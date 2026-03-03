import math
from typing import Any, Dict, Literal, Optional

from fastapi import APIRouter, Query

from app.database.mongodb import tickets_collection

router = APIRouter(prefix="/tickets", tags=["Tickets"])

ALLOWED_SORT_FIELDS = {
    "created_at",
    "updated_at",
    "rps",
    "rps_score",
    "priority",
    "type",
    "status",
    "video_timestamp_seconds",
    "frame_number",
}


@router.get("/")
async def get_tickets(
    page: int = Query(1, ge=1, description="Page number (starts at 1)"),
    limit: int = Query(20, ge=1, le=100, description="Items per page (max 100)"),
    priority: Optional[str] = Query(None, description="Filter by priority"),
    type: Optional[str] = Query(None, description="Filter by issue type"),
    status: Optional[str] = Query(None, description="Filter by status"),
    sort_by: str = Query("created_at", description="Sort field"),
    order: Literal["asc", "desc"] = Query("desc", description="Sort order"),
) -> Dict[str, Any]:
    filters: Dict[str, Any] = {}

    if priority is not None:
        filters["priority"] = priority
    if type is not None:
        filters["type"] = type
    if status is not None:
        filters["status"] = status

    safe_sort_by = sort_by if sort_by in ALLOWED_SORT_FIELDS else "created_at"
    sort_order = 1 if order == "asc" else -1

    total = await tickets_collection.count_documents(filters)
    total_pages = math.ceil(total / limit) if total > 0 else 0

    if total_pages > 0 and page > total_pages:
        return {
            "total": total,
            "page": page,
            "limit": limit,
            "total_pages": total_pages,
            "data": [],
        }

    skip = (page - 1) * limit

    cursor = (
        tickets_collection.find(filters, {"_id": 0})
        .sort(safe_sort_by, sort_order)
        .skip(skip)
        .limit(limit)
    )

    data = await cursor.to_list(length=limit)

    return {
        "total": total,
        "page": page,
        "limit": limit,
        "total_pages": total_pages,
        "data": data,
    }
