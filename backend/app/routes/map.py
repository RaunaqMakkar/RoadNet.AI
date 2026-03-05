from typing import Any, Dict, List, Optional

from fastapi import APIRouter, Query

from app.database.mongodb import db

router = APIRouter(prefix="/map", tags=["Map"])

_PROJECTION = {
    "_id": 0,
    "ticket_id": 1,
    "issue_id": 1,
    "type": 1,
    "priority": 1,
    "rps": 1,
    "rps_score": 1,
    "first_seen": 1,
    "last_seen": 1,
    "frames_detected": 1,
    "frame_number": 1,
    "video_timestamp_seconds": 1,
    "video_timestamp_formatted": 1,
    "max_area_pixels": 1,
    "avg_confidence": 1,
    "recommended_action": 1,
    "latitude": 1,
    "longitude": 1,
    "road_name": 1,
    "zone": 1,
    "status": 1,
    "assigned_department": 1,
    "assigned_to": 1,
    "created_at": 1,
    "updated_at": 1,
    "source": 1,
    "is_verified": 1,
}


def _build_query(
    priority: Optional[str],
    type: Optional[str],
    status: Optional[str],
    zone: Optional[str],
    assigned_department: Optional[str],
    is_verified: Optional[bool],
) -> Dict[str, Any]:
    query: Dict[str, Any] = {}

    if status is not None:
        query["status"] = status
    else:
        query["status"] = {"$ne": "Closed"}

    if priority is not None:
        query["priority"] = priority
    if type is not None:
        query["type"] = type
    if zone is not None:
        query["zone"] = zone
    if assigned_department is not None:
        query["assigned_department"] = assigned_department
    if is_verified is not None:
        query["is_verified"] = is_verified

    return query


def _ticket_to_feature(ticket: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    lat = ticket.get("latitude")
    lng = ticket.get("longitude")

    if lat is None or lng is None:
        return None

    try:
        lat = float(lat)
        lng = float(lng)
    except (TypeError, ValueError):
        return None

    properties = {k: v for k, v in ticket.items() if k not in ("latitude", "longitude")}

    return {
        "type": "Feature",
        "geometry": {
            "type": "Point",
            "coordinates": [lng, lat],
        },
        "properties": properties,
    }


@router.get("/geojson")
async def get_geojson(
    priority: Optional[str] = Query(None, description="Filter by priority"),
    type: Optional[str] = Query(None, description="Filter by issue type"),
    status: Optional[str] = Query(None, description="Filter by status (defaults to non-Closed)"),
    zone: Optional[str] = Query(None, description="Filter by zone"),
    assigned_department: Optional[str] = Query(None, description="Filter by assigned department"),
    is_verified: Optional[bool] = Query(None, description="Filter by verification status"),
) -> Dict[str, Any]:
    query = _build_query(priority, type, status, zone, assigned_department, is_verified)

    tickets: List[Dict[str, Any]] = await db.tickets.find(query, _PROJECTION).to_list(None)

    features = []
    for ticket in tickets:
        feature = _ticket_to_feature(ticket)
        if feature is not None:
            features.append(feature)

    return {
        "type": "FeatureCollection",
        "features": features,
    }


@router.get("/")
async def get_map_data(
    priority: Optional[str] = Query(None),
    type: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
) -> List[Dict[str, Any]]:
    query = _build_query(priority, type, status, None, None, None)

    tickets: List[Dict[str, Any]] = await db.tickets.find(
        query,
        {
            "_id": 0,
            "latitude": 1,
            "longitude": 1,
            "priority": 1,
            "type": 1,
            "rps_score": 1,
            "video_timestamp_seconds": 1,
        },
    ).to_list(None)

    return [
        {
            "lat": t["latitude"],
            "lng": t["longitude"],
            "priority": t.get("priority"),
            "type": t.get("type"),
            "rps": t.get("rps_score"),
            "video_time": t.get("video_timestamp_seconds"),
        }
        for t in tickets
        if "latitude" in t and "longitude" in t
    ]
