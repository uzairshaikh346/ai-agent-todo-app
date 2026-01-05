import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, SQLModel, create_engine
from sqlmodel.pool import StaticPool
from ..main import app
from ..database.engine import get_session
from ..models.user import User

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

def test_create_user(client: TestClient, session: Session):
    response = client.post("/auth/signup", json={
        "email": "test@example.com",
        "password": "password123"
    })
    data = response.json()
    
    assert response.status_code == 201
    assert data["email"] == "test@example.com"
    
    # Verify user was created in the database
    user = session.get(User, data["id"])
    assert user is not None
    assert user.email == "test@example.com"