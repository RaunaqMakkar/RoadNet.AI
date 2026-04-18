import os
import cv2
import requests
from ultralytics import YOLO

MODEL_PATH = "weights/best.pt"
MODEL_URL = os.getenv("MODEL_URL")
VIDEO_PATH = "manhole_video.webm"      # input road video
OUTPUT_PATH = "output_manhole_video.mp4"

CONFIDENCE = 0.40                   # optimal from F1 curve
DEVICE = "cpu"                     # "cuda" or "cpu"


def download_model():
    """Download model weights if not already present."""
    if os.path.exists(MODEL_PATH):
        print(f"✅ Model already exists at: {MODEL_PATH}")
        return

    if not MODEL_URL:
        raise ValueError(
            "MODEL_URL not set in environment variables and "
            f"model not found at {MODEL_PATH}"
        )

    print(f"⬇ Downloading model from: {MODEL_URL}")
    os.makedirs("weights", exist_ok=True)

    if "drive.google.com" in MODEL_URL:
        import gdown
        gdown.download(MODEL_URL, MODEL_PATH, quiet=False, fuzzy=True)
    else:
        response = requests.get(MODEL_URL, stream=True, timeout=300)
        response.raise_for_status()
        with open(MODEL_PATH, "wb") as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)

    print("✅ Model downloaded successfully")


# Download once, then load
download_model()
model = YOLO(MODEL_PATH)

cap = cv2.VideoCapture(VIDEO_PATH)

if not cap.isOpened():
    raise IOError("❌ Error opening video file")

width  = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
fps    = cap.get(cv2.CAP_PROP_FPS)

fourcc = cv2.VideoWriter_fourcc(*"mp4v")
out = cv2.VideoWriter(OUTPUT_PATH, fourcc, fps, (width, height))

while True:
    ret, frame = cap.read()
    if not ret:
        break

    results = model(
        frame,
        conf=CONFIDENCE,
        device=DEVICE,
        verbose=False
    )

    # YOLO built-in visualization (masks + boxes + labels)
    annotated_frame = results[0].plot()

    out.write(annotated_frame)

cap.release()
out.release()

print("✅ Video inference completed successfully")
print(f"📁 Output saved as: {OUTPUT_PATH}")
