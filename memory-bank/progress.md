---
description: Tracks what works, what's left to build, current status, known issues, and the evolution of project decisions for the GHOSTLY+ Dashboard.
---

# GHOSTLY+ Dashboard: Progress Log

## Current Overall Status: Phase 1 - Infrastructure Setup COMPLETE

- **Date**: 2025-05-06 (Updated after Task 1 completion and subsequent fixes)

## What Works / Completed Milestones

-   Initial project documentation (`docs/prd.md`, `docs/task-summary.md`, `docs/security.md`) reviewed.
-   Decision made to include optional 2FA/MFA; relevant documents and Taskmaster task (ID 3) updated.
-   Memory Bank core files (`projectbrief.md`, `productContext.md`, `systemPatterns.md`, `techContext.md`, `activeContext.md`, `progress.md`) created and updated.
-   **Task 1: Project Setup and Repository Configuration - FULLY COMPLETED.**
    -   Subtask 1.1: Git & Base Structure (repo init, core docs, .gitignore, LICENSE, Task #26).
    -   Subtask 1.2: Backend Environment with FastAPI (Poetry, dependencies, app structure, .env, /health endpoint).
    -   Subtask 1.3: Frontend with Vue.js 3, TS, Tailwind (Vite, dependencies, Tailwind CSS v4, shadcn/ui, Pinia, .env).
        - Explicitly documented TypeScript usage in memory bank and PRD.
        - Migrated ESLint to v9 with flat config (`eslint.config.js`), resolving compatibility issues.
    -   Subtask 1.4: Docker Configuration (Dockerfiles for backend/frontend, .dockerignore files, initial `docker-compose.yml`).
    -   Subtask 1.5: Nginx as Reverse Proxy (Nginx Dockerfile, `default.conf`, `docker-compose.yml` update).
    -   Subtask 1.6: Finalize Development Environment (Frontend lint/format scripts, Backend Makefile, dev dependencies, README updates, `docker-compose.override.yml`, basic GitHub Actions CI).
-   **Post-Task 1 Fixes & Refinements COMPLETED:**
    -   Resolved Docker build issues in `backend/Dockerfile` related to Poetry install flags, user permissions, and COPY paths.
    -   Updated `frontend/Dockerfile` and `frontend/postcss.config.js` for Tailwind CSS v4 compatibility.
    -   Corrected Nginx `default.conf` rewrite rule for proper API proxying.
    -   Addressed and fixed all frontend linting errors after ESLint v9 migration (type definitions, ESLint configuration details).
    -   Applied Prettier (frontend) and Ruff (backend) formatting to codebase.
    -   Verified complete Docker environment (`docker-compose up --build`) with all services (backend, frontend, nginx) running and accessible correctly.
    -   Updated `memory-bank/techContext.md` to specify Tailwind CSS v4.
-   All changes related to Task 1 and subsequent fixes have been committed.

## Documentation Efforts (as of 2025-05-07)

-   Completed documentation for local Supabase CLI development environment setup: `[docs/environments/local_cli_development_setup.md](mdc:docs/environments/local_cli_development_setup.md)` (Note: this method proved problematic on M1 Mac).
-   Drafted initial documentation for VUB VM self-hosted Supabase setup based on official guides: `[docs/environments/vm_self_hosted_supabase_setup.md](mdc:docs/environments/vm_self_hosted_supabase_setup.md)`.
-   Organized environment-specific setup guides into the `docs/environments/` directory.
-   Updated `[docs/development_workflow.md](mdc:docs/development_workflow.md)` to link to the new local setup guide.

## Supabase Local Deployment (as of 2025-05-07)

-   **Successfully deployed local Supabase services (Task 2.2) using a manual Docker Compose setup.**
    -   Encountered persistent `exec format error` with `postgrest` service on M1 Mac when using `npx supabase start`.
    -   Switched to manual configuration by cloning `supabase/supabase` repo, copying `docker/*` files to `supabase_config/`, and creating a root `.env` file.
    -   Resolved `postgrest` issue by first trying `platform: linux/arm64` and then successfully using `platform: linux/amd64` in its service definition in `supabase_config/docker-compose.yml` to force x86_64 emulation.
    -   Ensured root `.env` file variables (esp. `DOCKER_SOCKET_LOCATION`) were correctly read by Docker Compose by addressing shell variable overrides.
    -   All Supabase services, including `postgrest`, started successfully via `docker compose -f supabase_config/docker-compose.yml up -d`.

## What's Left to Build / Immediate Next Steps

-   Proceed with **Task 2.3: Configure local API and security** for the newly deployed Supabase instance.
-   Likely proceed to Task 2: User Authentication & Authorization (Supabase Integration).
-   Address open questions in `docs/prd.md` (Section 8) as they become relevant.

## Known Issues / Blockers

-   (Resolved) Global Git ignore settings on user's machine initially prevented creation of `.env.example` files; workaround was manual creation by user.
-   (Resolved) ESLint v9 upgrade required migration to flat config (`eslint.config.js`) and careful resolution of plugin/parser compatibility issues.
-   (Resolved) Docker build and runtime errors required iterative debugging of Dockerfiles (Poetry flags, COPY paths, user permissions) and Nginx configuration.

## Evolution of Project Decisions

-   **[Date of 2FA discussion]**: Decided to implement 2FA/MFA as an optional feature.
-   **2025-05-06**: Selected Apache 2.0 as a placeholder license, pending VUB TTO consultation (Task #26).
-   **2025-05-06**: Migrated frontend linting from ESLint v8 (legacy config) to ESLint v9 (flat config) due to compatibility issues and to align with current best practices.
-   **2025-05-06**: Confirmed Tailwind CSS v4 usage and updated relevant configurations and documentation.

*(This section will be updated as major decisions are made or plans evolve.)* 