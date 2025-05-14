---
description: Outlines the system architecture, key technical decisions, design patterns, component relationships, and critical implementation paths for the GHOSTLY+ Dashboard.
source_documents: [docs/prd.md](mdc:docs/prd.md) (Section 4), [docs/security.md](mdc:docs/security.md)
---

# GHOSTLY+ Dashboard: System Patterns

## 1. System Architecture Overview

The GHOSTLY+ system is composed of existing client-side components and a new server-side extension (Web Dashboard and supporting services). The architecture is designed around Work Packages (WP) as defined in [docs/prd.md](mdc:docs/prd.md) (Section 4):

-   **WP1: Existing System Integration**: Interfacing with OpenFeasyo game (MonoGame/C# on Android) and Delsys Trigno EMG sensors. Key modification: game will authenticate via Supabase Auth and upload C3D files directly to the backend API.
-   **WP2: Web Dashboard (Frontend)**: **React** with **React Router**, Tailwind CSS, shadcn/ui, Context API/Zustand. Provides role-based interfaces for therapists and researchers in a single consolidated codebase. *(Migrated from Next.js to standard React with Vite for simplicity and performance, and consolidated into a single directory)*
    -   Handles UI rendering, client-side validation, and user interactions.
    -   Organized by feature with clean component hierarchy.
    -   Communicates with backend services through secure API calls.
    -   Manages authentication through Supabase client, with custom fetch implementation for token handling.
-   **WP3: Service Layer (Backend API)**: FastAPI (Python), Pydantic, SQLAlchemy. Handles business logic, secure data processing, C3D handling, EMG analysis, JWT verification.
-   **WP4: Data Infrastructure**: Self-hosted Supabase (PostgreSQL for structured data, Supabase Storage for files like C3D and reports). Features RLS and encryption.
-   **WP5: Security and Compliance**: Focus on pseudonymization (SHA-256), encryption (Fernet), GDPR, role-based access control (RBAC), Row-Level Security (RLS), audit logs, OWASP Top 10 protections. Uses Supabase Auth for authentication (JWTs) with optional 2FA/MFA.
-   **WP6: Deployment and Operations**: Docker & Docker Compose for containerization, Nginx for reverse proxy in production. Deployment on VUB private VM.

Refer to the architecture diagram in [docs/prd.md](mdc:docs/prd.md) (Section 4.8) and security diagrams in [docs/security.md](mdc:docs/security.md).

```mermaid
flowchart TD
    %% Cohesive color scheme with clearer distinctions
    classDef existing fill:#D4F1F9,stroke:#2E86C1,stroke-width:2px
    classDef newSystem fill:#E8DAEF,stroke:#7D3C98,stroke-width:2px
    classDef frontend fill:#FDEBD0,stroke:#333,stroke-width:1px
    classDef backend fill:#D5F5E3,stroke:#333,stroke-width:1px
    classDef api fill:#D6EAF8,stroke:#3498DB,stroke-width:1.5px
    classDef database fill:#F5B7B1,stroke:#C0392B,stroke-width:1.5px
    classDef security fill:#FEF9E7,stroke:#333,stroke-width:1px
    classDef supabase fill:#3ECF8E30,stroke:#3ECF8E,stroke-width:2px
    classDef option1 stroke:#E74C3C,stroke-width:2.5px,stroke-dasharray: 5 5
    classDef option2 stroke:#3498DB,stroke-width:2.5px,stroke-dasharray: 5 5
    classDef legend fill:none,stroke:none
    classDef docker fill:#F5F5F580,stroke:#2C3E50,stroke-width:2px,stroke-dasharray: 5 5

    %% Existing system - simplified
    subgraph CurrentSystem["🏥 EXISTING SYSTEM"]
        direction LR
        Android["📱 Android Tablet"]:::existing
        Sensors["💪 EMG Sensors<br>Delsys Trigno"]:::existing
        Ghostly["🎮 Ghostly Game<br>(OpenFeasyo - MonoGame/C#)"]:::existing
        LocalFiles["📄 C3D Files (Local Cache)"]:::existing
    end

    %% New system - streamlined
    subgraph DockerEnv["🐳 DOCKER ENVIRONMENT"]
        subgraph NewSystem["🌐 GHOSTLY+ EXTENSION"]
            subgraph UserDashboard["📊 WEB DASHBOARD"]
                Dashboard["**React** / Tailwind CSS / shadcn-ui<br>Context API / React Router<br>USER INTERFACES:<br>👨‍⚕️ Therapists (Patient Mgmt, Progress)<br>🔬 Researchers (Analytics, Cohorts)<br>⚙️ Admin (User & System Mgmt)<br>*(Prev: Next.js)*"]:::frontend
            end
            
            API["🔌 REST API<br>(FastAPI - Python)"]:::api
            
            subgraph CoreServices["⚙️ SERVICES"]
                direction TB
                FastAPIServices["🔄 Core Services<br>FastAPI/SQLAlchemy (Python)"]:::backend
                Analytics["📈 Analytics Services<br>(Python/FastAPI)"]:::backend
            end
            
            subgraph SupabaseCloud["☁️ SUPABASE PLATFORM (Self-Hosted)"]
                Database["💾 PostgreSQL<br>Database"]:::database
                FileStore["📁 Supabase Storage<br>(Reports/C3D)"]:::database
                Auth["🔑 Supabase Auth<br>(JWT)"]:::supabase
            end
            
            subgraph GDPRCompliance["🔒 GDPR COMPLIANCE"]
                direction TB
                Pseudonymization["👤 Pseudonymization<br>of Patient Data (SHA-256)"]:::security
                DataEncryption["🔐 App-Level Encryption<br>(Fernet)"]:::security
                AccessControl["📝 Patient Access<br>& Deletion Rights (RLS)"]:::security
                AuditLogs["📋 Audit Logs<br>& Traceability"]:::security
            end
        end
    end
    class DockerEnv docker

    %% Essential connections only
    Sensors --> Android
    Android --> Ghostly
    Ghostly --> LocalFiles
    
    %% Key integration points - C3D files options with labels
    %% Ghostly ==> |"Session Data"| API %% Original generic connection, now superseded by specific options
    
    %% OPTION 1: Automated transfer via API
    Ghostly ==> |"OPTION 1 (Primary):<br>Authenticated C3D File Upload<br>to FastAPI Backend"| API:::option1
    
    %% OPTION 2: Manual import (via Dashboard through API)
    LocalFiles ==> |"OPTION 2 (Fallback):<br>Manual Import by Therapists<br>via Dashboard"| API:::option2
    
    %% Essential flows only
    Dashboard --> |"User Interface"| API
    Dashboard --> |"Authentication"| Auth
    Auth --> |"Validates"| API
    %% API verifies JWT from Supabase Auth
    API --> FastAPIServices
    FastAPIServices --> Database
    FastAPIServices --> Analytics
    Analytics --> FileStore
    %% Analytics might read/write processed data/reports
    API --> |"Store/Retrieve C3D/Reports"| FileStore
    FileStore --> Dashboard
    %% Dashboard views files via API
    
    %% GDPR connections
    FastAPIServices --> GDPRCompliance
    Database --> GDPRCompliance
    API --> GDPRCompliance
```

## 2. Key Technical Decisions & Design Patterns

-   **Unified Authentication**: Both the OpenFeasyo game and the Web Dashboard will use the same self-hosted Supabase Auth instance for user authentication (therapists, researchers). Clients authenticate *directly* with Supabase Auth, which then issues JWTs. The FastAPI backend's role is to subsequently *verify* these JWTs for API request authorization, not to handle the initial credential exchange. (Source: [docs/prd.md](mdc:docs/prd.md) 4.1.2, [docs/security.md](mdc:docs/security.md) Unified Authentication System)
-   **Direct Authenticated Game Upload**: The OpenFeasyo game will be modified to upload C3D files directly to a secure FastAPI backend endpoint, authenticated with a JWT (obtained from Supabase Auth). A manual dashboard upload serves as a fallback. (Source: [docs/prd.md](mdc:docs/prd.md) 4.1.2, 4.7.1)
-   **Self-Hosted Supabase**: All Supabase services (Auth, Database, Storage) will be self-hosted on the VUB private VM for data sovereignty and control. (Source: [docs/security.md](mdc:docs/security.md) Executive Summary, Local Supabase Deployment Notes)
-   **Security by Layers**: Multi-layered security approach (authentication, authorization, encryption at rest and in transit, pseudonymization, RLS). (Source: [docs/security.md](mdc:docs/security.md))
-   **Row-Level Security (RLS)**: Supabase (PostgreSQL) RLS will be extensively used to ensure users can only access data they are authorized to see. (Source: [docs/prd.md](mdc:docs/prd.md) 4.4.1, [docs/security.md](mdc:docs/security.md) Section 2)
-   **Application-Level Encryption**: Sensitive medical data will be encrypted by the FastAPI backend using Fernet before storage in Supabase and decrypted upon retrieval for authorized users. (Source: [docs/prd.md](mdc:docs/prd.md) 4.5.1, [docs/security.md](mdc:docs/security.md) Section 3)
-   **Pseudonymization**: Patient identifiers will be pseudonymized (e.g., using SHA-256) to enhance privacy. (Source: [docs/prd.md](mdc:docs/prd.md) 4.5.1, [docs/security.md](mdc:docs/security.md) Section 4)
-   **API-Driven Architecture**: The **React frontend** interacts with the FastAPI backend primarily through REST APIs. Next.js server-side logic (Server Components, Route Handlers) may interact directly with Supabase for initial loads/RLS-protected data or handle specific backend tasks, complementing the separate FastAPI service. *(Frontend switched to React for its integrated full-stack capabilities and ecosystem benefits)*.
-   **Containerization**: Docker will be used for packaging the frontend (`frontend-2`) and backend applications, orchestrated with Docker Compose for development and simplifying deployment.
    -   For local development, Supabase services are also containerized using a dedicated `supabase_config/docker-compose.yml`. Currently, core services like `studio`, `kong`, `auth`, `rest`, `storage`, `db`, `meta`, and `supavisor` are active, while others (`realtime`, `functions`, etc.) are commented out to streamline the local environment.
    (Source: [docs/prd.md](mdc:docs/prd.md) 4.6.1)
-   **Modular Project Structure**: The codebase will follow a recommended structure separating backend, frontend (`frontend-2`), Docker configs, etc. (Source: [docs/prd.md](mdc:docs/prd.md) 4.10)

## 3. Component Relationships

-   **Ghostly Game (OpenFeasyo)**: Collects EMG data -> Authenticates *directly* with Supabase Auth -> Uploads C3D to FastAPI Backend (sending JWT).
-   **Web Dashboard (React)**: User Interface (React components) -> Authenticates *directly* with Supabase Auth (using `@supabase/js`/`@supabase/ssr`) -> Manages auth state -> Communicates with FastAPI Backend (sending JWT) -> Leverages Next.js server features (Server Components, Route Handlers using `@supabase/ssr`) for integrated backend tasks/data fetching within user context (RLS enforced) -> May call Edge Functions for specific privileged actions.
-   **FastAPI Backend**: Receives requests from Game & Dashboard -> **Verifies JWTs** (issued by Supabase Auth) -> Processes business logic -> Interacts **directly with Supabase DB (PostgreSQL)** via ORM/driver for complex logic/analytics -> Handles encryption/decryption & pseudonymization -> May use `supabase-py` optionally for simple tasks.
-   **Supabase Auth**: Issues JWTs upon successful authentication.
-   **Supabase Database (PostgreSQL)**: Stores application data; enforces RLS based on JWT claims for direct access from React/clients.
-   **Supabase Storage**: Stores files (C3D, reports, avatars); access controlled by RLS policies.
-   **Supabase Edge Functions:** Execute specific backend logic -> Use `supabase-js` client **with `service_role` key** for privileged Supabase operations (bypassing RLS when needed).

See diagrams in [docs/prd.md](mdc:docs/prd.md) (Sections 4.8, 4.9) and [docs/security.md](mdc:docs/security.md) (Data Flow Diagrams) for visual representations. **Note:** Diagrams may need manual updates to reflect the React frontend and these interaction patterns. *Refer to Section 5 below for a detailed guide on choosing the appropriate backend implementation strategy.*

## 4. Critical Implementation Paths

-   **Authentication Flow**: Ensuring seamless and secure JWT-based authentication for both the C# game client and the **React web client** against the central Supabase Auth service, leveraging libraries like `@supabase/ssr`.
-   **C3D Data Pipeline**: The flow of C3D files from game generation, authenticated upload to API, processing (parsing, pseudonymization, encryption), storage in Supabase Storage, and retrieval/visualization in the dashboard.
-   **EMG Data Visualization**: Efficiently fetching, decrypting, processing, and rendering potentially large EMG datasets in the **React frontend** (using React components) with interactive charts.
-   **RLS Policy Implementation**: Correctly defining and implementing PostgreSQL RLS policies in Supabase to ensure strict data segregation and access control.
-   **Security Measures**: Proper implementation of encryption/decryption services, pseudonymization, and other security controls outlined in [docs/security.md](mdc:docs/security.md).
-   **Hybrid Backend Strategy**: Defining clear boundaries between logic handled by Next.js server-side features, Supabase Edge Functions, and the potential separate FastAPI analytics service. *Refer to Section 5 below for detailed guidance.*

## 5. Implementation Strategy Selection

For interacting with the database and implementing backend logic, multiple options are available, each suited to different scenarios:

1.  **React Frontend + Supabase Client (`@supabase/js`):**
    *   **When:** Simple data fetching/mutation directly tied to the UI, where operations respect user permissions defined by **Row Level Security (RLS)**.
    *   **Examples:**
    *   Displaying user-specific data (e.g., their profile, their assigned patients).
    *   Basic CRUD operations on tables where RLS is configured properly.
    *   *How:** Use Supabase client libraries (`@supabase/js`) in React components. Authentication is handled automatically via JWTs managed by the Supabase client. **NEVER use the `service_role` key here.**

2.  **FastAPI Backend:**
    *   **When:** Complex backend logic, data transformation, or operations that can't be handled by simple database queries or RLS.
    *   **Examples:**  
    *   Aggregating data from multiple sources.
    *   Implementing business logic that requires multiple database operations.
    *   Operations requiring service role level access.
    *   **How:** Create FastAPI endpoints in the backend service, call them from React components. Authenticate via headers forwarded from the client.

3.  **Supabase Edge Functions:**
    *   **When:** Isolated operations requiring elevated privileges or when you need serverless execution.
    *   **Examples:**
    *   Admin operations requiring the `service_role` key.
    *   Data transformation requiring access to sensitive fields before returning sanitized data.
    *   **How:** Deploy serverless functions through Supabase that can use the `service_role` key safely. Call these from the React frontend when needed.

4.  **Separate FastAPI Analytics Service (Future):**
    *   **When:** Advanced Python-based analytics and machine learning that require specialized libraries or significant computational resources.
    *   **Examples:**
    *   Processing C3D files for movement analysis.
    *   Running machine learning models.
    *   Complex statistical analysis of patient data.
    *   **How:** Deploy as a separate service that can be scaled independently, with its own authentication and resource allocation.

## 3. Frontend Architecture

### 3.1 Component Structure

The React frontend follows a feature-based architecture:

```
frontend/
├── src/
│   ├── components/
│   │   ├── ui/             # Shadcn UI components
│   │   ├── layouts/        # Page layouts and containers
│   │   ├── dashboard/      # Dashboard-specific components
│   │   ├── patients/       # Patient management components
│   │   ├── treatments/     # Treatment components
│   │   └── sessions/       # Session tracking and reporting
│   ├── pages/
│   │   ├── auth/           # Authentication pages
│   │   ├── dashboard/      # Dashboard pages
│   │   ├── patients/       # Patient management pages
│   │   └── reports/        # Analysis and reporting pages
│   ├── contexts/           # React context providers
│   ├── hooks/              # Custom React hooks
│   └── routes/             # Application routing
```

This organization enables:
- Isolation of features and concerns
- Easier code navigation for developers
- Logical grouping of related components
- Simplified testing and maintenance
- Clear separation between UI components and business logic

### 3.2 Frontend Authentication Flow

The authentication process uses a custom fetch implementation to avoid Supabase client header issues:

1. User submits login form with credentials
2. Custom auth function sends API request with controlled headers
3. Successful login returns JWT tokens
4. Tokens stored in Supabase client state
5. Protected routes check auth state in React Router
6. Auth context provides user information throughout the app

### 3.3 State Management

- React Context API for global state (authentication, user profile)
- Local component state for UI-specific concerns
- Potential migration to Zustand for more complex state as needed

# System Patterns

## Data Flow Architecture

The GHOSTLY+ system follows a clear data flow pattern for capturing, storing, and analyzing quadriceps muscle data:

1. **Data Capture**: EMG sensors on quadriceps muscles → Ghostly Game → C3D files
2. **Data Upload**: Authenticated upload to backend API endpoint
3. **Data Processing**: Backend processes C3D files, extracts metrics
4. **Data Storage**: Processed data stored in Supabase Database with pseudonymization and encryption
5. **Data Analysis**: Web Dashboard visualizes data with appropriate access controls
6. **Data Export**: Exports to SPSS-compatible formats for statistical analysis

## Visualization Patterns

### 1. EMG Visualization

```
┌─────────────────────────────────┐
│                                 │
│     ╱╲      ╱╲     ╱╲    ╱╲    │
│    ╱  ╲    ╱  ╲   ╱  ╲  ╱  ╲   │
│   ╱    ╲  ╱    ╲ ╱    ╲╱    ╲  │
│  ╱      ╲╱      ╲       ╲     ╲ │
│ ╱                              ╲│
│                                 │
└─────────────────────────────────┘
  EMG Signal with Time Controls
```

- Temporal visualization of quadriceps EMG signal
- Real-time or playback modes
- Amplitude visualization with adjustable scales
- Multiple channels for different quadriceps muscles (vastus lateralis, vastus medialis, rectus femoris)
- Training protocol markers (sets, repetitions)
- Comparison between left and right leg

### 2. Muscle Heatmap Visualization

```
┌─────────────────────────────────┐
│    ╔═════════╗                  │
│    ║███████░░║  ◄── Rectus      │
│    ║████████░║      Femoris     │
│    ╚═════════╝                  │
│    ╔═════════╗                  │
│    ║██████░░░║  ◄── Vastus      │
│    ║███░░░░░░║      Lateralis   │
│    ╚═════════╝                  │
│    ╔═════════╗                  │
│    ║████░░░░░║  ◄── Vastus      │
│    ║███░░░░░░║      Medialis    │
│    ╚═════════╝                  │
└─────────────────────────────────┘
        Quad Muscle Heatmap
```

- Color-coded visualization of quadriceps muscle activity
- Intensity mapping based on various measurements:
  - Strength (MicroFET dynamometer)
  - Cross-sectional area (ultrasound)
  - Pennation angle (ultrasound)  
  - Echo intensity (ultrasound)
- Side-by-side comparison of left and right leg
- Time-series visualization (baseline, 2-week, 6-week)

### 3. Progress Tracking Visualization

```
┌─────────────────────────────────┐
│                                 │
│  ┌───┐    ┌───┐    ┌───┐        │
│  │   │    │   │    │   │        │
│  │   │    │   │    │   │        │
│  │   │    │   │    │   │        │
│  └───┘    └───┘    └───┘        │
│ Baseline  2 Week   6 Week       │
│                                 │
└─────────────────────────────────┘
       Strength Progress Chart
```

- Bar/line charts showing progression over time
- Multiple metrics tracked simultaneously
- Treatment group comparison view
- Statistical significance indicators
- Baseline, 2-week, and 6-week measurements
- Population-specific assessment visualizations

### 4. Group Comparison Visualization

```
┌─────────────────────────────────┐
│                                 │
│  Group A   Group B   Control    │
│  ┌───┐     ┌───┐     ┌───┐     │
│  │   │     │   │     │   │     │
│  │   │     │   │     │   │     │
│  │   │     │   │     │   │     │
│  └───┘     └───┘     └───┘     │
│                                 │
└─────────────────────────────────┘
       Treatment Group Chart
```

- Compare outcomes across three treatment groups
- Filter by patient population
- Multiple outcome measures available
- Statistical analysis integration
- Error bars and significance indicators
- Interactive filtering by timepoint

## Authentication Patterns

The system follows a JWT-based authentication flow:

1. **Login**: User authenticates via Supabase Auth
2. **Token**: JWT issued to authorized user
3. **Authorization**: JWT included in all API requests
4. **Verification**: Backend verifies token and permissions
5. **Row-Level Security**: Database enforces access control based on user role
6. **Session Management**: Automatic token refresh and timeout handling

## Data Access Patterns

Different user roles have different access patterns:

1. **Therapists**:
   - Access only their assigned patients
   - View individual patient progress
   - Configure treatment parameters
   - Record session notes

2. **Researchers**:
   - Access pseudonymized data across patients
   - Perform cohort analysis
   - Export data for external analysis
   - View statistical summaries

3. **Administrators**:
   - Manage user accounts and permissions
   - Configure system settings
   - Access audit logs
   - Monitor system health

## Integration Patterns

The system integrates with several external components:

1. **EMG Sensors**: Delsys Trigno Avanti sensors provide raw quadriceps data
2. **Ghostly Game**: OpenFeasyo platform creates the game experience
3. **C3D Files**: Standard biomechanics format for data exchange
4. **SPSS**: Statistical analysis software for research outcomes
5. **Ultrasound**: Viamo sv7 device captures muscle measurements
6. **MicroFET**: Dynamometer for strength measurements

## Reporting Patterns

Standard reports follow consistent patterns:

1. **Session Report**: Individual training session details and metrics
2. **Progress Report**: Patient progression over multiple sessions
3. **Population Report**: Statistics across a specific patient population
4. **Treatment Group Report**: Comparison between treatment arms
5. **Export Report**: Formatted data for SPSS analysis
6. **USE Questionnaire Report**: User experience analysis

