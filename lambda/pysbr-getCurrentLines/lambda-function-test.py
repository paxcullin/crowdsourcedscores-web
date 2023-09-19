from pysbr import *
from pysbr.config.config import Config
from datetime import datetime, timedelta
from datetime import date
from pymongo import MongoClient
import boto3

sns = boto3.client('sns')


client = MongoClient("mongodb+srv://" +  str(Config.username) + ":" + str(Config.password) + "@pcsm.lwx4u.mongodb.net/pcsm?retryWrites=true&w=majority")
db = client['pcsm']
collection = db['games']

today = str(date.today())
yesterday = str((date.today() - timedelta(days=1)))
startDate = datetime.strptime(yesterday, '%Y-%m-%d')
endDate = datetime.strptime('2023-09-17', '%Y-%m-%d')
cols = ['event', 'event id', 'participant', 'spread / total', 'decimal odds', 'american odds', 'result', 'profit']

nfl = NFL()
sblib = Sportsbook()
# sbconfig = Sportsbook.
# print('sbconfig: ', sbconfig)

# lines = pd.merge(spreads.dataframe(), totals.dataframe(), how="outer", on="event id")



# def lambda_handler(e, context):
# e = EventsByDateRange(nfl.league_id, startDate,endDate)
gameid = 4700692
books = {
    'Pinnacle': 238,
    '5Dimes': 19,
    'Bookmaker': 93,
    'BetOnline': 1096,
    'Bovada': 999996
}
try:
    if gameid is None:
        print('no game id')
    sbids = sblib.ids(['Pinnacle', '5Dimes', 'Bookmaker', 'BetOnline', 'Bovada'])
    sbsysids = sblib.sysids(['Pinnacle', '5Dimes', 'Bookmaker', 'BetOnline', 'Bovada'])
    print('sbids: ', sbids)
    clspread = CurrentLines([gameid],nfl.market_ids('pointspread'),sbids)
    cltotal = CurrentLines([gameid],nfl.market_ids('totals'),sbids)
    clmoneyline = CurrentLines([gameid],nfl.market_ids('money-line'),sbids)

    lines = {
        'spread': [],
        'total': [],
        'moneyline': []
    }
    # print('bl: ', bl)
    if len(clspread.list()) > 0:
        for line in clspread.list():
            line['type'] = 'spread'
            print('line: ', line)
            bookid = line['sportsbook id']
            sysid = None
            if (bookid == 20):
                sysid = 238
            if (bookid == 3):
                sysid = 19
            if (bookid == 10):
                sysid = 93
            if (bookid == 8):
                sysid = 1096
            if (bookid == 9):
                sysid = 999996
            sb = Sportsbooks(sysid)
            print('spread sb:', line['sportsbook id'], len(sb.list()))
            if len(sb.list()) > 0:
                for book in sb.list():
                    line['sportsbook'] = {
                        'name': book['name'],
                        'id': book['sportsbook id']
                    }
                lines['spread'].append(line)
    if len(cltotal.list()) > 0:
        for line in cltotal.list():
            line['type'] = 'total'
            sb = Sportsbooks(line['sportsbook id'])
            print('total sb:', line['sportsbook id'], len(sb.list()))
            if len(sb.list()) > 0:
                for book in sb.list():
                    line['sportsbook'] = {
                        'name': book['name'],
                        'id': book['sportsbook id']
                    }
                lines['total'].append(line)

    if len(clmoneyline.list()) > 0:
        for line in clmoneyline.list():
            line['type'] = 'ml'
            sb = Sportsbooks(line['sportsbook id'])
            print('ml sb:', line['sportsbook id'], len(sb.list()))
            if len(sb.list()) > 0:
                for book in sb.list():
                    line['sportsbook'] = {
                        'name': book['name'],
                        'id': book['sportsbook id']
                    }
                lines['moneyline'].append(line)
    print (lines)
except TypeError as error:
    print(TypeError) 
    print(repr(error))
except ValueError as error:
    print(ValueError)
    print(repr(error))
    # return {
    #     'message': 'lines update'
    # }

    


    # print(cl.dataframe(e)[cols])
    # for event in e.list():
    #     print(event)
