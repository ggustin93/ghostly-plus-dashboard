---
description: Outlines the system architecture, key technical decisions, design patterns, component relationships, and critical implementation paths for the GHOSTLY+ Dashboard.
source_documents: [docs/prd.md](mdc:docs/prd.md) (Section 4), [docs/security.md](mdc:docs/security.md)
---

# GHOSTLY+ Dashboard: System Patterns

## 1. System Architecture Overview

The GHOSTLY+ system is composed of existing client-side components and a new server-side extension (Web Dashboard and supporting services). The architecture is designed around Work Packages (WP) as defined in [docs/prd.md](mdc:docs/prd.md) (Section 4):

-   **WP1: Existing System Integration**: Interfacing with OpenFeasyo game (MonoGame/C# on Android) and Delsys Trigno EMG sensors. Key modification: game will authenticate via Supabase Auth and upload C3D files directly to the backend API.
-   **WP2: Web Dashboard (Frontend)**: Vue.js 3, Tailwind CSS, shadcn/ui, Pinia, Vue Router, Chart.js/D3.js. Provides role-based interfaces for therapists and researchers.
-   **WP3: Service Layer (Backend API)**: FastAPI (Python), Pydantic, SQLAlchemy. Handles business logic, secure data processing, C3D handling, EMG analysis, JWT verification.
-   **WP4: Data Infrastructure**: Self-hosted Supabase (PostgreSQL for structured data, Supabase Storage for files like C3D and reports). Features RLS and encryption.
-   **WP5: Security and Compliance**: Focus on pseudonymization (SHA-256), encryption (Fernet), GDPR, role-based access control (RBAC), Row-Level Security (RLS), audit logs, OWASP Top 10 protections. Uses Supabase Auth for authentication (JWTs) with optional 2FA/MFA.
-   **WP6: Deployment and Operations**: Docker & Docker Compose for containerization, Nginx for reverse proxy in production. Deployment on VUB private VM.

Refer to the architecture diagram in [docs/prd.md](mdc:docs/prd.md) (Section 4.8) and security diagrams in [docs/security.md](mdc:docs/security.md).

## 2. Key Technical Decisions & Design Patterns

-   **Unified Authentication**: Both the OpenFeasyo game and the Web Dashboard will use the same self-hosted Supabase Auth instance for user authentication (therapists, researchers), employing JWTs. (Source: [docs/prd.md](mdc:docs/prd.md) 4.1.2, [docs/security.md](mdc:docs/security.md) Unified Authentication System)
-   **Direct Authenticated Game Upload**: The OpenFeasyo game will be modified to upload C3D files directly to a secure FastAPI backend endpoint, authenticated with a JWT. A manual dashboard upload serves as a fallback. (Source: [docs/prd.md](mdc:docs/prd.md) 4.1.2, 4.7.1)
-   **Self-Hosted Supabase**: All Supabase services (Auth, Database, Storage) will be self-hosted on the VUB private VM for data sovereignty and control. (Source: [docs/security.md](mdc:docs/security.md) Executive Summary, Local Supabase Deployment Notes)
-   **Security by Layers**: Multi-layered security approach (authentication, authorization, encryption at rest and in transit, pseudonymization, RLS). (Source: [docs/security.md](mdc:docs/security.md))
-   **Row-Level Security (RLS)**: Supabase (PostgreSQL) RLS will be extensively used to ensure users can only access data they are authorized to see. (Source: [docs/prd.md](mdc:docs/prd.md) 4.4.1, [docs/security.md](mdc:docs/security.md) Section 2)
-   **Application-Level Encryption**: Sensitive medical data will be encrypted by the FastAPI backend using Fernet before storage in Supabase and decrypted upon retrieval for authorized users. (Source: [docs/prd.md](mdc:docs/prd.md) 4.5.1, [docs/security.md](mdc:docs/security.md) Section 3)
-   **Pseudonymization**: Patient identifiers will be pseudonymized (e.g., using SHA-256) to enhance privacy. (Source: [docs/prd.md](mdc:docs/prd.md) 4.5.1, [docs/security.md](mdc:docs/security.md) Section 4)
-   **API-Driven Architecture**: The Vue.js frontend interacts with the backend exclusively through the FastAPI REST API.
-   **Containerization**: Docker will be used for packaging the frontend and backend applications, orchestrated with Docker Compose for development and simplifying deployment.
    -   For local development, Supabase services are also containerized using a dedicated `supabase_config/docker-compose.yml`. Currently, core services like `studio`, `kong`, `auth`, `rest`, `storage`, `db`, `meta`, and `supavisor` are active, while others (`realtime`, `functions`, etc.) are commented out to streamline the local environment.
    (Source: [docs/prd.md](mdc:docs/prd.md) 4.6.1)
-   **Modular Project Structure**: The codebase will follow a recommended structure separating backend, frontend, Docker configs, etc. (Source: [docs/prd.md](mdc:docs/prd.md) 4.10)

## 3. Component Relationships

-   **Ghostly Game (OpenFeasyo)**: Collects EMG data -> Authenticates with Supabase Auth -> Uploads C3D to FastAPI Backend.
-   **Web Dashboard (Vue.js)**: User Interface -> Authenticates with Supabase Auth -> Communicates with FastAPI Backend for all data operations and file access (via API which then interacts with Supabase Storage).
-   **FastAPI Backend**: Receives requests from Game & Dashboard -> Validates JWTs (can consult Supabase Auth) -> Processes business logic -> Interacts with Supabase Database (PostgreSQL with RLS) & Supabase Storage -> Handles encryption/decryption & pseudonymization.
-   **Supabase**: Provides Auth services (issues/validates JWTs), Database (stores structured, encrypted, pseudonymized data with RLS), Storage (stores C3D files, reports).

See diagrams in [docs/prd.md](mdc:docs/prd.md) (Sections 4.8, 4.9) and [docs/security.md](mdc:docs/security.md) (Data Flow Diagrams) for visual representations.

## 4. Critical Implementation Paths

-   **Authentication Flow**: Ensuring seamless and secure JWT-based authentication for both the C# game client and the Vue.js web client against the central Supabase Auth service.
-   **C3D Data Pipeline**: The flow of C3D files from game generation, authenticated upload to API, processing (parsing, pseudonymization, encryption), storage in Supabase Storage, and retrieval/visualization in the dashboard.
-   **EMG Data Visualization**: Efficiently fetching, decrypting, processing, and rendering potentially large EMG datasets in the frontend with interactive charts.
-   **RLS Policy Implementation**: Correctly defining and implementing PostgreSQL RLS policies in Supabase to ensure strict data segregation and access control.
-   **Security Measures**: Proper implementation of encryption/decryption services, pseudonymization, and other security controls outlined in [docs/security.md](mdc:docs/security.md). 