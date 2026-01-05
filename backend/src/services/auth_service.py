from sqlmodel import Session, select
from typing import Optional
from ..models.user import User, UserCreate
from ..utils.security import verify_password, get_password_hash
from datetime import timedelta
from jose import jwt, JWTError
import os
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY", "your-default-secret-key-change-in-production")
ALGORITHM = os.getenv("ALGORITHM", "HS256")

class AuthService:
    @staticmethod
    def authenticate_user(session: Session, email: str, password: str) -> Optional[User]:
        """Authenticate a user by email and password"""
        statement = select(User).where(User.email == email)
        user = session.exec(statement).first()
        
        if not user or not verify_password(password, user.password_hash):
            return None
        return user

    @staticmethod
    def create_user(session: Session, user_create: UserCreate) -> User:
        """Create a new user with hashed password"""
        # Check if user already exists
        existing_user = session.exec(select(User).where(User.email == user_create.email)).first()
        if existing_user:
            raise ValueError("Email already registered")
        
        # Create new user with hashed password
        hashed_password = get_password_hash(user_create.password)
        db_user = User(email=user_create.email, password_hash=hashed_password)
        session.add(db_user)
        session.commit()
        session.refresh(db_user)
        return db_user

    @staticmethod
    def get_user_by_email(session: Session, email: str) -> Optional[User]:
        """Get a user by email"""
        statement = select(User).where(User.email == email)
        user = session.exec(statement).first()
        return user

    @staticmethod
    def get_user_by_id(session: Session, user_id: str) -> Optional[User]:
        """Get a user by ID"""
        statement = select(User).where(User.id == user_id)
        user = session.exec(statement).first()
        return user