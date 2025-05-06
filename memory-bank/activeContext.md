---
description: Tracks the current work focus, recent changes, next steps, active decisions, and key learnings for the GHOSTLY+ Dashboard project.
---

# GHOSTLY+ Dashboard: Active Context

## Current Status: Phase 1 - Infrastructure Setup COMPLETE (Task 1 done)

- **Date**: 2025-05-06 (Updated after Task 1 completion and fixes)
- **Focus**: Project setup is complete. Awaiting next task from user.
- **Recent Changes**:
    - **Task 1: Project Setup and Repository Configuration - FULLY COMPLETED.**
        - Subtask 1.1 (Git & Base Structure) - COMPLETED.
        - Subtask 1.2 (Backend Env with FastAPI) - COMPLETED.
        - Subtask 1.3 (Frontend Env with Vue.js, TS, Tailwind) - COMPLETED.
        - Subtask 1.4 (Docker Configuration) - COMPLETED.
        - Subtask 1.5 (Nginx Reverse Proxy) - COMPLETED.
        - Subtask 1.6 (Finalize Dev Env Config - Linters, CI, README) - COMPLETED.
    - **Post-Task 1 Fixes & Refinements:**
        - Resolved Docker build issues in `backend/Dockerfile` (Poetry flags, user permissions, COPY paths).
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

## Next Steps

1.  Await user direction for the next task (e.g., `task-master next` or specific task ID).
2.  Continue with Phase 2: Core Feature Development, likely starting with Task 2 (User Authentication & Authorization).
3.  Regularly update Memory Bank files (`activeContext.md`, `progress.md`) with progress on new tasks.

## Important Patterns & Preferences (Emerging)

-   Prioritizing clear documentation and context establishment (Memory Bank initiative).
-   Adherence to security best practices as outlined in `docs/security.md`.
-   Use of Taskmaster for task management, aligned with `docs/task-summary.md`.
-   Iterative subtask completion followed by Memory Bank updates.
-   Thorough testing of environment changes (e.g., Docker builds, linting) before committing.

## Learnings & Project Insights

-   The project involves integrating a new web dashboard with an existing C# based game, requiring careful consideration of authentication and data flow between these components.
-   Data security and GDPR compliance are paramount due to the handling of sensitive medical data.
-   The self-hosted nature of Supabase on a private VM is a key architectural constraint and security feature.
-   Local environment configurations (like global .gitignore) can sometimes affect tool behavior.
-   ESLint v9 migration to flat config can be complex and require careful handling of plugin compatibility and configuration structure.
-   Docker build processes, especially with multi-stage builds and user permissions, require attention to detail regarding paths and command flags (e.g., Poetry versions).
-   Nginx rewrite rules are crucial for seamless API proxying when frontend and backend have different base paths. 