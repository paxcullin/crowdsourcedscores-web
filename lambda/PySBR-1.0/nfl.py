import collections
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
cl = CurrentLines(e.ids(), nfl.market_ids('pointspread'), sb.ids('Pinnacle')[0])
print(len(e.list()))
if len(e.list()) > 0:
    for event in e.list()[0:4]:
        print(event)
        gameObject = {
                "gameId": event['event id'],
                "season": "reg",
                "year": 2021,
                "gameWeek": event['event group']['event group id'] -9,
                "weekName": event['event group']['alias'],
                "status": event['event status'],
                "sport": "nfl",
                "location": event['location'] + ", " + event["country"],
                "startDateTime": datetime.strptime(event["datetime"], '%Y-%m-%dT%H:%M:%S%z') 
            }
        for team in event['participants']:
            teamObject = {
                    "code": team["source"]["abbreviation"],
                    "shortName": team["source"]["nickname"],
                    "fullName": team["source"]["name"] + " " + team["source"]["nickname"]
                }
            if team['is home'] == True:
                gameObject["homeTeam"] = teamObject
            else:
                gameObject["awayTeam"] = teamObject
        collection.update_one({
            "gameId": event['event id']
            },
            {
                "$set": gameObject
            },
            upsert=True)

# print(cl.dataframe(e)[cols])
# for event in e.list():
#     print(event)
