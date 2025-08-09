import requests
from bs4 import BeautifulSoup
import pandas as pd
from datetime import datetime
import re
import time
import os
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

def save_to_csv(videos, output_dir=None):
    """
    Saves a list of video data to a CSV file.

    Args:
        videos (list): A list of dictionaries, where each dictionary is a video's data.
        output_dir (str, optional): The directory to save the file in.
                                    If None, saves to the current directory.

    Returns:
        str: The full path to the saved CSV file.
    """
    df = pd.DataFrame(videos)

    # Generate a unique filename using the current timestamp
    # --- THIS IS THE CORRECTED LINE ---
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    
    file_name = f"youtube_videos_{timestamp}.csv"

    if output_dir:
        os.makedirs(output_dir, exist_ok=True)
        file_path = os.path.join(output_dir, file_name)
    else:
        file_path = file_name

    df.to_csv(file_path, index=False, encoding='utf-8-sig')

    return file_path

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