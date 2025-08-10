from fastapi import FastAPI, HTTPException, UploadFile, File,  Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, FileResponse
from Scrapers import scrape_reddit_user_to_df
from Scrapers.YoutubeScraper import scrape_youtube_channel, save_to_csv
from pydantic import BaseModel
import ollama
import asyncio
import requests
from PIL import Image
import io
import os
import re
import pytesseract
import pandas as pd # Import pandas for the new logic


from fetch_realtime import get_user_from_realtime_db

app = FastAPI()

# Enable CORS - This is already correctly configured
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic model for the Ollama request body
class OllamaRequest(BaseModel):
    prompt: str
    model: str = "llama3"

### --- NEW CODE START --- ###
# Pydantic model for the new /process-url endpoint request body.
# This ensures the data sent from React is valid.
class ProcessUrlRequest(BaseModel):
    userId: str
    platform: str
    url: str
### --- NEW CODE END --- ###


@app.get("/account/{email}")
async def get_user(email: str):
    try:
        user_data = get_user_from_realtime_db(email)
        return user_data
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

### --- NEW CODE START --- ###
# This is the new endpoint that your React "Fetch Details" button calls.
@app.post("/process-url")
async def process_url(request: ProcessUrlRequest):
    """
    Receives a platform and URL, triggers the appropriate scraper,
    saves the data on the server, and returns a confirmation.
    """
    platform = request.platform.lower()
    url = request.url
    user_id = request.userId

    # Define a directory to save the scraped data
    output_dir = "scraped_data"
    os.makedirs(output_dir, exist_ok=True)
    
    try:
        if platform == "youtube":
            videos = scrape_youtube_channel(url)
            if not videos:
                raise HTTPException(status_code=404, detail="No YouTube videos found or channel is invalid.")
            
            # save_to_csv from your scraper already handles saving the file
            file_path = save_to_csv(videos, output_dir)
            message = f"Successfully scraped {len(videos)} videos from YouTube."
            return {"status": "success", "message": message, "file_path": file_path}

        elif platform == "reddit":
            df = scrape_reddit_user_to_df(url)
            if df.empty:
                raise HTTPException(status_code=404, detail="No Reddit posts found or user is invalid.")
            
            file_name = f"reddit_{user_id}.csv"
            file_path = os.path.join(output_dir, file_name)
            df.to_csv(file_path, index=False)
            message = f"Successfully scraped {len(df)} posts from Reddit."
            return {"status": "success", "message": message, "file_path": file_path}
            
        elif platform == "x":
            # You can add your Twitter/X scraper logic here in the future
            raise HTTPException(status_code=501, detail="Scraping for X (Twitter) is not yet implemented.")

        else:
            raise HTTPException(status_code=400, detail=f"Unsupported platform: {platform}")

    except HTTPException as e:
        # Re-raise HTTPExceptions to send proper client errors
        raise e
    except Exception as e:
        # Catch any other unexpected errors from the scrapers
        raise HTTPException(status_code=500, detail=f"An error occurred while scraping: {str(e)}")
### --- NEW CODE END --- ###

@app.post("/generate_text")
async def generate_text_with_ollama(request: OllamaRequest):
    try:
        client = ollama.AsyncClient()
        response = await client.chat(
            model=request.model,
            messages=[{'role': 'user', 'content': request.prompt}],
        )
        return {"generated_text": response['message']['content']}
    except ollama.ResponseError as e:
        raise HTTPException(status_code=e.status_code, detail=f"Ollama Error: {e.error}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")

@app.post("/ocr-query")
async def ocr_and_ask(file: UploadFile = File(...), query: str = ""):
    try:
        # Load image
        image_bytes = await file.read()
        image = Image.open(io.BytesIO(image_bytes))

        # OCR with Tesseract
        extracted_text = pytesseract.image_to_string(image)

        # Ask LLaMA a question about the extracted data (if any query is provided)
        if query:
            prompt = f"This is the text extracted from the image:\n\n{extracted_text}\n\nNow answer this question: {query}"
            client = ollama.AsyncClient()
            response = await client.chat(
                model="llama3",
                messages=[{'role': 'user', 'content': prompt}]
            )
            answer = response['message']['content']
        else:
            answer = "No query provided."

        return {
            "extracted_text": extracted_text,
            "answer": answer
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process image: {str(e)}")


@app.get("/scrape/reddit/")
async def scrape_reddit_user(user_url: str = Query(..., description="Full Reddit user URL")):
    try:
        df = scrape_reddit_user_to_df(user_url)

        if df.empty:
            raise HTTPException(status_code=404, detail="No posts found")

        stream = io.StringIO()
        df.to_csv(stream, index=False)
        stream.seek(0)

        return StreamingResponse(
            stream,
            media_type="text/csv",
            headers={"Content-Disposition": "attachment; filename=reddit_posts.csv"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/scrape/youtube")
async def get_youtube_data(channel_url: str = Query(..., description="YouTube channel URL")):
    videos = scrape_youtube_channel(channel_url)
    if not videos:
        raise HTTPException(status_code=404, detail="No videos found or failed to scrape")

    file_path = save_to_csv(videos)
    if file_path:
        return FileResponse(path=file_path, filename=os.path.basename(file_path), media_type='text/csv')
    else:
        raise HTTPException(status_code=500, detail="Failed to save CSV")