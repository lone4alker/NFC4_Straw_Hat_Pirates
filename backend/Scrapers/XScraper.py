from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
import time
import csv
import re

# --- Input ---
user_input = input("Enter X username or profile URL: ").strip()
match = re.search(r"(?:https?://)?(?:www\.)?twitter\.com/([A-Za-z0-9_]+)", user_input)
username = match.group(1) if match else user_input.lstrip('@')
output_file = f"{username}_tweets.csv"

# --- Selenium setup ---
options = Options()
options.add_argument("--start-maximized")
options.add_argument("--disable-blink-features=AutomationControlled")
driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)

# --- Open profile ---
profile_url = f"https://twitter.com/{username}"
print(f"🔍 Opening {profile_url}")
driver.get(profile_url)
time.sleep(5)

# --- Scroll logic ---
SCROLLS = 30  # Increase for more tweets
PAUSE_TIME = 3
last_height = driver.execute_script("return document.body.scrollHeight")
tweets_set = set()

for scroll in range(SCROLLS):
    print(f"📜 Scrolling: {scroll + 1}/{SCROLLS}")
    driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
    time.sleep(PAUSE_TIME)

    tweets = driver.find_elements(By.XPATH, '//article//div[@data-testid="tweetText"]')
    for tweet in tweets:
        text = tweet.text.strip()
        if text:
            tweets_set.add(text)

    new_height = driver.execute_script("return document.body.scrollHeight")
    if new_height == last_height:
        print("🛑 Reached end of scroll.")
        break
    last_height = new_height

# --- Save tweets ---
if tweets_set:
    with open(output_file, mode='w', newline='', encoding='utf-8') as file:
        writer = csv.writer(file)
        writer.writerow(["Tweet"])
        for tweet in tweets_set:
            writer.writerow([tweet])
    print(f"✅ {len(tweets_set)} unique tweets saved to {output_file}")
else:
    print("⚠️ No tweets found.")

driver.quit()
