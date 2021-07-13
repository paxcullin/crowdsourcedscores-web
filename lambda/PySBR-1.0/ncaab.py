from pysbr import *
from mongoconfig import * 
from datetime import datetime
from pymongo import MongoClient


client = MongoClient('localhost', 27017)
MONGO_URL = "mongodb+srv://" +  str(MongoConfig.username) + ":" + str(MongoConfig.password) + "@pcsm.lwx4u.mongodb.net/pcsm?retryWrites=true&w=majority"

dt = datetime.strptime('2020-12-06', '%Y-%m-%d')
cols = ['event', 'event id', 'participant', 'spread / total', 'decimal odds', 'american odds', 'result', 'profit']

ncaab = NCAAB()
sb = Sportsbook()

e = EventsByDate(ncaab.league_id, dt)
cl = CurrentLines(e.ids(), ncaab.market_ids('pointspread'), sb.ids('Pinnacle')[0])

print(cl.dataframe(e)[cols])
# for event in e.list():
#     print(event)
