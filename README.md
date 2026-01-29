# AI-Powered Natural Language Chatbot for Todo Management

This project implements an AI-powered natural language chatbot for todo management that allows users to create, list, complete, and delete tasks using conversational AI.

## Architecture

- **Frontend**: Next.js 16+ with React
- **Backend**: FastAPI with SQLModel ORM
- **AI Layer**: OpenAI Agents SDK with MCP tools
- **Database**: Neon Serverless PostgreSQL
- **Authentication**: Better Auth (JWT)

## Features

- Natural language processing for todo management
- Persistent conversation history
- Multi-user isolation with row-level security
- MCP tools for task operations
- JWT-based authentication

## Setup

### Prerequisites

- Python 3.12+
- Node.js 18+
- uv package manager
- Neon PostgreSQL database
- Better Auth configured
- OpenAI API key

### Environment Configuration

```bash
# Copy the environment template
cp .env.example .env

# Update the following variables in .env:
DATABASE_URL="your_neon_postgres_url"
JWT_SECRET="your_jwt_secret"
OPENAI_API_KEY="your_openai_api_key"
```

### Backend Setup

```bash
# Install dependencies using uv
uv venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
uv pip install -r requirements.txt

# Run database migrations
alembic upgrade head

# Start the backend server
uv run python -m backend.src.main
```

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

## Usage

### Starting a Chat Session

1. Log in to the application (JWT token will be issued)
2. Navigate to the chat interface
3. Send a natural language message like "Add task to buy groceries"

### Supported Commands

- **Create tasks**: "Add task to buy groceries", "Create a reminder to call mom"
- **List tasks**: "Show my pending tasks", "What's on my list?"
- **Complete tasks**: "Mark task 3 as done", "Complete the shopping task"
- **Delete tasks**: "Delete task 2", "Remove the meeting reminder"
- **Update tasks**: "Change task 1 to 'Call dad tonight'"

### API Endpoints

- `POST /api/{user_id}/chat` - Main chat endpoint for natural language processing

## Key Components

- **Models**: Located in `backend/src/models/` (Task, Conversation, Message)
- **Services**: Located in `backend/src/services/` (TaskService, ConversationService, MessageService, ChatService, MCP Tools)
- **API Routes**: Defined in `backend/src/api/chat_endpoint.py`
- **Frontend**: Chat interface in `frontend/src/pages/chat.jsx`