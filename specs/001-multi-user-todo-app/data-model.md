# Data Model: Multi-User Todo Web Application

## Overview
This document defines the data models for the Multi-User Todo Web Application based on the feature specification.

## Entity: User

### Fields
- **id** (String/UUID): Unique identifier for the user (Primary Key)
- **email** (String): User's email address, used for authentication (Required, Unique)
- **password_hash** (String): Hashed password for authentication (Required)
- **created_at** (DateTime): Timestamp when the user account was created
- **updated_at** (DateTime): Timestamp when the user account was last updated

### Relationships
- One-to-Many: A user can have many tasks

### Validation Rules
- Email must be in valid email format (user@domain.com)
- Email must be unique across all users
- Password must be securely hashed before storage
- Email and password are required for registration

### State Transitions
- Account created: When user registers successfully
- Account updated: When user updates their information
- Account deleted: When user account is removed

## Entity: Task

### Fields
- **id** (Integer): Unique identifier for the task (Primary Key, Auto-increment)
- **title** (String): Title of the task (Required)
- **description** (String): Optional detailed description of the task
- **completed** (Boolean): Status indicating if the task is completed (Default: false)
- **user_id** (String/UUID): Foreign key linking to the user who owns this task (Required)
- **created_at** (DateTime): Timestamp when the task was created
- **updated_at** (DateTime): Timestamp when the task was last updated

### Relationships
- Many-to-One: A task belongs to one user (user_id foreign key)

### Validation Rules
- Title is required and must not be empty
- User_id is required and must reference an existing user
- Completed status defaults to false when creating a new task
- A task can only be modified by its owner

### State Transitions
- Task created: When a new task is added by a user
- Task updated: When task details (title, description, completion status) are modified
- Task completed: When the completion status is changed to true
- Task uncompleted: When the completion status is changed to false
- Task deleted: When the task is removed by the user

## Entity: Authentication Token (JWT)

### Fields
- **token** (String): The JWT token string (Not stored in database, passed in requests)
- **user_id** (String/UUID): The user ID associated with this token
- **expires_at** (DateTime): Expiration time of the token
- **type** (String): Type of token (e.g., "Bearer")

### Relationships
- Many-to-One: Multiple tokens can be associated with one user (during concurrent sessions)

### Validation Rules
- Token must be properly formatted JWT
- Token must not be expired
- Token must be signed with the correct secret
- Token user_id must match an existing user

### State Transitions
- Token issued: When user successfully authenticates
- Token validated: When token is verified for protected endpoints
- Token expired: When token reaches its expiration time
- Token revoked: When token is invalidated (not implemented in initial version)

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### Tasks Table
```sql
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for efficient querying of tasks by user
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
```

## API Data Contracts

### User Registration Request
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

### User Registration Response
```json
{
  "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
  "email": "user@example.com",
  "created_at": "2025-01-01T10:00:00Z"
}
```

### Task Creation Request
```json
{
  "title": "Complete project",
  "description": "Finish the todo application project",
  "completed": false
}
```

### Task Creation Response
```json
{
  "id": 123,
  "title": "Complete project",
  "description": "Finish the todo application project",
  "completed": false,
  "user_id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
  "created_at": "2025-01-01T10:00:00Z",
  "updated_at": "2025-01-01T10:00:00Z"
}
```

### Task List Response
```json
[
  {
    "id": 123,
    "title": "Complete project",
    "description": "Finish the todo application project",
    "completed": false,
    "user_id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
    "created_at": "2025-01-01T10:00:00Z",
    "updated_at": "2025-01-01T10:00:00Z"
  },
  {
    "id": 124,
    "title": "Write documentation",
    "description": "Create user guides and API documentation",
    "completed": true,
    "user_id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
    "created_at": "2025-01-01T09:30:00Z",
    "updated_at": "2025-01-01T11:15:00Z"
  }
]
```