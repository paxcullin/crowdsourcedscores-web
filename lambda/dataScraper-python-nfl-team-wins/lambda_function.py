import requests
import time
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import csv



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

odds = driver.find_elements(By.XPATH, '//*[@id="mainContainer"]/div/div[6]/div[1]/table/tbody/tr')
scrapedOdds = []
for teamOdds in odds:
    cols = teamOdds.find_elements(By.TAG_NAME, 'td')
    if len(cols) == 4:
        teamName = cols[0].text
        teamTotal = cols[1].text
        teamOverJuice = cols[2].text
        teamUnderJuice = cols[3].text
        #check for '+' and convert to straight number
        if teamOverJuice.find('+') > -1:
            teamOverJuice = teamOverJuice[1:]
        if teamUnderJuice.find('+') > -1:
            teamUnderJuice = teamUnderJuice[1:]
        scrapedOdds.append([teamName, float(teamTotal), int(teamOverJuice), int(teamUnderJuice)])

print(scrapedOdds)




    
# first10 = odds[:10] # Keep only the first 10 anchors
# for anchor in first10:
#     print(anchor.text) # Display the innerText of each anchor