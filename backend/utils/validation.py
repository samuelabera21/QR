from typing import Optional

from werkzeug.datastructures import FileStorage

ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif", "webp", "bmp", "tiff"}
ALLOWED_MIME_PREFIX = "image/"


def validate_image_file(file_storage: FileStorage) -> Optional[str]:
    if not file_storage or not file_storage.filename:
        return "Please select an image file."

    filename = file_storage.filename.lower()
    extension = filename.rsplit(".", 1)[-1] if "." in filename else ""
    if extension not in ALLOWED_EXTENSIONS:
        return "Only image files are allowed."

    content_type = (file_storage.content_type or "").lower()
    if content_type and not content_type.startswith(ALLOWED_MIME_PREFIX):
        return "The uploaded file must be an image."

    return None
