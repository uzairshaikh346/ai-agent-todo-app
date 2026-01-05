from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session
from typing import List
from datetime import datetime
from ..database.engine import get_session
from ..models.task import Task, TaskCreate, TaskRead, TaskUpdate
from ..services.task_service import TaskService
from uuid import UUID
import uuid
from ..middleware.auth import validate_token

router = APIRouter()


def task_to_read(task: Task) -> TaskRead:
    """Convert Task to TaskRead with is_overdue calculated"""
    is_overdue = False
    if task.due_date and not task.completed:
        is_overdue = datetime.utcnow() > task.due_date

    return TaskRead(
        id=task.id,
        title=task.title,
        description=task.description,
        completed=task.completed,
        due_date=task.due_date,
        priority=task.priority,
        user_id=task.user_id,
        created_at=task.created_at,
        updated_at=task.updated_at,
        is_overdue=is_overdue
    )

@router.get("/tasks", response_model=List[TaskRead])
def get_tasks(user_id: str, current_user: dict = Depends(validate_token), session: Session = Depends(get_session)):
    """Get all tasks for a specific user"""
    if current_user["user_id"] != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access these tasks"
        )

    try:
        user_uuid = UUID(user_id)
        tasks = TaskService.get_tasks_by_user(session, user_uuid)
        return [task_to_read(task) for task in tasks]
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid user ID format"
        )


@router.post("/tasks", response_model=TaskRead, status_code=status.HTTP_201_CREATED)
def create_task(user_id: str, task_create: TaskCreate, current_user: dict = Depends(validate_token), session: Session = Depends(get_session)):
    """Create a new task for a user"""
    if current_user["user_id"] != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to create tasks for this user"
        )

    try:
        user_uuid = UUID(user_id)
        task = TaskService.create_task(session, user_uuid, task_create)
        return task_to_read(task)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid user ID format"
        )


@router.get("/tasks/{id}", response_model=TaskRead)
def get_task(user_id: str, id: int, current_user: dict = Depends(validate_token), session: Session = Depends(get_session)):
    """Get a specific task by ID for a user"""
    if current_user["user_id"] != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this task"
        )

    try:
        user_uuid = UUID(user_id)
        task = TaskService.get_task_by_id(session, id, user_uuid)
        if not task:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Task not found"
            )
        return task_to_read(task)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid user ID format"
        )


@router.put("/tasks/{id}", response_model=TaskRead)
def update_task(user_id: str, id: int, task_update: TaskUpdate, current_user: dict = Depends(validate_token), session: Session = Depends(get_session)):
    """Update a specific task for a user"""
    if current_user["user_id"] != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this task"
        )

    try:
        user_uuid = UUID(user_id)
        updated_task = TaskService.update_task(session, id, user_uuid, task_update)
        if not updated_task:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Task not found"
            )
        return task_to_read(updated_task)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid user ID format"
        )

@router.delete("/tasks/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(user_id: str, id: int, current_user: dict = Depends(validate_token), session: Session = Depends(get_session)):
    """Delete a specific task for a user"""
    # Verify that the user_id in the path matches the user from the token
    if current_user["user_id"] != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this task"
        )

    try:
        user_uuid = UUID(user_id)
        success = TaskService.delete_task(session, id, user_uuid)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Task not found"
            )
        return
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid user ID format"
        )

@router.patch("/tasks/{id}/complete", response_model=TaskRead)
def toggle_task_completion(user_id: str, id: int, current_user: dict = Depends(validate_token), session: Session = Depends(get_session)):
    """Toggle the completion status of a task"""
    if current_user["user_id"] != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this task"
        )

    try:
        user_uuid = UUID(user_id)
        task = TaskService.toggle_task_completion(session, id, user_uuid)
        if not task:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Task not found"
            )
        return task_to_read(task)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid user ID format"
        )