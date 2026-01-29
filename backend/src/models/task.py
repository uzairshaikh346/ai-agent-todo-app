"""
Task model for the AI-Powered Natural Language Chatbot for Todo Management.
"""
from sqlmodel import SQLModel, Field
from typing import Optional
import datetime

class TaskBase(SQLModel):
    title: str
    description: Optional[str] = None
    completed: bool = False

class Task(TaskBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(index=True)  # FK to user, indexed for performance
    created_at: datetime.datetime = Field(default_factory=datetime.datetime.utcnow)
    updated_at: datetime.datetime = Field(default_factory=datetime.datetime.utcnow)

class TaskCreate(TaskBase):
    pass

class TaskRead(TaskBase):
    id: int
    user_id: str
    created_at: datetime.datetime
    updated_at: datetime.datetime

class TaskUpdate(SQLModel):
    title: Optional[str] = None
    description: Optional[str] = None
    completed: Optional[bool] = None