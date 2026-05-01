"""Cloudinary upload service for detection frames."""

import os
import logging
import cloudinary.uploader

# Ensure cloudinary is configured on import
import app.config.cloudinary_config  # noqa: F401

logger = logging.getLogger(__name__)


def upload_frame(file_path: str, public_id: str) -> str | None:
    """
    Upload a frame image to Cloudinary and return its secure URL.

    Args:
        file_path: Local path to the image file.
        public_id: Unique identifier for the image in Cloudinary.

    Returns:
        The secure URL of the uploaded image, or None on failure.
    """
    if not os.path.exists(file_path):
        logger.error("File does not exist: %s", file_path)
        return None

    file_size = os.path.getsize(file_path)
    if file_size == 0:
        logger.error("File is empty (0 bytes): %s", file_path)
        return None

    try:
        response = cloudinary.uploader.upload(
            file_path,
            public_id=public_id,
            folder="roadnet_frames",
            overwrite=True,
            resource_type="image",
        )
        url = response.get("secure_url")
        return url
    except Exception as e:
        logger.error("Upload failed for %s: %s", public_id, e)
        return None
