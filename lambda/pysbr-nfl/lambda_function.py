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
endDate = datetime.strptime('2025-02-14', '%Y-%m-%d')
cols = ['event', 'event id', 'participant', 'spread / total', 'decimal odds', 'american odds', 'result', 'profit']

nfl = NFL()
sb = Sportsbook()
e = EventsByDateRange(nfl.league_id, startDate,endDate)
# print('games length: ', len(e.ids()))
spreads = CurrentLines(e.ids(), nfl.market_ids('pointspread'), sb.ids('Pinnacle')[0])
totals = CurrentLines(e.ids(), nfl.market_ids('totals'), sb.ids('Pinnacle')[0])
moneylines = CurrentLines(e.ids(), nfl.market_ids('money-line'), sb.ids('Pinnacle')[0])
bookmakerspreads = CurrentLines(e.ids(), nfl.market_ids('pointspread'), sb.ids('Bookmaker')[0])
bookmakertotals = CurrentLines(e.ids(), nfl.market_ids('totals'), sb.ids('Bookmaker')[0])
betonlinespreads = CurrentLines(e.ids(), nfl.market_ids('pointspread'), sb.ids('BetOnline')[0])
betonlinestotals = CurrentLines(e.ids(), nfl.market_ids('totals'), sb.ids('BetOnline')[0])

# lines = pd.merge(spreads.dataframe(), totals.dataframe(), how="outer", on="event id")

lambda_client = boto3.client('lambda')
gameWeekResponse = lambda_client.invoke(
    FunctionName="getGameWeek"
)
gameWeek = json.load(gameWeekResponse.get('Payload'))
print('gameWeek: ', gameWeek)


def lambda_handler2(ev, context):
    print('event: ', ev, 'context: ', context, 'len(e.list()): ', len(e.list()))
    # print(*e.list(), sep = ",")
    writeOperations = []
    gameids = []
    if len(e.list()) > 0:
        try:
            for game in e.list():
                # print('game: ', game['event id'], datetime.strptime(game["datetime"], '%Y-%m-%dT%H:%M:%S%z'))
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
                    betonlineodds = {
                        "date": datetime.now(),
                        "spread": '',
                        "spreadOdds": '',
                        "total": '',
                        "totalOdds": ''
                    }
                    # try:
                        # print(event)

                    gameObject = {
                            "year": 2024,
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
                        if team["source"]["abbreviation"] == "NYG":
                            teamObject["fullName"] = "N.Y. Giants"
                        elif team["source"]["abbreviation"] == "NYJ":
                            teamObject["fullName"] = "N.Y. Jets"
                        elif team["source"]["abbreviation"] == "LAC":
                            teamObject["fullName"] = "L.A. Chargers"
                        if team["source"]["abbreviation"] == "LA":
                            teamObject["code"] = "LAR"
                            teamObject["fullName"] = "L.A. Rams"
                        else:
                            teamObject["code"] = team["source"]["abbreviation"]
                        if team['is home'] == True:
                            gameObject["homeTeam"] = teamObject
                            homeId = team['participant id']
                        else:
                            gameObject["awayTeam"] = teamObject
                            awayId = team['participant id']
                            
                    
                    
                    if gameObject["startDateTime"] < datetime.strptime('2024-09-04T09:00:00Z', '%Y-%m-%dT%H:%M:%S%z'):
                        # print('pre', gameObject, game)
                        if gameObject["gameWeek"] < 0:
                            gameObject["gameWeek"] = gameObject["gameWeek"] + 9
                        if gameObject["gameWeek"] == 20153:
                            gameObject["gameWeek"] = 1
                        gameObject["season"] = "pre"
                    elif gameObject["startDateTime"] > datetime.strptime('2025-01-06T09:00:00Z', '%Y-%m-%dT%H:%M:%S%z'):
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
                            if gameResult and "daysBetweenGames" in gameResult["homeTeam"]:
                                gameObject["homeTeam"]["daysBetweenGames"] = gameResult["homeTeam"]["daysBetweenGames"]
                        else:
                            gameObject["awayTeam"] = teamObject
                            awayId = team['participant id']
                            if gameResult and "daysBetweenGames" in gameResult["awayTeam"]:
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
                    else:
                        gameObject["odds"] = {
                                "spread": '',
                                "spreadOdds": '',
                                "total": '',
                                "totalOdds": '',
                                "history": []
                            }
                        if len(spreads.list()) > 0:
                            # print(homeId)
                            for spread in spreads.list():
                                # print(spread['event id'] == gameObject['gameId'], spread['participant id'] == gameObject["homeTeam"]["participantId"])
                                if (spread['event id'] == game['event id'] and spread['participant id'] == gameObject["homeTeam"]["participantId"]):
                                    # print(spread)
                                    gameOdds['spread'] = spread['spread / total']
                                    gameOdds['spreadOdds'] = spread['american odds']
                                    gameObject['odds']['spread'] = spread['spread / total']
                                    gameObject['odds']['spreadOdds'] = spread['american odds']
                            # if line['event id'] == event['event id']:
                            #     print(line, event['event id'])
                        # print(len(totals.list()))
                        # if len(bookmakerspreads.list()) > 0:
                        #     for bmspread in bookmakerspreads.list():
                        #         # print(spread['event id'] == gameObject['gameId'], spread['participant id'] == gameObject["homeTeam"]["participantId"])
                        #         if (spread['event id'] == gameObject['gameId'] and spread['participant id'] == gameObject["homeTeam"]["participantId"]):
                        #             # print(spread)
                        #             gameOdds['spread'] = spread['spread / total']
                        #             gameOdds['spreadOdds'] = spread['american odds']
                        #             gameObject['odds']['spread'] = spread['spread / total']
                        #             gameObject['odds']['spreadOdds'] = spread['american odds']


                        if len(totals.list()) > 0:
                            # print(homeId)
                            for total in totals.list():
                                # print(total)
                                if (total['event id'] == game['event id']):
                                    gameOdds['total'] = total['spread / total']
                                    gameOdds['totalOdds'] = total['american odds']
                                    gameObject['odds']['total'] = total['spread / total']
                                    gameObject['odds']['totalOdds'] = total['american odds']
                        if len(moneylines.list()) > 0:
                            # print(homeId)
                            for ml in moneylines.list():
                                # print(total)
                                if (ml['event id'] == game['event id']):
                                    if (ml['participant id'] == gameObject["homeTeam"]["participantId"]):
                                        gameOdds['homeML'] = {
                                            "decimal": ml['decimal odds'],
                                            "american": ml['american odds']
                                        }
                                        gameObject['odds']['homeML'] = {
                                            "decimal": ml['decimal odds'],
                                            "american": ml['american odds']
                                        }
                                    else:
                                        gameOdds['awayML'] = {
                                            "decimal": ml['decimal odds'],
                                            "american": ml['american odds']
                                        }
                                        gameObject['odds']['awayML'] = {
                                            "decimal": ml['decimal odds'],
                                            "american": ml['american odds']
                                        }

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
