import asyncio
from pathlib import Path
import shutil
from uuid import uuid4

from fastapi import APIRouter, File, HTTPException, UploadFile

from app.database.mongodb import tickets_collection
from app.services.ai_pipeline import run_full_pipeline

router = APIRouter(prefix="/detect", tags=["Detection"])

UPLOAD_DIR = Path("temp_uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

ALLOWED_EXTENSIONS = {".mp4", ".webm", ".avi", ".mov"}


def _save_uploaded_file(file: UploadFile, destination: Path) -> None:
    with destination.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)


@router.post("/")
async def detect(file: UploadFile = File(...)):
    original_name = file.filename or ""
    extension = Path(original_name).suffix.lower()

    if extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail="Unsupported file type. Allowed: .mp4, .webm, .avi, .mov",
        )

    unique_filename = f"{uuid4().hex}_{Path(original_name).name}"
    video_path = UPLOAD_DIR / unique_filename

    try:
        await asyncio.to_thread(_save_uploaded_file, file, video_path)

        tickets = await asyncio.to_thread(run_full_pipeline, str(video_path))

        if not tickets:
            return {
                "message": "No issues detected",
                "tickets_created": 0,
            }

        insert_result = await tickets_collection.insert_many(tickets)

        return {
            "message": "Detection completed successfully",
            "tickets_created": len(insert_result.inserted_ids),
        }
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Detection failed: {exc}") from exc
    finally:
        if video_path.exists():
            video_path.unlink()
        await file.close()
