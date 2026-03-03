from fastapi import APIRouter

from app.database.mongodb import tickets_collection

router = APIRouter(prefix="/map-data", tags=["Map"])


@router.get("")
async def get_map_data():
    tickets = await tickets_collection.find(
        {"status": {"$ne": "Closed"}},
        {
            "_id": 0,
            "latitude": 1,
            "longitude": 1,
            "priority": 1,
            "type": 1,
            "rps": 1,
            "rps_score": 1,
            "video_timestamp_seconds": 1,
        },
    ).to_list(length=None)

    return [
        {
            "lat": ticket["latitude"],
            "lng": ticket["longitude"],
            "priority": ticket.get("priority"),
            "type": ticket.get("type"),
            "rps": ticket.get("rps", ticket.get("rps_score")),
            "video_time": ticket.get("video_timestamp_seconds"),
        }
        for ticket in tickets
        if "latitude" in ticket and "longitude" in ticket
    ]
