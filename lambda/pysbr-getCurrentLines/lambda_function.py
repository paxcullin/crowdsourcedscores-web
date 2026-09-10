# pysbr-getCurrentLines lambda function

from pysbr import NFL, Sportsbook, BestLines, NCAAB, NCAAF, NBA
from pysbr.config.config import Config
from datetime import datetime, timedelta, date
from pymongo import MongoClient, InsertOne, UpdateOne
import boto3
import os

sns = boto3.client('sns')

# Database connection
client = MongoClient("mongodb+srv://" + str(Config.username) + ":" + str(Config.password) + "@pcsm.lwx4u.mongodb.net/pcsm?retryWrites=true&w=majority")
db = client['pcsm']

today = str(date.today())
yesterday = str((date.today() - timedelta(days=1)))
startDate = datetime.strptime(yesterday, '%Y-%m-%d')
endDate = datetime.strptime('2024-02-14', '%Y-%m-%d')
cols = ['event', 'event id', 'participant', 'spread / total', 'decimal odds', 'american odds', 'result', 'profit']

nfl = NFL()
ncaab = NCAAB()
ncaaf = NCAAF()
nba = NBA()
sblib = Sportsbook()

def get_sportsbook_ids():
    return {
        20: 'Pinnacle',
        3: '5Dimes',
        10: 'Bookmaker',
        8: 'BetOnline',
        9: 'Bovada'
    }
#{"data":{"sportsbook":{"sbid":93,"paid":10,"nam":"Bookmaker","iid":"5a7c720f731f32008e9e1fb2","pre":"http://www.bookmaker.eu/?","suf":"","afid":"5160f4dd-a4d6-4585-b9c1-b394e51ea223"}}}
#bodog sbid: 5, paid: 9
#pinnacle sbid: 238, paid: 20
#5dimes sbid: 19, paid: 3
#bet365: sbid: 43, paid: 5
#bwin sbid: 44, paid: 47
#betus sbid: 83, paid: 33
#bookmaker sbid: 93, paid: 10
#betcris sbid: 118, paid: 10
#heritage sbid: 169, paid: 44
def get_lines(gameid, sport):
    market = nfl
    if (sport == 'ncaab'):
        market = ncaab
    elif (sport == 'ncaaf'):
        market = ncaaf
    elif (sport == 'nba'):
        market = nba
    try:
        books = get_sportsbook_ids()
        try:
            BESTLINES_CATID = int(os.getenv('PYSBR_BESTLINES_CATID', '338'))
        except ValueError:
            BESTLINES_CATID = None

        clspread = BestLines([gameid], market.market_ids('pointspread'), BESTLINES_CATID)
        cltotal = BestLines([gameid], market.market_ids('totals'), BESTLINES_CATID)
        clmoneyline = BestLines([gameid], market.market_ids('money-line'), BESTLINES_CATID)

        lines = {
            'spread': [],
            'total': [],
            'moneyline': []
        }

        def process_lines(lines_list, line_type):
            for line in lines_list:
                line['type'] = line_type
                line['name'] = books.get(line['sportsbook id'], 'Unknown')
                lines[line_type].append(line)

        if len(clspread.list()) > 0:
            process_lines(clspread.list(), 'spread')

        if len(cltotal.list()) > 0:
            process_lines(cltotal.list(), 'total')


        if len(clmoneyline.list()) > 0:
            process_lines(clmoneyline.list(), 'moneyline')
        return lines
    except Exception as e:
        print('error: ', e)
        return None

def lambda_handler(e, context):
    print('event: ', e, 'context: ', context)
    gameids = e['gameIds']
    sport = e['sport']
    collection = db['games']
    if (sport == 'ncaaf'):
        collection = db['games-ncaaf']
    elif (sport == 'ncaam' or sport == 'ncaab'):
        collection = db['games-ncaab']
    elif (sport == 'nba'):
        collection = db['games-nba']
    if gameids is None or len(gameids) == 0:
        print('no game id')
        return {
            "lines": []
        }
    writeOperations = []
    for gameid in gameids:
        lines = [] 
        lines = get_lines(gameid, sport)
        if (lines is not None):
            print('lines: ', gameid)
            # writeOperations.append(UpdateOne(
            #     {
            #         'gameId': gameid
            #     },
            #     {
            #         '$set': {
            #             'currentLines': lines
            #         }
            #     }
            # ))
            gameObject = collection.find_one(
                    {'gameId': gameid}
            )
            if (gameObject is not None and gameObject.get('odds') is not None):
                odds = gameObject['odds']
                if (odds.get('spread') == ""):
                    odds["spread"] = lines["spread"][0]["spread / total"] if len(lines["spread"]) > 0 else ""
                    odds["spreadOdds"] = lines["spread"][0]["american odds"] if len(lines["spread"]) > 0 else ""
                    odds["spreadBook"] = lines["spread"][0]["sportsbook id"] if len(lines["spread"]) > 0 else ""
                if (odds.get('total') == ""):
                    odds["total"] = lines["total"][0]["spread / total"] if len(lines["total"]) > 0 else ""
                    odds["totalOdds"] = lines["total"][0]["american odds"] if len(lines["total"]) > 0 else ""
                    odds["totalBook"] = lines["total"][0]["sportsbook id"] if len(lines["total"]) > 0 else ""
                collection.update_one(
                    {
                        'gameId': gameid
                    },
                    {
                        '$set': {
                            'odds': odds
                        }
                    }
                )
                # if (gameObject['currentLines'] != lines):
                #     print('lines changed for gameId: ', gameid)
                #     sns.publish(
                #         TopicArn=Config.snsTopic,
                #         Message=f'Lines changed for gameId: {gameid}',
                #         Subject='Lines Changed'
                #     )
            if (lines is not None and (lines["spread"] is not None or lines["total"] is not None or lines["moneyline"] is not None)):
                updateResponse = collection.update_one(
                    {
                        '$or': [
                            {'gameId': gameid},
                            {'sbrGameId': gameid}
                        ]
                    },
                    {
                        '$set': {
                            'currentLines': lines
                        }
                    }
                )
                print('updateResponse: ', updateResponse)
    # collection.bulk_write(writeOperations)
    return {
        "lines": lines
    }
