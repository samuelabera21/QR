# QR Image Sharing

A production-style full stack QR image sharing app.

## What it does

1. Upload an image from the Next.js frontend.
2. The Flask backend validates the file and uploads it to Cloudinary.
3. The backend returns the Cloudinary `secure_url`.
4. The frontend automatically renders a QR code for that URL.
5. Scanning the QR opens the uploaded image directly.

## Tech Stack

- Frontend: Next.js 15, TypeScript, Tailwind CSS, Axios, Framer Motion, lucide-react, qrcode
- Backend: Flask, Flask-CORS, Cloudinary Python SDK, Pillow, qrcode, python-dotenv

## Project Structure

```text
project/
├── frontend/
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── public/
│   ├── .env.local
│   └── package.json
├── backend/
│   ├── app.py
│   ├── .env
│   ├── requirements.txt
│   └── utils/
└── README.md
```

## Setup

### Backend

1. Open a terminal in `backend/`.
2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Run the Flask API:

```bash
python app.py
```

The backend runs on `http://localhost:5000` by default.

### Frontend

1. Open a separate terminal in `frontend/`.
2. Install dependencies:

```bash
npm install
```

3. Start the Next.js app:

```bash
npm run dev
```

The frontend runs on `http://localhost:3000` by default.

## Environment Variables

### Backend: `backend/.env`

Use Cloudinary credentials only here.

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_FOLDER=qr-image-sharing
PORT=5000
FLASK_DEBUG=false
FRONTEND_ORIGINS=http://localhost:3000
MAX_CONTENT_LENGTH=10485760
```

### Frontend: `frontend/.env.local`

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
```

## API

### `POST /upload`

Accepts `multipart/form-data` with an `image` field and returns:

```json
{
  "imageUrl": "https://..."
}
```

## Deployment Guide

### Backend deployment

- Deploy the Flask app to a Python host such as Render, Railway, Fly.io, or a VPS.
- Set the Cloudinary environment variables in the backend environment.
- Ensure the frontend origin is allowed through `FRONTEND_ORIGINS`.
- Bind the app to the platform-provided port via the `PORT` variable.

### Frontend deployment

- Deploy the Next.js app to Vercel, Netlify, or a Node host.
- Set `NEXT_PUBLIC_API_BASE_URL` to the deployed backend URL.
- Rebuild after changing environment variables.

## Notes

- No local uploads folder is used.
- The backend uploads directly to Cloudinary and returns the secure public URL.
- The QR appears automatically after upload; there is no generate button.
