"""Cloudinary upload service for detection frames."""

import os
import cloudinary.uploader

# Ensure cloudinary is configured on import
import app.config.cloudinary_config  # noqa: F401

# Validate credentials on import
_cloud_name = os.getenv("CLOUDINARY_CLOUD_NAME", "")
if not _cloud_name or _cloud_name == "your_cloud_name":
    print("⚠️  WARNING: Cloudinary credentials not configured! Update CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET in backend/.env")


def upload_frame(file_path: str, public_id: str) -> str | None:
    """
    Upload a frame image to Cloudinary and return its secure URL.

    Args:
        file_path: Local path to the image file.
        public_id: Unique identifier for the image in Cloudinary.

    Returns:
        The secure URL of the uploaded image, or None on failure.
    """
    try:
        print(f"[Cloudinary] Uploading {file_path} as {public_id}...")
        response = cloudinary.uploader.upload(
            file_path,
            public_id=public_id,
            folder="roadnet_frames",
            overwrite=True,
            resource_type="image",
        )
        url = response.get("secure_url")
        print(f"[Cloudinary] ✅ Upload success! URL: {url}")
        return url
    except Exception as e:
        print(f"[Cloudinary] ❌ Upload Error: {e}")
        return None

