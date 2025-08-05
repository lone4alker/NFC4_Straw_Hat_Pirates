import requests
from bs4 import BeautifulSoup
import pandas as pd
from datetime import datetime
import re
import time

def scrape_youtube_channel(channel_url):
    """Scrape videos from YouTube channel"""
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
    
    # Add /videos to URL if not present
    if '/videos' not in channel_url:
        channel_url = channel_url.rstrip('/') + '/videos'
    
    try:
        print(f"Scraping: {channel_url}")
        r = requests.get(channel_url, headers=headers)
        soup = BeautifulSoup(r.content, 'html.parser')
        
        # Get channel name
        channel_name = soup.find('title').text.replace(' - YouTube', '') if soup.find('title') else 'Unknown'
        print(f"Channel: {channel_name}")
        
        # Find video IDs
        video_ids = re.findall(r'"videoId":"([a-zA-Z0-9_-]{11})"', str(soup))
        video_ids = list(set(video_ids))[:20]  # Remove duplicates, limit to 20
        
        videos = []
        for i, video_id in enumerate(video_ids):
            video_url = f"https://www.youtube.com/watch?v={video_id}"
            
            # Get video page
            video_response = requests.get(video_url, headers=headers)
            video_soup = BeautifulSoup(video_response.content, 'html.parser')
            
            # Extract title and description
            title_tag = video_soup.find('meta', {'property': 'og:title'})
            desc_tag = video_soup.find('meta', {'property': 'og:description'})
            
            title = title_tag['content'] if title_tag else 'No title'
            description = desc_tag['content'] if desc_tag else 'No description'
            
            videos.append({
                'channel_name': channel_name,
                'title': title,
                'description': description,
                'video_url': video_url,
                'scraped_at': datetime.now()
            })
            
            print(f"✓ {i+1}/{len(video_ids)}: {title[:50]}...")
            time.sleep(1)  # Be respectful
        
        return videos
        
    except Exception as e:
        print(f"Error: {e}")
        return []

def save_to_csv(videos):
    """Save videos to CSV"""
    if videos:
        df = pd.DataFrame(videos)
        filename = f"youtube_videos_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"
        df.to_csv(filename, index=False)
        print(f"Saved {len(videos)} videos to {filename}")
        return df
    return None

# Main execution
if __name__ == "__main__":
    print("YouTube Channel Scraper")
    print("=" * 25)
    
    channel_url = input("Enter YouTube channel URL: ")
    videos = scrape_youtube_channel(channel_url)
    
    if videos:
        save_to_csv(videos)
        print(f"\nSuccess! Scraped {len(videos)} videos")
    else:
        print("No videos found")