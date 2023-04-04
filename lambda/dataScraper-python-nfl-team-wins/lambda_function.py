import requests
import time
from bs4 import BeautifulSoup
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

tableClass = 'Covers-CoversArticles-AdminArticleTable'
page = driver.get('https://www.covers.com/nfl/nfl-odds-win-totals') # Getting page HTML through request
WebDriverWait(driver, 30).until(
    EC.element_to_be_clickable(
        (By.CLASS_NAME, tableClass), #Element filtration
        #The expected text for text_to_be_present
    )
)

teams = {
    'Arizona Cardinals': {
        "code": 'ARI',
        "shortName": "Cardinals",
        "fullName": "Arizona Cardinals"
    },
    'Atlanta Falcons': {
        "code": 'ATL',
        "shortName": "Falcons",
        "fullName": "Atlanta Falcons"},
    'Baltimore Ravens': {
        "code": "BAL",
        "shortName": "Ravens",
        "fullName": "Baltimore Ravens"
        },
    'Buffalo Bills': {
        "code": "BUF",
        "shortName": "Bills",
        "fullName": "Buffalo Bills"
        },
    'Carolina Panthers': {
        "code": "CAR",
        "shortName": "Panthers",
        "fullName": "Carolina Panthers"
        },
    'Chicago Bears': {
        "code": "CHI",
        "shortName": "Bears",
        "fullName": "Chicago Bears"
        }, 
    'Cincinnati Bengals':{
        "code": "CIN",
        "shortName": "Bengals",
        "fullName": "Cincinnati Bengals"
    }, 
    'Cleveland Browns': {
        "code": "CLE",
        "shortName": "Browns",
        "fullName": "Cleveland Browns"
    }, 
    'Dallas Cowboys': {
        "code": "DAL",
        "shortName": "Cowboys",
        "fullName": "Dallas Cowboys"
        }, 
    'Denver Broncos': {
        "code": "DEN",
        "shortName": "Broncos",
        "fullName": "Denver Broncos"
        }, 
    'Detroit Lions':{
        "code": "DET",
        "shortName": "Lions",
        "fullName": "Detroit Lions"
        },
    'Green Bay Packers': {
        "code": "GB",
        "shortName": "Packers",
        "fullName": "Green Bay Packers"
        }, 
    'Houston Texans': {
        "code": "HOU",
        "shortName": "Texans",
        "fullName": "Houston Texans"
        }, 
    'Indianapolis Colts': {
        "code": "IND",
        "shortName": "Colts",
        "fullName": "Indianapolis Colts"
        }, 
    'Jacksonville Jaguars': {
        "code": "JAC",
        "shortName": "Jaguars",
        "fullName": "Jacksonville Jaguars"
        }, 
    'Kansas City Chiefs': {
        "code": "KC",
        "shortName": "Chiefs",
        "fullName": "Kansas City Chiefs"
        }, 
    'Los Angeles Chargers': {
        "code": "LAC",
        "shortName": "Chargers",
        "fullName": "Los Angeles Chargers"
        }, 
    'Los Angeles Rams': {
        "code": "LAR",
        "shortName": "Rams",
        "fullName": "Los Angeles Rams"
        }, 
    'Las Vegas Raiders': {
        "code": "LV",
        "shortName": "Raiders",
        "fullName": "Las Vegas Raiders"
        }, 
    'Miami Dolphins': {
        "code": "MIA",
        "shortName": "Dolphins",
        "fullName": "Miami Dolphins"
        }, 
    'Minnesota Vikings': {
        "code": "MIN",
        "shortName": "Vikings",
        "fullName": "Miami Vikings"
        }, 
    'New England Patriots': {
        "code": "NE",
        "shortName": "Patriots",
        "fullName": "New England Patriots"
        }, 
    'New Orleans Saints': {
        "code": "NO",
        "shortName": "Saints",
        "fullName": "New Orleans Saints"
        }, 
    'New York Giants': {
        "code": "NYG",
        "shortName": "Giants",
        "fullName": "New York Giants"
        }, 
    'New York Jets': {
        "code": "NYJ",
        "shortName": "Jets",
        "fullName": "New York Jets"
        }, 
    'Philadelphia Eagles': {
        "code": "PHI",
        "shortName": "Eagles",
        "fullName": "Philadelphia Eagles"
        }, 
    'Pittsburgh Steelers': {
        "code": "PIT",
        "shortName": "Steelers",
        "fullName": "Pittsburgh Steelers"
        }, 
    'San Francisco 49ers': {
        "code": "SF",
        "shortName": "49ers",
        "fullName": "San Francisco 49ers"
        }, 
    'Seattle Seahawks': {
        "code": "SEA",
        "shortName": "Seahawks",
        "fullName": "Seattle Seahawks"
        }, 
    'Tampa Bay Buccaneers': {
        "code": "TB",
        "shortName": "Buccaneers",
        "fullName": "Tampa Bay Buccaneers"
        }, 
    'Tennessee Titans': {
        "code": "TEN",
        "shortName": "Titans",
        "fullName": "Tennessee Titans"
        },
    'Washington Commanders': {
        "code": "WAS",
        "shortName": "Commanders",
        "fullName": "Washington Commanders"
        }
}

odds = driver.find_elements(By.XPATH, '//*[@id="mainContainer"]/div/div[6]/div[1]/table/tbody/tr')
scrapedOdds = []
for teamOdds in odds:
    cols = teamOdds.find_elements(By.TAG_NAME, 'td')
    if len(cols) == 4:
        teamName = cols[0].text
        teamTotal = cols[1].text
        teamOverJuice = cols[2].text
        teamUnderJuice = cols[3].text
        year = 2023
        sport = 'nfl'
        season = 'reg'
        #check for '+' and convert to straight number
        if teamOverJuice.find('+') > -1:
            teamOverJuice = teamOverJuice[1:]
        if teamUnderJuice.find('+') > -1:
            teamUnderJuice = teamUnderJuice[1:]
        winObject = {
            "wins": float(teamTotal),
            "overOdds": int(teamOverJuice),
            "underOdds": int(teamUnderJuice)
        }
        print(teams[teamName])
        if teams[teamName]:
            teamObject = teams[teamName]
            collection.update_one({
                "fullName": teamObject["fullName"],
                "year": year,
                "sport": sport,
                "season": season
                },
                {
                    "$set": {
                        "code": teamObject["code"],
                        "shortName": teamObject["shortName"],
                        "fullName": teamObject["fullName"],
                        "year": year,
                        "sport": sport,
                        "season": season,
                        "wins": float(teamTotal),
                        "overOdds": int(teamOverJuice),
                        "underOdds": int(teamUnderJuice)
                    }
                },
                upsert=True)
        scrapedOdds.append({"team": teamName, "wins": float(teamTotal), "overOdds": int(teamOverJuice), "underOdds": int(teamUnderJuice)})

print(scrapedOdds)




    
# first10 = odds[:10] # Keep only the first 10 anchors
# for anchor in first10:
#     print(anchor.text) # Display the innerText of each anchor