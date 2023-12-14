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

sportsbook = Sportsbook()

# lines = pd.merge(spreads.dataframe(), totals.dataframe(), how="outer", on="event id")



# def lambda_handler(e, context):
# e = EventsByDateRange(nfl.league_id, startDate,endDate)
gameid = 4700693
try:
    if gameid is None:
        print('no game id')
    blspread = BestLines([gameid],nfl.market_ids('pointspread'))
    bltotal = BestLines([gameid],nfl.market_ids('totals'))
    blmoneyline = BestLines([gameid],nfl.market_ids('money-line'))

    lines = []
    # print('bl: ', bl)
    if len(blspread.list()) > 0:
        for line in blspread.list():
            line['type'] = 'spread'
            sbid = sportsbook.sysids(line['sportsbook id'])
            sbtest = Sportsbooks(139)
            print('sbid: ', sbid)
            sb = Sportsbooks(sbid[line['sportsbook id']])
            print('spread sb:', line['sportsbook id'], len(sb.list()))
            if len(sb.list()) > 0:
                for book in sb.list():
                    print('book: ', book)
                    line['sportsbook'] = {
                        'name': book['name'],
                        'id': book['sportsbook id']
                    }
            
            lines.append(line)
    if len(bltotal.list()) > 0:
        for line in bltotal.list():
            line['type'] = 'total'
            sbid = sportsbook.sysids(line['sportsbook id'])
            print('sbid: ', sbid)
            sb = Sportsbooks(sbid[line['sportsbook id']])
            print('total sb:', line['sportsbook id'], len(sb.list()))
            if len(sb.list()) > 0:
                for book in sb.list():
                    line['sportsbook'] = {
                        'name': book['name'],
                        'id': book['sportsbook id']
                    }
            lines.append(line)

    if len(blmoneyline.list()) > 0:
        for line in blmoneyline.list():
            line['type'] = 'ml'
            sbid = sportsbook.sysids(line['sportsbook id'])
            print('sbid: ', sbid)
            sb = Sportsbooks(sbid[line['sportsbook id']])
            print('ml sb:', line['sportsbook id'], len(sb.list()))
            if len(sb.list()) > 0:
                for book in sb.list():
                    line['sportsbook'] = {
                        'name': book['name'],
                        'id': book['sportsbook id']
                    }
            lines.append(line)
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
