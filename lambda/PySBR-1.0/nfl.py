from pysbr import *
from pysbr.config.config import Config
from datetime import datetime, date
from pymongo import MongoClient




client = MongoClient("mongodb+srv://" +  str(Config.username) + ":" + str(Config.password) + "@pcsm.lwx4u.mongodb.net/pcsm?retryWrites=true&w=majority")
db = client['pcsm']
collection = db['games']

today = str(date.today())
startDate = datetime.strptime(today, '%Y-%m-%d')
endDate = datetime.strptime('2024-02-16', '%Y-%m-%d')
w1 = datetime.strptime('2021-09-12', '%Y-%m-%d')
cols = ['event', 'event id', 'participant', 'spread / total', 'decimal odds', 'american odds', 'result', 'profit']

nfl = NFL()
# print(nfl.sport_config())
sb = Sportsbook()
# print(sb.sportsbook_config())
e = EventsByDateRange(nfl.league_id, startDate,endDate)
print('games length: ', len(e.ids()))
# e2 = EventsByDate(nfl.league_id, w1)
spreads = CurrentLines(e.ids(), nfl.market_ids('pointspread'), sb.ids('Pinnacle')[0])
totals = CurrentLines(e.ids(), nfl.market_ids('totals'), sb.ids('Pinnacle')[0])
moneylines = CurrentLines(e.ids(), nfl.market_ids('money-line'), sb.ids('Pinnacle')[0])
# lines = pd.merge(spreads.dataframe(), totals.dataframe(), how="outer", on="event id")

# print('totals', len(totals.list()))


# print(cl.list()[0])
# print('gameListLength:', len(e.list()))
# print(e2.list())
if len(e.list()) > 0:
    count = 0
    for event in e.list():
        if event["event group"] != None:
            try:
                homeId = ''
                gameOdds = {
                    "date": datetime.now(),
                    "spread": '',
                    "total": ''
                }
                # try:
                print(event)
                gameResult = collection.find_one({"gameId": event['event id']})
                # print('gameWeek:',event['event group']['event group id'])
                # if (gameResult):
                #     print('gameResult exists', gameResult['gameId'], event['event group']['event group id'])
                # else:
                #     print('no game result for ', event['event id'])
                gameObject = {
                        "gameId": event['event id'],
                        "year": 2021,
                        "gameWeek": event['event group']['event group id'] -9,
                        "weekName": event['event group']['alias'],
                        "status": event['event status'],
                        "sport": "nfl",
                        "location": event['location'] + ", " + event["country"],
                        "startDateTime": datetime.strptime(event["datetime"], '%Y-%m-%dT%H:%M:%S%z')
                    }
                
                if gameObject["startDateTime"] < datetime.strptime('2022-09-08T09:00:00Z', '%Y-%m-%dT%H:%M:%S%z'):
                    gameObject["season"] = "pre"
                    print('pre', event)
                elif gameObject["startDateTime"] > datetime.strptime('2023-01-09T09:00:00Z', '%Y-%m-%dT%H:%M:%S%z'):
                    gameObject["season"] = "post"
                else:
                    gameObject["season"] = "reg"
                print('gameObject: ', gameObject)
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
                if (gameObject["status"] == "scheduled"):
                    gameObject["odds"] = {
                            "spread": '',
                            "total": '',
                            "history": []
                        }
                    if len(spreads.list()) > 0:
                        # print(homeId)
                        for spread in spreads.list():
                            print('spread', spread)
                            # print(spread['event id'] == gameObject['gameId'], spread['participant id'] == gameObject["homeTeam"]["participantId"])
                            if (spread['event id'] == gameObject['gameId'] and spread['participant id'] == gameObject["homeTeam"]["participantId"]):
                                print("gameId and spread: ", gameObject['gameId'], spread['american odds'])
                                gameOdds['spread'] = spread['spread / total']
                                gameOdds['spreadOdds'] = spread['american odds']
                                gameObject['odds']['spread'] = spread['spread / total']
                            else:
                                print('no spread for 4720244', spread['event id'], gameObject['gameId'], spread['participant id'], gameObject["homeTeam"]["participantId"])
                        # if line['event id'] == event['event id']:
                        #     print(line, event['event id'])
                    # print(len(totals.list()))
                    if len(totals.list()) > 0:
                        # print(homeId)
                        for total in totals.list():
                            print('total', total)
                            if (total['event id'] == gameObject['gameId']):
                                gameOdds['total'] = total['spread / total']
                                gameObject['totalOdds'] = total['american odds']
                                gameObject['odds']['total'] = total['spread / total']


                        # if line['event id'] == event['event id']:
                        #     print(line, event['event id'])
                    if len(moneylines.list()) > 0:
                        # print(homeId)
                        for ml in moneylines.list():
                            print('ml', ml)
                            # if (total['event id'] == gameObject['gameId']):
                            #     gameOdds['total'] = total['spread / total']
                            #     gameObject['totalOdds'] = total['american odds']
                            #     gameObject['odds']['total'] = total['spread / total']
                    if (gameResult != None):
                        print(gameResult)
                    if (gameResult and hasattr(gameResult,'odds')):
                        # print('appending game odds')
                        gameObject['odds']['history'] = gameResult['odds']['history']
                        gameObject['odds']['history'].append(gameOdds)
                    else:
                        # print('no new game odds')
                        gameObject['odds']['history'].append(gameOdds)
                
                else:
                    gameObject["results"] = {
                            "awayTeam": '',
                            "homeTeam": '',
                            "scores": []
                        }
                    homeTeamScore = 0
                    awayTeamScore = 0
                    for score in event['scores']:
                        if score['participant id'] == homeId:
                            homeTeamScore += score['points scored']
                        else:
                            awayTeamScore += score['points scored']
                        gameObject['results']['scores'].append(score)
                if gameObject["gameWeek"] == 4:
                    print(gameObject)
                    # collection.update_one({
                    #     "gameId": event['event id']
                    #     },
                    #     {
                    #         "$set": gameObject
                    #     },
                    #     upsert=True)
                else:
                    print(gameObject["gameId"])
            except TypeError as e:
                print(TypeError, e)
            except ValueError as ve:
                print(ValueError, ve)

# print(cl.dataframe(e)[cols])
# for event in e.list():
#     print(event)
