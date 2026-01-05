from sqlmodel import create_engine, Session
from sqlalchemy import text
from sqlalchemy.pool import QueuePool
from ..models.user import User
from ..models.task import Task
from ..models.password_reset import PasswordResetToken
import os
from dotenv import load_dotenv

load_dotenv()

# Get database URL from environment
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./todo_app.db")

# If the URL starts with 'postgresql://' but doesn't include the driver, add psycopg2
if DATABASE_URL.startswith("postgresql://") and "+psycopg2" not in DATABASE_URL:
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+psycopg2://")

# Check if using PostgreSQL for pool settings
is_postgres = DATABASE_URL.startswith("postgresql")

# Create engine with connection pool settings for PostgreSQL
if is_postgres:
    engine = create_engine(
        DATABASE_URL,
        echo=True,
        pool_pre_ping=True,  # Check connection health before using
        pool_recycle=300,    # Recycle connections after 5 minutes
        pool_size=5,         # Number of connections to keep
        max_overflow=10,     # Additional connections allowed
        pool_timeout=30,     # Timeout waiting for connection
        connect_args={
            "sslmode": "require",  # Require SSL for PostgreSQL
            "connect_timeout": 10,
            "keepalives": 1,
            "keepalives_idle": 30,
            "keepalives_interval": 10,
            "keepalives_count": 5,
        }
    )
else:
    engine = create_engine(DATABASE_URL, echo=True)

def create_db_and_tables():
    """Create database tables"""
    from sqlmodel import SQLModel
    SQLModel.metadata.create_all(engine)


async def create_db_and_tables_async():
    """Async version of create_db_and_tables"""
    from sqlmodel import SQLModel
    SQLModel.metadata.create_all(engine)

def get_session():
    """Get database session"""
    with Session(engine) as session:
        yield session