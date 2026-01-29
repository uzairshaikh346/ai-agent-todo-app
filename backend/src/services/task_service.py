"""
Task service for the AI-Powered Natural Language Chatbot for Todo Management.
Handles all business logic and database operations related to tasks.
"""
from typing import List, Optional
from sqlmodel import Session, select
from ..models.task import Task, TaskCreate, TaskUpdate
from ..utils.logging import get_logger
import structlog

logger = get_logger(__name__)

class TaskService:
    """
    Service class for handling task operations.
    """

    def create_task(self, db_session: Session, user_id: str, task_create: TaskCreate) -> Task:
        """
        Create a new task for a user.

        Args:
            db_session: Database session
            user_id: ID of the user creating the task
            task_create: Task creation data

        Returns:
            Created Task object
        """
        logger.info("Creating task", user_id=user_id, title=task_create.title)

        # Validate input
        if not task_create.title.strip():
            raise ValueError("Task title cannot be empty")

        # Create task object
        task = Task(
            title=task_create.title,
            description=task_create.description,
            completed=task_create.completed,
            user_id=user_id
        )

        # Add to database
        db_session.add(task)
        db_session.commit()
        db_session.refresh(task)

        logger.info("Task created successfully", task_id=task.id, user_id=user_id)
        return task

    def get_task_by_id_and_user(self, db_session: Session, task_id: int, user_id: str) -> Optional[Task]:
        """
        Get a specific task by its ID and user ID.

        Args:
            db_session: Database session
            task_id: ID of the task
            user_id: ID of the user

        Returns:
            Task object if found and belongs to user, None otherwise
        """
        logger.info("Fetching task by ID and user", task_id=task_id, user_id=user_id)

        statement = select(Task).where(Task.id == task_id).where(Task.user_id == user_id)
        task = db_session.exec(statement).first()

        if task:
            logger.info("Task found", task_id=task.id, user_id=user_id)
        else:
            logger.info("Task not found or doesn't belong to user", task_id=task_id, user_id=user_id)

        return task

    def get_tasks_by_user_id(self, db_session: Session, user_id: str, completed: Optional[bool] = None) -> List[Task]:
        """
        Get all tasks for a user, optionally filtered by completion status.

        Args:
            db_session: Database session
            user_id: ID of the user
            completed: Filter by completion status (None for all, True for completed, False for pending)

        Returns:
            List of Task objects
        """
        logger.info("Fetching tasks by user", user_id=user_id, completed_filter=completed)

        statement = select(Task).where(Task.user_id == user_id)

        if completed is not None:
            statement = statement.where(Task.completed == completed)

        tasks = db_session.exec(statement).all()

        logger.info("Tasks fetched successfully", user_id=user_id, task_count=len(tasks))
        return tasks

    def update_task(self, db_session: Session, task_id: int, user_id: str, task_update: TaskUpdate) -> Task:
        """
        Update a task for a user.

        Args:
            db_session: Database session
            task_id: ID of the task to update
            user_id: ID of the user
            task_update: Task update data

        Returns:
            Updated Task object
        """
        logger.info("Updating task", task_id=task_id, user_id=user_id)

        # Get the task
        statement = select(Task).where(Task.id == task_id).where(Task.user_id == user_id)
        task = db_session.exec(statement).first()

        if not task:
            raise ValueError(f"Task {task_id} not found or doesn't belong to user {user_id}")

        # Update the task with provided values
        update_data = task_update.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(task, field, value)

        # Update timestamp
        from datetime import datetime
        task.updated_at = datetime.utcnow()

        # Commit changes
        db_session.add(task)
        db_session.commit()
        db_session.refresh(task)

        logger.info("Task updated successfully", task_id=task.id, user_id=user_id)
        return task

    def delete_task(self, db_session: Session, task_id: int, user_id: str) -> bool:
        """
        Delete a task for a user.

        Args:
            db_session: Database session
            task_id: ID of the task to delete
            user_id: ID of the user

        Returns:
            True if deletion was successful, False otherwise
        """
        logger.info("Deleting task", task_id=task_id, user_id=user_id)

        # Get the task
        statement = select(Task).where(Task.id == task_id).where(Task.user_id == user_id)
        task = db_session.exec(statement).first()

        if not task:
            logger.warning("Attempted to delete non-existent task", task_id=task_id, user_id=user_id)
            return False

        # Delete the task
        db_session.delete(task)
        db_session.commit()

        logger.info("Task deleted successfully", task_id=task_id, user_id=user_id)
        return True