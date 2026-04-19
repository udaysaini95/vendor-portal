# Vendor Onboarding Portal

A premium, full-stack application for managing vendor onboarding.

## Features
- **Premium UI**: Dark mode with glassmorphism and smooth animations.
- **FastAPI Backend**: Robust API with in-memory storage.
- **Vite + React**: Fast and modern frontend.
- **Deployable**: Dockerized for easy deployment.

## Local Development

### Prerequisites
- Python 3.8+
- Node.js 18+

### 1. Backend Setup
```bash
cd backend
pip install -r requirements.txt
python main.py
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## Deployment

### Using Docker
The project includes a `Dockerfile` that builds the frontend and serves it via the FastAPI backend.

```bash
docker build -t vendor-portal .
docker run -p 8000:8000 vendor-portal
```

### Environment Variables
- `PORT`: Port to run the server on (default: 8000).
- `ALLOWED_ORIGINS`: Comma-separated list of allowed CORS origins.
- `VITE_API_URL`: (Frontend build-time) URL of the API.
