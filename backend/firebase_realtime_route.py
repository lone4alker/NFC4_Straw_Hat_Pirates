# firebase_realtime_routes.py

import requests
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow frontend requests (you can restrict origins later)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Your Realtime Database URL
FIREBASE_DB_URL = "https://vedant-d772a-default-rtdb.firebaseio.com"

@app.get("/account/{email}")
async def get_account_by_email(email: str):
    try:
        # Fetch all users from Realtime DB
        response = requests.get(f"{FIREBASE_DB_URL}/users.json")

        if response.status_code != 200:
            raise HTTPException(status_code=500, detail="Failed to fetch users")

        users_data = response.json()

        # Check if email matches
        for uid, user in users_data.items():
            if user.get("email") == email:
                return user

        raise HTTPException(status_code=404, detail="404: Account data not found")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
