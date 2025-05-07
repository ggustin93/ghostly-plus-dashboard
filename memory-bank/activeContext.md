---
description: Tracks the current work focus, recent changes, next steps, active decisions, and key learnings for the GHOSTLY+ Dashboard project.
---

# GHOSTLY+ Dashboard: Active Context

## Current Status: Phase 1 Complete; Starting Phase 2 (Supabase Config)

- **Date**: 2025-05-07
- **Focus**: Local Supabase infrastructure deployed via manual Docker Compose setup. Proceeding with Supabase configuration (Task 2.3).
- **Recent Changes**:
    - **Task 1: Project Setup and Repository Configuration - FULLY COMPLETED.**
    - **Task 2.1: Set up local development environment - COMPLETED.**
    - **Task 2.2: Deploy local Supabase services - COMPLETED.**
        - Resolved `exec format error` on M1 Mac for `postgrest` service by switching from `npx supabase start` to manual Docker Compose setup (`supabase_config/docker-compose.yml`).
        - Added `platform: linux/arm64` to the `rest` service definition in `supabase_config/docker-compose.yml`.
        - Ensured project root `.env` file is correctly populated and read by Docker Compose.
    - Successfully started all Supabase services using `docker compose -f supabase_config/docker-compose.yml up -d`.
    - **Post-Task 1 Fixes & Refinements:**
        - Updated `frontend/Dockerfile` and `frontend/postcss.config.js` for Tailwind CSS v4 compatibility.
        - Fixed Nginx configuration (`nginx/conf.d/default.conf`) for correct API proxying and rewrite.
        - Migrated frontend ESLint setup from `.eslintrc.cjs` to `eslint.config.js` (flat config) for ESLint v9 compatibility.
        - Resolved all resulting linting errors in frontend (Vue/TS types, ESLint setup).
        - Applied Prettier (frontend) and Ruff (backend) formatting.
        - Updated `memory-bank/techContext.md` to specify Tailwind CSS v4.
        - Successfully tested the full Docker environment (`docker-compose up --build`) with frontend and backend accessible via Nginx.
    - All changes committed.
- **Active Decisions**:
    - Using Poetry for backend Python dependency management.
    - Using Vite for frontend (Vue.js 3 + TypeScript + Tailwind CSS v4 + shadcn/ui + Pinia).
    - Apache 2.0 as placeholder license (Task #26 pending for VUB TTO consultation).
    - Dockerized development environment with Nginx as reverse proxy.
    - ESLint v9 with flat config (`eslint.config.js`) for frontend linting.
    - Ruff for backend linting and formatting.

- **Current Blocker (2025-05-07)**: Unable to successfully start local Supabase services using `npx supabase start` on an M1 Mac. Encountering `exec format error` for `postgrest` and `supabase_studio` container is unhealthy. Troubleshooting attempts (Rosetta, CLI update, clean restarts) have not yet resolved the issue. See `techContext.md` for details. This blocks progress on Task 2.2 (Deploy local Supabase services) and subsequent tasks depending on local Supabase (e.g., Task 2.3, Task 3).

## Documentation Updates (2025-05-07)

- Organized environment setup documentation into the `docs/environments/` directory.
- Finalized `[docs/environments/local_cli_development_setup.md](mdc:docs/environments/local_cli_development_setup.md)` detailing local Supabase CLI setup procedures.
- Drafted `[docs/environments/vm_self_hosted_supabase_setup.md](mdc:docs/environments/vm_self_hosted_supabase_setup.md)` outlining VM-based Supabase self-hosting based on official guides.
- Updated `[docs/development_workflow.md](mdc:docs/development_workflow.md)` to reference the new local setup guide.

## Next Steps

1.  Proceed with **Task 2.3: Configure local API and security**. This involves:
    - Verifying Supabase Studio access (likely via Kong at `http://localhost:8000`).
    - Connecting to the PostgreSQL database (port 5432 or 6543 via Supavisor).
    - Setting up initial database schemas, tables, and RLS policies as needed for authentication (Task 3).
2.  Continue with Task 3 (Authentication and Authorization System) once Supabase is configured.
3.  Regularly update Memory Bank files (`activeContext.md`, `progress.md`) with progress on new tasks.

## Important Patterns & Preferences (Emerging)

-   Using manual Docker Compose (`supabase_config/docker-compose.yml` and root `.env`) for managing local Supabase environment due to M1 compatibility issues with `npx supabase start`.
-   Prioritizing clear documentation and context establishment (Memory Bank initiative).
-   Adherence to security best practices as outlined in `docs/security.md`.
-   Use of Taskmaster for task management, aligned with `docs/task-summary.md`.
-   Iterative subtask completion followed by Memory Bank updates.
-   Thorough testing of environment changes (e.g., Docker builds, linting) before committing.

## Learnings & Project Insights

-   `npx supabase start` can have architecture compatibility issues (`exec format error`) on M1 Macs, particularly with the `postgrest` service.
-   Manual Docker Compose setup provides more control for resolving such issues (e.g., using `platform: linux/arm64`).
-   Docker Compose relies heavily on the `.env` file in the *current working directory* from which it's executed. Variables set in the shell environment take precedence over `.env`.
-   The `DOCKER_SOCKET_LOCATION=/var/run/docker.sock` variable is crucial in `.env` when compose files mount the Docker socket.
-   The project involves integrating a new web dashboard with an existing C# based game, requiring careful consideration of authentication and data flow between these components.
-   Data security and GDPR compliance are paramount due to the handling of sensitive medical data.
-   The self-hosted nature of Supabase on a private VM is a key architectural constraint and security feature.
-   Local environment configurations (like global .gitignore) can sometimes affect tool behavior.
-   ESLint v9 migration to flat config can be complex and require careful handling of plugin compatibility and configuration structure.
-   Docker build processes, especially with multi-stage builds and user permissions, require attention to detail regarding paths and command flags (e.g., Poetry versions).
-   Nginx rewrite rules are crucial for seamless API proxying when frontend and backend have different base paths. 