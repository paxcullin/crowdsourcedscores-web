import requests
import time
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC



driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
driver.maximize_window()
 
option = webdriver.ChromeOptions()
# I use the following options as my machine is a window subsystem linux. 
# I recommend to use the headless option at least, out of the 3
option.add_argument('--headless')
option.add_argument('--no-sandbox')
option.add_argument('--disable-dev-sh-usage')
# Replace YOUR-PATH-TO-CHROMEDRIVER with your chromedriver location


page = driver.get('https://www.legalsportsreport.com/odds/nfl/win-totals/') # Getting page HTML through request
WebDriverWait(driver, 30).until(
    EC.element_to_be_clickable(
        (By.CLASS_NAME, 'metabet-futures-board-lines-over-under'), #Element filtration
        #The expected text for text_to_be_present
    )
)

odds = driver.find_element(By.CLASS_NAME, 'metabet-futures-board-lines-over-under')
print(odds.text)

# print(odds.text)
# first10 = odds[:10] # Keep only the first 10 anchors
# for anchor in first10:
#     print(anchor.text) # Display the innerText of each anchor