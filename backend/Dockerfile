# Use Python 3.11 slim image
FROM python:3.11-slim

# Env vars
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Workdir
WORKDIR /app

# System deps
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install deps
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

# Copy app
COPY . .

# HF uses dynamic PORT
EXPOSE 8000

# IMPORTANT: use $PORT
CMD ["sh", "-c", "uvicorn src.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
