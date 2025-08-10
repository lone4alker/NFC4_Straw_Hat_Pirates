import os
import io
import pandas as pd
import google.generativeai as genai
from fastapi import FastAPI, HTTPException, UploadFile, File, Query, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, FileResponse

from pydantic import BaseModel
from PIL import Image
from dotenv import load_dotenv

from Scrapers import scrape_reddit_user_to_df
from Scrapers.YoutubeScraper import scrape_youtube_channel, save_to_csv

# --- 1. Configuration ---
load_dotenv() 

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
else:
    print("WARNING: The 'GEMINI_API_KEY' environment variable is not set. AI features will not work.")

# --- 2. FastAPI App Initialization ---
app = FastAPI()

# Allow all origins for development (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 3. Pydantic Models (Data Schemas) ---
class ProcessUrlRequest(BaseModel):
    """Schema for the scraping request from the frontend."""
    userId: str
    platform: str
    url: str

class GenerateRequest(BaseModel):
    """Schema for the main content generation request."""
    prompt: str
    filePath: str | None = None


# --- 4. API Endpoints ---

#Scrapping Endpoints
@app.post("/process-url", tags=["Scraping"])
async def process_url(request: ProcessUrlRequest):
    """
    Receives a platform and URL, triggers the appropriate scraper,
    saves the data to a user-specific CSV file, and returns a confirmation.
    """
    platform = request.platform.lower()
    user_id = request.userId
    output_dir = "scraped_data"
    os.makedirs(output_dir, exist_ok=True)
    
    try:
        if platform == "youtube":
            videos = scrape_youtube_channel(request.url)
            if not videos:
                raise HTTPException(status_code=404, detail="No YouTube videos found or channel is invalid.")
            file_path = save_to_csv(videos, output_dir, f"youtube_{user_id}.csv")
            message = f"Successfully scraped {len(videos)} videos from YouTube."
        
        elif platform == "reddit":
            df = scrape_reddit_user_to_df(request.url)
            if df.empty:
                raise HTTPException(status_code=404, detail="No Reddit posts found or user is invalid.")
            file_path = os.path.join(output_dir, f"reddit_{user_id}.csv")
            df.to_csv(file_path, index=False)
            message = f"Successfully scraped {len(df)} posts from Reddit."
            
        elif platform == "x":
            raise HTTPException(status_code=501, detail="Scraping for X (Twitter) is not yet implemented.")
        else:
            raise HTTPException(status_code=400, detail=f"Unsupported platform: {platform}")

        return {"status": "success", "message": message, "file_path": file_path}

    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred while scraping: {e}")

#Generation Endpoints
@app.post("/generate-content", tags=["AI Generation"])
async def generate_content(request: GenerateRequest):
    """
    Generates text content using Gemini, with optional tone analysis from user's past posts.
    """
    if not GEMINI_API_KEY:
        raise HTTPException(status_code=503, detail="AI service is unavailable: API key not configured on server.")

    try:
        system_prompt = "You are an expert social media strategist and copywriter. Your task is to create engaging, platform-specific content for brands and influencers. IMPORTANT: Your response must ONLY be the generated post content itself, with no extra commentary, introductions, or sign-offs."
        
        model = genai.GenerativeModel(
            model_name='gemini-2.0-flash', 
            system_instruction=system_prompt
        )
        
        user_style_context = ""
        if request.filePath and os.path.exists(request.filePath):
            try:
                df = pd.read_csv(request.filePath)
                content_column = next((col for col in ['text', 'title', 'content', 'comment'] if col in df.columns), None)
                if content_column:
                    samples = df[content_column].dropna().head(5).tolist()
                    if samples:
                        user_style_context = "To match the user's unique style, here are examples of their past posts:\n\n" + "\n".join(f'- "{s}"' for s in samples)
            except Exception as e:
                print(f"Info: Could not read or process file {request.filePath}. Proceeding without style context. Error: {e}")

        final_prompt = f"{user_style_context}\n\nBased on the user's style (if provided), fulfill this request: {request.prompt}"
        response = await model.generate_content_async(final_prompt)
        
        return {"generated_text": response.text}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred with the AI service: {e}")


@app.post("/analyze-image", tags=["AI Generation"])
async def analyze_image(
    query: str = Form(...), 
    file: UploadFile = File(...)
):
    """
    Analyzes an uploaded image using Gemini's multimodal capabilities and answers a question about it.
    """
    if not GEMINI_API_KEY:
        raise HTTPException(status_code=503, detail="AI service is unavailable: API key not configured on server.")
    
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload an image.")

    try:
        model = genai.GenerativeModel('gemini-1.5-pro-latest')
        image_bytes = await file.read()
        image = Image.open(io.BytesIO(image_bytes))
        response = await model.generate_content_async([query, image])
        
        return {"answer": response.text}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process image with AI: {e}")

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