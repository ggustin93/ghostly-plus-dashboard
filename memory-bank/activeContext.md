---
description: Tracks the current work focus, recent changes, next steps, active decisions, and key learnings for the GHOSTLY+ Dashboard project.
---

# GHOSTLY+ Dashboard: Active Context

## Current Status: Phase 3 (Auth Implementation) - Frontend Debugging

- **Date**: 2025-05-09 (Updated)
- **Focus**: Finalizing authentication flow; custom fetch implementation created to resolve header conflicts.
- **Recent Changes**:
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
    - Using Poetry for backend Python dependency management.
    - Using Vite for frontend (Vue.js 3 + TypeScript + Tailwind CSS v4 + shadcn/ui + Pinia).
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

1.  Test the custom authentication implementation after Docker restart:
    - Verify login works with the new custom fetch approach
    - Inspect network requests to confirm proper headers are being sent
    - Document the final working solution in detail
2.  Integrate `UpdatePasswordPage.vue` into the Vue router.
3.  Continue with remaining aspects of Task 3 (Authentication and Authorization System).
4.  Update technical documentation to reflect the authentication architecture decisions.

## Important Patterns & Preferences (Emerging)

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

## Current Focus
- Fixed Supabase authentication issue with Nginx proxy
- Setup of authentication and authorization system with Supabase
- Implementing test harness features
- Preparing initial researcher portal functionality

## Recent Changes
- **Authentication Fix (May 9, 2025)**: Resolved an issue with Supabase authentication through Nginx proxy. Key fixes included:
  - Simplified Nginx configuration for `/auth/v1/` endpoints
  - Ensured proper header passthrough from frontend to Supabase Kong
  - Fixed environment variables in frontend
  - Detailed documentation added at `docs/supabase-auth-fix.md`

- **Dashboard Design**: Working on UI/UX for patient monitoring dashboard
- **Data Structures**: Implemented preliminary data structures for patient tracking
- **API Integration**: Connected frontend components with backend API endpoints

## Next Steps
- Finish implementing core authentication flows (registration, password reset)
- Set up role-based access control using Supabase policies
- Complete researcher portal basic features
- Implement data visualization components

## Critical Decisions & Considerations
- **Authentication Strategy**: Using Supabase Auth for all authentication needs
  - Signups disabled - admin will register therapists and researchers
  - Authentication must pass through Nginx proxy (now working)
  - Auth tokens stored in browser local storage

- **Architecture**: 
  - Vue.js frontend with Pinia state management
  - FastAPI backend for custom business logic
  - Supabase for authentication and data storage
  - Docker Compose for local development

- **Component Design**: 
  - Using ShadCN for UI components
  - Custom theming based on Ghostly brand colors
  - Mobile-first responsive design

## Patterns & Standards
- Consistent error handling pattern between frontend and backend
- API endpoint structure `/api/{version}/{resource}/{id?}/{action?}`
- Protected routes require JWT validation
- Progressive enhancement for offline functionality

## Current Blockers
- ~~Supabase authentication through Nginx proxy (needs fixing)~~ RESOLVED
- Realtime update implementation for patient metrics

## Performance Considerations
- Minimize API calls to Supabase by caching where appropriate
- Optimize image uploads and storage for patient uploads
- Use connection pooling for database connections

## Security Considerations
- Ensuring secure handling of patient data
- Proper RBAC implementation
- Regular security reviews of data access patterns
- Sanitizing user inputs to prevent injection attacks 