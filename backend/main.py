from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
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

@app.get("/account/{email}")
async def get_user(email: str):
    try:
        user_data = get_user_from_realtime_db(email)
        return user_data
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
