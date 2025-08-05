from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests

app = FastAPI()

# Allow CORS for local development (adjust as needed)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Input data model
class Prompt(BaseModel):
    sentence: str

# Route to process sentence and get response from Ollama
@app.post("/generate")
def generate_response(prompt: Prompt):
    ollama_url = "http://localhost:11434/api/generate"  # Default Ollama endpoint
    data = {
        "model": "llama3.2",  # Replace with your model name (e.g., 'llama3', 'mistral', etc.)
        "prompt": prompt.sentence,
        "stream": False     # Set to False to receive full response at once
    }

    try:
        response = requests.post(ollama_url, json=data)
        response.raise_for_status()
        result = response.json()
        return {"response": result.get("response", "")}
    except Exception as e:
        return {"error": str(e)}
