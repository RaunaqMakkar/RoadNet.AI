from typing import Optional, List, Dict, Any

from fastapi import APIRouter, Query

from app.database.mongodb import tickets_collection

router = APIRouter(prefix="/tickets", tags=["Tickets"])


@router.get("/", response_model=List[Dict[str, Any]])
async def get_tickets(
    priority: Optional[str] = Query(None, description="Filter by priority (e.g. Critical, High, Low)"),
    type: Optional[str] = Query(None, description="Filter by ticket type (e.g. pothole, crack)"),
    status: Optional[str] = Query(None, description="Filter by status (e.g. Open, Closed)"),
    sort_by_rps: bool = Query(False, description="Sort descending by rps_score"),
) -> List[Dict[str, Any]]:
    query: Dict[str, Any] = {}

    if priority is not None:
        query["priority"] = priority
    if type is not None:
        query["type"] = type
    if status is not None:
        query["status"] = status

    cursor = tickets_collection.find(query)

    if sort_by_rps:
        cursor = cursor.sort("rps_score", -1)

    tickets: List[Dict[str, Any]] = []
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        tickets.append(doc)

    return tickets
