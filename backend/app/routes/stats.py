from typing import Dict, Any, List

from fastapi import APIRouter

from app.database.mongodb import tickets_collection

router = APIRouter(prefix="/stats", tags=["Stats"])


async def _group_by(field: str) -> Dict[str, int]:
    pipeline: List[Dict[str, Any]] = [
        {"$group": {"_id": f"${field}", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
    ]
    return {
        doc["_id"]: doc["count"]
        async for doc in tickets_collection.aggregate(pipeline)
        if doc["_id"] is not None
    }


@router.get("/")
async def get_stats() -> Dict[str, Any]:
    total = await tickets_collection.count_documents({})

    score_pipeline: List[Dict[str, Any]] = [
        {
            "$group": {
                "_id": None,
                "avg_rps_score": {"$avg": "$rps_score"},
                "max_rps_score": {"$max": "$rps_score"},
            }
        }
    ]
    score_result = await tickets_collection.aggregate(score_pipeline).to_list(length=1)

    if score_result:
        avg_rps = score_result[0].get("avg_rps_score", 0)
        max_rps = score_result[0].get("max_rps_score", 0)
    else:
        avg_rps = 0
        max_rps = 0

    priority_breakdown = await _group_by("priority")
    type_breakdown = await _group_by("type")
    status_breakdown = await _group_by("status")

    return {
        "total_tickets": total,
        "avg_rps_score": round(avg_rps, 2) if avg_rps else 0,
        "max_rps_score": round(max_rps, 2) if max_rps else 0,
        "breakdown_by_priority": priority_breakdown,
        "breakdown_by_type": type_breakdown,
        "breakdown_by_status": status_breakdown,
    }
