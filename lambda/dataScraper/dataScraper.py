import requests
import json
from datetime import datetime
from bs4 import BeautifulSoup
from csv import writer

urls = ['https://www.cbssports.com/college-basketball/scoreboard/NCAA/20190323/']

# response = requests.get('https://www.cbssports.com/college-basketball/scoreboard/')
# soup = BeautifulSoup(response.text, 'html.parser')

#el = soup.find(class_='single-score-card')

with open('games.csv', 'w') as csv_file:
    csv_writer = writer(csv_file)
    headers = ['gameId', 'date', 'location', 'tv', 'awayTeam', 'awayTeamRank', 'homeTeam', 'homeTeamRank', 'total', 'spread']
    csv_writer.writerow(headers)

    for url in urls:
        response = requests.get(url)
        soup = BeautifulSoup(response.text, 'html.parser')
        for item in soup.find_all(class_='single-score-card'):
            gameId = item['id']
            if "game" not in gameId:
                continue
            gameDateString = item.find('span', class_='game-status')['data-format-datetime']
            gameDateObj = json.loads(gameDateString)
            gameDateInt = int(gameDateObj[u'value'])
            gameDate = datetime.fromtimestamp(gameDateInt)
            teams = item.find_all('a', class_='team')
            awayTeam = 'TBD'
            awayTeamRank = 'TBD'
            homeTeam = 'TBD'
            homeTeamRank = 'TBD'
            if len(teams) == 1:
                homeTeam = teams[0].get_text()
                homeTeamRankString = item.find_all('td', class_='team')[1].text
                print(homeTeamRankString)
                homeTeamRankArray = [int(s) for s in homeTeamRankString.split() if s.isdigit()]
                if len(homeTeamRankArray) > 0:
                    homeTeamRank = homeTeamRankArray[0]

            else:
                awayTeam = teams[0].get_text()
                awayTeamRankString = item.find_all('td', class_='team')[0].text
                print(awayTeamRankString)
                awayTeamRankArray = [int(s) for s in awayTeamRankString.split() if s.isdigit()]
                if len(awayTeamRankArray) > 0:
                    awayTeamRank = awayTeamRankArray[0]
            
                homeTeam = teams[1].get_text()
                homeTeamRankString = item.find_all('td', class_='team')[1].text
                print(homeTeamRankString)
                homeTeamRankArray = [int(s) for s in homeTeamRankString.split() if s.isdigit()]
                if len(homeTeamRankArray) > 0:
                    homeTeamRank = homeTeamRankArray[0]
            
            tv = item.find(class_="broadcaster").get_text().replace('\n','').replace(' ','')
            location = item.find(class_="series-statement").get_text().replace('\n','')
            odds = item.find_all(class_='in-progress-odds')
            if len(odds) > 0:
                oddsTotal = odds[0].get_text().replace('\n','').replace(' ','')
                oddsSpread = odds[1].get_text().replace('\n','').replace(' ','')
            csv_writer.writerow([gameId, gameDate, location, tv, awayTeam, awayTeamRank, homeTeam, homeTeamRank, oddsTotal, oddsSpread])
            # print(gameId)
            # print(gameDate)
            # print(datetime.fromtimestamp(gameDate))

    