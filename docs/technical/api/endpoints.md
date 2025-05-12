# API Endpoints Documentation

This document provides details on the API endpoints available in the Ghostly+ system. It covers authentication, request/response formats, and available operations.

> **Important Note**: This documentation will be complemented by FastAPI's automatic OpenAPI documentation (Swagger UI and ReDoc), which is generated at runtime based on the actual code implementations and Pydantic models. The live API documentation will be available at `/api/docs` and `/api/redoc` when the system is running.
>
> **Cross-references**:
> - For system architecture and overall design context, see the [Product Requirements Document (PRD)](../../requirements/prd.md)
> - For UI interactions that rely on these endpoints, see the [UI/UX Screens](../../requirements/ui_ux_screens.md)

## Base URL

All API endpoints are served under the `/api` base path.

- Development: `http://localhost:8000/api`
- Production: `https://your-domain.com/api`

## Authentication

All endpoints except `/api/health` and `/api/auth/*` require authentication via JWT.

**Authentication Header**:
```
Authorization: Bearer <jwt_token>
```

## Available Endpoints

### Health Check

#### `GET /api/health`

Returns the API health status.

- **Required Authentication**: None
- **Response**:
  ```json
  {
    "status": "ok",
    "version": "1.0.0"
  }
  ```

### Authentication

#### `POST /api/auth/login`

Authenticate a user and receive a JWT token.

- **Required Authentication**: None
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response**:
  ```json
  {
    "access_token": "eyJhbGciOiJIUzI1...",
    "token_type": "Bearer",
    "user": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "email": "user@example.com",
      "role": "therapist"
    }
  }
  ```

#### `POST /api/auth/refresh`

Refresh an existing JWT token.

- **Required Authentication**: Valid JWT
- **Response**: Same as login endpoint

### Patients

#### `GET /api/patients`

Get a list of patients assigned to the authenticated therapist.

- **Required Authentication**: Valid JWT (Therapist or Researcher role)
- **Query Parameters**:
  - `limit` (optional): Maximum number of results to return (default: 20)
  - `offset` (optional): Number of results to skip (default: 0)
  - `status` (optional): Filter by status (`active`, `inactive`, etc.)
- **Response**:
  ```json
  {
    "total": 42,
    "limit": 20,
    "offset": 0,
    "data": [
      {
        "id": "123e4567-e89b-12d3-a456-426614174000",
        "code": "P12345",
        "age": 72,
        "gender": "female",
        "status": "active",
        "created_at": "2023-06-15T10:30:00Z",
        "last_session": "2023-07-02T14:15:00Z"
      },
      // ...more patients
    ]
  }
  ```

#### `GET /api/patients/{patient_id}`

Get detailed information about a specific patient.

- **Required Authentication**: Valid JWT (Therapist or Researcher role)
- **Response**:
  ```json
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "code": "P12345",
    "age": 72,
    "gender": "female",
    "status": "active",
    "created_at": "2023-06-15T10:30:00Z",
    "medical_history": "...",
    "treatment_notes": "...",
    "sessions": [
      {
        "id": "789e4567-e89b-12d3-a456-426614174000",
        "date": "2023-07-02T14:15:00Z",
        "duration": 20,
        "game_level": 3
      }
      // ...more sessions
    ]
  }
  ```

#### `POST /api/patients`

Create a new patient record.

- **Required Authentication**: Valid JWT (Therapist role)
- **Request Body**:
  ```json
  {
    "code": "P12345",
    "age": 72,
    "gender": "female",
    "medical_history": "...",
    "treatment_notes": "..."
  }
  ```
- **Response**: The created patient object

### Sessions

#### `GET /api/sessions`

Get a list of all sessions.

- **Required Authentication**: Valid JWT (Therapist or Researcher role)
- **Query Parameters**:
  - `patient_id` (optional): Filter by patient ID
  - `start_date` (optional): Filter by start date
  - `end_date` (optional): Filter by end date
  - `limit` (optional): Maximum number of results (default: 20)
  - `offset` (optional): Number of results to skip (default: 0)
- **Response**:
  ```json
  {
    "total": 156,
    "limit": 20,
    "offset": 0,
    "data": [
      {
        "id": "789e4567-e89b-12d3-a456-426614174000",
        "patient_id": "123e4567-e89b-12d3-a456-426614174000",
        "patient_code": "P12345",
        "date": "2023-07-02T14:15:00Z",
        "duration": 20,
        "game_level": 3,
        "has_emg_data": true
      },
      // ...more sessions
    ]
  }
  ```

#### `GET /api/sessions/{session_id}`

Get detailed information about a specific session.

- **Required Authentication**: Valid JWT (Therapist or Researcher role)
- **Response**:
  ```json
  {
    "id": "789e4567-e89b-12d3-a456-426614174000",
    "patient_id": "123e4567-e89b-12d3-a456-426614174000",
    "patient_code": "P12345",
    "therapist_id": "456e4567-e89b-12d3-a456-426614174000",
    "date": "2023-07-02T14:15:00Z",
    "duration": 20,
    "game_level": 3,
    "game_score": 450,
    "game_metrics": {
      "attempts": 12,
      "successes": 10,
      "failures": 2
    },
    "notes": "Patient showed improved response time today",
    "c3d_file_path": "/storage/c3d/session_789e4567.c3d"
  }
  ```

#### `POST /api/sessions/upload`

Upload a C3D file for a new session.

- **Required Authentication**: Valid JWT (Therapist role)
- **Request Body**: Multipart form data with the following fields:
  - `patient_id`: ID of the patient
  - `c3d_file`: C3D file data
  - `notes` (optional): Session notes
  - `date` (optional): Session date/time (defaults to upload time)
- **Response**: The created session object

### EMG Data

#### `GET /api/emg/metrics/{session_id}`

Get calculated EMG metrics for a specific session.

- **Required Authentication**: Valid JWT (Therapist or Researcher role)
- **Response**:
  ```json
  {
    "session_id": "789e4567-e89b-12d3-a456-426614174000",
    "metrics": {
      "rms": {
        "left_rectus_femoris": 0.45,
        "right_rectus_femoris": 0.48,
        "left_vastus_lateralis": 0.52,
        "right_vastus_lateralis": 0.50
      },
      "mvc_percentage": {
        "left_rectus_femoris": 65,
        "right_rectus_femoris": 70,
        "left_vastus_lateralis": 75,
        "right_vastus_lateralis": 72
      },
      "symmetry_index": {
        "rectus_femoris": 5.6,
        "vastus_lateralis": 3.8
      },
      // Additional metrics
    }
  }
  ```

#### `GET /api/emg/raw/{session_id}`

Get raw EMG signal data for a session.

- **Required Authentication**: Valid JWT (Therapist or Researcher role)
- **Query Parameters**:
  - `muscle` (optional): Filter by muscle name
  - `start_time` (optional): Start time in seconds
  - `end_time` (optional): End time in seconds
  - `downsample` (optional): Downsample factor for large datasets
- **Response**:
  ```json
  {
    "session_id": "789e4567-e89b-12d3-a456-426614174000",
    "sampling_rate": 2000,
    "channels": ["left_rectus_femoris", "right_rectus_femoris", "left_vastus_lateralis", "right_vastus_lateralis"],
    "data": [
      {
        "timestamp": 0.0,
        "values": [0.012, 0.015, 0.010, 0.014]
      },
      {
        "timestamp": 0.0005,
        "values": [0.014, 0.016, 0.011, 0.015]
      },
      // ...more data points
    ]
  }
  ```

#### `POST /api/emg/analyze`

Submit EMG data for analysis.

- **Required Authentication**: Valid JWT (Therapist role)
- **Request Body**: EMG data to analyze
- **Response**: Calculated metrics similar to `/api/emg/metrics/{session_id}`

### Reports

#### `GET /api/reports`

Get a list of generated reports.

- **Required Authentication**: Valid JWT (Therapist or Researcher role)
- **Query Parameters**:
  - `patient_id` (optional): Filter by patient ID
  - `type` (optional): Report type
  - `limit` (optional): Maximum number of results
  - `offset` (optional): Number of results to skip
- **Response**: List of report objects

#### `POST /api/reports`

Generate a new report.

- **Required Authentication**: Valid JWT (Therapist role)
- **Request Body**:
  ```json
  {
    "type": "patient_progress",
    "patient_id": "123e4567-e89b-12d3-a456-426614174000",
    "start_date": "2023-06-01T00:00:00Z",
    "end_date": "2023-07-15T23:59:59Z",
    "included_metrics": ["rms", "mvc_percentage", "symmetry_index"],
    "format": "pdf"
  }
  ```
- **Response**: Report object with download URL

### Users

#### `GET /api/users`

Get a list of users (admin only).

- **Required Authentication**: Valid JWT (Administrator role)
- **Response**: List of user objects

#### `POST /api/users`

Create a new user (admin only).

- **Required Authentication**: Valid JWT (Administrator role)
- **Request Body**:
  ```json
  {
    "email": "newuser@example.com",
    "password": "initialPassword123",
    "role": "therapist",
    "name": "Dr. Jane Smith",
    "institutions": ["Hospital A"]
  }
  ```
- **Response**: Created user object

## Error Handling

All endpoints follow a consistent error format:

```json
{
  "error": {
    "code": "AUTHENTICATION_ERROR",
    "message": "Invalid or expired token",
    "details": "JWT signature verification failed"
  }
}
```

Common error codes:

- `AUTHENTICATION_ERROR`: Invalid or missing authentication
- `AUTHORIZATION_ERROR`: Insufficient permissions for the operation
- `VALIDATION_ERROR`: Invalid request parameters/body
- `NOT_FOUND`: Requested resource doesn't exist
- `INTERNAL_ERROR`: Unexpected server error

## Rate Limiting

API requests are limited to 100 requests per minute per user. Exceeding this limit will result in a 429 Too Many Requests response with retry details in the headers. 