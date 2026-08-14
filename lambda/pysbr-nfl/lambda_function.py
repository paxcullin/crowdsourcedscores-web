import sys
import types
import http.client
import urllib.parse
import urllib.request
import os
import inspect
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
from datetime import datetime, timedelta
from datetime import date
from pymongo import MongoClient, UpdateOne
import boto3, json

sns = boto3.client('sns')


client = MongoClient("mongodb+srv://" +  str(Config.username) + ":" + str(Config.password) + "@pcsm.lwx4u.mongodb.net/pcsm?retryWrites=true&w=majority")
db = client['pcsm']
collection = db['games']

today = str(date.today())
yesterday = str((date.today() - timedelta(days=1)))
startDate = datetime.strptime(yesterday, '%Y-%m-%d')
endDate = datetime.strptime('2027-08-14', '%Y-%m-%d')
cols = ['event', 'event id', 'participant', 'spread / total', 'decimal odds', 'american odds', 'result', 'profit']

nfl = NFL()
sb = Sportsbook()
e = EventsByDateRange(nfl.league_id, startDate,endDate)
# print('games length: ', len(e.ids()))

try:
    BESTLINES_CATID = int(os.getenv('PYSBR_BESTLINES_CATID', '338'))
except ValueError:
    BESTLINES_CATID = None
print ('e.ids:', e.ids(), nfl.market_ids('pointspread'), BESTLINES_CATID)

bestspreads = BestLines(e.ids(), nfl.market_ids('pointspread'), BESTLINES_CATID)
besttotals = BestLines(e.ids(), nfl.market_ids('totals'), BESTLINES_CATID)
bestmoneylines = BestLines(e.ids(), nfl.market_ids('money-line'), BESTLINES_CATID)

# Keep compatibility with older variable names used throughout this handler.
pinnaclespreads = bestspreads
pinnacletotals = besttotals
pinnaclemoneylines = bestmoneylines
spreads = bestspreads
totals = besttotals
moneylines = bestmoneylines
bestSpreads = bestspreads
bestTotals = besttotals
bestMoneylines = bestmoneylines
# fivedimesspreads = CurrentLines(e.ids(), ncaaf.market_ids('pointspread'), sb.ids('5Dimes')[0])
# fivedimesbookmakertotals = CurrentLines(e.ids(), ncaaf.market_ids('totals'), sb.ids('5Dimes')[0])
# fivedimesbookmakermoneylines = CurrentLines(e.ids(), ncaaf.market_ids('money-line'), sb.ids('5Dimes')[0])
# lines = pd.merge(spreads.dataframe(), totals.dataframe(), how="outer", on="event id")



lambda_client = boto3.client('lambda')
gameWeekResponse = lambda_client.invoke(
    FunctionName="getGameWeek",
    Payload=json.dumps({'sport': 'nfl'})
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


def lambda_handler2(ev, context):
    print('event: ', ev, 'context: ', context, 'len(e.list()): ', len(e.list()))
    eventsList = e.list()
    print('length', len(eventsList))
    # print(*e.list(), sep = ",")
    writeOperations = []
    gameids = []
    consensusByEvent = {}
    if len(eventsList) > 0:
        try:
            spreadLines = pinnaclespreads.list()
            _debug_log('DEBUG_PYSBR current lines count spread:', len(spreadLines))
            _debug_sample('DEBUG_PYSBR current spread', spreadLines)
            if len(spreadLines) == 0:
                spreadLines = bestspreads.list()
                _debug_log('DEBUG_PYSBR best lines fallback spread count:', len(spreadLines))
                _debug_sample('DEBUG_PYSBR best spread', spreadLines)

            totalLines = pinnacletotals.list()
            _debug_log('DEBUG_PYSBR current lines count total:', len(totalLines))
            _debug_sample('DEBUG_PYSBR current total', totalLines)
            if len(totalLines) == 0:
                totalLines = besttotals.list()
                _debug_log('DEBUG_PYSBR best lines fallback total count:', len(totalLines))
                _debug_sample('DEBUG_PYSBR best total', totalLines)

            moneylineLines = pinnaclemoneylines.list()
            _debug_log('DEBUG_PYSBR current lines count moneyline:', len(moneylineLines))
            _debug_sample('DEBUG_PYSBR current moneyline', moneylineLines)
            if len(moneylineLines) == 0:
                moneylineLines = bestmoneylines.list()
                _debug_log('DEBUG_PYSBR best lines fallback moneyline count:', len(moneylineLines))
                _debug_sample('DEBUG_PYSBR best moneyline', moneylineLines)

            if DEBUG_PYSBR:
                try:
                    _debug_log('DEBUG_PYSBR raw events keys:', list(e.raw().keys()))
                    _debug_log('DEBUG_PYSBR raw current spread keys:', list(pinnaclespreads.raw().keys()))
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

            for game in eventsList:
                # print('game: ', game)
                if game["event group"] != None:
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
                        # print(game)

                    gameObject = {
                            "year": 2026,
                            "gameWeek": game['event group']['event group id'] -9,
                            "weekName": game['event group']['alias'],
                            "status": game['event status'],
                            "sport": "nfl",
                            "location": game['location'] + ", " + game["country"],
                            "startDateTime": datetime.strptime(game["datetime"], '%Y-%m-%dT%H:%M:%S%z')
                        }
                    for team in game['participants']:
                        teamObject = {
                                "participantId": team["participant id"],
                                "code": "",
                                "shortName": team["source"]["nickname"],
                                "fullName": team["source"]["name"] + " " + team["source"]["nickname"]
                            }
                        if team["source"]["abbreviation"] == "LA":
                            teamObject["code"] = "LAR"
                            teamObject["fullName"] = "L.A. Rams"
                        else:
                            teamObject["code"] = team["source"]["abbreviation"]
                        if team["source"]["abbreviation"] == "LAC":
                            teamObject["fullName"] = "L.A. Chargers"
                        if team["source"]["abbreviation"] == "NYG":
                            teamObject["fullName"] = "N.Y. Giants"
                        if team["source"]["abbreviation"] == "NYJ":
                            teamObject["fullName"] = "N.Y. Jets"
                        if team["source"]["abbreviation"] == "JAX":
                            teamObject["code"] = "JAC"
                        if team['is home'] == True:
                            gameObject["homeTeam"] = teamObject
                            homeId = team['participant id']
                        else:
                            gameObject["awayTeam"] = teamObject
                            awayId = team['participant id']
                            
                    
                    
                    if gameObject["startDateTime"] < datetime.strptime('2026-09-03T09:00:00Z', '%Y-%m-%dT%H:%M:%S%z'):
                        # print('pre', gameObject, game)
                        if gameObject["gameWeek"] < 0:
                            gameObject["gameWeek"] = gameObject["gameWeek"] + 9
                        if gameObject["gameWeek"] == 20153:
                            gameObject["gameWeek"] = 1
                        gameObject["season"] = "pre"
                    elif gameObject["startDateTime"] > datetime.strptime('2027-01-06T09:00:00Z', '%Y-%m-%dT%H:%M:%S%z'):
                        gameObject["season"] = "post"
                        gameObject["gameWeek"] = gameObject["gameWeek"] - 18
                    else:
                        # print('date: ', gameObject["startDateTime"], ', ', datetime.strptime('2022-09-08T09:00:00Z', '%Y-%m-%dT%H:%M:%S%z'))
                        gameObject["season"] = "reg"
                    # find the game in Mongo
                    gameResult = collection.find_one({"homeTeam.code": gameObject["homeTeam"]["code"], "awayTeam.code": gameObject["awayTeam"]["code"], "season": gameObject["season"], "year": gameObject["year"]})

                    gameObject["gameId"] = game['event id']
                    if (gameWeek.get('week') == gameObject["gameWeek"]):
                        gameids.append(game['event id'])
                    if (gameResult):
                        gameObject["gameId"] = gameResult["gameId"]
                        # if (hasattr(gameResult,'odds')):
                            # print('gameResult[\'odds\']', gameResult['odds']['spread'])
                    else:
                        print('no game result for ', gameObject["homeTeam"]["code"], gameObject["awayTeam"]["code"], gameObject["season"], gameObject["year"])
                    
                    if gameObject["gameWeek"] == 33546 or gameObject["gameWeek"] == 33564:
                        gameObject["gameWeek"] = 18
                        gameObject["weekName"] = "Week 18"
                    for team in game['participants']:
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
                            if gameResult and "diffDays" in gameResult["homeTeam"]:
                                gameObject["homeTeam"]["daysBetweenGames"] = gameResult["homeTeam"]["daysBetweenGames"]
                        else:
                            gameObject["awayTeam"] = teamObject
                            awayId = team['participant id']
                            if gameResult and "diffDays" in gameResult["awayTeam"]:
                                gameObject["awayTeam"]["daysBetweenGames"] = gameResult["awayTeam"]["daysBetweenGames"]
                    if (game["event status"] != "scheduled"):
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
                        for score in game["scores"]:
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
                        if (game["event status"] == "complete"):
                            gameObject["status"] = "final"
                        else:
                            gameObject["status"] = "inProgress"
                            # print('updating game: ', gameObject)
                        writeOperations.append(UpdateOne({
                            "gameId": gameObject["gameId"]
                            },
                            {
                                "$set": gameObject
                            },
                            upsert=True))

                        
                        # print(hasattr(gameObject, "results"))
                        if gameObject["status"] == "final" and gameResult["status"] != "final":
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
                    # scheduled games
                    else:
                        # eventMarkets = EventMarkets(game['event id'])
                        # print(eventMarkets.raw())
                        gameObject["odds"] = {
                                "spread": '',
                                "spreadOdds": '',
                                "spreadBook": '',
                                "total": '',
                                "totalOdds": '',
                                "totalBook": '',
                                "history": []
                            }
                        print('pinnacle:', len(spreads.list()), len(totals.list()), len(moneylines.list()))
                        print(len(bestSpreads.list()), len(bestTotals.list()), len(bestMoneylines.list()))
                        spread = None
                        for line in spreads.list():
                            if line['event id'] == game['event id'] and line['participant id'] == gameObject["homeTeam"]["participantId"]:
                                spread = line
                                break
                        if spread is None:
                            for line in bestSpreads.list():
                                if line['event id'] == game['event id'] and line['participant id'] == gameObject["homeTeam"]["participantId"]:
                                    spread = line
                                    break
                        if spread is not None:
                            gameOdds['spread'] = spread['spread / total']
                            gameOdds['spreadOdds'] = spread['american odds']
                            gameOdds['spreadBook'] = spread.get('sportsbook id', '')
                            gameObject['odds']['spread'] = spread['spread / total']
                            gameObject['odds']['spreadOdds'] = spread['american odds']
                            gameObject['odds']['spreadBook'] = spread.get('sportsbook id', '')

                        total = None
                        for line in totals.list():
                            if line['event id'] == game['event id']:
                                total = line
                                break
                        if total is None:
                            for line in bestTotals.list():
                                if line['event id'] == game['event id']:
                                    total = line
                                    break
                        if total is not None:
                            gameOdds['total'] = total['spread / total']
                            gameOdds['totalOdds'] = total['american odds']
                            gameOdds['totalBook'] = total.get('sportsbook id', '')
                            gameObject['odds']['total'] = total['spread / total']
                            gameObject['odds']['totalOdds'] = total['american odds']
                            gameObject['odds']['totalBook'] = total.get('sportsbook id', '')

                        moneylineLines = []
                        for line in moneylines.list():
                            if line['event id'] == game['event id']:
                                moneylineLines.append(line)
                        if not moneylineLines:
                            for line in bestMoneylines.list():
                                if line['event id'] == game['event id']:
                                    moneylineLines.append(line)
                        for ml in moneylineLines:
                            mlValue = {
                                "decimal": ml['decimal odds'],
                                "american": ml['american odds'],
                                "sportsbook": ml.get('sportsbook id', '')
                            }
                            if ml['participant id'] == gameObject["homeTeam"]["participantId"]:
                                gameOdds['homeML'] = mlValue
                                gameObject['odds']['homeML'] = mlValue
                            else:
                                gameOdds['awayML'] = mlValue
                                gameObject['odds']['awayML'] = mlValue
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
                            #print(gameObject)
                            writeOperations.append(UpdateOne({
                                "gameId": gameObject['gameId']
                                },
                                {
                                    "$set": gameObject
                                },
                                upsert=True))
                else:
                    print('no event group for', game)
            if len(writeOperations) > 0:
                writeResult = collection.bulk_write(writeOperations)
                print('writeResult: ', writeResult)
                payload="{ \"sport\": \"nfl\", \"gameIds\": [" + ",".join(str(x) for x in gameids) + "]}"

                getCurrentLinesResponse = lambda_client.invoke(
                    FunctionName="pysbr-getCurrentLines",
                    Payload=payload
                )
                print('getCurrentLinesResponse: ', getCurrentLinesResponse)
        except TypeError as error:
            print(TypeError, game) 
            print(repr(error))
        except ValueError:
            print(ValueError)
    return {
        'message': 'Schedule updated'
    }

    


    # print(cl.dataframe(e)[cols])
    # for event in e.list():
    #     print(event)
