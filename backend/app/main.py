"""Third Eye backend API application entrypoint."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import detect, tickets, stats, map

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


@app.get("/")
async def root():
    return {"message": "Third Eye Backend Running"}
