import os
from pathlib import Path

from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient

BASE_DIR = Path(__file__).resolve().parents[2]
load_dotenv(BASE_DIR / ".env")

MONGO_URL = os.getenv("MONGO_URL")
if not MONGO_URL:
    raise RuntimeError("MONGO_URL is not configured in backend/.env")

client = AsyncIOMotorClient(MONGO_URL)

db = client["third_eye"]

tickets_collection = db["tickets"]
videos_collection = db["processed_videos"]
analytics_collection = db["analytics"]

print(MONGO_URL)
