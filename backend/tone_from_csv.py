# Generate a unified tone analyzer that loads scraped CSV files (from YouTube, Twitter/X, Reddit)
# and applies VADER + BERT to extract tone analysis.

unified_tone_model = """
# tone_from_csv.py

import pandas as pd
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from transformers import pipeline
import json
import os

# Load VADER and BERT-based emotion classifier
vader = SentimentIntensityAnalyzer()
emotion_classifier = pipeline("text-classification", model="j-hartmann/emotion-english-distilroberta-base", top_k=1)

def load_posts_from_csv(csv_path):
    try:
        df = pd.read_csv(csv_path)

        # Choose most probable column name for text
        for col in ["Tweet", "title", "description", "text", "content"]:
            if col in df.columns:
                posts = df[col].dropna().astype(str).tolist()
                return posts
        print("⚠️ No recognizable text column found in CSV.")
        return []
    except Exception as e:
        print(f"Error loading CSV: {e}")
        return []

def analyze_tone_from_csv(csv_path, username="default_user") -> dict:
    posts = load_posts_from_csv(csv_path)
    if not posts:
        print("⚠️ No posts to analyze.")
        return {}

    vader_scores = {"neg": [], "neu": [], "pos": [], "compound": []}
    emotion_labels = {}

    for post in posts:
        # 1. VADER Sentiment Analysis
        vs = vader.polarity_scores(post)
        for k in vader_scores:
            vader_scores[k].append(vs[k])

        # 2. BERT Emotion Analysis
        try:
            emotion = emotion_classifier(post)[0][0]  # Get top emotion
            label = emotion["label"]
            score = emotion["score"]
            emotion_labels[label] = emotion_labels.get(label, []) + [score]
        except:
            continue

    # Average scores
    vader_avg = {k: sum(v) / len(v) for k, v in vader_scores.items()}
    emotion_avg = {k: sum(v) / len(v) for k, v in emotion_labels.items()}

    tone_profile = {
        "username": username,
        "vader": vader_avg,
        "emotion": emotion_avg,
        "total_posts": len(posts),
        "source_file": os.path.basename(csv_path)
    }

    # Save as JSON
    os.makedirs("tone_profiles", exist_ok=True)
    with open(f"tone_profiles/{username}_tone_profile.json", "w") as f:
        json.dump(tone_profile, f, indent=4)

    print(f"✅ Tone profile saved for {username}")
    return tone_profile

# Usage example:
# analyze_tone_from_csv("anoop_tweets.csv", username="anoop")
"""

# Save to file
script_path = "/mnt/data/tone_from_csv.py"
with open(script_path, "w") as f:
    f.write(unified_tone_model)

script_path  # Return path for user to download

