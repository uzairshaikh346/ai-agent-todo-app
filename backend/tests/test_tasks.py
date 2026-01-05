import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, SQLModel, create_engine
from sqlmodel.pool import StaticPool
from ..main import app
from ..database.engine import get_session
from ..models.user import User
from ..models.task import Task
from uuid import uuid4

# Create a test database engine
@pytest.fixture(name="engine")
def engine_fixture():
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    SQLModel.metadata.create_all(engine)
    yield engine

@pytest.fixture(name="session")
def session_fixture(engine):
    with Session(engine) as session:
        yield session

@pytest.fixture(name="client")
def client_fixture(session):
    def get_session_override():
        return session

    app.dependency_overrides[get_session] = get_session_override
    client = TestClient(app)
    yield client
    app.dependency_overrides.clear()

def test_create_task(client: TestClient, session: Session):
    # First create a user
    user_response = client.post("/auth/signup", json={
        "email": "test@example.com",
        "password": "password123"
    })
    user_data = user_response.json()
    user_id = user_data["id"]
    
    # Then create a task for that user
    response = client.post(f"/api/{user_id}/tasks", json={
        "title": "Test Task",
        "description": "This is a test task"
    })
    data = response.json()
    
    assert response.status_code == 201
    assert data["title"] == "Test Task"
    assert data["description"] == "This is a test task"
    
    # Verify task was created in the database
    task = session.get(Task, data["id"])
    assert task is not None
    assert task.title == "Test Task"
    assert task.user_id == user_id