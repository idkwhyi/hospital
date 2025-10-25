import os
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY", "fallback_secret")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))

# Midtrans Configuration
MIDTRANS_SERVER_KEY = os.getenv("MIDTRANS_SERVER_KEY")
MIDTRANS_CLIENT_KEY = os.getenv("MIDTRANS_CLIENT_KEY")
MIDTRANS_MERCHANT_ID = os.getenv("MIDTRANS_MERCHANT_ID")

# Frontend URL for payment callbacks
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")

# Validate Midtrans configuration
if not MIDTRANS_SERVER_KEY or not MIDTRANS_CLIENT_KEY:
    raise ValueError("MIDTRANS_SERVER_KEY and MIDTRANS_CLIENT_KEY must be set in environment variables")