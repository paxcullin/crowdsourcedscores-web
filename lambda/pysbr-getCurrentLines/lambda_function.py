from pysbr import NFL, Sportsbook, CurrentLines
from pysbr.config.config import Config
from datetime import datetime, timedelta, date
from pymongo import MongoClient, InsertOne, UpdateOne
import boto3

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
def get_lines(gameid):
    try:
        books = get_sportsbook_ids()
        sbids = sblib.ids(['Pinnacle', '5Dimes', 'Bookmaker', 'BetOnline', 'Bovada'])
        sbsysids = sblib.sysids(['Pinnacle', '5Dimes', 'Bookmaker', 'BetOnline', 'Bovada'])

        clspread = CurrentLines([gameid], nfl.market_ids('pointspread'), sbids)
        cltotal = CurrentLines([gameid], nfl.market_ids('totals'), sbids)
        clmoneyline = CurrentLines([gameid], nfl.market_ids('money-line'), sbids)

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
    if gameids is None or len(gameids) == 0:
        print('no game id')
        return {
            "lines": []
        }
    writeOperations = []
    for gameid in gameids:
        lines = [] 
        lines = get_lines(gameid)
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
            if (lines is not None and (lines["spread"] is not None or lines["total"] is not None or lines["moneyline"] is not None)):
                collection.update_one(
                    {
                        'gameId': gameid
                    },
                    {
                        '$set': {
                            'currentLines': lines
                        }
                    }
                )
    # collection.bulk_write(writeOperations)
    return {
        "lines": lines
    }
