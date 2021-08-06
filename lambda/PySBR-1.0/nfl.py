import pandas as pd
from pysbr import *
from pysbr.config.config import Config
from datetime import datetime
from pymongo import MongoClient




client = MongoClient("mongodb+srv://" +  str(Config.username) + ":" + str(Config.password) + "@pcsm.lwx4u.mongodb.net/pcsm?retryWrites=true&w=majority")
db = client['pcsm']
collection = db['games']

startDate = datetime.strptime('2021-08-01', '%Y-%m-%d')
endDate = datetime.strptime('2022-01-10', '%Y-%m-%d')
cols = ['event', 'event id', 'participant', 'spread / total', 'decimal odds', 'american odds', 'result', 'profit']

nfl = NFL()
sb = Sportsbook()
e = EventsByDateRange(nfl.league_id, startDate,endDate)
spreads = CurrentLines(e.ids(), nfl.market_ids('pointspread'), sb.ids('Pinnacle')[0])
totals = CurrentLines(e.ids(), nfl.market_ids('totals'), sb.ids('Pinnacle')[0])
# lines = pd.merge(spreads.dataframe(), totals.dataframe(), how="outer", on="event id")

print('totals', len(totals.list()))


# print(cl.list()[0])
if len(e.list()) > 0:
    for event in e.list():
        homeId = ''
        # try:
            # print(event)
        gameObject = {
                "gameId": event['event id'],
                "season": "reg",
                "year": 2021,
                "gameWeek": event['event group']['event group id'] -9,
                "weekName": event['event group']['alias'],
                "status": event['event status'],
                "sport": "nfl",
                "location": event['location'] + ", " + event["country"],
                "odds": {
                    "spread": '',
                    "total": ''
                },
                "startDateTime": datetime.strptime(event["datetime"], '%Y-%m-%dT%H:%M:%S%z')
            }
        for team in event['participants']:
            teamObject = {
                    "participantId": team["participant id"],
                    "code": team["source"]["abbreviation"],
                    "shortName": team["source"]["nickname"],
                    "fullName": team["source"]["name"] + " " + team["source"]["nickname"]
                }
            if team['is home'] == True:
                gameObject["homeTeam"] = teamObject
                homeId = team['participant id']
            else:
                gameObject["awayTeam"] = teamObject
        if len(spreads.list()) > 0:
            # print(homeId)
            for spread in spreads.list():
                # print(spread['event id'] == gameObject['gameId'], spread['participant id'] == gameObject["homeTeam"]["participantId"])
                if (spread['event id'] == gameObject['gameId'] and spread['participant id'] == gameObject["homeTeam"]["participantId"]):
                    # print(spread)
                    gameObject['odds']['spread'] = spread['spread / total']

            # if line['event id'] == event['event id']:
            #     print(line, event['event id'])
        # print(len(totals.list()))
        if len(totals.list()) > 0:
            # print(homeId)
            for total in totals.list():
                print(total)
                if (total['event id'] == gameObject['gameId']):
                    print(total['spread / total'], gameObject['homeTeam']['code'])
                    gameObject['odds']['total'] = total['spread / total']

            # if line['event id'] == event['event id']:
            #     print(line, event['event id'])
        if gameObject["gameWeek"] == 1:
            # print(gameObject)
            collection.update_one({
                "gameId": event['event id']
                },
                {
                    "$set": gameObject
                },
                upsert=True)
        # except TypeError:
        #     print(TypeError, event)
        # except ValueError:
        #     print(ValueError)

# print(cl.dataframe(e)[cols])
# for event in e.list():
#     print(event)
