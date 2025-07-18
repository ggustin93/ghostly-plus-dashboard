# GHOSTLY+ Web Dashboard 

![Work in Progress](https://img.shields.io/badge/Status-Work%20in%20Progress-yellow?style=for-the-badge)
![Development Phase](https://img.shields.io/badge/Phase-Infrastructure%20Setup-blue?style=for-the-badge)
![License](https://img.shields.io/badge/License-Academic%20Research-blue?style=for-the-badge)

> ⚠️ **Work in Progress**: This project is currently under active development. Features and documentation may be incomplete or subject to change.

## 1. Project Purpose & Scope

GHOSTLY+ is an applied research project aimed at combating muscle strength loss in hospitalized elderly patients. This project focuses on the development of the **GHOSTLY+ Web Dashboard**, a critical component for patient monitoring, data analysis, and facilitating research.

The dashboard will provide a centralized platform for therapists and researchers to manage patient data, visualize EMG signals and game metrics from the existing OpenFeasyo serious game, track progress, and generate reports.

## 2. Proposed Solution Overview

The Web Dashboard will:
- Integrate with the existing EMG-driven serious game (OpenFeasyo on Android tablets) and Delsys Trigno Avanti EMG sensors.
- Provide secure authentication and role-based access for therapists, researchers, and administrators.
- Offer robust patient and cohort management functionalities.
- Feature advanced EMG data visualization and game performance analysis tools.
- Enable session management and the generation of clinical and research reports.
- Adhere to strict security and GDPR compliance standards for handling sensitive medical data.
- Be built with a modern tech stack: React (frontend), FastAPI (backend), and self-hosted Supabase (database, auth, storage), featuring a polished UI built with Shadcn UI components and styled with Tailwind CSS.

## 3. High-Level Project Phases

1.  **Infrastructure Setup**: Project config, Docker/Nginx, Supabase, Auth system, DB schema, C3D parser. *(Largely completed)*
2.  **Core Functionality**: Patient & Cohort management, OpenFeasyo integration, Backend API.
3.  **Visualization & Analysis**: EMG data viz, game performance components, session management, report generation.
4.  **Security & Compliance**: Data encryption, pseudonymization, GDPR features.
5.  **User Interfaces**: Therapist & Researcher dashboards, advanced EMG analytics, multilingual & accessibility.
6.  **Finalization & Deployment**: Performance optimization, security testing, deployment pipeline, documentation, user testing.

## 4. Development Setup

This project uses Docker Compose for local development orchestration, managing both the application services (frontend, backend, Nginx) and a self-hosted Supabase instance.

### Prerequisites

- Docker & Docker Compose
- Git (for cloning Supabase configuration initially)
- Node.js & npm (for frontend development outside Docker, if preferred)
- Python & Poetry (for backend development outside Docker, if preferred)

### Environment Variables

Before running the application, you need to set up environment variables:

1.  **Root `.env` File (Main Configuration):**
    -   A `.env` file is required at the project root. This file configures all services, including Supabase and your application's backend/frontend.
    -   It was initially created by copying the content from Supabase's official `docker/.env.example` (see `supabase_config/` setup below or `docs/environments/` for more details).
    -   **Crucial Supabase variables to set in this root `.env` file include:**
        -   `POSTGRES_PASSWORD` (a strong, random password)
        -   `JWT_SECRET` (a strong, random string of at least 32 characters)
        -   `ANON_KEY` and `SERVICE_ROLE_KEY` (generate these from your `JWT_SECRET` as per Supabase docs)
        -   `DASHBOARD_USERNAME` and `DASHBOARD_PASSWORD` (for Supabase Studio access)
        -   `SITE_URL` (e.g., `http://localhost:YOUR_FRONTEND_PORT`)
        -   `SUPABASE_PUBLIC_URL` (e.g., `http://localhost:8000` if Kong is on port 8000)
        -   `DOCKER_SOCKET_LOCATION=/var/run/docker.sock` (especially for macOS/Linux)
    -   Application-specific variables (e.g., backend `SECRET_KEY`, frontend `VITE_API_BASE_URL`) should also be defined in this root `.env` file. The `docker-compose.yml` for the application services will then pass these to the respective containers.
    -   Example stubs `backend/.env.example` and `frontend/.env.example` can serve as a reference for application-specific variables but the root `.env` is the source of truth for Dockerized execution.

### Supabase Local Instance Setup (One-time)

The local Supabase instance is managed via a dedicated Docker Compose setup located in the `supabase_config/` directory. This was necessary to resolve M1 Mac compatibility issues.
Refer to `memory-bank/techContext.md` (section 6.1) and `docs/environments/` for details on its one-time setup (cloning Supabase, copying files, creating the root `.env`).

### Running the Full Stack with Docker Compose

1.  Ensure Docker is running.
2.  Ensure your root `.env` file is correctly populated.
3.  From the project root directory, run:
    ```bash
    docker compose -f docker-compose.yml -f supabase_config/docker-compose.yml up --build -d
    ```
4.  The application should be accessible at `http://localhost` (Nginx on port 80).
    - The frontend (Vite dev server) is running internally on port 5173, proxied by Nginx.
    - The backend (FastAPI) is running internally on port 8000, proxied by Nginx under `/api`.
5.  **Supabase Studio** should be accessible via the Kong gateway, typically at `http://localhost:8000` (or the port defined by `KONG_HTTP_PORT` in your `.env`). Use the `DASHBOARD_USERNAME` and `DASHBOARD_PASSWORD` from your `.env` to log in.
6.  Supabase API endpoints (Auth, REST, Storage) for application interaction are primarily accessed through the Nginx proxy (e.g., `http://localhost/auth/v1`, `http://localhost/rest/v1`). Direct access via Kong (e.g., `http://localhost:8000/auth/v1`) is also possible.

### Running Manually (Optional)
**Backend:**
```bash
cd backend
poetry install # Install dependencies
poetry run make run # Or poetry run uvicorn ...
```

**Frontend:**
```bash
cd frontend
npm install # Install dependencies
npm run dev
```
*(Note: Running manually requires handling CORS and API proxying yourself if not using Docker.)*

*(More details can be found in the `docs/` and `memory-bank/` directories.)*

For a detailed breakdown of the development process and task management, see `docs/development_workflow.md`.

### AI Assistance

-   **AI Rules Source**: AI-assisted development for this project primarily uses the rules defined within the `.cursor/rules/` directory. Other rule files may exist in the repository but are secondary.

## 5. Project Structure

The project structure is organized as follows:

- `backend/`: Contains the backend code and dependencies.
- `frontend/`: Contains the frontend code and dependencies.
- `docs/`: Contains project documentation and setup instructions.
- `supabase_config/`: Contains the Docker Compose setup for the self-hosted Supabase services.
- `memory-bank/`: Contains AI-managed context files tracking project state, decisions, and technical details.
- `.env`: (At project root, **not versioned**) Stores all necessary environment variables.

The project is designed to be modular and scalable, with a focus on security and data privacy. 

## 6. License and Intellectual Property

The project operates under an "Academic Research" license, as indicated by the badge at the top of this document.

For comprehensive details on intellectual property rights, ownership of the GHOSTLY+ software (which belongs to VUB), data reuse, and collaboration terms, please consult the [LICENSE.md](mdc:LICENSE.md) file.
