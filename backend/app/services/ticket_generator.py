import random
import time
from datetime import datetime

BASE_LAT = 28.6139
BASE_LNG = 77.2090

def generate_random_location():
    return (
        BASE_LAT + random.uniform(-0.05, 0.05),
        BASE_LNG + random.uniform(-0.05, 0.05),
    )


def create_ticket(issue, ticket_number):
    now_ts = datetime.utcnow()
    lat, lng = generate_random_location()
    lat = round(lat, 6)
    lng = round(lng, 6)
    rps_value = issue.get("rps_score", issue.get("rps", 0.0))
    video_timestamp = float(issue.get("video_timestamp", issue.get("first_seen", 0.0)) or 0.0)
    frame_number = int(issue.get("frame_number", 0) or 0)

    return {
        "ticket_id": f"TKT_{ticket_number:03d}",
        "issue_id": issue.get("issue_id"),
        "type": issue.get("type"),
        "priority": issue.get("priority"),
        "rps": rps_value,
        "rps_score": rps_value,
        "first_seen": issue.get("first_seen"),
        "last_seen": issue.get("last_seen"),
        "frames_detected": issue.get("frames_detected"),
        "frame_number": frame_number,
        "video_timestamp_seconds": round(video_timestamp, 3),
        "video_timestamp_formatted": time.strftime("%H:%M:%S", time.gmtime(video_timestamp)),
        "max_area_pixels": issue.get("max_area_pixels"),
        "avg_confidence": issue.get("avg_confidence"),
        "recommended_action": issue.get("recommended_action"),
        "latitude": lat,
        "longitude": lng,
        "road_name": "Unknown",
        "zone": "Ward 1",
        "status": "Open",
        "assigned_department": "Public Works Department",
        "assigned_to": None,
        "created_at": now_ts,
        "updated_at": now_ts,
        "source": "AI_CAMERA",
        "is_verified": False,
    }


def generate_tickets(issues):
    tickets = []
    for idx, issue in enumerate(issues, start=1):
        tickets.append(create_ticket(issue, idx))
    return tickets
