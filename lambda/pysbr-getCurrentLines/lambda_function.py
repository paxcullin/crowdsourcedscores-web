from pysbr import NFL, Sportsbook, CurrentLines
from pysbr.config.config import Config
from datetime import datetime, timedelta, date
from pymongo import MongoClient, InsertOne, UpdateOne
import boto3

sns = boto3.client('sns')

# Database connection
client = MongoClient("mongodb+srv://" + str(Config.username) + ":" + str(Config.password) + "@pcsm.lwx4u.mongodb.net/pcsm?retryWrites=true&w=majority")
db = client['pcsm']
collection = db['games']

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
        16: 'Bookmaker',
        8: 'BetOnline',
        9: 'Bovada'
    }

def get_lines(gameid):
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

def lambda_handler(e, context):
    print('event: ', e, 'context: ', context)
    gameids = e
    if gameids is None or len(gameids) == 0:
        print('no game id')
        return {
            "lines": []
        }
    writeOperations = []
    lines = []
    for gameid in gameids: 
        lines = get_lines(gameid)
        writeOperations.append(UpdateOne(
            {
                'gameId': gameid
            },
            {
                '$set': {
                    'currentLines': lines
                }
            }
        ))
    collection.bulk_write(writeOperations)
    return {
        "lines": lines
    }
