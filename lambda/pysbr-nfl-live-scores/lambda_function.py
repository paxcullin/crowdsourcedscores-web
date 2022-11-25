from pysbr import *
from pysbr.config.config import Config
from datetime import datetime, timedelta
from datetime import date
from pymongo import MongoClient
# import boto3

# sns = boto3.client('sns')


client = MongoClient("mongodb+srv://" +  str(Config.username) + ":" + str(Config.password) + "@pcsm.lwx4u.mongodb.net/pcsm?retryWrites=true&w=majority")
db = client['pcsm']
collection = db['games']

today = str(date.today())
yesterday = str((date.today() - timedelta(days=1)))
startDate = datetime.strptime(yesterday, '%Y-%m-%d')
endDate = datetime.strptime('2022-11-14', '%Y-%m-%d')
cols = ['event', 'event id', 'participant', 'spread / total', 'decimal odds', 'american odds', 'result', 'profit']

nfl = NFL()
e = EventsByDateRange(nfl.league_id, startDate,endDate)
# print('games length: ', len(e.ids()))
# lines = pd.merge(spreads.dataframe(), totals.dataframe(), how="outer", on="event id")

# print('totals', len

# def lambda_handler(event, context):
# print('event: ', event, 'context: ', context)
if len(e.list()) > 0:
    try:
        for event in e.list():
            print('event: ', event)
            if event["event group"] != None:
                homeId = ''
                awayId = ''
                # try:
                    # print(event)

                gameObject = {
                        "year": 2022,
                        "gameWeek": event['event group']['event group id'] -9,
                        "weekName": event['event group']['alias'],
                        "status": event['event status'],
                        "sport": "nfl",
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
                        
                
                
                if gameObject["startDateTime"] < datetime.strptime('2022-09-08T09:00:00Z', '%Y-%m-%dT%H:%M:%S%z'):
                    if gameObject["gameWeek"] < 0:
                        gameObject["gameWeek"] = gameObject["gameWeek"] + 8
                        print('pre', gameObject, event)
                    gameObject["season"] = "pre"
                elif gameObject["startDateTime"] > datetime.strptime('2023-01-09T09:00:00Z', '%Y-%m-%dT%H:%M:%S%z'):
                    gameObject["season"] = "post"
                else:
                    # print('date: ', gameObject["startDateTime"], ', ', datetime.strptime('2022-09-08T09:00:00Z', '%Y-%m-%dT%H:%M:%S%z'))
                    gameObject["season"] = "reg"
                # find the game in Mongo
                gameResult = collection.find_one({"homeTeam.code": gameObject["homeTeam"]["code"], "awayTeam.code": gameObject["awayTeam"]["code"], "season": gameObject["season"], "year": gameObject["year"]})

                gameObject["gameId"] = event['event id']
                if (gameResult):
                    gameObject["gameId"] = gameResult["gameId"]
                    if (hasattr(gameResult,'odds')):
                        print('gameResult[\'odds\']', gameResult['odds']['spread'])
                else:
                    print('no game result for ', gameObject["homeTeam"]["code"], gameObject["awayTeam"]["code"], gameObject["season"], gameObject["year"])
                
                if gameObject["gameWeek"] == 33546 or gameObject["gameWeek"] == 33564:
                    gameObject["gameWeek"] = 18
                    gameObject["weekName"] = "Week 18"
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
                    # collection.update_one({
                    #     "gameId": gameObject["gameId"]
                    #     },
                    #     {
                    #         "$set": gameObject
                    #     },
                    #     upsert=True)

                    
                    # print(hasattr(gameObject, "results"))
                    if gameObject["status"] == "final" and gameResult["status"] != "final":
                        print("SNS Publishing", str(gameObject["gameId"]))
                        # sns.publish(
                        #     TopicArn="arn:aws:sns:us-west-2:198282214908:gameUpdated",
                        #     Message="Game " + str(gameObject["gameId"]),
                        #     Subject="Game Update",
                        #     MessageAttributes={ 
                        #         "gameId": {
                        #             "DataType": "Number",
                        #             "StringValue": str(gameObject["gameId"])
                        #         },
                        #         "gameWeek": {
                        #             "DataType": "Number",
                        #             "StringValue": str(gameObject["gameWeek"])
                        #         },
                        #         "year": {
                        #             "DataType": "Number",
                        #             "StringValue": str(gameObject["year"])
                        #         },
                        #         "sport": {
                        #             "DataType": "String",
                        #             "StringValue": gameObject["sport"]
                        #         },
                        #         "season": {
                        #             "DataType": "String",
                        #             "StringValue": gameObject["season"]
                        #         }
                                
                        #     })
                    # else:
                    #     print('no previous game result for this game')
                    # if (gameOdds["spread"] != "" or gameOdds["total"] != ""):
                    #     gameObject['odds']['history'].append(gameOdds)
                    # if (gameObject["status"] == "scheduled"):
                        # print(gameObject)
                        # collection.update_one({
                        #     "gameId": gameObject['gameId']
                        #     },
                        #     {
                        #         "$set": gameObject
                        #     },
                        #     upsert=True)
    except TypeError as error:
        print(TypeError, event) 
        print(repr(error))
    except ValueError:
        print(ValueError)
    # return {
    #     'message': 'Schedule updated'
    # }

    


    # print(cl.dataframe(e)[cols])
    # for event in e.list():
    #     print(event)
