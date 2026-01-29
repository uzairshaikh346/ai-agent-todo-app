"""
Main FastAPI application for the AI-Powered Natural Language Chatbot for Todo Management.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import structlog
from src.database import init_db
from src.api.chat_endpoint import router as chat_router
from src.api.tasks_simple import router as tasks_router

# Configure structlog
structlog.configure(
    processors=[
        structlog.stdlib.filter_by_level,
        structlog.stdlib.add_logger_name,
        structlog.stdlib.add_log_level,
        structlog.stdlib.PositionalArgumentsFormatter(),
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.StackInfoRenderer(),
        structlog.processors.format_exc_info,
        structlog.processors.UnicodeDecoder(),
        structlog.processors.JSONRenderer()
    ],
    context_class=dict,
    logger_factory=structlog.stdlib.LoggerFactory(),
    wrapper_class=structlog.stdlib.BoundLogger,
    cache_logger_on_first_use=True,
)

logger = structlog.get_logger()

app = FastAPI(
    title="AI-Powered Todo Chatbot API",
    description="API for managing todos through natural language chat interface",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    """Initialize the database when the application starts."""
    logger.info("Starting up application")
    init_db()
    logger.info("Database initialized")

@app.get("/")
async def root():
    """Root endpoint for health check."""
    return {"message": "AI-Powered Todo Chatbot API is running"}

# Include API routers
app.include_router(chat_router, prefix="/api/{user_id}", tags=["chat"])
app.include_router(tasks_router, prefix="/api/{user_id}", tags=["tasks"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)