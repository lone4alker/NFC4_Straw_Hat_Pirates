import re
import requests
import pandas as pd

def scrape_reddit_user_to_df(user_url):
    # Extract username
    match = re.search(r'reddit\.com/u(?:ser)?/([^/\?]+)', user_url)
    if not match:
        raise ValueError("Invalid Reddit user URL")

    username = match.group(1)

    # Reddit JSON API
    json_url = f"https://www.reddit.com/user/{username}/submitted.json"
    headers = {
        'User-Agent': 'Mozilla/5.0'
    }

    response = requests.get(json_url, headers=headers)
    if response.status_code != 200:
        raise ValueError(f"Failed to fetch Reddit data: {response.status_code}")

    data = response.json()
    posts = []

    for post in data['data']['children']:
        p = post['data']
        has_media = 'Yes' if (
            p.get('is_video') or 
            p.get('post_hint') in ['image', 'video'] or 
            any(ext in p.get('url', '') for ext in ['.jpg', '.png', '.gif', '.mp4'])
        ) else 'No'

        posts.append({
            'title': p.get('title', ''),
            'body_text': p.get('selftext', ''),
            'has_media': has_media
        })

    df = pd.DataFrame(posts)
    return df