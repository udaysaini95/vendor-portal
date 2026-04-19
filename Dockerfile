# Build Stage for Frontend
FROM node:20-slim AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Production Stage
FROM python:3.11-slim
WORKDIR /app

# Install backend dependencies
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY backend/ ./backend

# Copy built frontend from stage 1
COPY --from=frontend-build /app/frontend/dist ./static

# Set environment variables
ENV PORT=8000
ENV ALLOWED_ORIGINS="*"

# Command to run the application
# We use uvicorn to serve the API
# In a real deployment, you might want to serve static files with Nginx or use FastAPI's StaticFiles
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
