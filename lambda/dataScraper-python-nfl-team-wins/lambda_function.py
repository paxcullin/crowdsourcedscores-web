import requests
from datetime import datetime, date, timedelta
import numbers
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from pymongo import MongoClient
from config import Config


client = MongoClient("mongodb+srv://" +  str(Config.username) + ":" + str(Config.password) + "@pcsm.lwx4u.mongodb.net/pcsm?retryWrites=true&w=majority")
db = client['pcsm']
collection = db['wintotals']


driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
driver.maximize_window()
 
option = webdriver.ChromeOptions()
# I use the following options as my machine is a window subsystem linux. 
# I recommend to use the headless option at least, out of the 3
option.add_argument('--headless')
option.add_argument('--no-sandbox')
option.add_argument('--disable-dev-sh-usage')
# Replace YOUR-PATH-TO-CHROMEDRIVER with your chromedriver location


# def lambda_handler(event, context):
tableClass = 'sportsbook-event-accordion__wrapper'
page = driver.get('https://sportsbook.draftkings.com/leagues/football/nfl?category=team-futures&subcategory=regular-season-wins') # Getting page HTML through request
WebDriverWait(driver, 30).until(
    EC.element_to_be_clickable(
        (By.CLASS_NAME, tableClass), #Element filtration
        #The expected text for text_to_be_present
    )
)

teams = {
    'ARI Cardinals': {
        "code": 'ARI',
        "shortName": "Cardinals",
        "fullName": "Arizona Cardinals"
    },
    'ATL Falcons': {
        "code": 'ATL',
        "shortName": "Falcons",
        "fullName": "Atlanta Falcons"},
    'BAL Ravens': {
        "code": "BAL",
        "shortName": "Ravens",
        "fullName": "Baltimore Ravens"
        },
    'BUF Bills': {
        "code": "BUF",
        "shortName": "Bills",
        "fullName": "Buffalo Bills"
        },
    'CAR Panthers': {
        "code": "CAR",
        "shortName": "Panthers",
        "fullName": "Carolina Panthers"
        },
    'CHI Bears': {
        "code": "CHI",
        "shortName": "Bears",
        "fullName": "Chicago Bears"
        }, 
    'CIN Bengals':{
        "code": "CIN",
        "shortName": "Bengals",
        "fullName": "Cincinnati Bengals"
    }, 
    'CLE Browns': {
        "code": "CLE",
        "shortName": "Browns",
        "fullName": "Cleveland Browns"
    }, 
    'DAL Cowboys': {
        "code": "DAL",
        "shortName": "Cowboys",
        "fullName": "Dallas Cowboys"
        }, 
    'DEN Broncos': {
        "code": "DEN",
        "shortName": "Broncos",
        "fullName": "Denver Broncos"
        }, 
    'DET Lions':{
        "code": "DET",
        "shortName": "Lions",
        "fullName": "Detroit Lions"
        },
    'GB Packers': {
        "code": "GB",
        "shortName": "Packers",
        "fullName": "Green Bay Packers"
        }, 
    'HOU Texans': {
        "code": "HOU",
        "shortName": "Texans",
        "fullName": "Houston Texans"
        }, 
    'IND Colts': {
        "code": "IND",
        "shortName": "Colts",
        "fullName": "Indianapolis Colts"
        }, 
    'JAX Jaguars': {
        "code": "JAC",
        "shortName": "Jaguars",
        "fullName": "Jacksonville Jaguars"
        }, 
    'KC Chiefs': {
        "code": "KC",
        "shortName": "Chiefs",
        "fullName": "Kansas City Chiefs"
        }, 
    'LA Chargers': {
        "code": "LAC",
        "shortName": "Chargers",
        "fullName": "Los Angeles Chargers"
        }, 
    'LA Rams': {
        "code": "LAR",
        "shortName": "Rams",
        "fullName": "Los Angeles Rams"
        }, 
    'LV Raiders': {
        "code": "LV",
        "shortName": "Raiders",
        "fullName": "Las Vegas Raiders"
        }, 
    'MIA Dolphins': {
        "code": "MIA",
        "shortName": "Dolphins",
        "fullName": "Miami Dolphins"
        }, 
    'MIN Vikings': {
        "code": "MIN",
        "shortName": "Vikings",
        "fullName": "Miami Vikings"
        }, 
    'NE Patriots': {
        "code": "NE",
        "shortName": "Patriots",
        "fullName": "New England Patriots"
        }, 
    'NO Saints': {
        "code": "NO",
        "shortName": "Saints",
        "fullName": "New Orleans Saints"
        }, 
    'NY Giants': {
        "code": "NYG",
        "shortName": "Giants",
        "fullName": "New York Giants"
        }, 
    'NY Jets': {
        "code": "NYJ",
        "shortName": "Jets",
        "fullName": "New York Jets"
        }, 
    'PHI Eagles': {
        "code": "PHI",
        "shortName": "Eagles",
        "fullName": "Philadelphia Eagles"
        }, 
    'PIT Steelers': {
        "code": "PIT",
        "shortName": "Steelers",
        "fullName": "Pittsburgh Steelers"
        }, 
    'SF 49ers': {
        "code": "SF",
        "shortName": "49ers",
        "fullName": "San Francisco 49ers"
        }, 
    'SEA Seahawks': {
        "code": "SEA",
        "shortName": "Seahawks",
        "fullName": "Seattle Seahawks"
        }, 
    'TB Buccaneers': {
        "code": "TB",
        "shortName": "Buccaneers",
        "fullName": "Tampa Bay Buccaneers"
        }, 
    'TEN Titans': {
        "code": "TEN",
        "shortName": "Titans",
        "fullName": "Tennessee Titans"
        },
    'WAS Commanders': {
        "code": "WAS",
        "shortName": "Commanders",
        "fullName": "Washington Commanders"
        }
}
oddsTable = driver.find_elements(By.CLASS_NAME, "sportsbook-event-accordion__wrapper")
scrapedOdds = []
print('oddsTable:', len(oddsTable))
for teamOdds in oddsTable:
    teamName = teamOdds.find_element(By.TAG_NAME, 'p').text.replace(" Regular Season Wins", "")
    teamTotal = teamOdds.find_element(By.CLASS_NAME, 'sportsbook-outcome-cell__line').text
    teamJuiceSpans = teamOdds.find_elements(By.CLASS_NAME, 'sportsbook-odds') 
    teamOverJuiceString = teamJuiceSpans[0].text
    print('teamOverJuiceString: ', teamOverJuiceString)
    teamOverJuice = teamOverJuiceString.strip("\'")
    print('teamOverJuice: ', teamOverJuice)
    teamUnderJuice = teamJuiceSpans[1].text
    print('teamUnderJuice: ', teamUnderJuice)
    year = 2023
    sport = 'nfl'
    season = 'reg'
    #check for '+' and convert to straight number
    if teamOverJuice.find('+') > -1:
        teamOverJuice = teamOverJuice[1:]
    else:
        teamOverJuice = int(teamOverJuice[1:])*-1
    if teamUnderJuice.find('+') > -1:
        teamUnderJuice = teamUnderJuice[1:]
    else:
        teamUnderJuice = int(teamUnderJuice[1:])*-1
    winObject = {
        "wins": float(teamTotal),
        "overOdds": int(teamOverJuice),
        "underOdds": int(teamUnderJuice)
    }
    if teams[teamName]:
        teamObject = teams[teamName]
        teamQuery = {
            "fullName": teamObject["fullName"],
            "year": year,
            "sport": sport,
            "season": season
            }
        
        # get the existing odds to build the odds history
        teamOddsResult = collection.find_one(teamQuery)
        oddsHistory = []
        if (teamOddsResult):
            if teamOddsResult.get('history', None) is not None:
                oddsHistory = teamOddsResult["history"]
        
        oddsHistory.append({
            "date": datetime.now(),
            "wins": float(teamTotal),
            "overOdds": int(teamOverJuice),
            "underOdds": int(teamUnderJuice)
        })
        collection.update_one(teamQuery,
            {
                "$set": {
                    "code": teamObject["code"],
                    "shortName": teamObject["shortName"],
                    "fullName": teamObject["fullName"],
                    "year": year,
                    "sport": sport,
                    "season": season,
                    "updated": datetime.now(),
                    "wins": float(teamTotal),
                    "overOdds": int(teamOverJuice),
                    "underOdds": int(teamUnderJuice),
                    "history": oddsHistory
                }
            },
            upsert=True)
    scrapedOdds.append({"team": teamObject["fullName"], "wins": float(teamTotal), "overOdds": int(teamOverJuice), "underOdds": int(teamUnderJuice)})

print('scrapedOdds:', scrapedOdds)
    # return {
    #     'message': 'Win Totals Odds Updated'
    # }




    
# first10 = odds[:10] # Keep only the first 10 anchors
# for anchor in first10:
#     print(anchor.text) # Display the innerText of each anchor

#mybookie
# <a class="nav-link sub-items-menu__body__item__link" href="javascript:void(0)" data-league_id="15565" data-category="Regular Season Wins" data-parent-category="NFL" data-breadcrumb="13_962">Regular Season Wins</a>