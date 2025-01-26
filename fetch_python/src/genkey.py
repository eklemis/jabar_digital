import jwt
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv

# Load your secret key from .env or set it here
load_dotenv()

ACCESS_TOKEN_KEY = os.getenv("ACCESS_TOKEN_KEY")
print(ACCESS_TOKEN_KEY)

# Define the payload with a new expiration time (1 hour from now)
payload = {
    "sub": "user123",
    "exp": datetime.utcnow() + timedelta(hours=1),  # Token expires in 1 hour
    "iat": datetime.utcnow(),  # Issued at current time
    "role": "admin"
}

# Generate a new token
new_token = jwt.encode(payload, ACCESS_TOKEN_KEY, algorithm="HS256")

print("New JWT Token:", new_token)
