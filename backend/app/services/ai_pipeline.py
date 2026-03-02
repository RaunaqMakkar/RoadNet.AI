import os
from pathlib import Path

from dotenv import load_dotenv

from app.services.aggregate_detections import aggregate_detections
from app.services.rps_engine import compute_rps
from app.services.ticket_generator import generate_tickets
from app.services.video_processor import process_video_in_memory

BASE_DIR = Path(__file__).resolve().parents[2]
load_dotenv(BASE_DIR / ".env")

DEFAULT_MODEL_PATH = os.getenv("MODEL_PATH", "weights/best.pt")


def run_full_pipeline(video_path: str) -> list:
    model_path = Path(DEFAULT_MODEL_PATH)
    if not model_path.is_absolute():
        model_path = (BASE_DIR / model_path).resolve()

    if not model_path.exists():
        raise FileNotFoundError(
            f"Model weights not found at: {model_path}. "
            "Set MODEL_PATH in backend/.env to an absolute path."
        )

    payload = process_video_in_memory(
        model_path=str(model_path),
        video_path=video_path,
        conf=0.45,
        device="cpu",
        sample_every=1.0,
    )

    detections = payload["detections"]

    issues = aggregate_detections(detections)

    scored = compute_rps(issues)

    tickets = generate_tickets(scored)

    return tickets
