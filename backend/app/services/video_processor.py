from pathlib import Path

import cv2
from ultralytics import YOLO


def mask_area_from_result(masks_data, index):
    # Convert mask tensor to numpy (if needed) and count foreground pixels.
    if masks_data is None:
        return None

    if hasattr(masks_data, "cpu"):
        masks_data = masks_data.cpu()
    if hasattr(masks_data, "numpy"):
        masks_data = masks_data.numpy()

    if index >= len(masks_data):
        return None

    return int((masks_data[index] > 0.5).sum())


def detection_to_dict(result, index, timestamp_seconds, frame_number):
    # Extract one detection into a JSON-serializable structure.
    box = result.boxes[index]

    class_id = int(box.cls.item())
    class_name = result.names.get(class_id, str(class_id))
    confidence = float(box.conf.item())
    bbox_xyxy = [float(v) for v in box.xyxy[0].tolist()]

    masks_data = result.masks.data if result.masks is not None else None
    mask_area_pixels = mask_area_from_result(masks_data, index)

    return {
        "class": class_name,
        "class_id": class_id,
        "confidence": confidence,
        "bbox_xyxy": bbox_xyxy,
        "mask_area_pixels": mask_area_pixels,
        "timestamp_seconds": round(float(timestamp_seconds), 3),
        "frame_number": int(frame_number),
    }


def build_payload(model_path, video_path, fps, frame_count, sample_every, conf, device, detections):
    return {
        "video": str(Path(video_path)),
        "model": str(Path(model_path)),
        "fps": float(fps),
        "frame_count": int(frame_count),
        "sample_every_seconds": float(sample_every),
        "confidence_threshold": float(conf),
        "device": device,
        "total_detections": len(detections),
        "detections": detections,
    }


def process_video_in_memory(
    model_path: str,
    video_path: str,
    conf: float = 0.40,
    device: str = "cpu",
    sample_every: float = 1.0,
) -> dict:
    if sample_every <= 0:
        raise ValueError("--sample-every must be greater than 0")

    model = YOLO(model_path)
    cap = cv2.VideoCapture(video_path)

    if not cap.isOpened():
        raise IOError(f"Error opening video file: {video_path}")

    try:
        fps = cap.get(cv2.CAP_PROP_FPS)
        if fps <= 0:
            raise ValueError("Unable to determine FPS from input video")

        frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        sample_stride = max(1, int(round(sample_every * fps)))

        detections = []
        frame_number = 0

        while True:
            ret, frame = cap.read()
            if not ret:
                break

            if frame_number % sample_stride == 0:
                timestamp_seconds = frame_number / fps
                results = model(frame, conf=conf, device=device, verbose=False)
                result = results[0]

                if result.boxes is not None and len(result.boxes) > 0:
                    for det_idx in range(len(result.boxes)):
                        detections.append(
                            detection_to_dict(
                                result=result,
                                index=det_idx,
                                timestamp_seconds=timestamp_seconds,
                                frame_number=frame_number,
                            )
                        )

            frame_number += 1
    finally:
        cap.release()

    return build_payload(
        model_path=model_path,
        video_path=video_path,
        fps=fps,
        frame_count=frame_count,
        sample_every=sample_every,
        conf=conf,
        device=device,
        detections=detections,
    )
