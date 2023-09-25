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
endDate = datetime.strptime('2024-02-14', '%Y-%m-%d')
cols = ['event', 'event id', 'participant', 'spread / total', 'decimal odds', 'american odds', 'result', 'profit']

nfl = NFL()


# lines = pd.merge(spreads.dataframe(), totals.dataframe(), how="outer", on="event id")



def lambda_handler(e, context):
    print('event: ', e, 'context: ', context)
    try:
        gameid = e['gameId']
        if gameid is None:
            print('no game id')
            return {
                'statusCode': 400,
                'body': 'no game id'
            }
        blspread = BestLines([gameid],nfl.market_ids('pointspread'))
        bltotal = BestLines([gameid],nfl.market_ids('totals'))
        blmoneyline = BestLines([gameid],nfl.market_ids('money-line'))

        lines = {
            "spread": None,
            "total": None,
            "ml": None
        }
        # print('bl: ', bl)
        if len(blspread.list()) > 0:
            for line in blspread.list():
                line['type'] = 'spread'
                sb = Sportsbooks(line['sportsbook id'])
                print('spread sb:', line['sportsbook id'], len(sb.list()))
                if sb != None and len(sb.list()) > 0:
                    for book in sb.list():
                        line['sportsbook'] = {
                            'name': book['name'],
                            'id': book['sportsbook id']
                        }
                    if lines['spread'] is None:
                        lines['spread'] = line
        if len(bltotal.list()) > 0:
            for line in bltotal.list():
                line['type'] = 'total'
                sb = Sportsbooks(line['sportsbook id'])
                print('total sb:', line['sportsbook id'], len(sb.list()))
                if sb != None and len(sb.list()) > 0:
                    for book in sb.list():
                        line['sportsbook'] = {
                            'name': book['name'],
                            'id': book['sportsbook id']
                        }
                    if lines['total'] is None:
                        lines['total'] = line

        if len(blmoneyline.list()) > 0:
            for line in blmoneyline.list():
                line['type'] = 'ml'
                sb = Sportsbooks(line['sportsbook id'])
                print('ml sb:', line['sportsbook id'], len(sb.list()))
                if sb != None and len(sb.list()) > 0:
                    for book in sb.list():
                        line['sportsbook'] = {
                            'name': book['name'],
                            'id': book['sportsbook id']
                        }
                    if lines['ml'] is None:
                        lines['ml'] = line
        print ('lines: ', lines)
    except TypeError as error:
        print(TypeError) 
        print(repr(error))
    except ValueError:
        print(ValueError)
    return {
        "lines": lines 
    }

    


    # print(cl.dataframe(e)[cols])
    # for event in e.list():
    #     print(event)
