"""Third Eye backend API application entrypoint."""

from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import detect, tickets, stats, map, inspection

# Initialize Cloudinary configuration on startup (also loads .env)
import app.config.cloudinary_config  # noqa: F401

app = FastAPI(title="Third Eye API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(detect.router)
app.include_router(tickets.router)
app.include_router(stats.router)
app.include_router(map.router)
app.include_router(inspection.router)


@app.get("/")
async def root():
    return {"message": "Third Eye Backend Running"}

