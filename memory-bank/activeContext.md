---
description: Tracks the current work focus, recent changes, next steps, active decisions, and key learnings for the GHOSTLY+ Dashboard project.
---

# GHOSTLY+ Dashboard: Active Context

## Current Status: Phase 3 (Auth Implementation) - React Frontend

- **Date**: 2025-05-17
- **Focus**: Implementing core features in a consolidated React frontend with Vite. Setting up testing infrastructure.
- **Recent Changes**:
    - **Frontend Consolidation**: Completed major frontend reorganization:
        - Removed the temporary `frontend-2` Next.js directory completely
        - Cleaned up Vue components from `frontend` directory
        - Implemented unified React with Vite frontend in the single `frontend` directory
        - Created organized folder structure by feature (auth, dashboard, patients, etc.)
        - Set up UI component library with Shadcn UI for React
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
- **Docker & NGINX Configuration (as of 2025-05-09):**
    - Aligned main `docker-compose.yml` for NGINX proxying:
        - Added `supabase_network` to the `nginx` service to enable communication with `supabase-kong`.
        - Updated `frontend` service's `VITE_API_BASE_URL` to `http://localhost/api` to route API calls through NGINX.
    - Verified `nginx/conf.d/default.conf` correctly proxies to frontend (`/`), backend (`/api`), and Supabase services (`/auth/v1`, `/rest/v1`, etc.).
- **Supabase Services Optimization (as of 2025-05-09):**
    - Reviewed services in `supabase_config/docker-compose.yml` for local development.
    - Commented out the following Supabase services as they are not currently used: `realtime`, `functions`, `imgproxy`, `analytics`, and `vector`.
    - Essential services remain active: `studio`, `kong`, `auth`, `rest`, `storage`, `db`, `meta`, and `supavisor`.
- **Active Decisions**:
    - **Frontend Framework:** React with Vite is now the primary frontend, in a single consolidated directory.
        - **Rationale Summary**: Chosen for its lighter footprint, better alignment with project complexity and team skillset, and improved maintainability with a single codebase.
    - **Backend Strategy:** Hybrid approach. Use Next.js server features for standard web backend logic. Use Supabase Edge Functions for privileged operations/transformations. Use a separate FastAPI service *later* for advanced Python analytics. *(See [systemPatterns.md](mdc:memory-bank/systemPatterns.md#5-backend-implementation-strategy-when-to-use-what) for detailed guidance on choosing the correct implementation location).*
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

## Next Steps (Today)

1.  Continue development on the React admin page (`/admin`).
    -   Create the Supabase Edge Function (`get-all-users`) to securely fetch user data (potentially pseudonymized).
    -   Implement the frontend page to call the function and display users (likely using Shadcn Table).
2.  Review and potentially update other documentation (`README.md`, `docs/prd.md`, etc.) to reflect the framework change where necessary.
3.  Commit Memory Bank updates.

## Important Patterns & Preferences (Emerging)

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

# Active Development Context

## Current Focus: Quadriceps-Focused Visualization Components

We're currently focused on refining visualization components to better align with the clinical trial's focus on quadriceps muscle training and measurement. This addresses a key gap in the initial implementation which wasn't sufficiently targeted toward the specific muscles being studied.

## Recent Changes

1. **EMG Visualization Component**
   - Updated to focus specifically on quadriceps muscles
   - Added support for comparing data between treatment groups (Ghostly, Ghostly+BFR, Control)
   - Implemented visualization for different training protocols (standard, cluster set 1, cluster set 2)
   - Added recording of training compliance metrics

2. **Muscle Heatmap Component**
   - Redesigned to focus on quadriceps muscle regions (vastus lateralis, vastus medialis, rectus femoris)
   - Added visualization of key metrics:
     - Muscle strength (MicroFET dynamometer)
     - Cross-sectional area (ultrasound measurements)
     - Pennation angle (ultrasound measurements)
     - Echo intensity (ultrasound measurements)
   - Created side-by-side comparison between left and right legs

3. **Session Analysis Page**
   - Updated to integrate the new quadriceps-focused components
   - Added filters for patient population (stroke, elderly, COVID-19/ICU)
   - Added comparison views for treatment groups
   - Implemented 2-week vs. 6-week progress tracking

## Active Decisions

1. **Visual Design for Quadriceps Measurements**
   - Decision: Use color-coded heatmaps to represent different quadriceps metrics (strength, CSA, pennation, echo)
   - Reasoning: Provides intuitive visual representation of complex muscle data
   - Status: Implemented in muscle-heatmap.tsx

2. **Treatment Group Comparison**
   - Decision: Add treatment group filters to visualization components
   - Reasoning: Clinical trial compares three treatment approaches (Ghostly, Ghostly+BFR, Leaflet)
   - Status: Partially implemented, needs refinement

3. **Time-Series Analysis Approach**
   - Decision: Focus on baseline, 2-week, and 6-week comparison views
   - Reasoning: These are the primary measurement timepoints in the clinical trial
   - Status: Implemented in session analysis page

4. **Population-Specific Assessment Integration**
   - Decision: Create separate visualization panels for population-specific metrics
   - Reasoning: Each population uses different assessment tools (Motricity Index, sit-to-stand, manual testing)
   - Status: Planned, not yet implemented

## Next Steps

1. **Implement population-specific assessment visualizations**
   - Create specialized components for Motricity Index (stroke patients)
   - Create specialized components for 30-second sit-to-stand test (elderly patients)
   - Create specialized components for manual muscle testing (COVID-19/ICU patients)

2. **Add statistical analysis visualization**
   - Integrate ANOVA results visualization
   - Add significance indicators to treatment group comparisons
   - Create visual summary of Tukey post-hoc test results

3. **Develop USE questionnaire analysis dashboard**
   - Visualize user experience metrics from the modified USE questionnaire
   - Create component to display percentage distribution of questionnaire items
   - Build visualization for subscale mean scores

4. **Enhance session metrics analysis**
   - Add therapy compliance visualization (sessions completed vs. prescribed)
   - Add therapy compliance visualization (training load vs. prescribed load)
   - Create rep counting visualization for exercise adherence

## Current Challenges

1. **Complex Data Visualization**
   - Challenge: Effectively displaying multiple quadriceps metrics in an intuitive way
   - Approach: Using tabbed interfaces and color-coding to separate different measurement types

2. **Treatment Group Comparison**
   - Challenge: Creating meaningful visual comparisons between the three treatment approaches
   - Approach: Using side-by-side bars/charts with clear labeling and statistical indicators

3. **Multiple Patient Populations**
   - Challenge: Supporting different assessment tools for each population
   - Approach: Building flexible components that adapt based on patient population type

4. **Temporal Data Analysis**
   - Challenge: Clearly showing progress across baseline, 2-week, and 6-week measurements
   - Approach: Consistent timeline visualization with clear markers for each measurement point

## Learnings & Project Insights

1. **Clinical Focus Alignment**
   - Learning: Visualization components must align precisely with the clinical measurements
   - Insight: Regular consultation with clinical stakeholders is essential to ensure relevance

2. **Treatment Protocol Visualization**
   - Learning: Different training protocols (standard vs. cluster sets) need clear visual differentiation
   - Insight: Use consistent visual language to represent rest periods, sets, and repetitions

3. **Population-Specific Requirements**
   - Learning: Each patient population has unique assessment tools and baselines
   - Insight: Dashboard must adapt dynamically to the specific population being viewed

4. **Measurement Integration**
   - Learning: Various measurement tools (MicroFET, ultrasound, etc.) produce different data formats
   - Insight: Create a standardized data model that can accommodate all measurement types

## Current Blockers
- ~~Supabase authentication through Nginx proxy (needs fixing)~~ RESOLVED
- **Shadcn UI Vue component styling** with Tailwind 4 (Task #27 created to address)
- Realtime update implementation for patient metrics

## Performance Considerations
- Minimize API calls to Supabase by caching where appropriate
- Optimize image uploads and storage for patient uploads
- Use connection pooling for database connections
- Ensure styled components are optimized for performance

## Security Considerations
- Ensuring secure handling of patient data
- Proper RBAC implementation
- Regular security reviews of data access patterns
- Sanitizing user inputs to prevent injection attacks 