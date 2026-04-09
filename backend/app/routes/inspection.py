"""Inspection route – video upload, frame-level detection, ticket generation."""

import shutil
import logging
from pathlib import Path
from uuid import uuid4

from fastapi import APIRouter, File, HTTPException, UploadFile
from pydantic import BaseModel
from typing import List, Optional

from app.database.mongodb import tickets_collection
from app.services.ai_pipeline import run_inspection_pipeline
from app.services.rps_engine import classify_priority, PRIORITY_ACTIONS
from app.services.ticket_generator import create_ticket

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/inspection", tags=["Inspection"])

ALLOWED_EXTENSIONS = {".mp4", ".webm", ".avi", ".mov"}
UPLOAD_DIR = Path("temp_uploads")
UPLOAD_DIR.mkdir(exist_ok=True)


async def _get_next_ticket_number() -> int:
    """Get the next available ticket number by scanning all existing ticket_ids."""
    cursor = tickets_collection.find(
        {"ticket_id": {"$exists": True}},
        {"ticket_id": 1, "_id": 0}
    )
    all_tickets = await cursor.to_list(length=10000)

    max_num = 0
    for doc in all_tickets:
        tid = doc.get("ticket_id", "")
        if tid.startswith("TKT_"):
            try:
                num = int(tid.split("_")[1])
                if num > max_num:
                    max_num = num
            except (ValueError, IndexError):
                pass
    return max_num + 1


def _build_tickets_from_detections(detections: list, start_num: int) -> list:
    """Create ticket dicts from enriched detection results, including frame_id and image_url."""
    tickets = []
    for i, det in enumerate(detections):
        conf = det.get("confidence", 0)
        priority = classify_priority(conf * 100)
        rps = round(conf * 100, 2)

        issue_data = {
            "issue_id": det.get("frame_id", f"FRM_{i:04d}"),
            "type": det.get("issue_type", "unknown"),
            "priority": priority,
            "rps_score": rps,
            "first_seen": det.get("timestamp_seconds", 0),
            "last_seen": det.get("timestamp_seconds", 0),
            "frames_detected": 1,
            "max_area_pixels": 0,
            "avg_confidence": conf,
            "recommended_action": det.get("suggested_action")
                or PRIORITY_ACTIONS.get(priority, "Schedule inspection"),
            "frame_number": det.get("frame_number", 0),
            "frame_id": det.get("frame_id"),
            "image_url": det.get("image_url"),
        }

        ticket = create_ticket(issue_data, start_num + i)
        tickets.append(ticket)

    return tickets


@router.post("/upload")
async def upload_video(file: UploadFile = File(...)):
    """Upload a video, run YOLO inspection pipeline, auto-create tickets, return everything."""
    ext = Path(file.filename).suffix.lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type '{ext}'. Allowed: {', '.join(ALLOWED_EXTENSIONS)}",
        )

    unique_filename = f"{uuid4().hex}_{file.filename}"
    file_path = UPLOAD_DIR / unique_filename

    try:
        with file_path.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        result = run_inspection_pipeline(str(file_path))
        detections = result.get("detections", [])

        # Auto-create tickets from detections
        tickets_created = 0
        if detections:
            start_num = await _get_next_ticket_number()
            logger.info(f"Creating tickets starting from TKT_{start_num:03d} for {len(detections)} detections")
            tickets = _build_tickets_from_detections(detections, start_num)
            if tickets:
                try:
                    await tickets_collection.insert_many(tickets)
                    tickets_created = len(tickets)
                    logger.info(f"Successfully inserted {tickets_created} tickets into MongoDB")
                except Exception as db_err:
                    logger.error(f"MongoDB insert_many failed: {db_err}")
                    tickets_created = 0

        result["tickets_created"] = tickets_created
        return result

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if file_path.exists():
            file_path.unlink()


class DetectionItem(BaseModel):
    frame_id: str
    issue_type: str
    confidence: float
    severity: str
    timestamp: str
    timestamp_seconds: float
    bbox_xyxy: List[float] = []
    image_url: Optional[str] = None
    issue_title: Optional[str] = None
    suggested_action: Optional[str] = None


class GenerateTicketsRequest(BaseModel):
    detections: List[DetectionItem]


@router.post("/generate-tickets")
async def generate_tickets_endpoint(body: GenerateTicketsRequest):
    """Convert inspection detections into tickets and store in MongoDB (fallback/manual)."""
    if not body.detections:
        return {"message": "No detections to create tickets for", "tickets_created": 0}

    start_num = await _get_next_ticket_number()
    det_dicts = [d.model_dump() for d in body.detections]
    tickets = _build_tickets_from_detections(det_dicts, start_num)

    if tickets:
        await tickets_collection.insert_many(tickets)

    return {
        "message": f"Successfully created {len(tickets)} tickets",
        "tickets_created": len(tickets),
    }

