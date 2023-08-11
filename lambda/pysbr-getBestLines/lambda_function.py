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
    bl = BestLines(e['eventId'],nfl.market_ids('pointspread'))
    # print('bl: ', bl)
    if len(bl.list()) > 0:
        try:
            for line in bl.list():
                print('line: ', line)
                sb = Sportsbooks(line['sportsbook id'])
                print('sb:', len(sb.list()))
                # print('sb: ', sb["name"], sb["id"])
        except TypeError as error:
            print(TypeError, line) 
            print(repr(error))
        except ValueError:
            print(ValueError)
    return {
        'message': 'lines update'
    }

    


    # print(cl.dataframe(e)[cols])
    # for event in e.list():
    #     print(event)
