import sys
import types
import http.client
import urllib.parse
import urllib.request
import os
import json as cgi_json  # Mock for removed cgi module

# Ensure layer is in path without overriding bundled /var/task modules.
if "/opt/python" not in sys.path:
    sys.path.append("/opt/python")

# Keep function package modules first so local hotfixes override layer copies.
if "/var/task" in sys.path:
    sys.path.insert(0, sys.path.pop(sys.path.index("/var/task")))

# Clear urllib3 from cache to force fresh import from layer
for module_name in list(sys.modules):
    if module_name == "urllib3" or module_name.startswith("urllib3."):
        del sys.modules[module_name]

# Pre-populate six and six.moves modules before any boto3 import
try:
    import six
    
    # Register six
    sys.modules.setdefault("urllib3.packages.six", six)
    sys.modules.setdefault("urllib3.packages.six.moves", six.moves)
    
    # Register all six.moves submodules
    try:
        from six.moves import http_client as six_http_client, urllib, urllib_parse, urllib_request, configparser
        sys.modules.setdefault("urllib3.packages.six.moves.http_client", six_http_client)
        sys.modules.setdefault("urllib3.packages.six.moves.urllib", urllib)
        sys.modules.setdefault("urllib3.packages.six.moves.urllib.parse", urllib_parse)
        sys.modules.setdefault("urllib3.packages.six.moves.urllib.request", urllib_request)
        sys.modules.setdefault("urllib3.packages.six.moves.configparser", configparser)
    except ImportError:
        pass
        
except ImportError:
    # Fallback: create synthetic modules for all six.moves that boto3 might need
    six_module = types.ModuleType("urllib3.packages.six")
    moves_module = types.ModuleType("urllib3.packages.six.moves")
    
    # Create http_client
    moves_module.http_client = http.client
    sys.modules.setdefault("urllib3.packages.six.moves.http_client", http.client)
    
    # Create urllib submodule structure
    urllib_module = types.ModuleType("urllib3.packages.six.moves.urllib")
    urllib_module.parse = urllib.parse
    urllib_module.request = urllib.request
    moves_module.urllib = urllib_module
    sys.modules.setdefault("urllib3.packages.six.moves.urllib", urllib_module)
    sys.modules.setdefault("urllib3.packages.six.moves.urllib.parse", urllib.parse)
    sys.modules.setdefault("urllib3.packages.six.moves.urllib.request", urllib.request)
    
    six_module.moves = moves_module
    sys.modules.setdefault("urllib3.packages.six", six_module)
    sys.modules.setdefault("urllib3.packages.six.moves", moves_module)

# Handle missing cgi module (removed in Python 3.13)
if "cgi" not in sys.modules:
    cgi_module = types.ModuleType("cgi")
    cgi_module.escape = lambda x: x  # Basic escape function stub
    sys.modules["cgi"] = cgi_module

from pysbr import *
from pysbr.config.config import Config
from datetime import datetime, date, timedelta
from pymongo import MongoClient, UpdateOne
import boto3, json

sns = boto3.client('sns')



client = MongoClient("mongodb+srv://" +  str(Config.username) + ":" + str(Config.password) + "@pcsm.lwx4u.mongodb.net/pcsm?retryWrites=true&w=majority")
db = client['pcsm']
collection = db['games-ncaaf']

yesterday = str((date.today() - timedelta(days=5)))
startDate = datetime.strptime(yesterday, '%Y-%m-%d')
endDate = datetime.strptime('2027-02-28', '%Y-%m-%d')
cols = ['event', 'event id', 'participant', 'spread / total', 'decimal odds', 'american odds', 'result', 'profit']

ncaaf = NCAAF()
sb = Sportsbook()
preferredBooks = ['Pinnacle', 'Bookmaker', 'BetOnline']
preferredBookIds = sb.ids(preferredBooks)
e = EventsByDateRange(ncaaf.league_id, startDate,endDate)

try:
    BESTLINES_CATID = int(os.getenv('PYSBR_BESTLINES_CATID', '338'))
except ValueError:
    BESTLINES_CATID = None

bestspreads = BestLines(e.ids(), ncaaf.market_ids('pointspread'), BESTLINES_CATID)
besttotals = BestLines(e.ids(), ncaaf.market_ids('totals'), BESTLINES_CATID)
bestmoneylines = BestLines(e.ids(), ncaaf.market_ids('money-line'), BESTLINES_CATID)
# fivedimesspreads = CurrentLines(e.ids(), ncaaf.market_ids('pointspread'), sb.ids('5Dimes')[0])
# fivedimesbookmakertotals = CurrentLines(e.ids(), ncaaf.market_ids('totals'), sb.ids('5Dimes')[0])
# fivedimesbookmakermoneylines = CurrentLines(e.ids(), ncaaf.market_ids('money-line'), sb.ids('5Dimes')[0])
# lines = pd.merge(spreads.dataframe(), totals.dataframe(), how="outer", on="event id")



lambda_client = boto3.client('lambda')
gameWeekResponse = lambda_client.invoke(
    FunctionName="getGameWeek",
    Payload=json.dumps({'sport': 'ncaaf'})
)
gameWeek = json.load(gameWeekResponse.get('Payload'))
DEBUG_PYSBR = os.getenv('DEBUG_PYSBR', 'false').lower() in ('1', 'true', 'yes', 'y', 'on')


def _debug_log(*args):
    if DEBUG_PYSBR:
        print(*args)


def _debug_sample(label, rows):
    if not DEBUG_PYSBR or not rows:
        return
    sample = rows[0]
    if not isinstance(sample, dict):
        _debug_log(label, 'sample:', sample)
        return

    line_data = sample.get('line') if isinstance(sample.get('line'), dict) else sample
    view = {
        'event id': sample.get('event id', sample.get('eid', line_data.get('event id'))),
        'market id': sample.get('market id', sample.get('mtid', line_data.get('market id'))),
        'participant id': sample.get('participant id', sample.get('partid', line_data.get('participant id'))),
        'spread / total': line_data.get('spread / total', line_data.get('adj', '')),
        'american odds': line_data.get('american odds', line_data.get('ap', '')),
        'decimal odds': line_data.get('decimal odds', line_data.get('pri', '')),
    }
    _debug_log(label, 'sample:', view)


def _safe_int(value):
    try:
        return int(value)
    except (TypeError, ValueError):
        return None


def _extract_consensus_line(consensus_row):
    line_data = consensus_row.get('line') if isinstance(consensus_row, dict) else None
    if not isinstance(line_data, dict):
        line_data = consensus_row if isinstance(consensus_row, dict) else {}

    return {
        'marketId': _safe_int(consensus_row.get('market id', line_data.get('market id'))),
        'participantId': _safe_int(consensus_row.get('participant id', line_data.get('participant id'))),
        'spreadOrTotal': line_data.get('spread / total', ''),
        'americanOdds': line_data.get('american odds', ''),
        'decimalOdds': line_data.get('decimal odds', ''),
    }

def lambda_handler(event, context):
    print('event: ', event, 'context: ', context, 'version 3')
    eventsList = e.list()
    print('length', len(eventsList))

    writeOperations = []
    gameids = []
    consensusByEvent = {}
    if len(eventsList) > 0:
        try:
            spreadLines = bestspreads.list()
            _debug_log('DEBUG_PYSBR best lines spread count:', len(spreadLines))
            _debug_sample('DEBUG_PYSBR best spread', spreadLines)

            totalLines = besttotals.list()
            _debug_log('DEBUG_PYSBR best lines total count:', len(totalLines))
            _debug_sample('DEBUG_PYSBR best total', totalLines)

            moneylineLines = bestmoneylines.list()
            _debug_log('DEBUG_PYSBR best lines moneyline count:', len(moneylineLines))
            _debug_sample('DEBUG_PYSBR best moneyline', moneylineLines)

            if DEBUG_PYSBR:
                try:
                    _debug_log('DEBUG_PYSBR raw events keys:', list(e.raw().keys()))
                    _debug_log('DEBUG_PYSBR raw best spread keys:', list(bestspreads.raw().keys()))
                except Exception as rawError:
                    _debug_log('DEBUG_PYSBR unable to inspect raw query payloads:', rawError)

            spreadByEventAndParticipant = {}
            for spreadLine in spreadLines:
                key = (spreadLine.get('event id'), spreadLine.get('participant id'))
                if key not in spreadByEventAndParticipant:
                    spreadByEventAndParticipant[key] = spreadLine

            totalByEvent = {}
            for totalLine in totalLines:
                eventIdKey = totalLine.get('event id')
                if eventIdKey not in totalByEvent:
                    totalByEvent[eventIdKey] = totalLine

            moneylineByEventAndParticipant = {}
            for mlLine in moneylineLines:
                key = (mlLine.get('event id'), mlLine.get('participant id'))
                if key not in moneylineByEventAndParticipant:
                    moneylineByEventAndParticipant[key] = mlLine

            for event in eventsList:
                # print('event: ', event)
                if event["event group"] != None:
                    homeId = ''
                    awayId = ''
                    gameOdds = {
                        "date": datetime.now(),
                        "spread": '',
                        "spreadOdds": '',
                        "total": '',
                        "totalOdds": '',
                        "awayML": '',
                        "homeML": ''
                    }
                    pinnacleOdds = {
                        "date": datetime.now(),
                        "spread": '',
                        "spreadOdds": '',
                        "total": '',
                        "totalOdds": ''
                    }
                    bookmakerOdds = {
                        "date": datetime.now(),
                        "spread": '',
                        "spreadOdds": '',
                        "total": '',
                        "totalOdds": ''
                    }
                    fivedimesodds = {
                        "date": datetime.now(),
                        "spread": '',
                        "spreadOdds": '',
                        "total": '',
                        "totalOdds": ''
                    }
                    # try:
                        # print(event)

                    gameObject = {
                            "year": 2026,
                            "gameWeek": event['event group']['event group id'] - 32,
                            "weekName": event['event group']['alias'],
                            "status": event['event status'],
                            "sport": "ncaaf",
                            "location": event['location'] + ", " + event["country"],
                            "startDateTime": datetime.strptime(event["datetime"], '%Y-%m-%dT%H:%M:%S%z')
                        }
                    for team in event['participants']:
                        teamObject = {
                                "participantId": team["participant id"],
                                "code": "",
                                "shortName": team["source"]["nickname"],
                                "fullName": team["source"]["name"] + " " + team["source"]["nickname"]
                            }
                        teamObject["code"] = team["source"]["abbreviation"]
                        if team['is home'] == True:
                            gameObject["homeTeam"] = teamObject
                            homeId = team['participant id']
                        else:
                            gameObject["awayTeam"] = teamObject
                            awayId = team['participant id']
                            
                    
                    
                    if gameObject["startDateTime"] > datetime.strptime('2026-12-10T09:00:00Z', '%Y-%m-%dT%H:%M:%S%z'):
                        gameObject["season"] = "post"
                    else:
                        # print('date: ', gameObject["startDateTime"], ', ', datetime.strptime('2025-09-08T09:00:00Z', '%Y-%m-%dT%H:%M:%S%z'))
                        gameObject["season"] = "reg"
                    # find the game in Mongo
                    gameResult = collection.find_one({"homeTeam.code": gameObject["homeTeam"]["code"], "awayTeam.code": gameObject["awayTeam"]["code"], "season": gameObject["season"], "year": gameObject["year"]})

                    gameObject["gameId"] = event['event id']
                    if (gameResult):
                        gameObject["gameId"] = gameResult["gameId"]
                        # if (hasattr(gameResult,'odds')):
                        #     print('gameResult[\'odds\']', gameResult['odds']['spread'])
                    # else:
                    #     print('no game result for ', gameObject["homeTeam"]["code"], gameObject["awayTeam"]["code"], gameObject["season"], gameObject["year"])
                    
                    if gameObject["weekName"] == "Bowls":
                        gameObject["gameWeek"] = 1
                    isCurrentWeekGame = gameWeek.get('week') == gameObject["gameWeek"]
                    if isCurrentWeekGame:
                        gameids.append(event['event id'])
                    for team in event['participants']:
                        teamObject = {
                                "participantId": team["participant id"],
                                "code": "",
                                "shortName": team["source"]["nickname"],
                                "fullName": team["source"]["name"] + " " + team["source"]["nickname"]
                            }
                        
                        if team["source"]["abbreviation"] == "LA":
                            teamObject["code"] = "LAR"
                        else:
                            teamObject["code"] = team["source"]["abbreviation"]
                        if team['is home'] == True:
                            gameObject["homeTeam"] = teamObject
                            homeId = team['participant id']
                        else:
                            gameObject["awayTeam"] = teamObject
                            awayId = team['participant id']
                    if (event["event status"] != "scheduled"):
                        # print(event)
                        awayTeamScore = 0
                        awayTeamQ1 = 0
                        awayTeamQ2 = 0
                        awayTeamQ3 = 0
                        awayTeamQ4 = 0
                        homeTeamScore = 0
                        homeTeamQ1 = 0
                        homeTeamQ2 = 0
                        homeTeamQ3 = 0
                        homeTeamQ4 = 0

                        total = 0
                        spread = 0
                        resultsObj = {}
                        for score in event["scores"]:
                            if score["participant id"] == homeId:
                                homeTeamScore += score["points scored"]
                                if score["period"] == 1:
                                    homeTeamQ1 = score["points scored"]
                                elif score["period"] == 2:
                                    homeTeamQ2 = score["points scored"]
                                elif score["period"] == 3:
                                    homeTeamQ3 = score["points scored"]
                                elif score["period"] == 4:
                                    homeTeamQ4 = score["points scored"]
                            else:
                                awayTeamScore += score["points scored"]
                                if score["period"] == 1:
                                    awayTeamQ1 = score["points scored"]
                                elif score["period"] == 2:
                                    awayTeamQ2 = score["points scored"]
                                elif score["period"] == 3:
                                    awayTeamQ3 = score["points scored"]
                                elif score["period"] == 4:
                                    awayTeamQ4 = score["points scored"]
                        total = homeTeamScore + awayTeamScore
                        spread = awayTeamScore - homeTeamScore
                        resultsObj = {
                            "awayTeam": {
                                "score": awayTeamScore,
                                "periods": {
                                    "q1": awayTeamQ1,
                                    "q2": awayTeamQ2,
                                    "q3": awayTeamQ3,
                                    "q4": awayTeamQ4
                                }
                            },
                            "homeTeam": {
                                "score": homeTeamScore,
                                "periods": {
                                    "q1": homeTeamQ1,
                                    "q2": homeTeamQ2,
                                    "q3": homeTeamQ3,
                                    "q4": homeTeamQ4
                                }
                            },
                            "total": total,
                            "spread": spread
                        }
                        gameObject["results"] = resultsObj
                            
                        # "results": {
                        #     "awayTeam": "",
                        #     "homeTeam": "",
                        #     "scores": [
                        #         {
                        #             "participant id": 1546,
                        #             "period": 3,
                        #             "points scored": 0
                        #         },
                        #         {
                        #             "participant id": 1537,
                        #             "period": 3,
                        #             "points scored": 6
                        #         },
                        #         {
                        #             "participant id": 1546,
                        #             "period": 2,
                        #             "points scored": 14
                        #         },
                        #         {
                        #             "participant id": 1537,
                        #             "period": 2,
                        #             "points scored": 13
                        #         },
                        #         {
                        #             "participant id": 1546,
                        #             "period": 1,
                        #             "points scored": 3
                        #         },
                        #         {
                        #             "participant id": 1537,
                        #             "period": 1,
                        #             "points scored": 0
                        #         }
                        #     ]
                        # }
                        if (event["event status"] == "complete"):
                            gameObject["status"] = "final"
                        else:
                            gameObject["status"] = "inProgress"
                            # print('updating game: ', gameObject)

                        
                        # print(hasattr(gameObject, "results"))
                        if (gameObject is not None and gameObject["status"] == "final") and (gameResult is None or gameResult["status"] != "final"):

                            writeOperations.append(UpdateOne({
                                "gameId": gameObject["gameId"]
                                },
                                {
                                    "$set": gameObject
                                },
                                upsert=True))
                            print("SNS Publishing", str(gameObject["gameId"]))
                            sns.publish(
                                TopicArn="arn:aws:sns:us-west-2:198282214908:gameUpdated",
                                Message="Game " + str(gameObject["gameId"]),
                                Subject="Game Update",
                                MessageAttributes={ 
                                    "gameId": {
                                        "DataType": "Number",
                                        "StringValue": str(gameObject["gameId"])
                                    },
                                    "gameWeek": {
                                        "DataType": "Number",
                                        "StringValue": str(gameObject["gameWeek"])
                                    },
                                    "year": {
                                        "DataType": "Number",
                                        "StringValue": str(gameObject["year"])
                                    },
                                    "sport": {
                                        "DataType": "String",
                                        "StringValue": gameObject["sport"]
                                    },
                                    "season": {
                                        "DataType": "String",
                                        "StringValue": gameObject["season"]
                                    }
                                    
                                })
                    else:
                        gameObject["odds"] = {
                                "spread": '',
                                "spreadOdds": '',
                                "total": '',
                                "totalOdds": '',
                                "history": []
                            }
                        spread = spreadByEventAndParticipant.get((event['event id'], gameObject["homeTeam"]["participantId"]))
                        if spread:
                            gameOdds['spread'] = spread.get('spread / total', '')
                            gameOdds['spreadOdds'] = spread.get('american odds', '')
                            gameObject['odds']['spread'] = spread.get('spread / total', '')
                            gameObject['odds']['spreadOdds'] = spread.get('american odds', '')
                            gameObject['odds']['spreadBook'] = spread.get('sportsbook id', '')
                            gameOdds['spreadBook'] = spread.get('sportsbook id', '')

                        total = totalByEvent.get(event['event id'])
                        if total:
                            gameOdds['total'] = total.get('spread / total', '')
                            gameOdds['totalOdds'] = total.get('american odds', '')
                            gameObject['odds']['total'] = total.get('spread / total', '')
                            gameObject['odds']['totalOdds'] = total.get('american odds', '')
                            gameObject['odds']['totalBook'] = total.get('sportsbook id', '')
                            gameOdds['totalBook'] = total.get('sportsbook id', '')

                        homeML = moneylineByEventAndParticipant.get((event['event id'], gameObject["homeTeam"]["participantId"]))
                        if homeML:
                            gameOdds['homeML'] = {
                                "decimal": homeML.get('decimal odds', ''),
                                "american": homeML.get('american odds', ''),
                                "sportsbook": homeML.get('sportsbook id', '')
                            }
                            gameObject['odds']['homeML'] = {
                                "decimal": homeML.get('decimal odds', ''),
                                "american": homeML.get('american odds', ''),
                                "sportsbook": homeML.get('sportsbook id', '')
                            }

                        awayML = moneylineByEventAndParticipant.get((event['event id'], gameObject["awayTeam"]["participantId"]))
                        if awayML:
                            gameOdds['awayML'] = {
                                "decimal": awayML.get('decimal odds', ''),
                                "american": awayML.get('american odds', ''),
                                "sportsbook": awayML.get('sportsbook id', '')
                            }
                            gameObject['odds']['awayML'] = {
                                "decimal": awayML.get('decimal odds', ''),
                                "american": awayML.get('american odds', ''),
                                "sportsbook": awayML.get('sportsbook id', '')
                            }

                        needsConsensusFallback = (
                            gameOdds['spread'] == ''
                            or gameOdds['total'] == ''
                            or gameOdds['homeML'] == ''
                            or gameOdds['awayML'] == ''
                        )
                        remainingMs = context.get_remaining_time_in_millis() if context else None
                        canRunConsensus = remainingMs is None or remainingMs > 45000
                        shouldRunConsensus = needsConsensusFallback and canRunConsensus and (isCurrentWeekGame or DEBUG_PYSBR)
                        if DEBUG_PYSBR and needsConsensusFallback and not shouldRunConsensus:
                            _debug_log(
                                'DEBUG_PYSBR consensus skipped for event',
                                event['event id'],
                                'isCurrentWeekGame=',
                                isCurrentWeekGame,
                                'remainingMs=',
                                remainingMs,
                            )

                        if shouldRunConsensus:
                            eventId = event['event id']
                            if eventId not in consensusByEvent:
                                try:
                                    consensusQuery = ConsensusHistory(eventId, ncaaf.consensus_market_ids)
                                    consensusByEvent[eventId] = consensusQuery.list()
                                    _debug_log('DEBUG_PYSBR consensus count for event', eventId, ':', len(consensusByEvent[eventId]))
                                    _debug_sample('DEBUG_PYSBR consensus event ' + str(eventId), consensusByEvent[eventId])
                                    try:
                                        _debug_log('DEBUG_PYSBR consensus raw keys for event', eventId, ':', list(consensusQuery.raw().keys()))
                                    except Exception:
                                        pass
                                    if DEBUG_PYSBR and len(consensusByEvent[eventId]) == 0:
                                        _debug_log('DEBUG_PYSBR consensus market ids:', ncaaf.consensus_market_ids)
                                        _debug_log(
                                            'DEBUG_PYSBR empty consensus context event',
                                            eventId,
                                            'status=',
                                            event.get('event status'),
                                            'datetime=',
                                            event.get('datetime'),
                                            'gameWeek=',
                                            gameObject.get('gameWeek'),
                                            'currentWeek=',
                                            gameWeek.get('week'),
                                        )
                                except Exception as consensusError:
                                    print('consensus history unavailable for event', eventId, consensusError)
                                    consensusByEvent[eventId] = []

                            for consensusRow in consensusByEvent[eventId]:
                                consensusLine = _extract_consensus_line(consensusRow)
                                marketId = consensusLine['marketId']
                                participantId = consensusLine['participantId']

                                if (
                                    gameOdds['spread'] == ''
                                    and marketId == ncaaf.market_id('pointspread')
                                    and participantId == gameObject["homeTeam"]["participantId"]
                                ):
                                    gameOdds['spread'] = consensusLine['spreadOrTotal']
                                    gameOdds['spreadOdds'] = consensusLine['americanOdds']
                                    gameObject['odds']['spread'] = consensusLine['spreadOrTotal']
                                    gameObject['odds']['spreadOdds'] = consensusLine['americanOdds']

                                if gameOdds['total'] == '' and marketId == ncaaf.market_id('totals'):
                                    gameOdds['total'] = consensusLine['spreadOrTotal']
                                    gameOdds['totalOdds'] = consensusLine['americanOdds']
                                    gameObject['odds']['total'] = consensusLine['spreadOrTotal']
                                    gameObject['odds']['totalOdds'] = consensusLine['americanOdds']

                                if marketId == ncaaf.market_id('money-line') and participantId is not None:
                                    mlValue = {
                                        "decimal": consensusLine['decimalOdds'],
                                        "american": consensusLine['americanOdds']
                                    }
                                    if participantId == gameObject["homeTeam"]["participantId"] and gameOdds['homeML'] == '':
                                        gameOdds['homeML'] = mlValue
                                        gameObject['odds']['homeML'] = mlValue
                                    elif participantId == gameObject["awayTeam"]["participantId"] and gameOdds['awayML'] == '':
                                        gameOdds['awayML'] = mlValue
                                        gameObject['odds']['awayML'] = mlValue

                            # if line['event id'] == event['event id']:
                            #     print(line, event['event id'])
                        if (gameResult):
                            # print('has gameResult', gameResult['gameId'])
                            # print('odds attribute', list(gameResult))
                            try:
                                # print('gameResult.odds', gameResult['odds'])
                                if (gameResult and gameResult['odds']):
                                    # print("gameResult['odds']['history']", gameResult['odds']['history'])
                                    if (gameResult['odds']['history']):
                                        gameObject['odds']['history'] = gameResult['odds']['history']
                                        # if gameResult['odds']['history']['pinnacle']:
                                            # gameObject['odds']['history']['pinnacle'] = gameResult['odds']['history']['pinnacle']


                                else:
                                    print('no odds for', gameResult['gameId'])
                            except:
                                print('no odds')
                        # else:
                        #     print('no previous game result for this game')
                        if (gameOdds["spread"] != "" or gameOdds["total"] != ""):
                            gameObject['odds']['history'].append(gameOdds)
                        if (gameObject["status"] == "scheduled"):
                            # print(gameObject)
                            writeOperations.append(UpdateOne({
                                "gameId": gameObject['gameId']
                                },
                                {
                                    "$set": gameObject
                                },
                                upsert=True))
            print('writeOperations: ', len(writeOperations))
            print('gameIds:', gameids)
            if len(writeOperations) > 0:
                writeResult = collection.bulk_write(writeOperations)
                print('writeResult: ', writeResult)
                getCurrentLinesResponse = lambda_client.invoke(
                    FunctionName="pysbr-getCurrentLines",
                    InvocationType="Event",
                    Payload=json.dumps({"sport": "ncaaf", "gameIds": gameids})
                )
                print('queued getCurrentLinesResponse: ', getCurrentLinesResponse)
                # return {
                #     'message': 'Schedule updated'
                # }
        except TypeError as error:
            print(TypeError, event) 
            print(repr(error))
        except ValueError:
            print(ValueError)
    return {
        'message': 'Schedule updated'
    }




# print(cl.dataframe(e)[cols])
# for event in e.list():
#     print(event)
