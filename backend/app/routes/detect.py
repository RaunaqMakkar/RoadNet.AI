import shutil
from pathlib import Path
from uuid import uuid4

from fastapi import APIRouter, File, HTTPException, UploadFile

from app.database.mongodb import tickets_collection
from app.services.ai_pipeline import run_full_pipeline

router = APIRouter(prefix="/detect", tags=["Detection"])

ALLOWED_EXTENSIONS = {".mp4", ".webm", ".avi", ".mov"}
UPLOAD_DIR = Path("temp_uploads")
UPLOAD_DIR.mkdir(exist_ok=True)


@router.post("/")
async def detect(file: UploadFile = File(...)):
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

        tickets = run_full_pipeline(str(file_path))

        if not tickets:
            return {
                "message": "No issues detected",
                "tickets_created": 0,
            }

        await tickets_collection.insert_many(tickets)

        return {
            "message": "Detection completed successfully",
            "tickets_created": len(tickets),
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if file_path.exists():
            file_path.unlink()
