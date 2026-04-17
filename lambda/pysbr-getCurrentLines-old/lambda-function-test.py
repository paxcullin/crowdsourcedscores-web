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


# lines = pd.merge(spreads.dataframe(), totals.dataframe(), how="outer", on="event id")



# def lambda_handler(e, context):
# e = EventsByDateRange(nfl.league_id, startDate,endDate)
gameid = 4700690
try:
    if gameid is None:
        print('no game id')
    blspread = CurrentLines([gameid],nfl.market_ids('pointspread'))
    bltotal = CurrentLines([gameid],nfl.market_ids('totals'))
    blmoneyline = CurrentLines([gameid],nfl.market_ids('money-line'))

    lines = []
    # print('bl: ', bl)
    if len(blspread.list()) > 0:
        for line in blspread.list():
            line['type'] = 'spread'
            sb = Sportsbooks(line['sportsbook id'])
            if len(sb.list()) > 0:
                for book in sb.list():
                    line['sportsbook'] = {
                        'name': book['name'],
                        'id': book['sportsbook id']
                    }
            
                lines.append(line)
    if len(bltotal.list()) > 0:
        for line in bltotal.list():
            line['type'] = 'total'
            sb = Sportsbooks(line['sportsbook id'])
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
            sb = Sportsbooks(line['sportsbook id'])
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
