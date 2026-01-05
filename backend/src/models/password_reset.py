from sqlmodel import SQLModel, Field
from datetime import datetime, timedelta
import uuid
import secrets


class PasswordResetToken(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="user.id", nullable=False)
    token: str = Field(unique=True, nullable=False, index=True)
    expires_at: datetime = Field(nullable=False)
    used: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    @staticmethod
    def generate_token() -> str:
        """Generate a secure random token"""
        return secrets.token_urlsafe(32)

    @staticmethod
    def get_expiry(hours: int = 1) -> datetime:
        """Get expiry time (default 1 hour from now)"""
        return datetime.utcnow() + timedelta(hours=hours)

    def is_valid(self) -> bool:
        """Check if token is valid (not expired and not used)"""
        return not self.used and datetime.utcnow() < self.expires_at
