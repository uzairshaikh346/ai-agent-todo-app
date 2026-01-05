from sqlmodel import Session, select
from typing import Optional
from ..models.task import Task, TaskCreate, TaskUpdate
from ..models.user import User
from uuid import UUID

class TaskService:
    @staticmethod
    def create_task(session: Session, user_id: UUID, task_create: TaskCreate) -> Task:
        """Create a new task for a user"""
        db_task = Task(**task_create.dict(), user_id=user_id)
        session.add(db_task)
        session.commit()
        session.refresh(db_task)
        return db_task

    @staticmethod
    def get_tasks_by_user(session: Session, user_id: UUID) -> list[Task]:
        """Get all tasks for a specific user"""
        statement = select(Task).where(Task.user_id == user_id)
        tasks = session.exec(statement).all()
        return tasks

    @staticmethod
    def get_task_by_id(session: Session, task_id: int, user_id: UUID) -> Optional[Task]:
        """Get a specific task by ID for a user"""
        statement = select(Task).where(Task.id == task_id, Task.user_id == user_id)
        task = session.exec(statement).first()
        return task

    @staticmethod
    def update_task(session: Session, task_id: int, user_id: UUID, task_update: TaskUpdate) -> Optional[Task]:
        """Update a specific task for a user"""
        db_task = TaskService.get_task_by_id(session, task_id, user_id)
        if not db_task:
            return None

        # Update only the fields that are provided
        update_data = task_update.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_task, field, value)

        session.add(db_task)
        session.commit()
        session.refresh(db_task)
        return db_task

    @staticmethod
    def delete_task(session: Session, task_id: int, user_id: UUID) -> bool:
        """Delete a specific task for a user"""
        db_task = TaskService.get_task_by_id(session, task_id, user_id)
        if not db_task:
            return False

        session.delete(db_task)
        session.commit()
        return True

    @staticmethod
    def toggle_task_completion(session: Session, task_id: int, user_id: UUID) -> Optional[Task]:
        """Toggle the completion status of a task"""
        db_task = TaskService.get_task_by_id(session, task_id, user_id)
        if not db_task:
            return None

        db_task.completed = not db_task.completed
        session.add(db_task)
        session.commit()
        session.refresh(db_task)
        return db_task