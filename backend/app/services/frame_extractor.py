"""
Frame Extractor Service
-----------------------
Extracts specific frames from a video, draws color-coded bounding boxes
for each detection, uploads annotated frames to Cloudinary, and returns
enriched detection dicts with cloud image URLs.
"""

import os
import cv2
import numpy as np
from pathlib import Path

from app.services.cloudinary_service import upload_frame

# Bounding box colours per class  (BGR for OpenCV)
CLASS_COLORS = {
    "pothole":      (0, 0, 255),      # Red
    "road_crack":   (0, 140, 255),    # Orange
    "manhole":      (0, 220, 255),    # Yellow
    "open_manhole": (0, 200, 0),      # Green
}
DEFAULT_COLOR = (200, 200, 200)

# Temporary directory for frames before Cloudinary upload
TEMP_FRAMES_DIR = Path(__file__).resolve().parents[2] / "temp_frames"
TEMP_FRAMES_DIR.mkdir(exist_ok=True)


def _severity_from_confidence(conf: float) -> str:
    if conf >= 0.9:
        return "Critical"
    if conf >= 0.7:
        return "High"
    if conf >= 0.5:
        return "Moderate"
    return "Low"


def _issue_title(class_name: str) -> str:
    titles = {
        "pothole": "Deep Asphalt Pothole",
        "road_crack": "Longitudinal Cracking",
        "manhole": "Standard Manhole",
        "open_manhole": "Missing Cover",
    }
    return titles.get(class_name, class_name.replace("_", " ").title())


def _draw_detection(frame, bbox, class_name, confidence):
    """Draw a bounding box with label on the frame."""
    color = CLASS_COLORS.get(class_name, DEFAULT_COLOR)
    x1, y1, x2, y2 = [int(v) for v in bbox]

    # Draw rectangle
    cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)

    # Label text
    label = f"{class_name.upper().replace('_', ' ')} {confidence * 100:.0f}%"
    font = cv2.FONT_HERSHEY_SIMPLEX
    font_scale = 0.5
    thickness = 1
    (tw, th), _ = cv2.getTextSize(label, font, font_scale, thickness)

    # Label background
    cv2.rectangle(frame, (x1, y1 - th - 8), (x1 + tw + 6, y1), color, -1)
    cv2.putText(frame, label, (x1 + 3, y1 - 4), font, font_scale, (255, 255, 255), thickness)


def extract_and_annotate_frames(video_path: str, raw_detections: list) -> list:
    """
    Given a video path and the list of raw detections (from video_processor),
    re-open the video, seek to each unique detected frame, draw all bounding
    boxes on that frame, upload the annotated image to Cloudinary, and clean up.

    Returns a list of enriched detection dicts with Cloudinary image URLs.
    """
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        return []

    fps = cap.get(cv2.CAP_PROP_FPS)
    if fps <= 0:
        fps = 30.0

    # Group detections by frame_number
    frames_dict = {}
    for det in raw_detections:
        fn = det.get("frame_number", 0)
        frames_dict.setdefault(fn, []).append(det)

    extracted = []
    frame_counter = 0

    for frame_number in sorted(frames_dict.keys()):
        cap.set(cv2.CAP_PROP_POS_FRAMES, frame_number)
        ret, frame = cap.read()
        if not ret:
            continue

        dets_for_frame = frames_dict[frame_number]

        # Draw all detections on this frame
        for det in dets_for_frame:
            _draw_detection(
                frame,
                det.get("bbox_xyxy", [0, 0, 0, 0]),
                det.get("class", "unknown"),
                det.get("confidence", 0),
            )

        # Save annotated frame temporarily
        frame_counter += 1
        frame_id = f"FRM_{frame_counter:04d}"
        filename = f"{frame_id}.jpg"
        temp_filepath = TEMP_FRAMES_DIR / filename
        cv2.imwrite(str(temp_filepath), frame)

        # Upload to Cloudinary
        cloudinary_url = upload_frame(str(temp_filepath), frame_id)

        # Delete local temp file after upload
        if temp_filepath.exists():
            temp_filepath.unlink()

        # Use Cloudinary URL if upload succeeded, otherwise fall back to None
        image_url = cloudinary_url if cloudinary_url else None

        # Build enriched detection entries for each detection on this frame
        for det in dets_for_frame:
            conf = det.get("confidence", 0)
            class_name = det.get("class", "unknown")
            ts_seconds = det.get("timestamp_seconds", 0)

            hours = int(ts_seconds // 3600)
            minutes = int((ts_seconds % 3600) // 60)
            seconds = int(ts_seconds % 60)
            ms = int((ts_seconds % 1) * 100)

            extracted.append({
                "frame_id": frame_id,
                "frame_number": frame_number,
                "image_url": image_url,
                "issue_type": class_name,
                "issue_title": _issue_title(class_name),
                "confidence": round(conf, 4),
                "severity": _severity_from_confidence(conf),
                "timestamp": f"{hours:02d}:{minutes:02d}:{seconds:02d}.{ms:02d}",
                "timestamp_seconds": round(ts_seconds, 3),
                "bbox_xyxy": det.get("bbox_xyxy", [0, 0, 0, 0]),
                "suggested_action": _suggested_action(class_name, conf),
            })

    cap.release()
    return extracted


def _suggested_action(class_name: str, conf: float) -> str:
    if conf >= 0.9:
        actions = {
            "pothole": "Immediate repair required",
            "road_crack": "Schedule crack sealing",
            "manhole": "Logged to asset registry",
            "open_manhole": "Emergency cover replacement",
        }
    elif conf >= 0.7:
        actions = {
            "pothole": "Schedule pothole filling",
            "road_crack": "Schedule crack sealing",
            "manhole": "Logged to asset registry",
            "open_manhole": "Priority cover replacement",
        }
    else:
        actions = {
            "pothole": "Monitor and re-inspect",
            "road_crack": "Monitor condition",
            "manhole": "Logged to asset registry",
            "open_manhole": "Inspect and verify",
        }
    return actions.get(class_name, "Schedule inspection")
