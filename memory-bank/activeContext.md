---
description: Tracks the current work focus, recent changes, next steps, active decisions, and key learnings for the GHOSTLY+ Dashboard project, contextualized by the FWO proposal.
source_documents: [docs/00_PROJECT_DEFINITION/ressources/2024_ghostly_proposal.md](mdc:docs/00_PROJECT_DEFINITION/ressources/2024_ghostly_proposal.md)
---

# GHOSTLY+ Dashboard: Active Context

**Foundational Context Note:** This document reflects the ongoing development of the GHOSTLY+ Web Dashboard. The project's overarching scope, research aims, and initial planning (including Work Package definitions) are detailed in the **[FWO Proposal (April 2024)](mdc:docs/00_PROJECT_DEFINITION/ressources/2024_ghostly_proposal.md)**. The dashboard primarily supports WP2 (Game & Dashboard Development), WP3 (RCT & Interventions), WP4 (Data Collection), and WP5 (Data Analyses) of that proposal. **Specific tasks and deliverables from [WP2_proposal_detailed.md](mdc:docs/00_PROJECT_DEFINITION/ressources/WP2_proposal_detailed.md), such as sEMG metric implementation, multi-sensor considerations, and dynamic difficulty adjustment data handling, should be actively integrated into development sprints and reflected in this document as they are addressed.**

## Current Work Focus (as of [Current Date]):

-   **Primary Focus:** Refining and implementing the detailed user functionalities and data management strategies as outlined in the **`docs/00_PROJECT_DEFINITION/UX_UI_specifications.md`** document. This document now serves as the primary guide for feature development across all three user personas (Therapist, Researcher, Administrator).
-   **Data Modeling & Backend Alignment:** Ensuring all backend development (FastAPI) and frontend data handling aligns with the structure defined in **`docs/00_PROJECT_DEFINITION/database_schema_simplified_research.md`**. This includes correct mapping of UI elements to database tables like `Patient`, `RehabilitationSession`, `GameSession`, `ClinicalAssessment`, `ClinicalOutcomeMeasure`, `EMGCalculatedMetric`, `GamePlayStatistic`, `User`, etc.
-   **Therapist Persona Implementation (MVP):** Prioritizing the core features for the Therapist persona (T1-T5 in `UX_UI_specifications.md`), focusing on patient management, clinical data input (core measures), rehabilitation/game session management, and basic progress monitoring (sEMG/game metrics).
-   **Backend sEMG Metric Calculation:** Advancing the backend logic for calculating and storing key sEMG-derived metrics (WP2.3) into the `EMGCalculatedMetric` table, as these are crucial for both Therapist and Researcher views.
-   **User Story Prioritization:** Reviewing and assigning priorities (e.g., Must-have, Should-have for MVP) to the user stories (T1-T5, R1-R3, A1-A4) within `UX_UI_specifications.md` to guide phased implementation.

## Recent Changes & Decisions:

-   **Supabase Client Configuration & Dev/Prod Strategy (Current Session):**
    -   The Supabase client initialization in `frontend/src/lib/supabase/client.ts` has been updated to use `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` environment variables. This allows for dynamic configuration of the Supabase instance targeted by the frontend.
    -   This change facilitates the agreed-upon strategy: using a **Supabase Cloud instance for development and testing** (configured via `frontend/.env`) for ease of setup and iteration, while the **self-hosted Supabase instance on the VUB machine remains the target for production** to ensure data sovereignty and control, aligning with GDPR requirements for sensitive medical data.
    -   The `frontend/.env` file becomes the control point for switching the Supabase backend during development (e.g., between a personal Cloud dev instance, a shared team Cloud dev instance, or a local/VUB dev instance).
-   **UI Refinements & Vercel Deployment (Current Session):**
    -   Successfully deployed the application to Vercel.
    -   Fixed `TS6133: 'i18n' is declared but its value is never read` error in `frontend/src/components/layouts/header.tsx` by removing unused `i18n` variable, enabling Vercel build.
    -   Temporarily disabled dark mode:
        -   Set `darkMode: false` in `frontend/tailwind.config.js`.
        -   Modified `ThemeProvider` in `frontend/src/components/theme-provider.tsx` to always set theme to "light", overriding `ThemeToggle` selections.
        -   Added English alert in `ThemeToggle` (`frontend/src/components/theme-toggle.tsx`) to inform users that dark mode is disabled.
    -   Temporarily disabled language switching:
        -   Modified `Header` component (`frontend/src/components/layouts/header.tsx`) to show an English alert when language change is attempted.
    -   Refined responsive layout for sidebar and header:
        -   Sidebar retraction breakpoint changed from `md` (768px) to `lg` (1024px) in `sidebar.tsx` and `header.tsx`.
        -   Corrected hamburger icon display and alignment in `header.tsx`.
        -   Corrected sidebar close ('X') icon display in `sidebar.tsx`.
        -   Adjusted header welcome message visibility (`lg:block`) to prevent overlap with hamburger icon on medium screens.
        -   `ResponsiveBlocker.tsx` updated to block screens `< 640px` (mobile only), allowing tablets (>=640px) to use the retractable menu.
        -   Corrected sidebar branding ("Ghostly+") display and hover color retention in `sidebar.tsx`.
        -   Sidebar overlay click-to-close functionality removed; only 'X' button closes the sidebar now. Overlay visibility aligned to `lg:hidden`.
-   **Vercel Deployment & Path Aliasing (Frontend):**
    -   Encountered persistent `TS2307: Cannot find module '@/lib/utils'` (and similar for other `@/lib/*` imports) errors during Vercel builds, despite the `frontend` directory being set as the Vercel project root and `tsconfig.app.json` containing correct `baseUrl: "."` and `paths: { "@/*": ["./src/*"] }`.
    -   Attempted to fix by removing explicit `resolve.alias` from `frontend/vite.config.ts` to let Vite infer from `tsconfig.json` – this did not resolve the Vercel build error.
    -   Installed `vite-tsconfig-paths` plugin and added it to `frontend/vite.config.ts`.
    -   Further configured `vite-tsconfig-paths` to explicitly use `projects: ['./tsconfig.app.json']`.
    -   The issue persists on Vercel, indicating a potential mismatch in how Vercel's build environment handles these configurations or a deeper, more subtle configuration conflict.
-   **Comprehensive UX/UI Specification Update:** The `docs/00_PROJECT_DEFINITION/UX_UI_specifications.md` document has been extensively updated to include:
    -   Detailed feature lists (user stories T1-T5, R1-R3, A1-A4) structured in tables.
    -   Clear persona definitions with Executive Summaries, Primary Goals, Pain Points, and Reference Contacts.
    -   Consolidated EMG/Game metric definitions, referencing a new Section 9 (Parameter Tables).
    -   Introduction of simple text-based user flow diagrams.
    -   Addition of "Key UX Discussion Points" for certain screens.
    -   Addition of a disclaimer regarding reliance on `2024_ghostly_proposal.md` and `clinical_trial_info.md` and the need for research team validation.
    -   Restructuring of content to group information by interface/persona.
-   **Refinement of Data Tables in UX/UI Specifications:** Further cleanup and restructuring within `docs/00_PROJECT_DEFINITION/UX_UI_specifications.md` (Therapist Persona section) involved:
    -   Renumbering of data tables (previously 3.1.3, 3.1.4, 3.1.5, 3.1.1, 3.1.2 became 3.1.1 through 3.1.5 in the new order of features).
    -   Removal of the old "Table 3.1.2: Intervention Adherence & Contextual Data" as its content was either redundant or better integrated elsewhere, simplifying the data points to be collected/displayed for session context.
    -   Minor textual clarifications, including the addition of "- Main interface" to the Therapist persona overview.
-   **Database Schema Formalized:** A simplified research database schema has been documented in `docs/00_PROJECT_DEFINITION/database_schema_simplified_research.md`, providing a clear ERD and table definitions. This schema is now a core reference for development.
-   **Memory Bank Update:** All Memory Bank files (`projectbrief.md`, `productContext.md`, `systemPatterns.md`, `techContext.md`, `progress.md`, and this `activeContext.md`) have been updated to reflect the new level of detail from `UX_UI_specifications.md` and `database_schema_simplified_research.md`.
-   **Redundancy Reduction in UX Specs:** Executive Summaries and Primary Goals in `UX_UI_specifications.md` were reviewed, and merged for the Administrator persona to reduce redundancy.
-   **UI Updates for Patient Profile & Clinical Assessments (React Frontend):**
    -   **`PatientProfile.tsx`:**
        -   Tabs modified to "Sessions", "Clinical Assessments", and "Notes". "Overview" tab removed.
        -   "Sessions" set as the default tab.
        -   Styling of `TabsList` and `TabsTrigger` updated to match dashboard examples, including icons.
        -   "Edit Assessment" button text changed to "Manage Assessments" (now "Add Assessment").
    -   **`ClinicalAssessments.tsx`:**
        -   New component created to replace `TreatmentConfig` for the "Clinical Assessments" tab.
        -   Iteratively refined UI from initial category list to card view, then to a table view.
        -   Table view includes columns for "Category" (colored badge with tooltip), "Measure", and "Last Assessed". "Last Value" column removed.
        -   Implemented mock data (`mockPatientAssessments`) to populate the table.
        -   Measures displayed are now filtered to only show those with available mock data.
        -   Styling adjustments for alignment and readability.
    -   Unused imports and linter warnings addressed in both files.

## Next Steps & Immediate Priorities:

1.  **Resolve Vercel Path Aliasing Issue:**
    -   Verify Vercel Project Settings: Ensure "Root Directory" is correctly set to `frontend`.
    -   Investigate Vercel build logs in detail for clues about path resolution or `tsconfig` usage.
    -   If `vite-tsconfig-paths` with explicit project path doesn't work, consider reverting `vite.config.ts` to use a very explicit `resolve.alias` structure like `alias: { '@/lib/': path.resolve(__dirname, 'src/lib/') }` for each major subdirectory under `src/` as a more forceful workaround, ensuring `path` is imported.
    -   Consider creating a minimal reproducible example to isolate the issue with Vercel/Vite/tsconfig paths.
2.  **Research Team Validation of UX Specifications:** Crucially, the updated `docs/00_PROJECT_DEFINITION/UX_UI_specifications.md` needs to be reviewed and validated by the GHOSTLY+ research team to confirm assumptions and clarify requirements before extensive implementation.
3.  **Prioritize User Stories (MoSCoW):** Fill in the "Priority / Notes" column for all user stories (T1-T5, R1-R3, A1-A4) in `UX_UI_specifications.md` using MoSCoW or a similar framework, in collaboration with the research team if possible.
4.  **Backend Development for Core Therapist Features:**
    -   Develop FastAPI endpoints to support T1-T3 functionalities, ensuring data is created/retrieved according to `database_schema_simplified_research.md` (e.g., creating/updating `Patient`, `RehabilitationSession`, `GameSession`, `ClinicalAssessment`, `ClinicalOutcomeMeasure` records).
    -   Implement logic for calculating and storing core sEMG metrics (e.g., RMS, MAV) into `EMGCalculatedMetric` based on C3D file processing or direct data streams.
    -   Implement logic for processing and storing game statistics into `GamePlayStatistic`.
5.  **Frontend Development for Core Therapist Features:**
    -   Build React components for Therapist views (T1: Dashboard/Patient List, T2: Patient Profile/Clinical Data Entry, T3: Session Management/Monitoring).
    -   Integrate these components with the new backend APIs.
    -   Focus on clear visualization of clinical data, sEMG metrics, and game stats.
6.  **Refine Data Flow for Game Data:** Solidify how detailed game log data (beyond C3D, if necessary for WP2.3/WP2.4 metrics) will be transmitted from the game to the backend and stored (e.g., potentially new tables or extended fields in `GamePlayStatistic` or `GameSession`).

## Key Patterns & Preferences Emerging:

-   **Document-Driven Development:** `UX_UI_specifications.md` and `database_schema_simplified_research.md` are now central artifacts guiding development.
-   **Modular Design:** Continue with feature-based organization in both frontend (React components) and backend (FastAPI routers/services).
-   **Clear Separation of Concerns:** Maintain distinct responsibilities between frontend (UI/UX, client-side state), backend (business logic, data processing, security), and Supabase (data storage, auth, BaaS utilities).
-   **Iterative Refinement:** Expect further refinements to `UX_UI_specifications.md` based on research team feedback and initial implementation experiences.

## Learnings & Project Insights:

-   The detailed UX specification process has highlighted the complexity and interconnectedness of data required for the GHOSTLY+ dashboard. Having a clear, validated set of requirements is paramount before deep coding.
-   Formalizing the database schema early, even in a simplified form, provides significant clarity for both backend and frontend development.
-   Regularly updating the Memory Bank is crucial for maintaining a shared understanding of the project's evolving state, especially with detailed documents like the UX specifications.
-   **Ongoing UI/UX Refinements:** Small enhancements, such as adding keyboard navigation to components like the `GameSessionNavigator`, contribute to overall accessibility and usability goals, reflecting an iterative approach to improving the user experience.

*(Ensure to replace [Current Date] with the actual date of this update.)*

## Current Status: Phase 4 (C3D Processing & EMG Analysis) - React Frontend

- **Date**: 2025-05-24
- **Focus**: Implementing C3D file upload, processing, and EMG analysis visualization components. Resolving infrastructure issues.
- **Recent Changes**:
    - **C3D Processing & EMG Analysis Components**:
        - Successfully fixed C3D file upload functionality by aligning API route prefixes
        - Fixed Docker configuration for ezc3d library dependencies using a single-stage build approach
        - Implemented `C3DUpload` component for uploading C3D files with advanced processing options
        - Created `EMGAnalysisDisplay` component to visualize EMG analysis results with tables and charts
        - Added `C3DUploadCard` component for the dashboard for quick access
        - Added TypeScript interfaces for C3D and EMG data in the API service
        - Integrated real EMG waveform data from C3D files via dedicated API endpoint (may still be showing placeholder data)
        - Updated Recharts library from v2.12.7 to v2.15.3 to resolve React deprecation warnings
        - Integrated components into the application routing:
            - Added routes for `/sessions/upload` and `/patients/:patientId/upload`
            - Added upload buttons to sessions list and patient profile pages
            - Integrated with dashboard via card component
        - Added toast notifications with existing hooks
    - **Documentation Refinement (ui_ux_screens.md)**:
        - The `docs/00_PROJECT_DEFINITION/ui_ux_screens.md` document was retitled to "Ghostly+ Dashboard: Functional Design and UI/UX Specifications" to more accurately reflect its evolved scope, which now explicitly includes functional design aspects alongside UI and UX specifications.
    - **NGINX Configuration Improvements**:
        - Updated `nginx/conf.d/default.conf` to resolve 502 Bad Gateway errors:
            - Used variables for upstream services with appropriate names
            - Disabled IPv6 in the resolver configuration
            - Added detailed error handling for troubleshooting
            - Enabled larger request body size for file uploads
            - Used resolver variables consistently throughout the config
    - **Framework Update**: Finalized transition to React with Vite:
        - Next.js proved overly complex for our dashboard needs, with server-side features that weren't fully utilized
        - React with Vite offers a lighter, more appropriate solution for our primarily client-side dashboard application
        - Better alignment with project complexity and team skillset
        - Improved development speed with Vite's lightning-fast build times
        - Simplified routing using React Router
    - **Documentation Reorganization**:
        - Created a new numbered folder structure in `/docs`:
          - `00_PROJECT_DEFINITION`: Core requirements and scope
          - `01_ARCHITECTURE`: System design documentation
          - `02_SETUP_AND_DEVELOPMENT`: Developer onboarding and guides
          - `03_GUIDES`: Role-specific how-to guides
        - Added main README to explain the docs structure
        - Consolidated architecture documentation into a single comprehensive file
        - Created minimal testing documentation focused on MVP approach
    - **Testing Infrastructure**:
        - Implemented minimal E2E testing setup with Playwright
        - Created basic test structure for authentication
        - Set up MVP backend test approach with FastAPI TestClient
        - Added testing commands to package.json
        - Adopted a simplified test folder structure for maintainability
    - **`frontend` Setup**: Configured React with React Router, Tailwind CSS, Shadcn UI.
    - **`frontend` Auth**: Implemented Supabase client, Auth Context, Auth Form, Login Page, Account Page.
    - **`frontend` Component Structure**: Organized components by feature:
        - UI components (Shadcn UI React components)
        - Layout components (page layouts, containers)
        - Feature-specific components (dashboard, patients, treatments, etc.)
        - Context providers and hooks
    - *Older Vue and Next.js related code has been completely removed.*
    - **Task 1: Project Setup and Repository Configuration - FULLY COMPLETED.**
    - **Task 2.1: Set up local development environment - COMPLETED.**
    - **Task 2.2: Deploy local Supabase services - COMPLETED.**
        - Resolved `exec format error` on M1 Mac for `postgrest` service by switching from `npx supabase start` to manual Docker Compose setup (`supabase_config/docker-compose.yml`).
        - Added `platform: linux/arm64` to the `rest` service definition in `supabase_config/docker-compose.yml`.
        - Ensured project root `.env` file is correctly populated and read by Docker Compose.
    - Successfully started all Supabase services using `docker compose -f supabase_config/docker-compose.yml up -d`.
    - **Task 2.3: Configure local API and security - COMPLETED**
        - Created comprehensive documentation for Supabase API and security configuration in `docs/environments/supabase_api_security_config.md`.
        - Developed a CORS configuration script (`docs/environments/supabase_cors_config.sh`) to properly configure Kong API gateway and successfully ran it.
        - Created a storage bucket setup script (`docs/environments/create_storage_buckets.js`) for managing application file storage. This script encountered persistent issues.
        - **Storage buckets (`c3d-files`, `reports`, `avatars`, `temp-uploads`) were successfully created manually via Supabase Studio** after troubleshooting JWT and service key issues.
        - Added utility script (`docs/environments/install_supabase_js.sh`) to install the Supabase JS client required for storage management and successfully ran it.
        - Updated `JWT_SECRET` in `supabase_config/.env` and restarted services.
    - **Authentication Debugging & Resolution (Post Task 2.3):**
        - Investigated "Invalid authentication credentials" errors during sign-in and password reset attempts.
        - Updated `supabase_config/.env`: Enabled `ENABLE_EMAIL_AUTOCONFIRM=true`, corrected `SITE_URL` and `ADDITIONAL_REDIRECT_URLS` to match frontend dev server (`http://localhost:5173`), updated `MAILER_URLPATHS_RECOVERY` to `/update-password`.
        - Created `frontend/src/pages/UpdatePasswordPage.vue` component for handling password updates (router integration pending).
        - Installed `vue-router` dependency in `frontend` project.
        - Used `curl` to confirm authentication issues originated from the backend, not the Vue app.
        - **Identified root cause**: Inconsistent `JWT_SECRET`, `ANON_KEY`, and `SERVICE_ROLE_KEY` due to using the default `JWT_SECRET` and potential historical inconsistencies.
        - Generated a new unique `JWT_SECRET`, derived new `ANON_KEY` and `SERVICE_ROLE_KEY` using `jsonwebtoken`.
        - Updated `supabase_config/.env` with the new, consistent secret and keys.
        - Restarted all Supabase services to apply new keys.
        - **Confirmed successful authentication using `curl`** after recreating test user (`test2@test.be`) with the new keys active.
        - **Identified Frontend Issues**: 
            - Missing `VITE_SUPABASE_URL` and corrupted line in `frontend/.env`.
            - Frontend dev server (Vite) likely needed restart after `frontend/.env` changes to load correct Supabase URL/Key.
        - **Corrected Frontend Config**: `frontend/.env` updated; `supabaseClient.ts` verified to use Vite env vars.
        - Cleaned up `Auth.vue` (removed hardcoding).
        - **Current State**: Backend auth works via direct API call (`curl`). Frontend auth via UI still fails, suspected due to Vite not reloading env vars.
    - **Authentication Investigation Continued (2025-05-09):**
        - **Problem Identification**: Despite Nginx configurations and Supabase client options, browser requests still included both `Authorization: Bearer <anon_key>` and `apikey: <anon_key>` headers.
        - **Root Cause Confirmed**: The Supabase JS client adds both headers internally, and these duplicate credentials confuse GoTrue's authentication service.
        - **Implemented New Solution**:
          1. Created a custom authentication implementation in `authStore.ts` that bypasses the Supabase client's signIn method
          2. Used direct fetch API to control exactly which headers are sent (only apikey, no Authorization)
          3. Processes the authentication response and updates the Supabase client with the new session
        - **Technical Approach**:
          ```typescript
          // Custom fetch implementation to avoid duplicate headers
          const response = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              // Only send the apikey header, not Authorization
              'apikey': supabaseKey,
              'X-Client-Info': 'supabase-js-web/custom'
            },
            body: JSON.stringify({
              email: emailIn,
              password: passwordIn
            })
          });
          
          // Update Supabase client with the received session
          const { data: sessionData } = await supabaseClient.auth.setSession({
            access_token: responseData.access_token,
            refresh_token: responseData.refresh_token
          });
          ```
        - **Current Status**: Implementation complete but testing interrupted by Docker issues requiring system restart.

- **Post-Task 1 Fixes & Refinements:**
    - Updated `frontend/Dockerfile` and `frontend/postcss.config.js` for Tailwind CSS v4 compatibility.
    - Fixed Nginx configuration (`nginx/conf.d/default.conf`) for correct API proxying and rewrite.
    - Migrated frontend ESLint setup from `.eslintrc.cjs` to `eslint.config.js` (flat config) for ESLint v9 compatibility.
    - Resolved all resulting linting errors in frontend (Vue/TS types, ESLint setup).
    - Applied Prettier (frontend) and Ruff (backend) formatting.
    - Updated `memory-bank/techContext.md` to specify Tailwind CSS v4.
    - Successfully tested the full Docker environment (`docker-compose up --build`) with frontend and backend accessible via Nginx.
- All changes committed.
- **Docker & NGINX Configuration (as of 2025-05-24):**
    - Aligned main `docker-compose.yml` for NGINX proxying:
        - Added `supabase_network` to the `nginx` service to enable communication with `supabase-kong`.
        - Updated `frontend` service's `VITE_API_BASE_URL` to `http://localhost/api` to route API calls through NGINX.
    - Updated `nginx/conf.d/default.conf` with improved configuration:
        - Used variables for upstream services with appropriate names
        - Disabled IPv6 in resolver configuration
        - Added detailed error handling for troubleshooting
        - Enabled larger request body size for file uploads (for C3D files)
        - Used resolver variables consistently throughout the config
    - Verified `nginx/conf.d/default.conf` correctly proxies to frontend (`/`), backend (`/api`), and Supabase services (`/auth/v1`, `/rest/v1`, etc.).
- **Supabase Services Optimization (as of 2025-05-09):**
    - Reviewed services in `supabase_config/docker-compose.yml` for local development.
    - Commented out the following Supabase services as they are not currently used: `realtime`, `functions`, `imgproxy`, `analytics`, and `vector`.
    - Essential services remain active: `studio`, `kong`, `auth`, `rest`, `storage`, `db`, `meta`, and `supavisor`.
- **Active Decisions**:
    - **Frontend Framework:** React with Vite is now the primary frontend, in a single consolidated directory.
        - **Rationale Summary**: Chosen for its lighter footprint, better alignment with project complexity and team skillset, and improved maintainability with a single codebase.
    - **Backend Strategy:** Hybrid approach. Use a dedicated FastAPI backend for Python-specific processing (like C3D file analysis). Use Supabase Edge Functions for privileged operations/transformations. *(See [systemPatterns.md](mdc:memory-bank/systemPatterns.md#5-backend-implementation-strategy-when-to-use-what) for detailed guidance on choosing the correct implementation location).*
    - Using Poetry for backend Python dependency management.
    - Using npm for frontend Node.js dependency management.
    - Apache 2.0 as placeholder license (Task #26 pending for VUB TTO consultation).
    - Dockerized development environment with Nginx as reverse proxy.
    - ESLint v9 with flat config (`eslint.config.js`) for frontend linting.
    - Ruff for backend linting and formatting.
    - Storage buckets organization based on data type (c3d-files, reports, avatars, temp-uploads).
    - CORS configuration allows access from all local development environments.
    - **Local Supabase Service Configuration (as of 2025-05-09):**
        - Active services: `studio`, `kong`, `auth`, `rest`, `storage`, `db`, `meta`, `supavisor`.
        - Inactive (commented out in `supabase_config/docker-compose.yml`): `realtime`, `functions`, `imgproxy`, `analytics`, `vector`.
    - Using a unique, strong `JWT_SECRET` for Supabase services.
    - `ANON_KEY` and `SERVICE_ROLE_KEY` are derived from the current `JWT_SECRET`.
    - **Authentication Architecture (as of 2025-05-09):**
        - Frontend auth can use either:
          - Direct connection to Supabase services (`http://localhost:8000`)
          - Nginx proxy with properly configured header management (`http://localhost`)
        - Backend API accessed through Nginx proxy (`http://localhost/api`)
        - Supabase client configured with disabled session persistence to prevent auth header issues
        - Nginx explicitly removes the Authorization header for Supabase auth endpoints to prevent credential conflicts

## Documentation Updates (2025-05-08)

- Organized environment setup documentation into the `docs/environments/` directory.
- Finalized `[docs/environments/local_cli_development_setup.md](mdc:docs/environments/local_cli_development_setup.md)` detailing local Supabase CLI setup procedures.
- Drafted `[docs/environments/vm_self_hosted_supabase_setup.md](mdc:docs/environments/vm_self_hosted_supabase_setup.md)` outlining VM-based Supabase self-hosting based on official guides.
- Created `[docs/environments/supabase_api_security_config.md](mdc:docs/environments/supabase_api_security_config.md)` with comprehensive guidance on API endpoints, JWT configuration, CORS settings, and integration examples.
- Developed supplementary scripts in `docs/environments/`:
  - `supabase_cors_config.sh` - Script to update Kong CORS configuration.
  - `create_storage_buckets.js` - Script to set up necessary storage buckets.
  - `install_supabase_js.sh` - Utility to install required dependencies.
- Updated `[docs/development_workflow.md](mdc:docs/development_workflow.md)` to reference the new local setup guides.

## Additional Investigation Needed

1.  EMG Waveform Data Display:
    -   Currently displaying placeholder data instead of real C3D waveform data.
    -   Debug the `/api/v1/c3d/results/{result_id}/waveform` endpoint to ensure proper extraction.
    -   Add logging to trace data flow from C3D file to frontend visualization.
    -   Enhance error handling to provide clear diagnostics when original C3D files can't be processed.
    -   Verify file paths and references to original C3D files in the results directory.
2.  **Dashboard Support for RCT Data Management (WP3, WP4, WP5)**:
    -   Assess requirements for managing participant randomization data (if any part is managed in-dashboard vs. external IWRS).
    -   Ensure dashboard can capture/display all outcome measures specified in the proposal (MicroFet, ultrasound data entry/links, functional tests, questionnaires, adherence, user experience).
    -   Define data export formats compatible with SPSS and REDCap (as mentioned in proposal for WP5 and GDPR compliance).
    -   Clarify dashboard's role in supporting mixed-methods data for implementation analysis (surveys, interview notes if digitized).

## Important Patterns & Preferences (Emerging)

-   **Data Model Granularity**: A single **Rehabilitation Session** (the overall therapy appointment) can comprise one or more **Game Sessions**. Each Game Session results in a distinct C3D file. This many-to-one relationship (Game Sessions to Rehabilitation Session) is crucial for data upload, storage, analysis, and UI representation.
-   Using React with Vite for the frontend in a single directory.
-   Organizing frontend code by feature rather than by technical concern.
-   Leveraging Shadcn UI for consistent component design.
-   Employing Supabase Edge Functions for operations requiring `service_role` or secure data transformations (e.g., pseudonymization).
-   Preference for Hybrid Backend model (FastAPI for main backend + Edge Functions + separate Analytics service).
-   Using manual Docker Compose (`supabase_config/docker-compose.yml` and root `.env`) for managing local Supabase environment due to M1 compatibility issues with `npx supabase start`.
-   Prioritizing clear documentation and context establishment (Memory Bank initiative).
-   Adherence to security best practices as outlined in `docs/security.md`.
-   Use of Taskmaster for task management, aligned with `docs/task-summary.md`.
-   Iterative subtask completion followed by Memory Bank updates.
-   Thorough testing of environment changes (e.g., Docker builds, linting) before committing.
-   Organizing setup scripts and documentation in the `docs/environments/` directory.
-   Using JavaScript with the Supabase JS client for storage management tasks.
-   NGINX acts as the single entry point (localhost:80) for frontend, backend API, and Supabase services during local development.
-   Ensuring consistency between `JWT_SECRET`, `ANON_KEY`, and `SERVICE_ROLE_KEY` across all Supabase services and client configurations is critical for authentication stability.
-   Vite requires a server restart to load changes made to `.env` files.
-   **Authentication architecture**: 
    - Three approaches attempted:
      1. Direct connection to Supabase services (bypassing Nginx)
      2. Nginx proxy with explicit header management (removing Authorization header)
      3. Custom fetch implementation that bypasses Supabase client's internal header management
    - Custom fetch approach gives complete control over headers and appears to be the most reliable solution
-   **C3D file processing and EMG analysis**:
    - Separate dedicated components for upload, analysis, and display
    - TypeScript interfaces for strong typing of C3D and EMG data structures
    - Integration with FastAPI backend for complex numerical processing
    - Dashboard card components for quick access to key features
    - Multiple access points for uploading files (sessions page, patient page)
    - Real EMG waveform visualization using actual C3D data through dedicated API endpoints
    - Lazy loading of waveform data (loaded only when user selects the waveform tab)
    - Fallback to sophisticated placeholder data when original C3D files are unavailable

## Learnings & Project Insights

-   Module resolution in React with Vite with newer dependencies (React 19, Radix UI) and tools (npm, Turbopack) can sometimes require extensive troubleshooting (cache clearing, reinstalls, specific flags like `--legacy-peer-deps`, disabling Turbopack).
-   Clearly defining the roles of different backend options (Next.js server, Edge Functions, separate FastAPI) is important for architectural clarity.
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
-   CORS configuration is essential for enabling communication between the frontend, backend, and the game client.
-   Proper storage bucket organization facilitates data management and security enforcement.
-   The `create_storage_buckets.js` script proved unreliable in the local M1 environment, failing with various errors (invalid signature, jwt malformed, object size exceeded) despite multiple JWT/SERVICE_KEY configurations. Manual creation via Supabase Studio was successful once the underlying `JWT_SECRET` in `supabase_config/.env` was correct and services restarted (using the *default* `SERVICE_ROLE_KEY` from the `.env` for Studio operations).
-   The `shadcn-vue init` command confirmed configuration exists. `shadcn-vue add [multiple components]` failed persistently. Adding components individually (`button`, `input`, `label`, `separator`, `card`, `alert`) via `shadcn-vue add` succeeded. Installing `lucide-vue-next` via `npm install` was necessary as `add` command failed for it. This resolved the module import errors in `Auth.vue`.
-   Ensuring NGINX is on the same Docker network as `supabase-kong` is crucial for proxying Supabase API calls.
-   Frontend API calls should be routed via NGINX (e.g. `VITE_API_BASE_URL=http://localhost/api`) to leverage the proxy setup, rather than directly to the backend service port.
-   Default placeholder values for secrets (like `JWT_SECRET`) can lead to hard-to-debug authentication failures, even if seemingly consistent, due to historical state or environmental overrides.
-   Changing `JWT_SECRET` requires regenerating dependent keys (`ANON_KEY`, `SERVICE_ROLE_KEY`) and potentially re-creating users to ensure password hash consistency.
-   Testing authentication directly against the backend API (e.g., using `curl`) is essential for isolating frontend vs. backend issues.
-   Frontend environment variables (`.env` file for Vite) must be correctly configured and the dev server restarted for changes to take effect.
-   JWT signature validation errors (`bad_jwt`, `signature is invalid`) strongly indicate secret/key mismatches between services (e.g., Studio calling Admin API with outdated `SERVICE_ROLE_KEY`).
-   Frontend dev server restarts are crucial after modifying `.env` files used via `import.meta.env`.
-   **Authentication with Supabase (updated)**: 
    - Supabase JS client's internal mechanisms add both Authorization and apikey headers
    - These duplicate credentials cause GoTrue to reject password-based authentication
    - Three potential solutions:
      1. Configure Nginx to explicitly strip the Authorization header
      2. Direct connections to Supabase services (bypassing Nginx)
      3. Custom fetch implementation that completely bypasses the Supabase client's auth methods
    - The custom fetch approach provides the most reliable solution as it gives complete control over headers 
-   **Nginx configuration best practices**:
    - Use variables for upstream services to improve maintainability
    - Disable IPv6 in resolver when not needed to avoid connection issues
    - Add detailed error logging for troubleshooting
    - Configure appropriate request body sizes for file uploads
    - Use consistent resolver variables throughout the configuration
    - When facing 502 Bad Gateway errors, review network connectivity between services and check DNS resolution
-   **C/C++ Extension Libraries in Docker**: Python packages with compiled C/C++ extensions (like ezc3d) require special handling in Docker:
  - Single-stage builds are often more reliable than multi-stage builds for maintaining library paths and dependencies
  - LD_LIBRARY_PATH must include all directories containing .so files, including within site-packages
  - Build tools and dependencies must remain in the final image for some libraries to function properly
  - Verification scripts for testing imports are valuable for troubleshooting library issues
  - Including both runtime and build dependencies may increase image size but ensures library compatibility
- **API Routing Consistency**: Ensure API routes are registered with the same prefixes that frontend clients expect:
  - The FastAPI router registration must include any prefixes added by nginx (`/api`) before the version prefix (`/v1`)
  - Routes should be consistently defined as `app.include_router(router, prefix="/api/v1/resource")` to match frontend requests
  - When debugging 404 errors, compare the exact URL path in the frontend request with how routes are registered in the backend
  - Nginx location blocks should align with the API path structure used in both frontend and backend
- **React Component Best Practices**: Stay current with React's evolving best practices:
  - Use function parameters for defaults instead of the legacy `defaultProps` pattern
  - Keep dependencies updated to avoid deprecation warnings 
  - For third-party library warnings, consider updating to newer versions when available
  - Implement wrapper components when needed to adapt older libraries to current React patterns
- **Debugging Data Visualization Issues**: When troubleshooting data visualization problems:
  - Add logging at key data transformation points between backend and frontend
  - Verify that fallback/placeholder data isn't being used accidentally when real data should be available
  - Check file paths and references to original data files, especially after processing steps
  - Test API endpoints directly (using tools like curl, Postman, or browser devtools) to isolate frontend vs backend issues

# Active Development Context

## Current Focus

We are currently working on **fixing API endpoint routing and file upload functionality** in the GHOSTLY+ Dashboard, specifically:

1. Resolving 502 Bad Gateway errors occurring when uploading C3D files
2. Aligning frontend API requests with backend endpoints
3. Configuring nginx properly to handle API requests
4. Ensuring all required backend dependencies for C3D processing are properly installed

## Recent Changes

### API Endpoint Restructuring (2025-05-24)
- Renamed router prefix from `/api/v1/ghostly` to `/api/v1/c3d` for clearer domain separation
- Updated FastAPI tag from "GHOSTLY EMG" to "C3D Processing" to accurately reflect purpose
- Modified `/health` endpoint to be `/api/health` for consistent access through nginx
- Fixed duplicate `/api` prefixes in frontend API client requests that were causing path mismatches
- Updated nginx configuration to properly handle both `/api/` and `/v1/` routes

### Backend Dependency Management (2025-05-24)
- Added required Python dependencies for C3D processing:
  - `numpy` for numerical operations
  - `pandas` for data manipulation
  - `ezc3d` for C3D file processing
  - `matplotlib` for visualization
  - `scipy` for signal processing
- Modified Dockerfile to include necessary build dependencies (cmake, build-essential) for ezc3d
- Added system dependencies for runtime support of scientific libraries

### Nginx Configuration Refinement (2025-05-24)
- Added proper location block for `/v1/` paths to proxy to backend
- Removed problematic rewrite rule that was stripping `/api` prefix
- Increased timeouts for file uploads to 300 seconds
- Ensured consistent routing for all API endpoints

## Active Decisions & Considerations

### API Path Structure
- **Decision**: Use `/v1/c3d/*` for C3D-specific processing endpoints and `/api/health` for generic system endpoints
- **Rationale**: This provides clearer domain separation while maintaining backwards compatibility with existing integrations

### Backend Dependencies
- **Challenge**: Complex dependencies like ezc3d require C++ compilation and system libraries
- **Approach**: Added proper build environment in Docker with cmake and build tools
- **Consideration**: May need to investigate alternative C3D processing approaches if library compilation continues to cause issues

### Docker Build Process
- **Issue**: Docker build issues with ezc3d compilation 
- **Next step**: Consider using multi-stage Docker build to separate compilation environment from runtime
- **Alternative**: Investigate pre-built wheels or alternative C3D processing libraries

## Next Steps

1. **Resolve ezc3d compilation issues** in Docker build
   - Investigate Docker multi-stage builds
   - Consider pre-built wheels or alternative libraries
   - Ensure proper system libraries are available at runtime

2. **Complete frontend-backend integration testing**
   - Test C3D file upload with real files
   - Verify proper error handling for invalid files
   - Ensure response data format matches frontend expectations

3. **Update related frontend components**
   - Ensure consistent API path usage across all components
   - Add proper loading and error states for file uploads
   - Update visualization components to handle processed C3D data

4. **Document API changes**
   - Update API documentation with new endpoint structure
   - Document required payload formats and response structures
   - Add example requests and responses

## Learnings & Project Insights

- **API Path Consistency**: The importance of consistent API path structures between frontend, nginx configuration, and backend routes
- **Docker Multi-Stage Builds**: For complex scientific Python libraries, multi-stage builds can separate compilation environments from runtime
- **Dependency Management**: Scientific Python libraries often require careful management of system dependencies beyond what Poetry installs
- **Nginx Configuration**: Subtle differences in location blocks (e.g., `/api` vs `/api/`) can have significant impacts on request routing 