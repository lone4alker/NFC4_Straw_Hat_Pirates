import requests

def get_user_from_realtime_db(email: str):
    base_url = "https://vedant-d772a-default-rtdb.firebaseio.com/users.json"
    
    response = requests.get(base_url)
    
    if response.status_code != 200:
        raise ValueError("Failed to fetch data from Firebase")

    users_data = response.json()

    for uid, user in users_data.items():
        if user.get("email") == email:
            return user
    
    raise ValueError("404: Account data not found")
