# API Endpoints Documentation

This document provides details on the API endpoints and interaction patterns within the Ghostly+ system, reflecting our **hybrid architecture**.

> **Important Note on Architecture**:
> - **Supabase as Primary BaaS**: Authentication, basic data storage/retrieval (respecting Row-Level Security), and file storage are primarily handled by **Supabase**. Interactions occur via Supabase client libraries (in Next.js frontend/server) or Supabase Edge Functions.
> - **FastAPI for Specialized Tasks**: A dedicated **FastAPI backend service (to be developed)** will handle complex business logic, C3D file processing, advanced EMG analysis, and computationally intensive report generation.
> - **Next.js Backend Features**: Simple backend logic tightly coupled with the frontend may be handled by Next.js Route Handlers or Server Actions.
>
> This document will distinguish between functionalities provided directly by Supabase, those intended for the future FastAPI service, and those potentially handled by Next.js server features.
>
> The FastAPI service, once developed, will have its own live OpenAPI documentation (Swagger UI and ReDoc) available at its designated `/api/docs` and `/api/redoc` paths.

> **Cross-references**:
> - For system architecture and overall design context, see the [Product Requirements Document (PRD)](../../requirements/prd.md) and [System Patterns (Backend Strategy)](../../../memory-bank/systemPatterns.md#5-backend-implementation-strategy-when-to-use-what).
> - For UI interactions, see the [UI/UX Screens](../../requirements/ui_ux_screens.md).

## Interaction Patterns & Endpoints

### 1. Authentication (Handled by Supabase)

User authentication (login, registration, session management, password recovery) is managed **directly by Supabase Auth**.
-   **Interaction**: The Next.js frontend uses Supabase client libraries (`@supabase/js`, `@supabase/ssr`) to interact with Supabase Auth.
-   **JWTs**: Supabase issues JWTs upon successful authentication. These JWTs are then used to authorize requests to other services (e.g., the future FastAPI backend or Supabase Edge Functions).
-   **Notional Endpoints (Supabase Internal)**: While Supabase exposes HTTP endpoints for auth (e.g., `/auth/v1/token`), direct interaction with these is typically abstracted by the client libraries.

### 2. Data Management (Primarily Supabase, with Next.js & Edge Functions)

Basic CRUD operations and data retrieval for patients, sessions, and users are primarily handled by direct interaction with Supabase, respecting Row-Level Security (RLS).

-   **Next.js Frontend/Server + Supabase Client**:
    -   **Functionality**: Fetching lists of assigned patients, viewing patient details, creating new patient records (by therapists), managing user profiles.
    -   **Mechanism**: Next.js components (Client or Server) use `@supabase/js` or `@supabase/ssr` to query the Supabase database. RLS policies ensure users only access authorized data.
    -   **Example Interaction (Conceptual)**: A therapist views their patients. The Next.js app fetches `/rest/v1/patients?...` from Supabase, with the user's JWT ensuring RLS is applied.

-   **Supabase Edge Functions**:
    -   **Functionality**: Operations requiring privileged access or server-side logic not suitable for direct client-to-DB calls.
    -   **Example**: An admin fetching a list of *all* users (bypassing RLS with `service_role` key). The Next.js admin panel would call a specific Edge Function (e.g., `/functions/v1/get-all-users`).

### 3. Specialized Backend Services (Future FastAPI Backend)

The following functionalities are planned for the dedicated **FastAPI backend service**. These endpoints do not exist yet and will be developed as part of WP3.

**Base URL (Future FastAPI Service)**:
- Development: `http://localhost:8000/api` (or other configured port for FastAPI)
- Production: `https://your-domain.com/api` (or a sub-path like `/fastapi-service`)

**Authentication (for FastAPI Service)**:
- All FastAPI endpoints will require a valid JWT (obtained from Supabase Auth) in the `Authorization: Bearer <jwt_token>` header. The FastAPI service will be responsible for validating these tokens.

#### Health Check (Future FastAPI)

##### `GET /api/health`
Returns the FastAPI service health status.
- **Required Authentication**: None
- **Response**:
  ```json
  {
    "status": "ok",
    "service_name": "Ghostly+ FastAPI Service",
    "version": "0.1.0"
  }
  ```

#### Session & C3D File Management (Future FastAPI)

##### `POST /api/sessions/upload`
Upload a C3D file for a new session and trigger processing.
- **Required Authentication**: Valid JWT
- **Request Body**: Multipart form data:
  - `patient_id`: ID of the patient (Supabase UUID)
  - `c3d_file`: C3D file data
  - `session_date`: ISO 8601 datetime string
  - `game_level` (optional): Integer
  - `game_score` (optional): Integer
  - `notes` (optional): String
- **Response**:
  ```json
  {
    "session_id": "new_session_uuid_from_supabase_or_fastapi",
    "patient_id": "provided_patient_id",
    "status": "processing_initiated",
    "c3d_file_path": "path_in_supabase_storage",
    "message": "Session data received, C3D processing started."
  }
  ```
*(Further details on how session metadata is stored - in Supabase via FastAPI, or directly by client - to be refined based on workflow).*

#### EMG Data Processing & Analysis (Future FastAPI)

##### `POST /api/emg/analyze/{session_id}`
Trigger analysis of EMG data for a specific session (whose C3D is already uploaded).
- **Required Authentication**: Valid JWT
- **Request Body** (optional, if parameters are needed beyond session_id):
  ```json
  {
    "analysis_parameters": { ... }
  }
  ```
- **Response**:
  ```json
  {
    "session_id": "session_uuid",
    "analysis_status": "pending/completed",
    "report_id": "optional_report_id_if_generated"
  }
  ```

##### `GET /api/emg/metrics/{session_id}`
Get calculated EMG metrics for a specific session.
- **Required Authentication**: Valid JWT
- **Response**:
  ```json
  {
    "session_id": "session_uuid",
    "metrics": {
      "rms": { /* ... */ },
      "mvc_percentage": { /* ... */ },
      "symmetry_index": { /* ... */ }
      // Additional metrics
    }
  }
  ```

##### `GET /api/emg/raw/{session_id}`
Get processed/downsampled raw EMG signal data for visualization (if not served directly from Supabase storage by frontend).
- **Required Authentication**: Valid JWT
- **Query Parameters**:
  - `muscle` (optional): Filter by muscle name
  - `start_time` (optional): Start time in seconds
  - `end_time` (optional): End time in seconds
  - `downsample` (optional): Downsample factor
- **Response**:
  ```json
  {
    "session_id": "session_uuid",
    "sampling_rate": 1000, // Example processed rate
    "channels": ["left_rectus_femoris", "..."],
    "data": [ /* timestamped values */ ]
  }
  ```

#### Report Generation (Future FastAPI)

##### `POST /api/reports/generate`
Generate a new report based on patient/session data and EMG analysis.
- **Required Authentication**: Valid JWT
- **Request Body**:
  ```json
  {
    "type": "patient_progress", // e.g., patient_progress, session_summary
    "patient_id": "patient_uuid",
    "session_ids": ["session_uuid1", "session_uuid2"], // or date range
    "included_metrics": ["rms", "symmetry_index"],
    "output_format": "pdf" // or "json"
  }
  ```
- **Response**:
  ```json
  {
    "report_id": "new_report_uuid",
    "status": "generation_queued",
    "message": "Report generation has started."
    // "download_url": "transient_url_or_path_in_supabase_storage" // could be provided later
  }
  ```

##### `GET /api/reports/{report_id}/status`
Check the status of a report generation task.
- **Required Authentication**: Valid JWT
- **Response**:
  ```json
  {
    "report_id": "report_uuid",
    "status": "completed/pending/failed",
    "download_url": "optional_path_to_report_in_supabase_storage_if_completed"
  }
  ```

### 4. Error Handling (General Approach)

Error responses, whether from Supabase, Edge Functions, or the future FastAPI service, should aim for consistency.

-   **Supabase Client Errors**: The Supabase client libraries will throw JavaScript errors that should be caught and handled in the Next.js frontend.
-   **Edge Function Errors**: Can return JSON error objects.
-   **FastAPI Errors (Future)**: Will return JSON error objects.

**Example Error JSON Structure**:
```json
{
  "error": {
    "code": "SPECIFIC_ERROR_CODE", // e.g., AUTHENTICATION_FAILED, VALIDATION_ERROR, PROCESSING_FAILED
    "message": "A descriptive error message.",
    "details": "Optional additional details or context."
  }
}
```

Common conceptual error types:
- `AUTHENTICATION_FAILED`: Invalid, expired, or missing JWT.
- `AUTHORIZATION_DENIED`: User does not have permission for the action (RLS denial, role check failure).
- `VALIDATION_ERROR`: Invalid input parameters or request body.
- `RESOURCE_NOT_FOUND`: The requested resource (e.g., patient, session) does not exist.
- `PROCESSING_ERROR`: An error occurred during C3D processing, EMG analysis, or report generation.
- `SERVICE_UNAVAILABLE` / `INTERNAL_SERVER_ERROR`: Generic server-side error.

### 5. Rate Limiting

-   **Supabase**: Has its own rate limits for Auth and Database APIs. Refer to Supabase documentation.
-   **Edge Functions**: Subject to Supabase's invocation limits.
-   **FastAPI Service (Future)**: Will implement its own rate limiting (e.g., 100 requests per minute per user, configurable). Exceeding this will result in a `429 Too Many Requests` response.

---

