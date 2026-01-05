# API Contract: Multi-User Todo Web Application

## Overview
This document defines the API contracts for the Multi-User Todo Web Application based on the feature specification.

## Authentication Endpoints

### POST /auth/signup
Register a new user

#### Request
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

#### Response (201 Created)
```json
{
  "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
  "email": "user@example.com",
  "created_at": "2025-01-01T10:00:00Z"
}
```

#### Error Responses
- 400: Invalid email format or missing required fields
- 409: Email already exists

---

### POST /auth/signin
Authenticate an existing user

#### Request
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

#### Response (200 OK)
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

#### Error Responses
- 400: Missing email or password
- 401: Invalid credentials

---

## Task Management Endpoints

All task management endpoints require a valid JWT in the Authorization header:
`Authorization: Bearer <token>`

### GET /api/{user_id}/tasks
Retrieve all tasks for a specific user

#### Path Parameters
- `user_id` (string): The ID of the user whose tasks to retrieve

#### Headers
- `Authorization: Bearer <token>`

#### Response (200 OK)
```json
[
  {
    "id": 1,
    "title": "Sample task",
    "description": "A sample task description",
    "completed": false,
    "user_id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
    "created_at": "2025-01-01T10:00:00Z",
    "updated_at": "2025-01-01T10:00:00Z"
  }
]
```

#### Error Responses
- 401: Invalid or missing token
- 403: User is not authorized to access these tasks

---

### POST /api/{user_id}/tasks
Create a new task for a user

#### Path Parameters
- `user_id` (string): The ID of the user creating the task

#### Headers
- `Authorization: Bearer <token>`

#### Request Body
```json
{
  "title": "New task",
  "description": "A description of the new task",
  "completed": false
}
```

#### Response (201 Created)
```json
{
  "id": 2,
  "title": "New task",
  "description": "A description of the new task",
  "completed": false,
  "user_id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
  "created_at": "2025-01-01T10:00:00Z",
  "updated_at": "2025-01-01T10:00:00Z"
}
```

#### Error Responses
- 400: Missing required fields
- 401: Invalid or missing token
- 403: User is not authorized to create tasks for this user_id

---

### GET /api/{user_id}/tasks/{id}
Retrieve a specific task

#### Path Parameters
- `user_id` (string): The ID of the user
- `id` (integer): The ID of the task to retrieve

#### Headers
- `Authorization: Bearer <token>`

#### Response (200 OK)
```json
{
  "id": 1,
  "title": "Sample task",
  "description": "A sample task description",
  "completed": false,
  "user_id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
  "created_at": "2025-01-01T10:00:00Z",
  "updated_at": "2025-01-01T10:00:00Z"
}
```

#### Error Responses
- 401: Invalid or missing token
- 403: User is not authorized to access this task
- 404: Task not found

---

### PUT /api/{user_id}/tasks/{id}
Update a specific task

#### Path Parameters
- `user_id` (string): The ID of the user
- `id` (integer): The ID of the task to update

#### Headers
- `Authorization: Bearer <token>`

#### Request Body
```json
{
  "title": "Updated task title",
  "description": "Updated task description",
  "completed": true
}
```

#### Response (200 OK)
```json
{
  "id": 1,
  "title": "Updated task title",
  "description": "Updated task description",
  "completed": true,
  "user_id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
  "created_at": "2025-01-01T10:00:00Z",
  "updated_at": "2025-01-01T11:00:00Z"
}
```

#### Error Responses
- 400: Invalid request body
- 401: Invalid or missing token
- 403: User is not authorized to update this task
- 404: Task not found

---

### DELETE /api/{user_id}/tasks/{id}
Delete a specific task

#### Path Parameters
- `user_id` (string): The ID of the user
- `id` (integer): The ID of the task to delete

#### Headers
- `Authorization: Bearer <token>`

#### Response (204 No Content)

#### Error Responses
- 401: Invalid or missing token
- 403: User is not authorized to delete this task
- 404: Task not found

---

### PATCH /api/{user_id}/tasks/{id}/complete
Toggle the completion status of a task

#### Path Parameters
- `user_id` (string): The ID of the user
- `id` (integer): The ID of the task to update

#### Headers
- `Authorization: Bearer <token>`

#### Response (200 OK)
```json
{
  "id": 1,
  "title": "Sample task",
  "description": "A sample task description",
  "completed": true,
  "user_id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
  "created_at": "2025-01-01T10:00:00Z",
  "updated_at": "2025-01-01T11:00:00Z"
}
```

#### Error Responses
- 401: Invalid or missing token
- 403: User is not authorized to update this task
- 404: Task not found