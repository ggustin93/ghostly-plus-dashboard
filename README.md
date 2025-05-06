# GHOSTLY+ Web Dashboard

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
- Be built with a modern tech stack: Vue.js 3 (frontend), FastAPI (backend), and self-hosted Supabase (database, auth, storage).

## 3. High-Level Project Phases

1.  **Infrastructure Setup**: Project config, Docker/Nginx, Supabase, Auth system, DB schema, C3D parser.
2.  **Core Functionality**: Patient & Cohort management, OpenFeasyo integration, Backend API.
3.  **Visualization & Analysis**: EMG data viz, game performance components, session management, report generation.
4.  **Security & Compliance**: Data encryption, pseudonymization, GDPR features.
5.  **User Interfaces**: Therapist & Researcher dashboards, advanced EMG analytics, multilingual & accessibility.
6.  **Finalization & Deployment**: Performance optimization, security testing, deployment pipeline, documentation, user testing.

## 4. Development Setup

This project uses Docker Compose for local development orchestration.

### Prerequisites

- Docker & Docker Compose
- Node.js & npm (for frontend development outside Docker, if preferred)
- Python & Poetry (for backend development outside Docker, if preferred)

### Environment Variables

Before running the application, you need to set up environment variables:

1.  **Backend:**
    - Copy `backend/.env.example` to `backend/.env`.
    - Review `backend/.env` and fill in necessary values, especially `SECRET_KEY` and later, `DATABASE_URL` and any Supabase keys.
2.  **Frontend:**
    - Copy `frontend/.env.example` to `frontend/.env`.
    - Review `frontend/.env` and adjust `VITE_API_BASE_URL` if needed (though the default should work with the Nginx setup).

### Running with Docker Compose

1.  Ensure Docker is running.
2.  Ensure you have set up the `.env` files as described above.
3.  From the project root directory, run:
    ```bash
    docker-compose up --build
    ```
4.  The application should be accessible at `http://localhost` (Nginx on port 80).
    - The frontend (Vite dev server) is running internally on port 5173, proxied by Nginx.
    - The backend (FastAPI) is running internally on port 8000, proxied by Nginx under `/api`.

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

### AI Assistance

-   **AI Rules Source**: AI-assisted development for this project primarily uses the rules defined within the `.cursor/rules/` directory. Other rule files may exist in the repository but are secondary.

## 5. Project Structure

The project structure is organized as follows:

- `backend/`: Contains the backend code and dependencies.
- `frontend/`: Contains the frontend code and dependencies.
- `docs/`: Contains project documentation and setup instructions.
- `memory-bank/`: Contains project-related data and resources.

The project is designed to be modular and scalable, with a focus on security and data privacy. 