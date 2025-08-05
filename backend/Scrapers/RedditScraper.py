import requests
import csv
import re

def scrape_reddit_user(user_url):
    # Extract username from URL
    username = re.search(r'reddit\.com/u(?:ser)?/([^/\?]+)', user_url).group(1)
    
    # Use Reddit's JSON API
    json_url = f"https://www.reddit.com/user/{username}/submitted.json"
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
    
    response = requests.get(json_url, headers=headers)
    data = response.json()
    
    posts = []
    for post in data['data']['children']:
        p = post['data']
        
        # Check if has media
        has_media = 'Yes' if (p.get('is_video') or 
                             p.get('post_hint') in ['image', 'video'] or
                             any(ext in p.get('url', '') for ext in ['.jpg', '.png', '.gif', '.mp4'])) else 'No'
        
        posts.append({
            'title': p.get('title', ''),
            'body_text': p.get('selftext', ''),
            'has_media': has_media
        })
    
    # Save to CSV
    filename = f"{username}_posts.csv"
    with open(filename, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=['title', 'body_text', 'has_media'])
        writer.writeheader()
        writer.writerows(posts)
    
    print(f"Saved {len(posts)} posts to {filename}")

# Usage
user_url = input("Enter Reddit user URL: ")
scrape_reddit_user(user_url)