from pysbr import *
from pysbr.config.config import Config
from datetime import datetime, timedelta
from datetime import date
from pymongo import MongoClient
import boto3

sns = boto3.client('sns')

client = MongoClient(f"mongodb+srv://{Config.username}:{Config.password}@pcsm.lwx4u.mongodb.net/pcsm?retryWrites=true&w=majority")
db = client['pcsm']
collection = db['games']

today = str(date.today())
yesterday = str(date.today() - timedelta(days=1))
startDate = datetime.strptime(yesterday, '%Y-%m-%d')
endDate = datetime.strptime('2024-02-14', '%Y-%m-%d')
cols = ['event', 'event id', 'participant', 'spread / total', 'decimal odds', 'american odds', 'result', 'profit']

nfl = NFL()

def get_best_lines(game_id, market_type):
    best_lines = BestLines([game_id], nfl.market_ids(market_type))
    lines = None
    
    if len(best_lines.list()) > 0:
        lines = []
        for line in best_lines.list():
            line['type'] = market_type
            sb = Sportsbooks(line['sportsbook id'])
            
            if sb and len(sb.list()) > 0:
                book = sb.list()[0]  # Select the first sportsbook, or modify as needed
                line['sportsbook'] = {
                    'name': book['name'],
                    'id': book['sportsbook id']
                }
                lines.append(line)
    
    return lines

def lambda_handler(event, context):
    print('event:', event, 'context:', context)
    lines = {
        "spread": get_best_lines(event.get('gameId'), 'pointspread'),
        "total": get_best_lines(event.get('gameId'), 'totals'),
        "ml": get_best_lines(event.get('gameId'), 'money-line')
    }
    print('lines:', lines)
    return {
        "lines": lines
    }
