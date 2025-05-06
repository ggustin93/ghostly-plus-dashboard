---
description: Tracks the current work focus, recent changes, next steps, active decisions, and key learnings for the GHOSTLY+ Dashboard project.
---

# GHOSTLY+ Dashboard: Active Context

## Current Status: Phase 1 - Infrastructure Setup (Task 1 in progress)

- **Date**: 2025-05-06
- **Focus**: Completing Task 1: Project Setup and Repository Configuration.
    - Subtask 1.1 (Git & Base Structure) - **COMPLETED**
    - Subtask 1.2 (Backend Env with FastAPI) - **COMPLETED**
    - Currently working on **Subtask 1.3: Set Up Frontend with Vue.js 3, TypeScript, and Tailwind CSS.**
- **Recent Changes**: 
    - Completed initial Git repo and base project structure (Subtask 1.1).
    - Configured backend Python environment with FastAPI, including dependencies, basic app structure, .env files, and a working /health endpoint (Subtask 1.2).
    - Added placeholder Apache 2.0 LICENSE and Taskmaster task #26 for VUB TTO consultation.
    - Updated `.gitignore`.
    - Updated Memory Bank (`progress.md`, `activeContext.md`) to reflect this progress.
- **Active Decisions**: 
    - Using Poetry for backend Python dependency management.
    - Using Vite for frontend (Vue.js 3 + TypeScript).
    - Apache 2.0 as placeholder license.

## Next Steps

1.  **Complete Subtask 1.3**: Set Up Frontend with Vue.js 3, TypeScript, and Tailwind CSS.
    - Initialize Vue.js project with Vite.
    - Install dependencies.
    - Set up Tailwind CSS and shadcn/ui.
    - Set up Pinia.
    - Create frontend `.env` and `.env.example` files.
2.  Proceed with remaining subtasks for Task 1:
    - 1.4: Create Docker Configuration for Backend and Frontend.
    - 1.5: Configure Nginx as Reverse Proxy.
    - 1.6: Finalize Development Environment Configuration.
3.  Regularly update Memory Bank files (`activeContext.md`, `progress.md`) with progress.
4.  Address open questions in `docs/prd.md` (Section 8) as they become relevant to upcoming tasks.

## Important Patterns & Preferences (Emerging)

-   Prioritizing clear documentation and context establishment (Memory Bank initiative).
-   Adherence to security best practices as outlined in `docs/security.md`.
-   Use of Taskmaster for task management, aligned with `docs/task-summary.md`.
-   Iterative subtask completion followed by Memory Bank updates.

## Learnings & Project Insights

-   The project involves integrating a new web dashboard with an existing C# based game, requiring careful consideration of authentication and data flow between these components.
-   Data security and GDPR compliance are paramount due to the handling of sensitive medical data.
-   The self-hosted nature of Supabase on a private VM is a key architectural constraint and security feature.
-   Local environment configurations (like global .gitignore) can sometimes affect tool behavior, requiring workarounds (e.g., manual file creation for `.env.example`). 