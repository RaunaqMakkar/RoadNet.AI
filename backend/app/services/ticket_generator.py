import random
import time
from datetime import datetime, timezone


BASE_LAT = 28.6139
BASE_LNG = 77.2090


def generate_random_location():
    return (
        round(BASE_LAT + random.uniform(-0.05, 0.05), 6),
        round(BASE_LNG + random.uniform(-0.05, 0.05), 6),
    )


def format_video_time(seconds):
    return time.strftime("%H:%M:%S", time.gmtime(seconds))


def utc_timestamp_iso():
    return datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")


def create_ticket(issue, ticket_number):
    now_ts = utc_timestamp_iso()
    lat, lng = generate_random_location()

    video_ts = issue.get("first_seen", 0.0)

    return {
        "ticket_id": f"TKT_{ticket_number:03d}",
        "issue_id": issue.get("issue_id"),
        "type": issue.get("type"),
        "priority": issue.get("priority"),
        "rps_score": issue.get("rps_score"),
        "first_seen": issue.get("first_seen"),
        "last_seen": issue.get("last_seen"),
        "frames_detected": issue.get("frames_detected"),
        "max_area_pixels": issue.get("max_area_pixels"),
        "avg_confidence": issue.get("avg_confidence"),
        "recommended_action": issue.get("recommended_action"),
        "latitude": lat,
        "longitude": lng,
        "zone": "Ward 1",
        "location": {
            "latitude": lat,
            "longitude": lng,
            "road_name": "Unknown",
            "zone": "Ward 1",
        },
        "video_timestamp_seconds": round(video_ts, 3),
        "video_timestamp_formatted": format_video_time(video_ts),
        "frame_number": issue.get("frame_number"),
        "frame_id": issue.get("frame_id"),
        "image_url": issue.get("image_url"),
        "status": "Open",
        "assigned_department": "Public Works Department",
        "assigned_to": None,
        "created_at": now_ts,
        "updated_at": now_ts,
        "source": "AI_CAMERA",
        "is_verified": False,
    }


def generate_tickets(issues: list) -> list:
    tickets = []
    for idx, issue in enumerate(issues, start=1):
        tickets.append(create_ticket(issue, idx))
    return tickets