# Quickstart Guide: Multi-User Todo Web Application

## Overview
This guide provides instructions for setting up and running the Multi-User Todo Web Application for development.

## Prerequisites
- Python 3.11+
- Node.js 18+ and npm
- uv package manager for Python
- PostgreSQL (or access to Neon Serverless PostgreSQL)

## Backend Setup

### 1. Navigate to the backend directory
```bash
cd backend
```

### 2. Create and activate a virtual environment using uv
```bash
uv venv
source .venv/Scripts/activate  # On Windows use: .venv\Scripts\activate
```

### 3. Install dependencies
```bash
uv pip install fastapi sqlmodel psycopg2-binary python-jose[cryptography] passlib[bcrypt] python-multipart
uv pip install "uvicorn[standard]" pytest httpx
```

### 4. Set up environment variables
Create a `.env` file in the backend directory:
```env
DATABASE_URL=postgresql+psycopg2://username:password@localhost:5432/todo_app
SECRET_KEY=your-super-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### 5. Run the application
```bash
uvicorn src.main:app --reload --port 8000
```

The backend API will be available at `http://localhost:8000`.

## Frontend Setup

### 1. Navigate to the frontend directory
```bash
cd frontend  # or create this directory if it doesn't exist
```

### 2. Initialize a new Next.js project (if not already done)
```bash
npx create-next-app@latest frontend --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
cd frontend
```

### 3. Install additional dependencies
```bash
npm install axios
```

### 4. Set up environment variables
Create a `.env.local` file in the frontend directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 5. Run the development server
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`.

## Database Setup

### 1. Using Neon Serverless PostgreSQL
1. Create an account at [Neon](https://neon.tech)
2. Create a new project
3. Copy the connection string and update your `.env` file

### 2. Running Migrations
```bash
# From the backend directory
python -m src.database.migrate
```

## Running Tests

### Backend Tests
```bash
# From the backend directory
pytest
```

### Frontend Tests
```bash
# From the frontend directory
npm run test
```

## API Documentation
Once the backend is running, API documentation is available at:
- `http://localhost:8000/docs` (Swagger UI)
- `http://localhost:8000/redoc` (ReDoc)

## Common Commands

### Backend
- `uvicorn src.main:app --reload` - Start development server
- `pytest` - Run tests
- `python -m src.database.migrate` - Run database migrations

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run test` - Run tests

## Troubleshooting

### Common Issues
1. **Database Connection**: Ensure your PostgreSQL server is running and credentials are correct
2. **Port Conflicts**: Make sure ports 8000 (backend) and 3000 (frontend) are available
3. **Dependency Issues**: Try clearing cache and reinstalling dependencies

### Environment Variables
Make sure all required environment variables are set in both backend `.env` and frontend `.env.local` files.