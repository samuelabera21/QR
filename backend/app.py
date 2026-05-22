import os
from typing import Any, Dict

from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv

from utils.cloudinary_config import configure_cloudinary
from utils.validation import validate_image_file

load_dotenv()
configure_cloudinary()

app = Flask(__name__)
app.config["MAX_CONTENT_LENGTH"] = int(os.getenv("MAX_CONTENT_LENGTH", str(10 * 1024 * 1024)))

# Keep local development simple: allow the frontend to call the API from any local port.
CORS(app)


def _error(message: str, status_code: int, **extra: Any):
    payload: Dict[str, Any] = {"error": message}
    payload.update(extra)
    return jsonify(payload), status_code


@app.get("/health")
def health():
    return jsonify({"status": "ok"})


@app.post("/upload")
def upload_image():
    if "image" not in request.files:
        return _error("No image file was provided.", 400)

    image_file = request.files["image"]

    validation_error = validate_image_file(image_file)
    if validation_error:
        return _error(validation_error, 400)

    try:
        import cloudinary.uploader

        upload_result = cloudinary.uploader.upload(
            image_file,
            folder=os.getenv("CLOUDINARY_FOLDER", "qr-image-sharing"),
            resource_type="image",
            use_filename=True,
            unique_filename=True,
            overwrite=False,
            secure=True,
        )

        secure_url = upload_result.get("secure_url")
        if not secure_url:
            return _error("Cloudinary did not return a secure URL.", 502)

        return jsonify({"imageUrl": secure_url})
    except Exception as exc:  # pragma: no cover - defensive API boundary
        app.logger.exception("Cloudinary upload failed")
        return _error("Image upload failed.", 500, details=str(exc))


if __name__ == "__main__":
    port = int(os.getenv("PORT", "5000"))
    debug = os.getenv("FLASK_DEBUG", "false").lower() == "true"
    app.run(host="0.0.0.0", port=port, debug=debug)
