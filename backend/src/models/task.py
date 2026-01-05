from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, Literal
from datetime import datetime
import uuid

# Forward reference for User model
from .user import User

# Priority as Literal type for validation
PriorityType = Literal["low", "medium", "high"]


class TaskBase(SQLModel):
    title: str
    description: Optional[str] = None
    completed: bool = Field(default=False)
    due_date: Optional[datetime] = Field(default=None)
    priority: str = Field(default="medium")


class Task(TaskBase, table=True):
    id: int = Field(default=None, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="user.id", nullable=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationship to user
    user: Optional["User"] = Relationship(back_populates="tasks")

    @property
    def is_overdue(self) -> bool:
        """Check if task is overdue"""
        if self.due_date and not self.completed:
            return datetime.utcnow() > self.due_date
        return False


class TaskCreate(SQLModel):
    title: str
    description: Optional[str] = None
    completed: bool = False
    due_date: Optional[datetime] = None
    priority: str = "medium"


class TaskRead(SQLModel):
    id: int
    title: str
    description: Optional[str] = None
    completed: bool
    due_date: Optional[datetime] = None
    priority: str
    user_id: uuid.UUID
    created_at: datetime
    updated_at: datetime
    is_overdue: bool = False


class TaskUpdate(SQLModel):
    title: Optional[str] = None
    description: Optional[str] = None
    completed: Optional[bool] = None
    due_date: Optional[datetime] = None
    priority: Optional[str] = None