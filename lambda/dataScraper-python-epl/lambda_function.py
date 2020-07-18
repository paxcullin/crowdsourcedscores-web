#import urllib.request
import json, urllib3, boto3
from datetime import datetime
http = urllib3.PoolManager()
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('games-soccer-epl')

urls = ['https://io.oddsshark.com/scores/epl/2020-06-27']

def lambda_handler(event, context):
    for url in urls:
        request = http.request('GET',url, headers={'referer': 'https://www.oddsshark.com/soccer/epl/scores'})
        data = json.loads(request.data)
        
        for item in data:
            item['gameId'] = item['event_id']
            gameId = item['gameId']
            table.put_item(Item=item)
            print(gameId)
        return data
            # print(gameId)
            # print(gameDate)
            # print(datetime.fromtimestamp(gameDate))

    