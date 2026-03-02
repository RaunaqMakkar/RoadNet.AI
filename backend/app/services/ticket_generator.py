from datetime import datetime, timezone


def utc_timestamp_iso():
    return datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")


def create_ticket(issue, ticket_number):
    now_ts = utc_timestamp_iso()

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
        "location": {
            "latitude": None,
            "longitude": None,
            "road_name": "Unknown",
            "zone": "Ward 1",
        },
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
