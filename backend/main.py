from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import ollama # Import the ollama library
import asyncio # Import asyncio for asynchronous operations

from fetch_realtime import get_user_from_realtime_db

app = FastAPI()

# Enable CORS (optional if frontend)
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
    model: str = "llama3.2" 

@app.get("/account/{email}")
async def get_user(email: str):
    """
    Fetches user data from a realtime database based on the provided email.
    """
    try:
        user_data = get_user_from_realtime_db(email)
        return user_data
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@app.post("/generate_text")
async def generate_text_with_ollama(request: OllamaRequest):
    """
    Generates text using a locally running Ollama model.

    Args:
        request (OllamaRequest): Contains the prompt and the model name.

    Returns:
        dict: A dictionary containing the generated text.

    Raises:
        HTTPException: If there's an error connecting to Ollama or generating text.
    """
    try:
        client = ollama.AsyncClient()

        response = await client.chat(
            model=request.model,
            messages=[{'role': 'user', 'content': request.prompt}],
        )

        generated_content = response['message']['content']
        return {"generated_text": generated_content}

    except ollama.ResponseError as e:
        # Handle specific Ollama API errors (e.g., model not found, server down)
        raise HTTPException(status_code=e.status_code, detail=f"Ollama Error: {e.error}")
    except Exception as e:
        # Catch any other unexpected errors
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {str(e)}")
