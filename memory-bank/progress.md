---
description: Tracks what works, what's left to build, current status, known issues, and the evolution of project decisions for the GHOSTLY+ Dashboard.
source_documents: [[docs/00_PROJECT_DEFINITION/ressources/data_management_plan.md](mdc:docs/00_PROJECT_DEFINITION/ressources/data_management_plan.md)]
---

# GHOSTLY+ Dashboard: Project Progress

## What Works:

### Infrastructure and Setup:
1. ✅ **Complete project scaffolding** with Docker, Poetry (backend), Vite/React/TypeScript (frontend), Supabase, and NGINX reverse proxy.
2. ✅ **Local development environment** via Docker Compose with hot-reloading for frontend and backend.
3. ✅ **Local Supabase instance** running on Docker (M1-compatible) with required services (database, auth, storage, etc.).
4. ✅ **NGINX configuration** properly proxying requests to frontend, backend, and Supabase services.
5. ✅ **Storage buckets** created in Supabase for different data categories (c3d-files, avatars, reports, temp-...).
6. ✅ **Auth API verification** with successful backend authentication via direct API requests (`curl`).
7. ✅ **Authentication system now working properly** (as of May 9, 2025)
  - Supabase authentication through Nginx proxy resolved
  - Custom fetch implementation in authStore bypasses Supabase client header issues
  - Simplified Nginx configuration for auth endpoints
  - Detailed documentation added in `docs/supabase-auth-fix.md`
8. ✅ **API endpoint restructuring** for C3D file processing (as of May 24, 2025)
  - Renamed API router prefix from `/api/v1/ghostly` to `/api/v1/c3d` for clarity
  - Added proper nginx configuration for both `/api/` and `/v1/` paths
  - Fixed frontend API client to use correct paths without duplicate `/api` prefixes
  - Added health endpoint at `/api/health` for system monitoring
9. ✅ **Improved Nginx configuration** for file uploads (as of May 24, 2025)
  - Used variables for upstream services with appropriate names
  - Disabled IPv6 in resolver configuration
  - Added detailed error handling for troubleshooting
  - Enabled larger request body size for file uploads
  - Fixed 502 Bad Gateway errors with proper resolver variables

### Features and Components (React with Vite):
1. ✅ **Consolidated frontend architecture**:
   - Single `frontend` directory with clean React + Vite implementation
   - Structured organization by feature (auth, dashboard, patients, etc.)
   - Complete removal of legacy Vue components and temporary Next.js code
2. ✅ **UI Component Library**:
   - Shadcn UI for React components configured
   - Complete set of UI primitives available
   - Feature-specific components organized by domain
3. ✅ **Auth Features**:
   - Authentication UI components created using shadcn/ui components
   - Auth Context API for authentication state management
   - Login Page with redirection logic
   - Account Page displaying basic user info and logout
   - Protected routes redirecting based on auth status
4. ✅ **Routing**:
   - React Router configured for client-side routing
   - Route protection based on authentication status
   - Organized route definitions
5. ✅ **API Client Integration**:
   - Centralized API client in `lib/api.ts`
   - Proper endpoint structure for C3D file uploads and processing
   - Error handling and type definitions
6. 🔄 **C3D File Processing & EMG Analysis**:
   - Created API service (`api.ts`) with TypeScript interfaces for C3D and EMG data
   - Implemented `C3DUpload` component for file uploads with processing options
   - Developed `EMGAnalysisDisplay` component for visualization of analysis results
   - Added `C3DUploadCard` dashboard component for quick access
   - Integrated with routes for `/sessions/upload` and `/patients/:patientId/upload`
   - Added upload buttons to sessions list and patient profile pages
   - ⚠️ EMG waveform visualization API implemented but currently displays placeholder data instead of actual C3D data
7. ✅ **Patient Profile UI Enhancements (`PatientProfile.tsx`, `ClinicalAssessments.tsx`)**:
    -   `PatientProfile.tsx` tabs updated to "Sessions", "Clinical Assessments", "Notes"; "Overview" removed.
    -   `ClinicalAssessments.tsx` component created and iteratively developed (category list -> card view -> table view with mock data).
    -   Table view now shows "Category" (badge), "Measure", "Last Assessed"; "Last Value" removed.
    -   Mock data (`mockPatientAssessments`) populates the table, filtered to show only measures with data.
    -   Tab styling in `PatientProfile.tsx` updated to match dashboard, including icons.
    -   Linter warnings and unused imports addressed.
8. ✅ **Patient Progress Tracking Charts (`ProgressTrackingCharts.tsx`)**:
    -   Redefined and clarified key metrics: "Adherence", "Game Performance Score" (formerly Compliance), and added "Perceived Exertion (RPE)".
    -   Updated the `Patient` data model (`types/patient.ts`) and mock data (`data/patients-data.ts`) to support these new metrics.
    -   Completely redesigned the charts for a more professional and informative look, using a reusable `ChartCard` component.
    -   Charts now include icons, descriptions, and reference lines for context.
    -   The patient list view is now populated with `adherence` and `progress` data.

*(Previous Vue and Next.js components have been completely removed)*

### Documentation:
1. ✅ **Development workflow** documentation established.
2. ✅ **Environment setup guides** created for local CLI development and VM self-hosted Supabase.
3. ✅ **API and security configuration** documented in detail.
4. ✅ **Memory Bank** established for contextual documentation.
5. ✅ **Reorganized documentation structure** with numbered folders:
   - `00_PROJECT_DEFINITION`: Core requirements and scope
   - `01_ARCHITECTURE`: System design documentation
   - `02_SETUP_AND_DEVELOPMENT`: Developer onboarding and guides  
   - `03_GUIDES`: Role-specific how-to guides
6. ✅ **Testing documentation** created with MVP approach.

### Deployment:
1. ✅ **Production deployment strategy defined** (as of June 1, 2025)
   - Coolify selected as the preferred deployment platform for VUB VM
   - Docker Compose configuration confirmed compatible with Coolify
   - Documentation updated in `docs/02_SETUP_AND_DEVELOPMENT/prod_env_setup.md`
   - Local testing workflow established for pre-production validation
2. ✅ **Simplified environment management**
   - Web GUI for managing Docker containers without SSH
   - Centralized environment variable configuration
   - Streamlined backup and monitoring capabilities
   - Automatic SSL certificate management

### Testing:
1. ✅ **E2E testing setup** with Playwright configured.
2. ✅ **Basic authentication test** created to verify login flow.
3. ✅ **Backend unit test approach** established with FastAPI TestClient.
4. ✅ **Testing commands** added to package.json.

### Backend Development:
1. ✅ **Basic FastAPI structure** with proper router organization.
2. ✅ **C3D processing endpoint** created at `/v1/c3d/upload` for file processing.
3. ✅ **Health check endpoint** created at `/api/health` for system monitoring.
4. ✅ **Required Python dependencies** identified and added to pyproject.toml:
   - numpy, pandas, ezc3d, matplotlib, scipy for C3D processing
   - FastAPI, uvicorn, python-multipart for API handling

## What's Left to Build (Dashboard Focus, Supporting GHOSTLY+ Proposal WPs):

**IMPORTANT NOTE ON DEVELOPMENT ALIGNMENT WITH DATA MANAGEMENT PLAN (DMP):** All features outlined below, especially those involving any aspect of data handling (collection, input, storage, processing, visualization, security, retention, and export), **MUST** be developed in strict alignment with the **[Data Management Plan (data_management_plan.md)](mdc:docs/00_PROJECT_DEFINITION/ressources/data_management_plan.md)**. This includes adhering to the specified clinical variables, primary/secondary outcomes, data types, ethical guidelines (consent, pseudonymization), security protocols, and the defined roles for data systems (Supabase as operational DB; REDCap for eCRF/clinical trial master data/archive; Pixiu for long-term research data archive; SharePoint for documents). The DMP is the guiding document for these aspects.

### Phase 3: Authentication and Authorization System (Supporting WP2, WP3, WP4, WP5 - aligns with `UX_UI_specifications.md` Admin persona A1-A2)
1. ✅ Implement basic email/password login (Done in consolidated React frontend).
2. ✅ Implement session management (Done via Supabase client/Context).
3. ⏳ Integrate password reset functionality (Requires UI form and potentially Supabase Edge Function/backend logic - **A2**).
4. ⏳ Add user registration functionality (Likely admin-initiated or specific form for new study personnel - **A1, A2**).
5. ⏳ Set up role-based access control (RBAC) - Requires defining roles (Therapist, Researcher, Admin in `User` table) and checking them in frontend/backend - **A1**.
6. ⏳ Develop admin interface for user management (user listing, role assignment, (de)activation - **A1, A2**).

### Phase 4: Therapist Persona - Core Functionalities (Aligns with `UX_UI_specifications.md` Section 4.1 - T1-T5)
1.  **T1: Personalized Dashboard & Patient List:**
    *   ⏳ Display assigned patient list with key identifiers (e.g., pseudo-ID, study group).
    *   ⏳ Show alerts for overdue tasks or critical patient updates.
    *   ⏳ List upcoming Rehabilitation Sessions.
2.  **T2: Patient Profile & Clinical Data Management:**
    *   ⏳ Interface to view/manage detailed patient profiles (`Patient` table: demographics, medical history, consent status).
    *   ⏳ Forms for inputting/tracking clinical assessment data (`ClinicalAssessment`, `ClinicalOutcomeMeasure` tables) at T0, T1, T2, including:
        *   Core GHOSTLY+ measures (e.g., muscle strength via **handheld dynamometer**, functional tests like **FAC, 30s STS**, as detailed in specs and `data_management_plan.md`).
        *   Optional/Further measures (e.g., muscle morphology via **ultrasound**, body comp, QoL, **cognitive function via MMSE**, as per `data_management_plan.md`, if deemed necessary by research team for dashboard input).
    *   ⏳ Interface for managing MVC calibration data (`MVCCalibration` table).
3.  **T3: Rehabilitation & Game Session Management & Monitoring:**
    *   ⏳ Interface to schedule/log/manage Rehabilitation Sessions (`RehabilitationSession` table).
    *   ⏳ For each Rehab Session, manage one or more Game Sessions (`GameSession` table), including:
        *   Configuration of game parameters (level from `GameLevel`, DDA review - `dda_parameters_snapshot` in `GameSession`).
        *   BFR protocol application details (`bfr_applied` in `GameSession`).
        *   sEMG sensor selection (`sensor_type_used` in `GameSession`).
    *   ⏳ Review detailed analysis of individual Game Sessions:
        *   Visualizations of EMG data (raw from C3D, processed).
        *   Display of key sEMG-derived metrics (`EMGCalculatedMetric` table from `EMGMetricDefinition` - RMS, MAV/MAD, fatigue indices, etc., as per WP2.3).
        *   Display of game performance statistics (`GamePlayStatistic` table - duration, intensity, activation points, etc., as per WP2.3).
4.  **T4: Session Configuration (BFR & Game Setup):**
    *   ⏳ Detailed UI for configuring BFR settings (AOP, LOP determination support, target pressure).
    *   ⏳ UI for configuring GHOSTLY+ game parameters (e.g., selecting levels from `GameLevel`, adjusting difficulty if DDA is not fully auto, reviewing DDA settings).
    *   ⏳ Interface for initiating and logging MVC calibration procedures (`MVCCalibration` table).
5.  **T5: Clinical Documentation & Reporting (MVP focus on GHOSTLY+ specific):**
    *   ⏳ Interface to add/edit/view clinical notes for Rehab/Game Sessions (`overall_notes` in `RehabilitationSession`).
    *   ⏳ Generate GHOSTLY+ specific progress reports (MVP) summarizing sEMG/game metrics from `EMGCalculatedMetric`/`GamePlayStatistic` and core clinical outcomes from `ClinicalOutcomeMeasure`, referencing WP2.3 data.
    *   ⏳ (Non-MVP/Further) Broader clinical progress reports for export (e.g., formatted for easy import into **REDCap** or for clinical records, as per `data_management_plan.md` requirements).

### Phase 5: Researcher Persona - Core Functionalities (Aligns with `UX_UI_specifications.md` Section 4.2 - R1-R3)
1.  **R1: Study Dashboard & Oversight:**
    *   ⏳ Display study-wide dashboard: patient counts per site (`HospitalSite` links), recruitment/retention metrics.
    *   ⏳ Overview of adherence/compliance based on `GamePlayStatistic` and `RehabilitationSession` (WP2.3 data).
    *   ⏳ Data quality monitoring (e.g., missing assessments from `ClinicalAssessment`).
2.  **R2: Data Exploration & Analysis:**
    *   ⏳ Interface for pseudonymized data exploration: `Patient`, `ClinicalAssessment`, `ClinicalOutcomeMeasure` (including all primary/secondary outcomes like **dynamometry, ultrasound CSA, FAC, STS, MMSE**), `RehabilitationSession`, `GameSession`, `EMGCalculatedMetric`, `GamePlayStatistic`, `MVCCalibration` data.
    *   ⏳ Tools for cohort comparisons (Intervention vs. Control - `study_group` in `Patient` table).
    *   ⏳ Visualization of outcome changes over time (longitudinal data from assessments and sessions).
    *   ⏳ Analysis of DDA parameter usage (`dda_parameters_snapshot` in `GameSession`).
3.  **R3: Data Export & Reporting:**
    *   ⏳ Robust export functionality for pseudonymized datasets (CSV, SPSS/**REDCap compatible formats**), including all WP2 data and clinical measures (`EMGCalculatedMetric`, `GamePlayStatistic`, `ClinicalOutcomeMeasure`, etc., ensuring all relevant data types from `data_management_plan.md` are covered).

### Phase 6: Administrator Persona - Core Functionalities (Aligns with `UX_UI_specifications.md` Section 4.3 - A1-A4)
1.  **A1: User & Access Management:**
    *   ⏳ Manage user accounts (`User` table - create, edit, (de)activate).
    *   ⏳ Assign roles (Therapist, Researcher, Admin to `User.role`).
    *   ⏳ Assign patients (`Patient` table) to therapists (`Therapist` table).
    *   ⏳ Manage site access if necessary (`HospitalSite` table).
2.  **A2: System Configuration & Maintenance:**
    *   ⏳ Manage study parameters (e.g., site details in `HospitalSite`, potentially game level definitions in `GameLevel` if not hardcoded).
    *   ⏳ View audit logs (requires logging mechanism).
    *   ⏳ Manage `EMGMetricDefinition` if extensible.
3.  **A3: Data Integrity & Management:**
    *   ⏳ Monitor data quality and completeness (e.g., orphaned records, missing C3D file links in `GameSession.c3d_file_storage_path`).
    *   ⏳ Oversee data backup/restore procedures (Supabase managed mostly, but admin needs awareness of DMP specified procedures including **manual encrypted HDD backups** and roles of **Pixiu, REDCap, SharePoint** for overall data security and archiving).
    *   ⏳ Manage data export configurations for REDCap/other systems.
4.  **A4: System Health & Monitoring:**
    *   ⏳ Dashboard for system performance (DB connections, API response times, storage usage from Supabase Storage).
    *   ⏳ Error log monitoring.

### Phase 7: Backend sEMG Processing & Game Data Integration (Supporting WP2, WP3)
1. ✅ Create API (FastAPI) for C3D file processing (Basic endpoint created at `/v1/c3d/upload` - `GameSession.c3d_file_storage_path` is key).
2. ✅ Implement file upload functionality (Frontend API client created with TypeScript interfaces).
3. ⏳ **Implement detailed sEMG-derived metrics calculation in backend ([WP2_proposal_detailed.md](mdc:docs/00_PROJECT_DEFINITION/ressources/WP2_proposal_detailed.md) Task 2.3, WP5):** As per proposal (fatigue indicators, strength/force estimations, mass estimations) and store in `EMGCalculatedMetric` table, linking to `GameSession` and `EMGMetricDefinition`, ensuring these support analysis of outcomes specified in `data_management_plan.md`.
4. ⏳ **Process and store detailed game statistics (WP2.3)** from game logs/C3D into `GamePlayStatistic` table, linking to `GameSession` and `GameLevel`, ensuring these support analysis of outcomes specified in `data_management_plan.md`.
5. ⏳ **Log DDA parameters (WP2.4)** used during a `GameSession` into `GameSession.dda_parameters_snapshot`.
6. ⏳ Establish API endpoints for game to send detailed logs if C3D is insufficient for all WP2.3/WP2.4 data.
7. ⏳ Ensure backend processing can handle data from different sensor types if integrated per WP2.2 (`GameSession.sensor_type_used`).

### Phase 8: Advanced Features & Refinements (Post-MVP)
1. 🔄 Implement advanced data export options (custom queries, scheduled reports).
2. 🔄 Develop therapist annotation tools for EMG/game data.
3. 🔄 Implement more sophisticated patient progress tracking visualizations (longitudinal trends, comparative views).
4. 🔄 Implement features for multi-site data segregation/tagging if needed (`Patient.hospital_id`, `Therapist.hospital_id`).

### Phase 9: Testing and Optimization
1. 🔄 Set up comprehensive automated testing framework (unit, integration, E2E for all personas and features T1-T5, R1-R3, A1-A4).
2. 🔄 Perform security audit (OWASP Top 10, data handling).
3. 🔄 Optimize performance for large datasets and concurrent users.
4. 🔄 Conduct user acceptance testing with actual Therapists, Researchers, and Admins.

### Phase 10: Deployment and Documentation (Supporting WP6 - Utilisation)
1. ✅ Define production deployment strategy using Coolify on VUB private VM.
2. 🔄 Configure Coolify project for GHOSTLY+ Dashboard and Supabase deployment.
3. 🔄 Prepare detailed user and administrator documentation for all features (T1-T5, R1-R3, A1-A4), including GHOSTLY+ protocol specifics for therapists.
4. 🔄 Develop maintenance procedures based on Coolify's GUI-based management.

## Project Status & Progress Notes:

### Task 1: Project Setup and Repository Configuration
- ✅ **COMPLETED**
- Created repository structure with appropriate .gitignore, LICENSE, and README.
- Set up Docker configuration for development environment.
- Configured Poetry for backend dependency management.
- Established frontend project with Vue 3, TypeScript, and Vite.
- Set up Supabase for local development.
- Configured NGINX as reverse proxy.
- Updated ESLint to v9 with flat config structure.
- Applied proper formatting with Prettier (frontend) and Ruff (backend).

### Task 2: Local Development Environment
- ✅ **COMPLETED**
- ✅ Subtask 2.1: **COMPLETED** - Set up local development environment
- ✅ Subtask 2.2: **COMPLETED** - Deploy local Supabase services
- ✅ Subtask 2.3: **COMPLETED** - Configure local API and security
  - Successfully configured CORS for Supabase services
  - Created storage buckets for different data types
  - Resolved M1 Mac compatibility issues
  - Established proper JWT configuration for secure authentication

### Task 3: Authentication and Authorization System (Frontend Focus)
- ⏳ **IN PROGRESS**
- ✅ Supabase authentication backend configured and tested.
- ✅ Basic login UI implemented (`AuthForm.tsx`).
- ✅ Auth Context API for state management.
- ✅ Login/Account pages with routing protection implemented.
- ✅ Resolved module resolution issues related to dependencies.
- ⏳ Next: Implement Admin page, RBAC, Password Reset, Registration (if applicable).

### Task 4: C3D File Processing API
- ✅ **COMPLETED**
- ✅ Created C3D processing endpoint at `/v1/c3d/upload`.
- ✅ Updated frontend API client to use correct endpoints.
- ✅ Added required Python dependencies to pyproject.toml.
- ✅ Added build dependencies to Dockerfile.
- ✅ Created TypeScript interfaces for C3D and EMG data.
- ✅ Implemented frontend components for file upload and analysis visualization.
- ✅ Added routing and integration with existing application.
- ✅ Fixed Nginx configuration to resolve 502 Bad Gateway errors.
- ⚠️ **Further work needed to implement detailed sEMG metrics calculation (WP2.3) and DDA data handling (WP2.4, WP2.5) in the backend, and corresponding frontend displays.**

## Known Issues:

1. **Docker Stability**: Occasional issues with Docker restarts, may require system reboot to resolve. *(Seems less frequent now?)*
2. **Backend Dependencies**: Issues with ezc3d compilation in Docker build process (Python C extension).
3. **Frontend**: Need to implement Role-Based Access Control (RBAC) checks for admin page.
4. **UI Component Styling**: *(Verify if Tailwind 4 / Shadcn UI issues from Vue project persist in Next.js/React setup. Assume resolved unless specified otherwise)*.
5. **EMG Waveform Visualization**: Waveform data visualization appears to be displaying placeholder/generated data instead of actual C3D file data. The `/api/v1/c3d/results/{result_id}/waveform` endpoint may need debugging to correctly extract and return real waveform data.

## Evolution of Project Decisions:

### C3D Processing API Structure:
- **Initial implementation**: API endpoints under `/api/v1/ghostly/upload`
- **Problem identified**: Mismatch between frontend API client paths and backend router prefix
- **Solution**: 
  - Renamed router prefix from `/api/v1/ghostly` to `/api/v1/c3d` for clearer domain separation
  - Removed duplicate `/api` prefixes in frontend API client
  - Added proper nginx location blocks for both `/api/` and `/v1/` paths
  - Created consistent API path structure across entire application

### Data Presentation in UX/UI Specifications (Therapist Persona):
- **Evolution**: The structure and numbering of data tables within the Therapist Persona section of `docs/00_PROJECT_DEFINITION/UX_UI_specifications.md` were refined.
- **Details**:
    - Key feature categories were logically reordered.
    - Data tables were renumbered sequentially (3.1.1 through 3.1.5) to align with the new feature order.
    - The former "Table 3.1.2: Intervention Adherence & Contextual Data" was removed, as its specific data points were deemed redundant or better integrated into other feature descriptions or general session notes, streamlining the documented data requirements.
    - Minor textual clarifications, like adding "- Main interface" to the Therapist persona overview, were incorporated.
- **Rationale**: To improve clarity, reduce redundancy, and ensure a more logical flow of information in the specifications guiding UI/UX development for the therapist interface.

### C3D Upload and EMG Analysis UI:
- **Initial implementation**: Basic file upload component with minimal options
- **Problem identified**: Need for more control over processing parameters and visualization options
- **Solution**:
  - Created dedicated `C3DUpload` component with advanced processing options
  - Developed separate `EMGAnalysisDisplay` component for visualization
  - Added dashboard card component for quick access
  - Implemented multiple access points (sessions page, patient page)
  - Designed for extensibility with different muscle groups

### Backend Dependency Management:
- **Initial implementation**: Basic Python dependencies for FastAPI
- **Problem identified**: Missing scientific libraries for C3D processing
- **Solution**:
  - Added numpy, pandas, ezc3d, matplotlib, scipy to pyproject.toml
  - Added build-essential, cmake, gcc, g++ to Dockerfile for compilation
  - Working on multi-stage Docker build to separate compilation from runtime

### Nginx Configuration Improvements:
- **Initial implementation**: Basic proxying for frontend, backend, and Supabase services
- **Problem identified**: 502 Bad Gateway errors when accessing the application
- **Solution**:
  - Used variables for upstream services with appropriate names
  - Disabled IPv6 in resolver configuration
  - Added detailed error handling for troubleshooting
  - Enabled larger request body size for file uploads
  - Used resolver variables consistently throughout the config

### Supabase Authentication Approach:
- **Initial implementation**: Used standard Supabase client for authentication
- **Problem identified**: Duplicate authentication headers (Authorization and apikey) causing 401 errors
- **Attempted solutions**:
  1. ⚠️ **Direct connection**: Updating Supabase URL to connect directly to port 8000 (bypassing Nginx) - CORS issues
  2. ⚠️ **Nginx header management**: Configuring Nginx to strip Authorization header - Not effective with browser-generated requests
  3. ✅ **Custom fetch implementation**: Bypassing Supabase client's auth methods for complete header control - Implementation complete
- **Current approach**: Custom fetch-based login function in authStore that only sends apikey header

### UI Component Styling Approach:
- **Initial implementation**: Used Shadcn UI Vue components with default Tailwind 4 configuration
- **Problem identified**: Component variants (especially buttons) not being detected correctly, all appearing black
- **Planned solutions** (Task #27):
  1. Review Tailwind 4 and Shadcn UI Vue integration, focusing on theme configuration
  2. Update color handling from HSL to OKLCH format where needed
  3. Ensure proper data-slot attributes on component primitives
  4. Refactor component code to use latest recommended variant styling patterns
  5. Test extensively to ensure consistent styling across all components

### **Frontend Framework Choice:**
- **Initial Choice**: Vue.js (`frontend`) selected for reactivity and component model.
- **First Switch**: Next.js/React (`frontend-2`).
  - **Rationale**: 
    - Leverage the broader React ecosystem and component libraries (like Shadcn UI, which has robust React support).
    - Utilize Next.js's integrated full-stack capabilities, including App Router, Server Components, Route Handlers (API routes), and built-in optimizations.
    - Address challenges encountered with specific Vue component library integrations.
- **Current Choice (May 14, 2025)**: Standard React with Vite
  - **Rationale**:
    - Next.js proved overly complex for our dashboard needs
    - React with Vite offers a lighter, more appropriate solution for our primarily client-side dashboard
    - Better alignment with project complexity and team skillset
    - Improved development speed with Vite's fast build times
- **Frontend Consolidation (May 17, 2025)**: Single React with Vite implementation in `frontend` directory
  - **Rationale**:
    - Eliminate code duplication and confusion between multiple frontend implementations
    - Simplify maintenance with a single codebase
    - Create clear organization by feature to improve developer experience
    - Remove technical debt from legacy Vue components and temporary Next.js transition code

### **Testing Strategy Decision:**
- **Decision (May 14, 2025)**: Adopted a **minimal but effective testing approach**.
  - **Rationale**: 
    - E2E tests with Playwright for critical user flows (auth, data submission)
    - Backend unit tests with FastAPI TestClient for API validation
    - Simplified folder structure for maintainability
    - Focus on testing business-critical paths rather than exhaustive coverage

### **Backend Strategy Choice:**
- **Decision (May 17, 2025)**: Refined **Hybrid Backend Approach**.
  - **Rationale**: Utilize FastAPI for most backend services, Supabase Edge Functions for specific privileged/isolated tasks (like admin actions, transformations). Plan for a *separate* FastAPI service dedicated to future advanced Python analytics, keeping concerns separated.

## Project Decision Timeline:

### 2025-05-05
- Decided to use Docker Compose for local development environment
- Selected Poetry for backend dependency management
- Chose Vue 3 with TypeScript and Vite for frontend
- Adopted Supabase for authentication, database, and storage
- Implemented NGINX as reverse proxy
- Selected Apache 2.0 as placeholder license (pending TTO consultation)

### 2025-05-06
- Configured basic Docker containers (nginx, frontend, backend)
- Set up Supabase for local development environment
- Created NGINX configuration for proxying requests
- Established initial project structure

### 2025-05-07
- Documented local development environment setup
- Created storage buckets in Supabase
- Configured CORS for Supabase services
- Implemented first version of authentication

### 2025-05-08
- Created comprehensive API and security documentation
- Refined authentication implementation
- Reorganized documentation structure

### 2025-05-09
- Fixed authentication issues with custom fetch implementation
- Optimized Supabase services for local development
- Updated Docker and NGINX configuration for improved stability

### 2025-05-14
- Decided to switch to React with Vite (rather than Next.js)
- Adopted minimal but effective testing approach
- Refined backend strategy to hybrid approach

### 2025-05-17
- Consolidated frontend to single React with Vite implementation
- Organized frontend code by feature
- Set up testing infrastructure with Playwright and FastAPI TestClient

### 2025-05-24
- Implemented C3D file upload and EMG analysis components
- Created API client with TypeScript interfaces for C3D and EMG data
- Fixed Nginx configuration to resolve 502 Bad Gateway errors
- Improved API endpoint structure for C3D file processing

### 2025-06-01
- Selected Coolify as production deployment platform for VUB VM
- Updated production deployment documentation to include Coolify
- Documented local Coolify testing process for pre-production validation
- Simplified environment variable management through Coolify's web interface

## Next Actions:

1.  Create Supabase Edge Function (`get-all-users`) for admin page user fetching.
2.  Build `/admin` page in React to display users (using Shadcn Table).
3.  Implement RBAC check for accessing `/admin` page.
4.  Expand test coverage for critical user flows.
5.  Investigate and fix waveform data visualization issue - ensure the `/api/v1/c3d/results/{result_id}/waveform` endpoint returns real C3D file data instead of placeholder data.
6.  Continue with other pending tasks (Password Reset, Registration, Dashboard Layout).

---
**Last Updated**: 2025-05-24 

# Progress

## Current Status

The GHOSTLY+ dashboard development is progressing with a refined understanding of the clinical trial requirements. We've recently updated key visualization components to better align with the quadriceps muscle focus and the specific measurements used in the trial.

## What Works

1. **User Authentication**
   - Supabase Auth integration for secure login
   - Role-based permissions system (therapist, researcher, admin)
   - JWT token handling for secure API requests

2. **Patient Management**
   - Basic patient registration and profile creation
   - Treatment group assignment (Ghostly, Ghostly+BFR, Control)
   - Patient population categorization (stroke, elderly, COVID-19/ICU)

3. **EMG Visualization**
   - Real-time and recorded EMG signal display
   - Focus on quadriceps muscle groups
   - Filter controls for signal processing
   - Support for comparing left and right leg activation
   - Treatment group filtering

4. **Muscle Heatmap**
   - Quadriceps-focused visualization (vastus lateralis, vastus medialis, rectus femoris)
   - Support for multiple measurement types:
     - Muscle strength (MicroFET)
     - Cross-sectional area (ultrasound)
     - Pennation angle (ultrasound)
     - Echo intensity (ultrasound)
   - Side-by-side left/right leg comparison
   - Time-point comparison (baseline, 2-week, 6-week)

5. **Session Analysis**
   - Session recording and playback
   - Basic metrics calculation
   - Integration with updated visualization components
   - Session comparison features

## What's Left to Build

1. **Population-Specific Assessment Tools**
   - Visualization for Motricity Index (stroke patients)
   - Visualization for 30-second sit-to-stand test (elderly)
   - Visualization for manual muscle testing (COVID-19/ICU)

2. **Statistical Analysis Tools**
   - ANOVA result visualization
   - Tukey post-hoc test result display
   - Statistical significance indicators
   - SPSS export functionality

3. **Advanced Comparison Features**
   - Multi-patient comparison across treatment groups
   - Population-level analytics
   - Hospital/site filtering and comparison

4. **Reporting System**
   - PDF report generation
   - Custom report templates for different user roles
   - Batch reporting for research purposes

5. **USE Questionnaire Analysis**
   - Data collection interface for the modified USE questionnaire
   - Visualization of percentage distribution of items
   - Display of mean scores for subscales
   - Open question response collection and analysis

6. **Therapy Compliance Tracking**
   - Session attendance tracking (completed vs. prescribed)
   - Training load comparison (actual vs. prescribed)
   - Rep counting and validation
   - Compliance analytics and reporting

## Known Issues

1. **Visualization Components**
   - Muscle heatmap needs refinement for better accuracy of quadriceps regions
   - EMG visualization occasionally shows performance issues with large datasets
   - Treatment group comparison views need clearer visual differentiation

2. **Data Integration**
   - C3D file parsing needs optimization for larger files
   - Some ultrasound measurement formats not yet fully supported
   - MicroFET data integration requires additional validation

3. **User Interface**
   - Population-specific interfaces need more distinct visual indicators
   - Some complex analytics views are not yet optimized for mobile devices
   - USE questionnaire data entry form not yet implemented

## Evolution of Project Decisions

### Initial Focus vs. Current Direction

1. **Initial**: General muscle visualization for rehabilitation
   **Current**: Specific quadriceps muscle visualization with clinically relevant metrics

2. **Initial**: Generic patient management
   **Current**: Population-specific tracking with custom assessment tools

3. **Initial**: Basic EMG visualization
   **Current**: Advanced EMG analysis with training protocol markers

4. **Initial**: Single treatment approach
   **Current**: Three treatment arms comparison (Ghostly, Ghostly+BFR, Control)

5. **Initial**: Simple progress tracking
   **Current**: Time-point specific analysis (baseline, 2-week, 6-week)

### Recent Technical Decisions

1. **Decision**: Refactor visualization components to focus on quadriceps
   **Impact**: Better alignment with clinical trial focus, more relevant data visualization

2. **Decision**: Add treatment group filtering to all visualizations
   **Impact**: Enables direct comparison between the three study arms

3. **Decision**: Implement time-point specific views
   **Impact**: Clearer visualization of progress at the 2-week and 6-week measurement points

4. **Decision**: Create separate visualization types for different quadriceps measurements
   **Impact**: More accurate representation of the various clinical measurements

## Next Implementation Priorities

1. Complete the population-specific assessment visualizations
2. Implement the statistical analysis visualization components
3. Develop the USE questionnaire data collection and analysis features
4. Enhance the therapy compliance tracking system
5. Refine the muscle heatmap component for greater anatomical accuracy 

# Active Development Context

## Current Focus

We are currently working on **fixing API endpoint routing and file upload functionality** in the GHOSTLY+ Dashboard, specifically:

1. Resolving 502 Bad Gateway errors occurring when uploading C3D files
2. Aligning frontend API requests with backend endpoints
3. Configuring nginx properly to handle API requests
4. Ensuring all required backend dependencies for C3D processing are properly installed

We are also **refining the UI for the Patient Profile page, particularly the Clinical Assessments tab**, ensuring mock data is displayed correctly and styling is consistent.

## Recent Changes

### API Endpoint Restructuring (2025-05-24)
  - Renamed router prefix from `/api/v1/ghostly` to `/api/v1/c3d` for clearer domain separation
- Added system dependencies for runtime support of scientific libraries

### Nginx Configuration Refinement (2025-05-24)
- Added proper location block for `/v1/` paths to proxy to backend
- Ensured consistent routing for all API endpoints

### UI Enhancements for Patient Profile & Clinical Assessments (2025-05-26)
-   **`PatientProfile.tsx`**:
    -   Tabs modified to "Sessions", "Clinical Assessments", "Notes". "Overview" tab and its content (e.g., `EmgVisualization`, `TreatmentTimeline`) were removed.
    -   "Clinical Assessments" tab now uses the new `ClinicalAssessments` component instead of `TreatmentConfig`.
    -   "Edit Assessment" button in the "Clinical Assessments" tab header changed to "Manage Assessments" (subsequently updated to "Add Assessment" and "View Progress" buttons).
    -   Tab styling ( `TabsList` and `TabsTrigger` in `PatientProfile.tsx`) updated to align with the styling in `frontend/src/pages/dashboard/index.tsx`, including icons (`Calendar`, `FileEdit`, `FilePlus`).
    -   Removed unused imports like `PlusCircle`.
-   **`ClinicalAssessments.tsx`** (`frontend/src/components/patients/clinical-assessments.tsx`):
    -   Created as a new component.
    -   UI evolved from a simple list of assessment categories to a card-based layout, and finally to a table-based layout.
    -   The table displays columns for "Category" (using a colored `Badge` with a `Tooltip`), "Measure", and "Last Assessed". The "Last Value" column was removed.
    -   Mock data (`mockPatientAssessments`) was introduced and integrated to populate the table. The displayed data is filtered to only include measures for which mock data exists.
    -   Keys in `mockPatientAssessments` were corrected to use hyphens (e.g., `muscle-strength_0`) to match the dynamically generated measure IDs, resolving data display issues.
    -   The "Measure" column header is now left-aligned.
    -   Linter warnings (unused imports, `hasOwnProperty`) addressed.
    -   A message "No assessment data available." is shown if the filtered list of measures with mock data is empty.

## Active Decisions & Considerations

### API Path Structure
- **Date**: 2025-05-26
- **Focus**: Refining UI for Patient Profile, specifically the Clinical Assessments tab. Ongoing backend integration for EMG data.
- **Recent Changes**:
    - **UI Enhancements for `PatientProfile.tsx` and `ClinicalAssessments.tsx`**:
        -   In `PatientProfile.tsx`:
            -   Tabs updated to "Sessions", "Clinical Assessments", "Notes". "Overview" tab and its content (e.g., `EmgVisualization`, `TreatmentTimeline`) were removed.
            -   "Clinical Assessments" tab now uses the new `ClinicalAssessments` component instead of `TreatmentConfig`.
            -   "Edit Assessment" button in the "Clinical Assessments" tab header changed to "Manage Assessments" (subsequently updated to "Add Assessment" and "View Progress" buttons).
            -   Tab styling ( `TabsList` and `TabsTrigger` in `PatientProfile.tsx`) updated to align with the styling in `frontend/src/pages/dashboard/index.tsx`, including icons (`Calendar`, `FileEdit`, `FilePlus`).
        -   In `ClinicalAssessments.tsx`:
            -   Component created in `frontend/src/components/patients/clinical-assessments.tsx`.
            -   Initial implementation listed assessment categories.
            -   Iteratively improved UI:
                -   Card view with reduced padding and two-column grid for measures.
                -   Table view implemented with colored badges for categories (with tooltips), "Measure", "Last Value" (later removed), and "Last Assessed" columns.
                -   Mock data (`mockPatientAssessments`) added to populate the table, with logic to display data or "N/A".
                -   Corrected mock data keys to match generated measure IDs (hyphens vs. underscores).
                -   Filtered measures to display only those with mock data.
                -   "Last Value" column removed.
                -   "Measure" column header aligned to the left.
            -   Linter warnings (unused imports, `hasOwnProperty`) addressed.
    - **C3D Processing & EMG Analysis Components** (previous focus, largely stable):
        - Successfully fixed C3D file upload functionality by aligning API route prefixes
        - Fixed Docker configuration for ezc3d library dependencies using a single-stage build approach
        - Added system dependencies for runtime support of scientific libraries
        - Added proper location block for `/v1/` paths to proxy to backend
        - Ensured consistent routing for all API endpoints

### Nginx Configuration Refinement (2025-05-24)
- Added proper location block for `/v1/` paths to proxy to backend
- Ensured consistent routing for all API endpoints

### UI Enhancements for Patient Profile & Clinical Assessments (2025-05-26)
-   **`PatientProfile.tsx`**:
    -   Tabs modified to "Sessions", "Clinical Assessments", "Notes". "Overview" tab and its content (e.g., `EmgVisualization`, `TreatmentTimeline`) were removed.
    -   "Clinical Assessments" tab now uses the new `ClinicalAssessments` component instead of `TreatmentConfig`.
    -   "Edit Assessment" button in the "Clinical Assessments" tab header changed to "Manage Assessments" (subsequently updated to "Add Assessment" and "View Progress" buttons).
    -   Tab styling ( `TabsList` and `TabsTrigger` in `PatientProfile.tsx`) updated to align with the styling in `frontend/src/pages/dashboard/index.tsx`, including icons (`Calendar`, `FileEdit`, `FilePlus`).
-   **`ClinicalAssessments.tsx`** (`frontend/src/components/patients/clinical-assessments.tsx`):
    -   Created as a new component.
    -   UI evolved from a simple list of assessment categories to a card-based layout, and finally to a table-based layout.
    -   The table displays columns for "Category" (using a colored `Badge` with a `Tooltip`), "Measure", and "Last Assessed". The "Last Value" column was removed.
    -   Mock data (`mockPatientAssessments`) was introduced and integrated to populate the table. The displayed data is filtered to only include measures for which mock data exists.
    -   Keys in `mockPatientAssessments` were corrected to use hyphens (e.g., `muscle-strength_0`) to match the dynamically generated measure IDs, resolving data display issues.
    -   The "Measure" column header is now left-aligned.
    -   Linter warnings (unused imports, `hasOwnProperty`) addressed.
    -   A message "No assessment data available." is shown if the filtered list of measures with mock data is empty.

## Active Decisions & Considerations

### API Path Structure
- **Date**: 2025-05-26
- **Focus**: Refining UI for Patient Profile, specifically the Clinical Assessments tab. Ongoing backend integration for EMG data.
- **Recent Changes**:
    - **UI Enhancements for `PatientProfile.tsx` and `ClinicalAssessments.tsx`**:
        -   In `PatientProfile.tsx`:
            -   Tabs updated to "Sessions", "Clinical Assessments", "Notes". "Overview" tab and its content (e.g., `EmgVisualization`, `TreatmentTimeline`) were removed.
            -   "Clinical Assessments" tab now uses the new `ClinicalAssessments` component instead of `TreatmentConfig`.
            -   "Edit Assessment" button in the "Clinical Assessments" tab header changed to "Manage Assessments" (subsequently updated to "Add Assessment" and "View Progress" buttons).
            -   Tab styling ( `TabsList` and `TabsTrigger` in `PatientProfile.tsx`) updated to align with the styling in `frontend/src/pages/dashboard/index.tsx`, including icons (`Calendar`, `FileEdit`, `FilePlus`).
        -   In `ClinicalAssessments.tsx`:
            -   Component created in `frontend/src/components/patients/clinical-assessments.tsx`.
            -   Initial implementation listed assessment categories.
            -   Iteratively improved UI:
                -   Card view with reduced padding and two-column grid for measures.
                -   Table view implemented with colored badges for categories (with tooltips), "Measure", "Last Value" (later removed), and "Last Assessed" columns.
                -   Mock data (`mockPatientAssessments`) added to populate the table, with logic to display data or "N/A".
                -   Corrected mock data keys to match generated measure IDs (hyphens vs. underscores).
                -   Filtered measures to display only those with mock data.
                -   "Last Value" column removed.
                -   "Measure" column header aligned to the left.
            -   Linter warnings (unused imports, `hasOwnProperty`) addressed.
    - **C3D Processing & EMG Analysis Components** (previous focus, largely stable):
        - Successfully fixed C3D file upload functionality by aligning API route prefixes
        - Fixed Docker configuration for ezc3d library dependencies using a single-stage build approach
        - Added system dependencies for runtime support of scientific libraries
        - Added proper location block for `/v1/` paths to proxy to backend
        - Ensured consistent routing for all API endpoints

### Nginx Configuration Refinement (2025-05-24)
- Added proper location block for `/v1/` paths to proxy to backend
- Ensured consistent routing for all API endpoints

### UI Enhancements for Patient Profile & Clinical Assessments (2025-05-26)
-   **`PatientProfile.tsx`**:
    -   Tabs modified to "Sessions", "Clinical Assessments", "Notes". "Overview" tab and its content (e.g., `EmgVisualization`, `TreatmentTimeline`) were removed.
    -   "Clinical Assessments" tab now uses the new `ClinicalAssessments` component instead of `TreatmentConfig`.
    -   "Edit Assessment" button in the "Clinical Assessments" tab header changed to "Manage Assessments" (subsequently updated to "Add Assessment" and "View Progress" buttons).
    -   Tab styling ( `TabsList` and `TabsTrigger` in `PatientProfile.tsx`) updated to align with the styling in `frontend/src/pages/dashboard/index.tsx`, including icons (`Calendar`, `FileEdit`, `FilePlus`).
-   **`ClinicalAssessments.tsx`** (`frontend/src/components/patients/clinical-assessments.tsx`):
    -   Created as a new component.
    -   UI evolved from a simple list of assessment categories to a card-based layout, and finally to a table-based layout.
    -   The table displays columns for "Category" (using a colored `Badge` with a `Tooltip`), "Measure", and "Last Assessed". The "Last Value" column was removed.
    -   Mock data (`mockPatientAssessments`) was introduced and integrated to populate the table. The displayed data is filtered to only include measures for which mock data exists.
    -   Keys in `mockPatientAssessments` were corrected to use hyphens (e.g., `muscle-strength_0`) to match the dynamically generated measure IDs, resolving data display issues.
    -   The "Measure" column header is now left-aligned.
    -   Linter warnings (unused imports, `hasOwnProperty`) addressed.
    -   A message "No assessment data available." is shown if the filtered list of measures with mock data is empty.

## Active Decisions & Considerations

### API Path Structure
- **Date**: 2025-05-26
- **Focus**: Refining UI for Patient Profile, specifically the Clinical Assessments tab. Ongoing backend integration for EMG data.
- **Recent Changes**:
    - **UI Enhancements for `PatientProfile.tsx` and `ClinicalAssessments.tsx`**:
        -   In `PatientProfile.tsx`:
            -   Tabs updated to "Sessions", "Clinical Assessments", "Notes". "Overview" tab and its content (e.g., `EmgVisualization`, `TreatmentTimeline`) were removed.
            -   "Clinical Assessments" tab now uses the new `ClinicalAssessments` component instead of `TreatmentConfig`.
            -   "Edit Assessment" button in the "Clinical Assessments" tab header changed to "Manage Assessments" (subsequently updated to "Add Assessment" and "View Progress" buttons).
            -   Tab styling ( `TabsList` and `TabsTrigger` in `PatientProfile.tsx`) updated to align with the styling in `frontend/src/pages/dashboard/index.tsx`, including icons (`Calendar`, `FileEdit`, `FilePlus`).
        -   In `ClinicalAssessments.tsx`:
            -   Component created in `frontend/src/components/patients/clinical-assessments.tsx`.
            -   Initial implementation listed assessment categories.
            -   Iteratively improved UI:
                -   Card view with reduced padding and two-column grid for measures.
                -   Table view implemented with colored badges for categories (with tooltips), "Measure", "Last Value" (later removed), and "Last Assessed" columns.
                -   Mock data (`mockPatientAssessments`) added to populate the table, with logic to display data or "N/A".
                -   Corrected mock data keys to match generated measure IDs (hyphens vs. underscores).
                -   Filtered measures to display only those with mock data.
                -   "Last Value" column removed.
                -   "Measure" column header aligned to the left.
            -   Linter warnings (unused imports, `hasOwnProperty`) addressed.
    - **C3D Processing & EMG Analysis Components** (previous focus, largely stable):
        - Successfully fixed C3D file upload functionality by aligning API route prefixes
        - Fixed Docker configuration for ezc3d library dependencies using a single-stage build approach
        - Added system dependencies for runtime support of scientific libraries
        - Added proper location block for `/v1/` paths to proxy to backend
        - Ensured consistent routing for all API endpoints

### Nginx Configuration Refinement (2025-05-24)
- Added proper location block for `/v1/` paths to proxy to backend
- Ensured consistent routing for all API endpoints

### UI Enhancements for Patient Profile & Clinical Assessments (2025-05-26)
-   **`PatientProfile.tsx`**:
    -   Tabs modified to "Sessions", "Clinical Assessments", "Notes". "Overview" tab and its content (e.g., `EmgVisualization`, `TreatmentTimeline`) were removed.
    -   "Clinical Assessments" tab now uses the new `ClinicalAssessments` component instead of `TreatmentConfig`.
    -   "Edit Assessment" button in the "Clinical Assessments" tab header changed to "Manage Assessments" (subsequently updated to "Add Assessment" and "View Progress" buttons).
    -   Tab styling ( `TabsList` and `TabsTrigger` in `PatientProfile.tsx`) updated to align with the styling in `frontend/src/pages/dashboard/index.tsx`, including icons (`Calendar`, `FileEdit`, `FilePlus`).
-   **`ClinicalAssessments.tsx`** (`frontend/src/components/patients/clinical-assessments.tsx`):
    -   Created as a new component.
    -   UI evolved from a simple list of assessment categories to a card-based layout, and finally to a table-based layout.
    -   The table displays columns for "Category" (using a colored `Badge` with a `Tooltip`), "Measure", and "Last Assessed". The "Last Value" column was removed.
    -   Mock data (`mockPatientAssessments`) was introduced and integrated to populate the table. The displayed data is filtered to only include measures for which mock data exists.
    -   Keys in `mockPatientAssessments` were corrected to use hyphens (e.g., `muscle-strength_0`) to match the dynamically generated measure IDs, resolving data display issues.
    -   The "Measure" column header is now left-aligned.
    -   Linter warnings (unused imports, `hasOwnProperty`) addressed.
    -   A message "No assessment data available." is shown if the filtered list of measures with mock data is empty.

## Active Decisions & Considerations

### API Path Structure
- **Date**: 2025-05-26
- **Focus**: Refining UI for Patient Profile, specifically the Clinical Assessments tab. Ongoing backend integration for EMG data.
- **Recent Changes**:
    - **UI Enhancements for `PatientProfile.tsx` and `ClinicalAssessments.tsx`**:
        -   In `PatientProfile.tsx`:
            -   Tabs updated to "Sessions", "Clinical Assessments", "Notes". "Overview" tab and its content (e.g., `EmgVisualization`, `TreatmentTimeline`) were removed.
            -   "Clinical Assessments" tab now uses the new `ClinicalAssessments` component instead of `TreatmentConfig`.
            -   "Edit Assessment" button in the "Clinical Assessments" tab header changed to "Manage Assessments" (subsequently updated to "Add Assessment" and "View Progress" buttons).
            -   Tab styling ( `TabsList` and `TabsTrigger` in `PatientProfile.tsx`) updated to align with the styling in `frontend/src/pages/dashboard/index.tsx`, including icons (`Calendar`, `FileEdit`, `FilePlus`).
        -   In `ClinicalAssessments.tsx`:
            -   Component created in `frontend/src/components/patients/clinical-assessments.tsx`.
            -   Initial implementation listed assessment categories.
            -   Iteratively improved UI:
                -   Card view with reduced padding and two-column grid for measures.
                -   Table view implemented with colored badges for categories (with tooltips), "Measure", "Last Value" (later removed), and "Last Assessed" columns.
                -   Mock data (`mockPatientAssessments`) added to populate the table, with logic to display data or "N/A".
                -   Corrected mock data keys to match generated measure IDs (hyphens vs. underscores).
                -   Filtered measures to display only those with mock data.
                -   "Last Value" column removed.
                -   "Measure" column header aligned to the left.
            -   Linter warnings (unused imports, `hasOwnProperty`) addressed.
    - **C3D Processing & EMG Analysis Components** (previous focus, largely stable):
        - Successfully fixed C3D file upload functionality by aligning API route prefixes
        - Fixed Docker configuration for ezc3d library dependencies using a single-stage build approach
        - Added system dependencies for runtime support of scientific libraries
        - Added proper location block for `/v1/` paths to proxy to backend
        - Ensured consistent routing for all API endpoints

### Nginx Configuration Refinement (2025-05-24)
- Added proper location block for `/v1/` paths to proxy to backend
- Ensured consistent routing for all API endpoints

### UI Enhancements for Patient Profile & Clinical Assessments (2025-05-26)
-   **`PatientProfile.tsx`**:
    -   Tabs modified to "Sessions", "Clinical Assessments", "Notes". "Overview" tab and its content (e.g., `EmgVisualization`, `TreatmentTimeline`) were removed.
    -   "Clinical Assessments" tab now uses the new `ClinicalAssessments` component instead of `TreatmentConfig`.
    -   "Edit Assessment" button in the "Clinical Assessments" tab header changed to "Manage Assessments" (subsequently updated to "Add Assessment" and "View Progress" buttons).
    -   Tab styling ( `TabsList` and `TabsTrigger` in `PatientProfile.tsx`) updated to align with the styling in `frontend/src/pages/dashboard/index.tsx`, including icons (`Calendar`, `FileEdit`, `FilePlus`).
-   **`ClinicalAssessments.tsx`** (`frontend/src/components/patients/clinical-assessments.tsx`):
    -   Created as a new component.
    -   UI evolved from a simple list of assessment categories to a card-based layout, and finally to a table-based layout.
    -   The table displays columns for "Category" (using a colored `Badge` with a `Tooltip`), "Measure", and "Last Assessed". The "Last Value" column was removed.
    -   Mock data (`mockPatientAssessments`) was introduced and integrated to populate the table. The displayed data is filtered to only include measures for which mock data exists.
    -   Keys in `mockPatientAssessments` were corrected to use hyphens (e.g., `muscle-strength_0`) to match the dynamically generated measure IDs, resolving data display issues.
    -   The "Measure" column header is now left-aligned.
    -   Linter warnings (unused imports, `hasOwnProperty`) addressed.
    -   A message "No assessment data available." is shown if the filtered list of measures with mock data is empty.

## Active Decisions & Considerations

### API Path Structure
- **Date**: 2025-05-26
- **Focus**: Refining UI for Patient Profile, specifically the Clinical Assessments tab. Ongoing backend integration for EMG data.
- **Recent Changes**:
    - **UI Enhancements for `PatientProfile.tsx` and `ClinicalAssessments.tsx`**:
        -   In `PatientProfile.tsx`:
            -   Tabs updated to "Sessions", "Clinical Assessments", "Notes". "Overview" tab and its content (e.g., `EmgVisualization`, `TreatmentTimeline`) were removed.
            -   "Clinical Assessments" tab now uses the new `ClinicalAssessments` component instead of `TreatmentConfig`.
            -   "Edit Assessment" button in the "Clinical Assessments" tab header changed to "Manage Assessments" (subsequently updated to "Add Assessment" and "View Progress" buttons).
            -   Tab styling ( `TabsList` and `TabsTrigger` in `PatientProfile.tsx`) updated to align with the styling in `frontend/src/pages/dashboard/index.tsx`, including icons (`Calendar`, `FileEdit`, `FilePlus`).
        -   In `ClinicalAssessments.tsx`:
            -   Component created in `frontend/src/components/patients/clinical-assessments.tsx`.
            -   Initial implementation listed assessment categories.
            -   Iteratively improved UI:
                -   Card view with reduced padding and two-column grid for measures.
                -   Table view implemented with colored badges for categories (with tooltips), "Measure", "Last Value" (later removed), and "Last Assessed" columns.
                -   Mock data (`mockPatientAssessments`) added to populate the table, with logic to display data or "N/A".
                -   Corrected mock data keys to match generated measure IDs (hyphens vs. underscores).
                -   Filtered measures to display only those with mock data.
                -   "Last Value" column removed.
                -   "Measure" column header aligned to the left.
            -   Linter warnings (unused imports, `hasOwnProperty`) addressed.
    - **C3D Processing & EMG Analysis Components** (previous focus, largely stable):
        - Successfully fixed C3D file upload functionality by aligning API route prefixes
        - Fixed Docker configuration for ezc3d library dependencies using a single-stage build approach
        - Added system dependencies for runtime support of scientific libraries
        - Added proper location block for `/v1/` paths to proxy to backend
        - Ensured consistent routing for all API endpoints

### Nginx Configuration Refinement (2025-05-24)
- Added proper location block for `/v1/` paths to proxy to backend
- Ensured consistent routing for all API endpoints

### UI Enhancements for Patient Profile & Clinical Assessments (2025-05-26)
-   **`PatientProfile.tsx`**:
    -   Tabs modified to "Sessions", "Clinical Assessments", "Notes". "Overview" tab and its content (e.g., `EmgVisualization`, `TreatmentTimeline`) were removed.
    -   "Clinical Assessments" tab now uses the new `ClinicalAssessments` component instead of `TreatmentConfig`.
    -   "Edit Assessment" button in the "Clinical Assessments" tab header changed to "Manage Assessments" (subsequently updated to "Add Assessment" and "View Progress" buttons).
    -   Tab styling ( `TabsList` and `TabsTrigger` in `PatientProfile.tsx`) updated to align with the styling in `frontend/src/pages/dashboard/index.tsx`, including icons (`Calendar`, `FileEdit`, `FilePlus`).
-   **`ClinicalAssessments.tsx`** (`frontend/src/components/patients/clinical-assessments.tsx`):
    -   Created as a new component.
    -   UI evolved from a simple list of assessment categories to a card-based layout, and finally to a table-based layout.
    -   The table displays columns for "Category" (using a colored `Badge` with a `Tooltip`), "Measure", and "Last Assessed". The "Last Value" column was removed.
    -   Mock data (`mockPatientAssessments`) was introduced and integrated to populate the table. The displayed data is filtered to only include measures for which mock data exists.
    -   Keys in `mockPatientAssessments` were corrected to use hyphens (e.g., `muscle-strength_0`) to match the dynamically generated measure IDs, resolving data display issues.
    -   The "Measure" column header is now left-aligned.
    -   Linter warnings (unused imports, `hasOwnProperty`) addressed.
    -   A message "No assessment data available." is shown if the filtered list of measures with mock data is empty.

## Active Decisions & Considerations

### API Path Structure
- **Date**: 2025-05-26
- **Focus**: Refining UI for Patient Profile, specifically the Clinical Assessments tab. Ongoing backend integration for EMG data.
- **Recent Changes**:
    - **UI Enhancements for `PatientProfile.tsx` and `ClinicalAssessments.tsx`**:
        -   In `PatientProfile.tsx`:
            -   Tabs updated to "Sessions", "Clinical Assessments", "Notes". "Overview" tab and its content (e.g., `EmgVisualization`, `TreatmentTimeline`) were removed.
            -   "Clinical Assessments" tab now uses the new `ClinicalAssessments` component instead of `TreatmentConfig`.
            -   "Edit Assessment" button in the "Clinical Assessments" tab header changed to "Manage Assessments" (subsequently updated to "Add Assessment" and "View Progress" buttons).
            -   Tab styling ( `TabsList` and `TabsTrigger` in `PatientProfile.tsx`) updated to align with the styling in `frontend/src/pages/dashboard/index.tsx`, including icons (`Calendar`, `FileEdit`, `FilePlus`).
        -   In `ClinicalAssessments.tsx`:
            -   Component created in `frontend/src/components/patients/clinical-assessments.tsx`.
            -   Initial implementation listed assessment categories.
            -   Iteratively improved UI:
                -   Card view with reduced padding and two-column grid for measures.
                -   Table view implemented with colored badges for categories (with tooltips), "Measure", "Last Value" (later removed), and "Last Assessed" columns.
                -   Mock data (`mockPatientAssessments`) added to populate the table, with logic to display data or "N/A".
                -   Corrected mock data keys to match generated measure IDs (hyphens vs. underscores).
                -   Filtered measures to display only those with mock data.
                -   "Last Value" column removed.
                -   "Measure" column header aligned to the left.
            -   Linter warnings (unused imports, `hasOwnProperty`) addressed.
    - **C3D Processing & EMG Analysis Components** (previous focus, largely stable):
        - Successfully fixed C3D file upload functionality by aligning API route prefixes
        - Fixed Docker configuration for ezc3d library dependencies using a single-stage build approach
        - Added system dependencies for runtime support of scientific libraries
        - Added proper location block for `/v1/` paths to proxy to backend
        - Ensured consistent routing for all API endpoints

### Nginx Configuration Refinement (2025-05-24)
- Added proper location block for `/v1/` paths to proxy to backend
- Ensured consistent routing for all API endpoints

### UI Enhancements for Patient Profile & Clinical Assessments (2025-05-26)
-   **`PatientProfile.tsx`**:
    -   Tabs modified to "Sessions", "Clinical Assessments", "Notes". "Overview" tab and its content (e.g., `EmgVisualization`, `TreatmentTimeline`) were removed.
    -   "Clinical Assessments" tab now uses the new `ClinicalAssessments` component instead of `TreatmentConfig`.
    -   "Edit Assessment" button in the "Clinical Assessments" tab header changed to "Manage Assessments" (subsequently updated to "Add Assessment" and "View Progress" buttons).
    -   Tab styling ( `TabsList` and `TabsTrigger` in `PatientProfile.tsx`) updated to align with the styling in `frontend/src/pages/dashboard/index.tsx`, including icons (`Calendar`, `FileEdit`, `FilePlus`).
-   **`ClinicalAssessments.tsx`** (`frontend/src/components/patients/clinical-assessments.tsx`):
    -   Created as a new component.
    -   UI evolved from a simple list of assessment categories to a card-based layout, and finally to a table-based layout.
    -   The table displays columns for "Category" (using a colored `Badge` with a `Tooltip`), "Measure", and "Last Assessed". The "Last Value" column was removed.
    -   Mock data (`mockPatientAssessments`) was introduced and integrated to populate the table. The displayed data is filtered to only include measures for which mock data exists.
    -   Keys in `mockPatientAssessments` were corrected to use hyphens (e.g., `muscle-strength_0`) to match the dynamically generated measure IDs, resolving data display issues.
    -   The "Measure" column header is now left-aligned.
    -   Linter warnings (unused imports, `hasOwnProperty`) addressed.
    -   A message "No assessment data available." is shown if the filtered list of measures with mock data is empty.

## Active Decisions & Considerations

### API Path Structure
- **Date**: 2025-05-26
- **Focus**: Refining UI for Patient Profile, specifically the Clinical Assessments tab. Ongoing backend integration for EMG data.
- **Recent Changes**:
    - **UI Enhancements for `PatientProfile.tsx` and `ClinicalAssessments.tsx`**:
        -   In `PatientProfile.tsx`:
            -   Tabs updated to "Sessions", "Clinical Assessments", "Notes". "Overview" tab and its content (e.g., `EmgVisualization`, `TreatmentTimeline`) were removed.
            -   "Clinical Assessments" tab now uses the new `ClinicalAssessments` component instead of `TreatmentConfig`.
            -   "Edit Assessment" button in the "Clinical Assessments" tab header changed to "Manage Assessments" (subsequently updated to "Add Assessment" and "View Progress" buttons).
            -   Tab styling ( `TabsList` and `TabsTrigger` in `PatientProfile.tsx`) updated to align with the styling in `frontend/src/pages/dashboard/index.tsx`, including icons (`Calendar`, `FileEdit`, `FilePlus`).
        -   In `ClinicalAssessments.tsx`:
            -   Component created in `frontend/src/components/patients/clinical-assessments.tsx`.
            -   Initial implementation listed assessment categories.
            -   Iteratively improved UI:
                -   Card view with reduced padding and two-column grid for measures.
                -   Table view implemented with colored badges for categories (with tooltips), "Measure", "Last Value" (later removed), and "Last Assessed" columns.
                -   Mock data (`mockPatientAssessments`) added to populate the table, with logic to display data or "N/A".
                -   Corrected mock data keys to match generated measure IDs (hyphens vs. underscores).
                -   Filtered measures to display only those with mock data.
                -   "Last Value" column removed.
                -   "Measure" column header aligned to the left.
            -   Linter warnings (unused imports, `hasOwnProperty`) addressed.
    - **C3D Processing & EMG Analysis Components** (previous focus, largely stable):
        - Successfully fixed C3D file upload functionality by aligning API route prefixes
        - Fixed Docker configuration for ezc3d library dependencies using a single-stage build approach
        - Added system dependencies for runtime support of scientific libraries
        - Added proper location block for `/v1/` paths to proxy to backend
        - Ensured consistent routing for all API endpoints

### Nginx Configuration Refinement (2025-05-24)
- Added proper location block for `/v1/` paths to proxy to backend
- Ensured consistent routing for all API endpoints

### UI Enhancements for Patient Profile & Clinical Assessments (2025-05-26)
-   **`PatientProfile.tsx`**:
    -   Tabs modified to "Sessions", "Clinical Assessments", "Notes". "Overview" tab and its content (e.g., `EmgVisualization`, `TreatmentTimeline`) were removed.
    -   "Clinical Assessments" tab now uses the new `ClinicalAssessments` component instead of `TreatmentConfig`.
    -   "Edit Assessment" button in the "Clinical Assessments" tab header changed to "Manage Assessments" (subsequently updated to "Add Assessment" and "View Progress" buttons).
    -   Tab styling ( `TabsList` and `TabsTrigger` in `PatientProfile.tsx`) updated to align with the styling in `frontend/src/pages/dashboard/index.tsx`, including icons (`Calendar`, `FileEdit`, `FilePlus`).
-   **`ClinicalAssessments.tsx`** (`frontend/src/components/patients/clinical-assessments.tsx`):
    -   Created as a new component.
    -   UI evolved from a simple list of assessment categories to a card-based layout, and finally to a table-based layout.
    -   The table displays columns for "Category" (using a colored `Badge` with a `Tooltip`), "Measure", and "Last Assessed". The "Last Value" column was removed.
    -   Mock data (`mockPatientAssessments`) was introduced and integrated to populate the table. The displayed data is filtered to only include measures for which mock data exists.
    -   Keys in `mockPatientAssessments` were corrected to use hyphens (e.g., `muscle-strength_0`) to match the dynamically generated measure IDs, resolving data display issues.
    -   The "Measure" column header is now left-aligned.
    -   Linter warnings (unused imports, `hasOwnProperty`) addressed.
    -   A message "No assessment data available." is shown if the filtered list of measures with mock data is empty.

## Active Decisions & Considerations

### API Path Structure
- **Date**: 2025-05-26
- **Focus**: Refining UI for Patient Profile, specifically the Clinical Assessments tab. Ongoing backend integration for EMG data.
- **Recent Changes**:
    - **UI Enhancements for `PatientProfile.tsx` and `ClinicalAssessments.tsx`**:
        -   In `PatientProfile.tsx`:
            -   Tabs updated to "Sessions", "Clinical Assessments", "Notes". "Overview" tab and its content (e.g., `EmgVisualization`, `TreatmentTimeline`) were removed.
            -   "Clinical Assessments" tab now uses the new `ClinicalAssessments` component instead of `TreatmentConfig`.
            -   "Edit Assessment" button in the "Clinical Assessments" tab header changed to "Manage Assessments" (subsequently updated to "Add Assessment" and "View Progress" buttons).
            -   Tab styling ( `TabsList` and `TabsTrigger` in `PatientProfile.tsx`) updated to align with the styling in `frontend/src/pages/dashboard/index.tsx`, including icons (`Calendar`, `FileEdit`, `FilePlus`).
        -   In `ClinicalAssessments.tsx`:
            -   Component created in `frontend/src/components/patients/clinical-assessments.tsx`.
            -   Initial implementation listed assessment categories.
            -   Iteratively improved UI:
                -   Card view with reduced padding and two-column grid for measures.
                -   Table view implemented with colored badges for categories (with tooltips), "Measure", "Last Value" (later removed), and "Last Assessed" columns.
                -   Mock data (`mockPatientAssessments`) added to populate the table, with logic to display data or "N/A".
                -   Corrected mock data keys to match generated measure IDs (hyphens vs. underscores).
                -   Filtered measures to display only those with mock data.
                -   "Last Value" column removed.
                -   "Measure" column header aligned to the left.
            -   Linter warnings (unused imports, `hasOwnProperty`) addressed.
    - **C3D Processing & EMG Analysis Components** (previous focus, largely stable):
        - Successfully fixed C3D file upload functionality by aligning API route prefixes
        - Fixed Docker configuration for ezc3d library dependencies using a single-stage build approach
        - Added system dependencies for runtime support of scientific libraries
        - Added proper location block for `/v1/` paths to proxy to backend
        - Ensured consistent routing for all API endpoints

### Nginx Configuration Refinement (2025-05-24)
- Added proper location block for `/v1/` paths to proxy to backend
- Ensured consistent routing for all API endpoints

### UI Enhancements for Patient Profile & Clinical Assessments (2025-05-26)
-   **`PatientProfile.tsx`**:
    -   Tabs modified to "Sessions", "Clinical Assessments", "Notes". "Overview" tab and its content (e.g., `EmgVisualization`, `TreatmentTimeline`) were removed.
    -   "Clinical Assessments" tab now uses the new `ClinicalAssessments` component instead of `TreatmentConfig`.
    -   "Edit Assessment" button in the "Clinical Assessments" tab header changed to "Manage Assessments" (subsequently updated to "Add Assessment" and "View Progress" buttons).
    -   Tab styling ( `TabsList` and `TabsTrigger` in `PatientProfile.tsx`) updated to align with the styling in `frontend/src/pages/dashboard/index.tsx`, including icons (`Calendar`, `FileEdit`, `FilePlus`).
-   **`ClinicalAssessments.tsx`** (`frontend/src/components/patients/clinical-assessments.tsx`):
    -   Created as a new component.
    -   UI evolved from a simple list of assessment categories to a card-based layout, and finally to a table-based layout.
    -   The table displays columns for "Category" (using a colored `Badge` with a `Tooltip`), "Measure", and "Last Assessed". The "Last Value" column was removed.
    -   Mock data (`mockPatientAssessments`) was introduced and integrated to populate the table. The displayed data is filtered to only include measures for which mock data exists.
    -   Keys in `mockPatientAssessments` were corrected to use hyphens (e.g., `muscle-strength_0`) to match the dynamically generated measure IDs, resolving data display issues.
    -   The "Measure" column header is now left-aligned.
    -   Linter warnings (unused imports, `hasOwnProperty`) addressed.
    -   A message "No assessment data available." is shown if the filtered list of measures with mock data is empty.

## Active Decisions & Considerations

### API Path Structure
- **Date**: 2025-05-26
- **Focus**: Refining UI for Patient Profile, specifically the Clinical Assessments tab. Ongoing backend integration for EMG data.
- **Recent Changes**:
    - **UI Enhancements for `PatientProfile.tsx` and `ClinicalAssessments.tsx`**:
        -   In `PatientProfile.tsx`:
            -   Tabs updated to "Sessions", "Clinical Assessments", "Notes". "Overview" tab and its content (e.g., `EmgVisualization`, `TreatmentTimeline`) were removed.
            -   "Clinical Assessments" tab now uses the new `ClinicalAssessments` component instead of `TreatmentConfig`.
            -   "Edit Assessment" button in the "Clinical Assessments" tab header changed to "Manage Assessments" (subsequently updated to "Add Assessment" and "View Progress" buttons).
            -   Tab styling ( `TabsList` and `TabsTrigger` in `PatientProfile.tsx`) updated to align with the styling in `frontend/src/pages/dashboard/index.tsx`, including icons (`Calendar`, `FileEdit`, `FilePlus`).
        -   In `ClinicalAssessments.tsx`:
            -   Component created in `frontend/src/components/patients/clinical-assessments.tsx`.
            -   Initial implementation listed assessment categories.
            -   Iteratively improved UI:
                -   Card view with reduced padding and two-column grid for measures.
                -   Table view implemented with colored badges for categories (with tooltips), "Measure", "Last Value" (later removed), and "Last Assessed" columns.
                -   Mock data (`mockPatientAssessments`) added to populate the table, with logic to display data or "N/A".
                -   Corrected mock data keys to match generated measure IDs (hyphens vs. underscores).
                -   Filtered measures to display only those with mock data.
                -   "Last Value" column removed.
                -   "Measure" column header aligned to the left.
            -   Linter warnings (unused imports, `hasOwnProperty`) addressed.
    - **C3D Processing & EMG Analysis Components** (previous focus, largely stable):
        - Successfully fixed C3D file upload functionality by aligning API route prefixes
        - Fixed Docker configuration for ezc3d library dependencies using a single-stage build approach
        - Added system dependencies for runtime support of scientific libraries
        - Added proper location block for `/v1/` paths to proxy to backend
        - Ensured consistent routing for all API endpoints

### Nginx Configuration Refinement (2025-05-24)
- Added proper location block for `/v1/` paths to proxy to backend
- Ensured consistent routing for all API endpoints

### UI Enhancements for Patient Profile & Clinical Assessments (2025-05-26)
-   **`PatientProfile.tsx`**:
    -   Tabs modified to "Sessions", "Clinical Assessments", "Notes". "Overview" tab and its content (e.g., `EmgVisualization`, `TreatmentTimeline`) were removed.
    -   "Clinical Assessments" tab now uses the new `ClinicalAssessments` component instead of `TreatmentConfig`.
    -   "Edit Assessment" button in the "Clinical Assessments" tab header changed to "Manage Assessments" (subsequently updated to "Add Assessment" and "View Progress" buttons).
    -   Tab styling ( `TabsList` and `TabsTrigger` in `PatientProfile.tsx`) updated to align with the styling in `frontend/src/pages/dashboard/index.tsx`, including icons (`Calendar`, `FileEdit`, `FilePlus`).
-   **`ClinicalAssessments.tsx`** (`frontend/src/components/patients/clinical-assessments.tsx`):
    -   Created as a new component.
    -   UI evolved from a simple list of assessment categories to a card-based layout, and finally to a table-based layout.
    -   The table displays columns for "Category" (using a colored `Badge` with a `Tooltip`), "Measure", and "Last Assessed". The "Last Value" column was removed.
    -   Mock data (`mockPatientAssessments`) was introduced and integrated to populate the table. The displayed data is filtered to only include measures for which mock data exists.
    -   Keys in `mockPatientAssessments` were corrected to use hyphens (e.g., `muscle-strength_0`) to match the dynamically generated measure IDs, resolving data display issues.
    -   The "Measure" column header is now left-aligned.
    -   Linter warnings (unused imports, `hasOwnProperty`) addressed.
    -   A message "No assessment data available." is shown if the filtered list of measures with mock data is empty.

## Active Decisions & Considerations

### API Path Structure
- **Date**: 2025-05-26
- **Focus**: Refining UI for Patient Profile, specifically the Clinical Assessments tab. Ongoing backend integration for EMG data.
- **Recent Changes**:
    - **UI Enhancements for `PatientProfile.tsx` and `ClinicalAssessments.tsx`**:
        -   In `PatientProfile.tsx`:
            -   Tabs updated to "Sessions", "Clinical Assessments", "Notes". "Overview" tab and its content (e.g., `EmgVisualization`, `TreatmentTimeline`) were removed.
            -   "Clinical Assessments" tab now uses the new `ClinicalAssessments` component instead of `TreatmentConfig`.
            -   "Edit Assessment" button in the "Clinical Assessments" tab header changed to "Manage Assessments" (subsequently updated to "Add Assessment" and "View Progress" buttons).
            -   Tab styling ( `TabsList` and `TabsTrigger` in `PatientProfile.tsx`) updated to align with the styling in `frontend/src/pages/dashboard/index.tsx`, including icons (`Calendar`, `FileEdit`, `FilePlus`).
        -   In `ClinicalAssessments.tsx`:
            -   Component created in `frontend/src/components/patients/clinical-assessments.tsx`.
            -   Initial implementation listed assessment categories.
            -   Iteratively improved UI:
                -   Card view with reduced padding and two-column grid for measures.
                -   Table view implemented with colored badges for categories (with tooltips), "Measure", "Last Value" (later removed), and "Last Assessed" columns.
                -   Mock data (`mockPatientAssessments`) added to populate the table, with logic to display data or "N/A".
                -   Corrected mock data keys to match generated measure IDs (hyphens vs. underscores).
                -   Filtered measures to display only those with mock data.
                -   "Last Value" column removed.
                -   "Measure" column header aligned to the left.
            -   Linter warnings (unused imports, `hasOwnProperty`) addressed.
    - **C3D Processing & EMG Analysis Components** (previous focus, largely stable):
        - Successfully fixed C3D file upload functionality by aligning API route prefixes
        - Fixed Docker configuration for ezc3d library dependencies using a single-stage build approach
        - Added system dependencies for runtime support of scientific libraries
        - Added proper location block for `/v1/` paths to proxy to backend
        - Ensured consistent routing for all API endpoints

### Nginx Configuration Refinement (2025-05-24)
- Added proper location block for `/v1/` paths to proxy to backend
- Ensured consistent routing for all API endpoints

### UI Enhancements for Patient Profile & Clinical Assessments (2025-05-26)
-   **`PatientProfile.tsx`**:
    -   Tabs modified to "Sessions", "Clinical Assessments", "Notes". "Overview" tab and its content (e.g., `EmgVisualization`, `TreatmentTimeline`) were removed.
    -   "Clinical Assessments" tab now uses the new `ClinicalAssessments` component instead of `TreatmentConfig`.
    -   "Edit Assessment" button in the "Clinical Assessments" tab header changed to "Manage Assessments" (subsequently updated to "Add Assessment" and "View Progress" buttons).
    -   Tab styling ( `TabsList` and `TabsTrigger` in `PatientProfile.tsx`) updated to align with the styling in `frontend/src/pages/dashboard/index.tsx`, including icons (`Calendar`, `FileEdit`, `FilePlus`).
-   **`ClinicalAssessments.tsx`** (`frontend/src/components/patients/clinical-assessments.tsx`):
    -   Created as a new component.
    -   UI evolved from a simple list of assessment categories to a card-based layout, and finally to a table-based layout.
    -   The table displays columns for "Category" (using a colored `Badge` with a `Tooltip`), "Measure", and "Last Assessed". The "Last Value" column was removed.
    -   Mock data (`mockPatientAssessments`) was introduced and integrated to populate the table. The displayed data is filtered to only include measures for which mock data exists.
    -   Keys in `mockPatientAssessments` were corrected to use hyphens (e.g., `muscle-strength_0`) to match the dynamically generated measure IDs, resolving data display issues.
    -   The "Measure" column header is now left-aligned.
    -   Linter warnings (unused imports, `hasOwnProperty`) addressed.
    -   A message "No assessment data available." is shown if the filtered list of measures with mock data is empty.

## Active Decisions & Considerations

### API Path Structure
- **Date**: 2025-05-26
- **Focus**: Refining UI for Patient Profile, specifically the Clinical Assessments tab. Ongoing backend integration for EMG data.
- **Recent Changes**:
    - **UI Enhancements for `PatientProfile.tsx` and `ClinicalAssessments.tsx`**:
        -   In `PatientProfile.tsx`:
            -   Tabs updated to "Sessions", "Clinical Assessments", "Notes". "Overview" tab and its content (e.g., `EmgVisualization`, `TreatmentTimeline`) were removed.
            -   "Clinical Assessments" tab now uses the new `ClinicalAssessments` component instead of `TreatmentConfig`.
            -   "Edit Assessment" button in the "Clinical Assessments" tab header changed to "Manage Assessments" (subsequently updated to "Add Assessment" and "View Progress" buttons).
            -   Tab styling ( `TabsList` and `TabsTrigger` in `PatientProfile.tsx`) updated to align with the styling in `frontend/src/pages/dashboard/index.tsx`, including icons (`Calendar`, `FileEdit`, `FilePlus`).
        -   In `ClinicalAssessments.tsx`:
            -   Component created in `frontend/src/components/patients/clinical-assessments.tsx`.
            -   Initial implementation listed assessment categories.
            -   Iteratively improved UI:
                -   Card view with reduced padding and two-column grid for measures.
                -   Table view implemented with colored badges for categories (with tooltips), "Measure", "Last Value" (later removed), and "Last Assessed" columns.
                -   Mock data (`mockPatientAssessments`) added to populate the table, with logic to display data or "N/A".
                -   Corrected mock data keys to match generated measure IDs (hyphens vs. underscores).
                -   Filtered measures to display only those with mock data.
                -   "Last Value" column removed.
                -   "Measure" column header aligned to the left.
            -   Linter warnings (unused imports, `hasOwnProperty`) addressed.
    - **C3D Processing & EMG Analysis Components** (previous focus, largely stable):
        - Successfully fixed C3D file upload functionality by aligning API route prefixes
        - Fixed Docker configuration for ezc3d library dependencies using a single-stage build approach
        - Added system dependencies for runtime support of scientific libraries
        - Added proper location block for `/v1/` paths to proxy to backend
        - Ensured consistent routing for all API endpoints

### Nginx Configuration Refinement (2025-05-24)
- Added proper location block for `/v1/` paths to proxy to backend
- Ensured consistent routing for all API endpoints

### UI Enhancements for Patient Profile & Clinical Assessments (2025-05-26)
-   **`PatientProfile.tsx`**:
    -   Tabs modified to "Sessions", "Clinical Assessments", "Notes". "Overview" tab and its content (e.g., `EmgVisualization`, `TreatmentTimeline`) were removed.
    -   "Clinical Assessments" tab now uses the new `ClinicalAssessments` component instead of `TreatmentConfig`.
    -   "Edit Assessment" button in the "Clinical Assessments" tab header changed to "Manage Assessments" (subsequently updated to "Add Assessment" and "View Progress" buttons).
    -   Tab styling ( `TabsList` and `TabsTrigger` in `PatientProfile.tsx`) updated to align with the styling in `frontend/src/pages/dashboard/index.tsx`, including icons (`Calendar`, `FileEdit`, `FilePlus`).
-   **`ClinicalAssessments.tsx`** (`frontend/src/components/patients/clinical-assessments.tsx`):
    -   Created as a new component.
    -   UI evolved from a simple list of assessment categories to a card-based layout, and finally to a table-based layout.
    -   The table displays columns for "Category" (using a colored `Badge` with a `Tooltip`), "Measure", and "Last Assessed". The "Last Value" column was removed.
    -   Mock data (`mockPatientAssessments`) was introduced and integrated to populate the table. The displayed data is filtered to only include measures for which mock data exists.
    -   Keys in `mockPatientAssessments` were corrected to use hyphens (e.g., `muscle-strength_0`) to match the dynamically generated measure IDs, resolving data display issues.
    -   The "Measure" column header is now left-aligned.
    -   Linter warnings (unused imports, `hasOwnProperty`) addressed.
    -   A message "No assessment data available." is shown if the filtered list of measures with mock data is empty.

## Active Decisions & Considerations

### API Path Structure
- **Date**: 2025-05-26
- **Focus**: Refining UI for Patient Profile, specifically the Clinical Assessments tab. Ongoing backend integration for EMG data.
- **Recent Changes**:
    - **UI Enhancements for `PatientProfile.tsx` and `ClinicalAssessments.tsx`**:
        -   In `PatientProfile.tsx`:
            -   Tabs updated to "Sessions", "Clinical Assessments", "Notes". "Overview" tab and its content (e.g., `EmgVisualization`, `TreatmentTimeline`) were removed.
            -   "Clinical Assessments" tab now uses the new `ClinicalAssessments` component instead of `TreatmentConfig`.
            -   "Edit Assessment" button in the "Clinical Assessments" tab header changed to "Manage Assessments" (subsequently updated to "Add Assessment" and "View Progress" buttons).
            -   Tab styling ( `TabsList` and `TabsTrigger` in `PatientProfile.tsx`) updated to align with the styling in `frontend/src/pages/dashboard/index.tsx`, including icons (`Calendar`, `FileEdit`, `FilePlus`).
        -   In `ClinicalAssessments.tsx`:
            -   Component created in `frontend/src/components/patients/clinical-assessments.tsx`.
            -   Initial implementation listed assessment categories.
            -   Iteratively improved UI:
                -   Card view with reduced padding and two-column grid for measures.
                -   Table view implemented with colored badges for categories (with tooltips), "Measure", "Last Value" (later removed), and "Last Assessed" columns.
                -   Mock data (`mockPatientAssessments`) added to populate the table, with logic to display data or "N/A".
                -   Corrected mock data keys to match generated measure IDs (hyphens vs. underscores).
                -   Filtered measures to display only those with mock data.
                -   "Last Value" column removed.
                -   "Measure" column header aligned to the left.
            -   Linter warnings (unused imports, `hasOwnProperty`) addressed.
    - **C3D Processing & EMG Analysis Components** (previous focus, largely stable):
        - Successfully fixed C3D file upload functionality by aligning API route prefixes
        - Fixed Docker configuration for ezc3d library dependencies using a single-stage build approach
        - Added system dependencies for runtime support of scientific libraries
        - Added proper location block for `/v1/` paths to proxy to backend
        - Ensured consistent routing for all API endpoints

### Nginx Configuration Refinement (2025-05-24)
- Added proper location block for `/v1/` paths to proxy to backend
- Ensured consistent routing for all API endpoints

### UI Enhancements for Patient Profile & Clinical Assessments (2025-05-26)
-   **`PatientProfile.tsx`**:
    -   Tabs modified to "Sessions", "Clinical Assessments", "Notes". "Overview" tab and its content (e.g., `EmgVisualization`, `TreatmentTimeline`) were removed.
    -   "Clinical Assessments" tab now uses the new `ClinicalAssessments` component instead of `TreatmentConfig`.
    -   "Edit Assessment" button in the "Clinical Assessments" tab header changed to "Manage Assessments" (subsequently updated to "Add Assessment" and "View Progress" buttons).
    -   Tab styling ( `TabsList` and `TabsTrigger` in `PatientProfile.tsx`) updated to align with the styling in `frontend/src/pages/dashboard/index.tsx`, including icons (`Calendar`, `FileEdit`, `FilePlus`).
-   **`ClinicalAssessments.tsx`** (`frontend/src/components/patients/clinical-assessments.tsx`):
    -   Created as a new component.
    -   UI evolved from a simple list of assessment categories to a card-based layout, and finally to a table-based layout.
    -   The table displays columns for "Category" (using a colored `Badge` with a `Tooltip`), "Measure", and "Last Assessed". The "Last Value" column was removed.
    -   Mock data (`mockPatientAssessments`) was introduced and integrated to populate the table. The displayed data is filtered to only include measures for which mock data exists.
    -   Keys in `mockPatientAssessments` were corrected to use hyphens (e.g., `muscle-strength_0`) to match the dynamically generated measure IDs, resolving data display issues.
    -   The "Measure" column header is now left-aligned.
    -   Linter warnings (unused imports, `hasOwnProperty`) addressed.
    -   A message "No assessment data available." is shown if the filtered list of measures with mock data is empty.

## Active Decisions & Considerations

### API Path Structure
- **Date**: 2025-05-26
- **Focus**: Refining UI for Patient Profile, specifically the Clinical Assessments tab. Ongoing backend integration for EMG data.
- **Recent Changes**:
    - **UI Enhancements for `PatientProfile.tsx` and `ClinicalAssessments.tsx`**:
        -   In `PatientProfile.tsx`:
            -   Tabs updated to "Sessions", "Clinical Assessments", "Notes". "Overview" tab and its content (e.g., `EmgVisualization`, `TreatmentTimeline`) were removed.
            -   "Clinical Assessments" tab now uses the new `ClinicalAssessments` component instead of `TreatmentConfig`.
            -   "Edit Assessment" button in the "Clinical Assessments" tab header changed to "Manage Assessments" (subsequently updated to "Add Assessment" and "View Progress" buttons).
            -   Tab styling ( `TabsList` and `TabsTrigger` in `PatientProfile.tsx`) updated to align with the styling in `frontend/src/pages/dashboard/index.tsx`, including icons (`Calendar`, `FileEdit`, `FilePlus`).
        -   In `ClinicalAssessments.tsx`:
            -   Component created in `frontend/src/components/patients/clinical-assessments.tsx`.
            -   Initial implementation listed assessment categories.
            -   Iteratively improved UI:
                -   Card view with reduced padding and two-column grid for measures.
                -   Table view implemented with colored badges for categories (with tooltips), "Measure", "Last Value" (later removed), and "Last Assessed" columns.
                -   Mock data (`mockPatientAssessments`) added to populate the table, with logic to display data or "N/A".
                -   Corrected mock data keys to match generated measure IDs (hyphens vs. underscores).
                -   Filtered measures to display only those with mock data.
                -   "Last Value" column removed.
                -   "Measure" column header aligned to the left.
            -   Linter warnings (unused imports, `hasOwnProperty`) addressed.
    - **C3D Processing & EMG Analysis Components** (previous focus, largely stable):
        - Successfully fixed C3D file upload functionality by aligning API route prefixes
        - Fixed Docker configuration for ezc3d library dependencies using a single-stage build approach
        - Added system dependencies for runtime support of scientific libraries
        - Added proper location block for `/v1/` paths to proxy to backend
        - Ensured consistent routing for all API endpoints

### Nginx Configuration Refinement (2025-05-24)
- Added proper location block for `/v1/` paths to proxy to backend
- Ensured consistent routing for all API endpoints

### UI Enhancements for Patient Profile & Clinical Assessments (2025-05-26)
-   **`PatientProfile.tsx`**:
    -   Tabs modified to "Sessions", "Clinical Assessments", "Notes". "Overview" tab and its content (e.g., `EmgVisualization`, `TreatmentTimeline`) were removed.
    -   "Clinical Assessments" tab now uses the new `ClinicalAssessments` component instead of `TreatmentConfig`.
    -   "Edit Assessment" button in the "Clinical Assessments" tab header changed to "Manage Assessments" (subsequently updated to "Add Assessment" and "View Progress" buttons).
    -   Tab styling ( `TabsList` and `TabsTrigger` in `PatientProfile.tsx`) updated to align with the styling in `frontend/src/pages/dashboard/index.tsx`, including icons (`Calendar`, `FileEdit`, `FilePlus`).
-   **`ClinicalAssessments.tsx`** (`frontend/src/components/patients/clinical-assessments.tsx`):
    -   Created as a new component.
    -   UI evolved from a simple list of assessment categories to a card-based layout, and finally to a table-based layout.
    -   The table displays columns for "Category" (using a colored `Badge` with a `Tooltip`), "Measure", and "Last Assessed". The "Last Value" column was removed.
    -   Mock data (`mockPatientAssessments`) was introduced and integrated to populate the table. The displayed data is filtered to only include measures for which mock data exists.
    -   Keys in `mockPatientAssessments` were corrected to use hyphens (e.g., `muscle-strength_0`) to match the dynamically generated measure IDs, resolving data display issues.
    -   The "Measure" column header is now left-aligned.
    -   Linter warnings (unused imports, `hasOwnProperty`) addressed.
    -   A message "No assessment data available." is shown if the filtered list of measures with mock data is empty.

## Active Decisions & Considerations

### API Path Structure
- **Date**: 2025-05-26
- **Focus**: Refining UI for Patient Profile, specifically the Clinical Assessments tab. Ongoing backend integration for EMG data.
- **Recent Changes**:
    - **UI Enhancements for `PatientProfile.tsx` and `ClinicalAssessments.tsx`**:
        -   In `PatientProfile.tsx`:
            -   Tabs updated to "Sessions", "Clinical Assessments", "Notes". "Overview" tab and its content (e.g., `EmgVisualization`, `TreatmentTimeline`) were removed.
            -   "Clinical Assessments" tab now uses the new `ClinicalAssessments` component instead of `TreatmentConfig`.
            -   "Edit Assessment" button in the "Clinical Assessments" tab header changed to "Manage Assessments" (subsequently updated to "Add Assessment" and "View Progress" buttons).
            -   Tab styling ( `TabsList` and `TabsTrigger` in `PatientProfile.tsx`) updated to align with the styling in `frontend/src/pages/dashboard/index.tsx`, including icons (`Calendar`, `FileEdit`, `FilePlus`).
        -   In `ClinicalAssessments.tsx`:
            -   Component created in `frontend/src/components/patients/clinical-assessments.tsx`.
            -   Initial implementation listed assessment categories.
            -   Iteratively improved UI:
                -   Card view with reduced padding and two-column grid for measures.
                -   Table view implemented with colored badges for categories (with tooltips), "Measure", "Last Value" (later removed), and "Last Assessed" columns.
                -   Mock data (`mockPatientAssessments`) added to populate the table, with logic to display data or "N/A".
                -   Corrected mock data keys to match generated measure IDs (hyphens vs. underscores).
                -   Filtered measures to display only those with mock data.
                -   "Last Value" column removed.
                -   "Measure" column header aligned to the left.
            -   Linter warnings (unused imports, `hasOwnProperty`) addressed.
    - **C3D Processing & EMG Analysis Components** (previous focus, largely stable):
        - Successfully fixed C3D file upload functionality by aligning API route prefixes
        - Fixed Docker configuration for ezc3d library dependencies using a single-stage build approach
        - Added system dependencies for runtime support of scientific libraries
        - Added proper location block for `/v1/` paths to proxy to backend
        - Ensured consistent routing for all API endpoints

### Nginx Configuration Refinement (2025-05-24)
- Added proper location block for `/v1/` paths to proxy to backend
- Ensured consistent routing for all API endpoints

### UI Enhancements for Patient Profile & Clinical Assessments (2025-05-26)
-   **`PatientProfile.tsx`**:
    -   Tabs modified to "Sessions", "Clinical Assessments", "Notes". "Overview" tab and its content (e.g., `EmgVisualization`, `TreatmentTimeline`) were removed.
    -   "Clinical Assessments" tab now uses the new `ClinicalAssessments` component instead of `TreatmentConfig`.
    -   "Edit Assessment" button in the "Clinical Assessments" tab header changed to "Manage Assessments" (subsequently updated to "Add Assessment" and "View Progress" buttons).
    -   Tab styling ( `TabsList` and `TabsTrigger` in `PatientProfile.tsx`) updated to align with the styling in `frontend/src/pages/dashboard/index.tsx`, including icons (`Calendar`, `FileEdit`, `FilePlus`).
-   **`ClinicalAssessments.tsx`** (`frontend/src/components/patients/clinical-assessments.tsx`):
    -   Created as a new component.
    -   UI evolved from a simple list of assessment categories to a card-based layout, and finally to a table-based layout.
    -   The table displays columns for "Category" (using a colored `Badge` with a `Tooltip`), "Measure", and "Last Assessed". The "Last Value" column was removed.
    -   Mock data (`mockPatientAssessments`) was introduced and integrated to populate the table. The displayed data is filtered to only include measures for which mock data exists.
    -   Keys in `mockPatientAssessments` were corrected to use hyphens (e.g., `muscle-strength_0`) to match the dynamically generated measure IDs, resolving data display issues.
    -   The "Measure" column header is now left-aligned.
    -   Linter warnings (unused imports, `hasOwnProperty`) addressed.
    -   A message "No assessment data available." is shown if the filtered list of measures with mock data is empty.

## Active Decisions & Considerations

### API Path Structure
- **Date**: 2025-05-26
- **Focus**: Refining UI for Patient Profile, specifically the Clinical Assessments tab. Ongoing backend integration for EMG data.
- **Recent Changes**:
    - **UI Enhancements for `PatientProfile.tsx` and `ClinicalAssessments.tsx`**:
        -   In `PatientProfile.tsx`:
            -   Tabs updated to "Sessions", "Clinical Assessments", "Notes". "Overview" tab and its content (e.g., `EmgVisualization`, `TreatmentTimeline`) were removed.
            -   "Clinical Assessments" tab now uses the new `ClinicalAssessments` component instead of `TreatmentConfig`.
            -   "Edit Assessment" button in the "Clinical Assessments" tab header changed to "Manage Assessments" (subsequently updated to "Add Assessment" and "View Progress" buttons).
            -   Tab styling ( `TabsList` and `TabsTrigger` in `PatientProfile.tsx`) updated to align with the styling in `frontend/src/pages/dashboard/index.tsx`, including icons (`Calendar`, `FileEdit`, `FilePlus`).
        -   In `ClinicalAssessments.tsx`:
            -   Component created in `frontend/src/components/patients/clinical-assessments.tsx`.
            -   Initial implementation listed assessment categories.
            -   Iteratively improved UI:
                -   Card view with reduced padding and two-column grid for measures.
                -   Table view implemented with colored badges for categories (with tooltips), "Measure", "Last Value" (later removed), and "Last Assessed" columns.
                -   Mock data (`mockPatientAssessments`) added to populate the table, with logic to display data or "N/A".
                -   Corrected mock data keys to match generated measure IDs (hyphens vs. underscores).
                -   Filtered measures to display only those with mock data.
                -   "Last Value" column removed.
                -   "Measure" column header aligned to the left.
            -   Linter warnings (unused imports, `hasOwnProperty`) addressed.
    - **C3D Processing & EMG Analysis Components** (previous focus, largely stable):
        - Successfully fixed C3D file upload functionality by aligning API route prefixes
        - Fixed Docker configuration for ezc3d library dependencies using a single-stage build approach
        - Added system dependencies for runtime support of scientific libraries
        - Added proper location block for `/v1/` paths to proxy to backend
        - Ensured consistent routing for all API endpoints

### Nginx Configuration Refinement (2025-05-24)
- Added proper location block for `/v1/` paths to proxy to backend
- Ensured consistent routing for all API endpoints

### UI Enhancements for Patient Profile & Clinical Assessments (2025-05-26)
-   **`PatientProfile.tsx`**:
    -   Tabs modified to "Sessions", "Clinical Assessments", "Notes". "Overview" tab and its content (e.g., `EmgVisualization`, `TreatmentTimeline`) were removed.
    -   "Clinical Assessments" tab now uses the new `ClinicalAssessments` component instead of `TreatmentConfig`.
    -   "Edit Assessment" button in the "Clinical Assessments" tab header changed to "Manage Assessments" (subsequently updated to "Add Assessment" and "View Progress" buttons).
    -   Tab styling ( `TabsList` and `TabsTrigger` in `PatientProfile.tsx`) updated to align with the styling in `frontend/src/pages/dashboard/index.tsx`, including icons (`Calendar`, `FileEdit`, `FilePlus`).
-   **`ClinicalAssessments.tsx`** (`frontend/src/components/patients/clinical-assessments.tsx`):
    -   Created as a new component.
    -   UI evolved from a simple list of assessment categories to a card-based layout, and finally to a table-based layout.
    -   The table displays columns for "Category" (using a colored `Badge` with a `Tooltip`), "Measure", and "Last Assessed". The "Last Value" column was removed.
    -   Mock data (`mockPatientAssessments`) was introduced and integrated to populate the table. The displayed data is filtered to only include measures for which mock data exists.
    -   Keys in `mockPatientAssessments` were corrected to use hyphens (e.g., `muscle-strength_0`) to match the dynamically generated measure IDs, resolving data display issues.
    -   The "Measure" column header is now left-aligned.
    -   Linter warnings (unused imports, `hasOwnProperty`) addressed.
    -   A message "No assessment data available." is shown if the filtered list of measures with mock data is empty.

## Active Decisions & Considerations

### API Path Structure
- **Date**: 2025-05-26
- **Focus**: Refining UI for Patient Profile, specifically the Clinical Assessments tab. Ongoing backend integration for EMG data.
- **Recent Changes**:
    - **UI Enhancements for `PatientProfile.tsx` and `ClinicalAssessments.tsx`**:
        -   In `PatientProfile.tsx`:
            -   Tabs updated to "Sessions", "Clinical Assessments", "Notes". "Overview" tab and its content (e.g., `EmgVisualization`, `TreatmentTimeline`) were removed.
            -   "Clinical Assessments" tab now uses the new `ClinicalAssessments` component instead of `TreatmentConfig`.
            -   "Edit Assessment" button in the "Clinical Assessments" tab header changed to "Manage Assessments" (subsequently updated to "Add Assessment" and "View Progress" buttons).
            -   Tab styling ( `TabsList` and `TabsTrigger` in `PatientProfile.tsx`) updated to align with the styling in `frontend/src/pages/dashboard/index.tsx`, including icons (`Calendar`, `FileEdit`, `FilePlus`).
        -   In `ClinicalAssessments.tsx`:
            -   Component created in `frontend/src/components/patients/clinical-assessments.tsx`.
            -   Initial implementation listed assessment categories.
            -   Iteratively improved UI:
                -   Card view with reduced padding and two-column grid for measures.
                -   Table view implemented with colored badges for categories (with tooltips), "Measure", "Last Value" (later removed), and "Last Assessed" columns.
                -   Mock data (`mockPatientAssessments`) added to populate the table, with logic to display data or "N/A".
                -   Corrected mock data keys to match generated measure IDs (hyphens vs. underscores).
                -   Filtered measures to display only those with mock data.
                -   "Last Value" column removed.
                -   "Measure" column header aligned to the left.
            -   Linter warnings (unused imports, `hasOwnProperty`) addressed.
    - **C3D Processing & EMG Analysis Components** (previous focus, largely stable):
        - Successfully fixed C3D file upload functionality by aligning API route prefixes
        - Fixed Docker configuration for ezc3d library dependencies using a single-stage build approach
        - Added system dependencies for runtime support of scientific libraries
        - Added proper location block for `/v1/` paths to proxy to backend
        - Ensured consistent routing for all API endpoints

### Nginx Configuration Refinement (2025-05-24)
- Added proper location block for `/v1/` paths to proxy to backend
- Ensured consistent routing for all API endpoints

### UI Enhancements for Patient Profile & Clinical Assessments (2025-05-26)
-   **`PatientProfile.tsx`**:
    -   Tabs modified to "Sessions", "Clinical Assessments", "Notes". "Overview" tab and its content (e.g., `EmgVisualization`, `TreatmentTimeline`) were removed.
    -   "Clinical Assessments" tab now uses the new `ClinicalAssessments` component instead of `TreatmentConfig`.
    -   "Edit Assessment" button in the "Clinical Assessments" tab header changed to "Manage Assessments" (subsequently updated to "Add Assessment" and "View Progress" buttons).
    -   Tab styling ( `TabsList` and `TabsTrigger` in `PatientProfile.tsx`) updated to align with the styling in `frontend/src/pages/dashboard/index.tsx`, including icons (`Calendar`, `FileEdit`, `FilePlus`).
-   **`ClinicalAssessments.tsx`** (`frontend/src/components/patients/clinical-assessments.tsx`):
    -   Created as a new component.
    -   UI evolved from a simple list of assessment categories to a card-based layout, and finally to a table-based layout.
    -   The table displays columns for "Category" (using a colored `Badge` with a `Tooltip`), "Measure", and "Last Assessed". The "Last Value" column was removed.
    -   Mock data (`mockPatientAssessments`) was introduced and integrated to populate the table. The displayed data is filtered to only include measures for which mock data exists.
    -   Keys in `mockPatientAssessments` were corrected to use hyphens (e.g., `muscle-strength_0`) to match the dynamically generated measure IDs, resolving data display issues.
    -   The "Measure" column header is now left-aligned.
    -   Linter warnings (unused imports, `hasOwnProperty`) addressed.
    -   A message "No assessment data available." is shown if the filtered list of measures with mock data is empty.

## Active Decisions & Considerations

### API Path Structure
- **Date**: 2025-05-26
- **Focus**: Refining UI for Patient Profile, specifically the Clinical Assessments tab. Ongoing backend integration for EMG data.
- **Recent Changes**:
    - **UI Enhancements for `PatientProfile.tsx` and `ClinicalAssessments.tsx`**:
        -   In `PatientProfile.tsx`:
            -   Tabs updated to "Sessions", "Clinical Assessments", "Notes". "Overview" tab and its content (e.g., `EmgVisualization`, `TreatmentTimeline`) were removed.
            -   "Clinical Assessments" tab now uses the new `ClinicalAssessments` component instead of `TreatmentConfig`.
            -   "Edit Assessment" button in the "Clinical Assessments" tab header changed to "Manage Assessments" (subsequently updated to "Add Assessment" and "View Progress" buttons).
            -   Tab styling ( `TabsList` and `TabsTrigger` in `PatientProfile.tsx`) updated to align with the styling in `frontend/src/pages/dashboard/index.tsx`, including icons (`Calendar`, `FileEdit`, `FilePlus`).
        -   In `ClinicalAssessments.tsx`:
            -   Component created in `frontend/src/components/patients/clinical-assessments.tsx`.
            -   Initial implementation listed assessment categories.
            -   Iteratively improved UI:
                -   Card view with reduced padding and two-column grid for measures.
                -   Table view implemented with colored badges for categories (with tooltips), "Measure", "Last Value" (later removed), and "Last Assessed" columns.
                -   Mock data (`mockPatientAssessments`) added to populate the table, with logic to display data or "N/A".
                -   Corrected mock data keys to match generated measure IDs (hyphens vs. underscores).
                -   Filtered measures to display only those with mock data.
                -   "Last Value" column removed.
                -   "Measure" column header aligned to the left.
            -   Linter warnings (unused imports, `hasOwnProperty`) addressed.
    - **C3D Processing & EMG Analysis Components** (previous focus, largely stable):
        - Successfully fixed C3D file upload functionality by aligning API route prefixes
        - Fixed Docker configuration for ezc3d library dependencies using a single-stage build approach
        - Added system dependencies for runtime support of scientific libraries
        - Added proper location block for `/v1/` paths to proxy to backend
        - Ensured consistent routing for all API endpoints

### Nginx Configuration Refinement (2025-05-24)
- Added proper location block for `/v1/` paths to proxy to backend
- Ensured consistent routing for all API endpoints

### UI Enhancements for Patient Profile & Clinical Assessments (2025-05-26)
-   **`PatientProfile.tsx`**:
    -   Tabs modified to "Sessions", "Clinical Assessments", "Notes". "Overview" tab and its content (e.g., `EmgVisualization`, `TreatmentTimeline`) were removed.
    -   "Clinical Assessments" tab now uses the new `ClinicalAssessments` component instead of `TreatmentConfig`.
    -   "Edit Assessment" button in the "Clinical Assessments" tab header changed to "Manage Assessments" (subsequently updated to "Add Assessment" and "View Progress" buttons).
    -   Tab styling ( `TabsList` and `TabsTrigger` in `PatientProfile.tsx`) updated to align with the styling in `frontend/src/pages/dashboard/index.tsx`, including icons (`Calendar`, `FileEdit`, `FilePlus`).
-   **`ClinicalAssessments.tsx`** (`frontend/src/components/patients/clinical-assessments.tsx`):
    -   Created as a new component.
    -   UI evolved from a simple list of assessment categories to a card-based layout, and finally to a table-based layout.
    -   The table displays columns for "Category" (using a colored `Badge` with a `Tooltip`), "Measure", and "Last Assessed". The "Last Value" column was removed.
    -   Mock data (`mockPatientAssessments`) was introduced and integrated to populate the table. The displayed data is filtered to only include measures for which mock data exists.
    -   Keys in `mockPatientAssessments` were corrected to use hyphens (e.g., `muscle-strength_0`) to match the dynamically generated measure IDs, resolving data display issues.
    -   The "Measure" column header is now left-aligned.
    -   Linter warnings (unused imports, `hasOwnProperty`) addressed.
    -   A message "No assessment data available." is shown if the filtered list of measures with mock data is empty.

## Active Decisions & Considerations

### API Path Structure
- **Date**: 2025-05-26
- **Focus**: Refining UI for Patient Profile, specifically the Clinical Assessments tab. Ongoing backend integration for EMG data.
- **Recent Changes**:
    - **UI Enhancements for `PatientProfile.tsx` and `ClinicalAssessments.tsx`**:
        -   In `PatientProfile.tsx`:
            -   Tabs updated to "Sessions", "Clinical Assessments", "Notes". "Overview" tab and its content (e.g., `EmgVisualization`, `TreatmentTimeline`) were removed.
            -   "Clinical Assessments" tab now uses the new `ClinicalAssessments` component instead of `TreatmentConfig`.
            -   "Edit Assessment" button in the "Clinical Assessments" tab header changed to "Manage Assessments" (subsequently updated to "Add Assessment" and "View Progress" buttons).
            -   Tab styling ( `TabsList` and `TabsTrigger` in `PatientProfile.tsx`) updated to align with the styling in `frontend/src/pages/dashboard/index.tsx`, including icons (`Calendar`, `FileEdit`, `FilePlus`).
        -   In `ClinicalAssessments.tsx`:
            -   Component created in `frontend/src/components/patients/clinical-assessments.tsx`.
            -   Initial implementation listed assessment categories.
            -   Iteratively improved UI:
                -   Card view with reduced padding and two-column grid for measures.
                -   Table view implemented with colored badges for categories (with tooltips), "Measure", "Last Value" (later removed), and "Last Assessed" columns.
                -   Mock data (`mockPatientAssessments`) added to populate the table, with logic to display data or "N/A".
                -   Corrected mock data keys to match generated measure IDs (hyphens vs. underscores).
                -   Filtered measures to display only those with mock data.
                -   "Last Value" column removed.
                -   "Measure" column header aligned to the left.
            -   Linter warnings (unused imports, `hasOwnProperty`) addressed.
    - **C3D Processing & EMG Analysis Components** (previous focus, largely stable):
        - Successfully fixed C3D file upload functionality by aligning API route prefixes
        - Fixed Docker configuration for ezc3d library dependencies using a single-stage build approach
        - Added system dependencies for runtime support of scientific libraries
        - Added proper location block for `/v1/` paths to proxy to backend
        - Ensured consistent routing for all API endpoints

### Nginx Configuration Refinement (2025-05-24)
- Added proper location block for `/v1/` paths to proxy to backend
- Ensured consistent routing for all API endpoints

### UI Enhancements for Patient Profile & Clinical Assessments (2025-05-26)
-   **`PatientProfile.tsx`**:
    -   Tabs modified to "Sessions", "Clinical Assessments", "Notes". "Overview" tab and its content (e.g., `EmgVisualization`, `TreatmentTimeline`) were removed.
    -   "Clinical Assessments" tab now uses the new `ClinicalAssessments` component instead of `TreatmentConfig`.
    -   "Edit Assessment" button in the "Clinical Assessments" tab header changed to "Manage Assessments" (subsequently updated to "Add Assessment" and "View Progress" buttons).
    -   Tab styling ( `TabsList` and `TabsTrigger` in `PatientProfile.tsx`) updated to align with the styling in `frontend/src/pages/dashboard/index.tsx`, including icons (`Calendar`, `FileEdit`, `FilePlus`).
-   **`ClinicalAssessments.tsx`** (`frontend/src/components/patients/clinical-assessments.tsx`):
    -   Created as a new component.
    -   UI evolved from a simple list of assessment categories to a card-based layout, and finally to a table-based layout.
    -   The table displays columns for "Category" (using a colored `Badge` with a `Tooltip`), "Measure", and "Last Assessed". The "Last Value" column was removed.
    -   Mock data (`mockPatientAssessments`) was introduced and integrated to populate the table. The displayed data is filtered to only include measures for which mock data exists.
    -   Keys in `mockPatientAssessments` were corrected to use hyphens (e.g., `muscle-strength_0`) to match the dynamically generated measure IDs, resolving data display issues.
    -   The "Measure" column header is now left-aligned.
    -   Linter warnings (unused imports, `hasOwnProperty`) addressed.
    -   A message "No assessment data available." is shown if the filtered list of measures with mock data is empty.

## Active Decisions & Considerations

### API Path Structure
- **Date**: 2025-05-26
- **Focus**: Refining UI for Patient Profile, specifically the Clinical Assessments tab. Ongoing backend integration for EMG data.
- **Recent Changes**:
    - **UI Enhancements for `PatientProfile.tsx` and `ClinicalAssessments.tsx`**:
        -   In `PatientProfile.tsx`:
            -   Tabs updated to "Sessions", "Clinical Assessments", "Notes". "Overview" tab and its content (e.g., `EmgVisualization`, `TreatmentTimeline`) were removed.
            -   "Clinical Assessments" tab now uses the new `ClinicalAssessments` component instead of `TreatmentConfig`.
            -   "Edit Assessment" button in the "Clinical Assessments" tab header changed to "Manage Assessments" (subsequently updated to "Add Assessment" and "View Progress" buttons).
            -   Tab styling ( `TabsList` and `TabsTrigger` in `PatientProfile.tsx`) updated to align with the styling in `frontend/src/pages/dashboard/index.tsx`, including icons (`Calendar`, `FileEdit`, `FilePlus`).
        -   In `ClinicalAssessments.tsx`:
            -   Component created in `frontend/src/components/patients/clinical-assessments.tsx`.
            -   Initial implementation listed assessment categories.
            -   Iteratively improved UI:
                -   Card view with reduced padding and two-column grid for measures.
                -   Table view implemented with colored badges for categories (with tooltips), "Measure", "Last Value" (later removed), and "Last Assessed" columns.
                -   Mock data (`mockPatientAssessments`) added to populate the table, with logic to display data or "N/A".
                -   Corrected mock data keys to match generated measure IDs (hyphens vs. underscores).
                -   Filtered measures to display only those with mock data.
                -   "Last Value" column removed.
                -   "Measure" column header aligned to the left.
            -   Linter warnings (unused imports, `hasOwnProperty`) addressed.
    - **C3D Processing & EMG Analysis Components** (previous focus, largely stable):
        - Successfully fixed C3D file upload functionality by aligning API route prefixes
        - Fixed Docker configuration for ezc3d library dependencies using a single-stage build approach
        - Added system dependencies for runtime support of scientific libraries
        - Added proper location block for `/v1/` paths to proxy to backend
        - Ensured consistent routing for all API endpoints

### Nginx Configuration Refinement (2025-05-24)
- Added proper location block for `/v1/` paths to proxy to backend
- Ensured consistent routing for all API endpoints

### UI Enhancements for Patient Profile & Clinical Assessments (2025-05-26)
-   **`PatientProfile.tsx`**:
    -   Tabs modified to "Sessions", "Clinical Assessments", "Notes". "Overview" tab and its content (e.g., `EmgVisualization`, `TreatmentTimeline`) were removed.
    -   "Clinical Assessments" tab now uses the new `ClinicalAssessments` component instead of `TreatmentConfig`.
    -   "Edit Assessment" button in the "Clinical Assessments" tab header changed to "Manage Assessments" (subsequently updated to "Add Assessment" and "View Progress" buttons).
    -   Tab styling ( `TabsList` and `TabsTrigger` in `PatientProfile.tsx`) updated to align with the styling in `frontend/src/pages/dashboard/index.tsx`, including icons (`Calendar`, `FileEdit`, `FilePlus`).
-   **`ClinicalAssessments.tsx`** (`frontend/src/components/patients/clinical-assessments.tsx`):
    -   Created as a new component.
    -   UI evolved from a simple list of assessment categories to a card-based layout, and finally to a table-based layout.
    -   The table displays columns for "Category" (using a colored `Badge` with a `Tooltip`), "Measure", and "Last Assessed". The "Last Value" column was removed.
    -   Mock data (`mockPatientAssessments`) was introduced and integrated to populate the table. The displayed data is filtered to only include measures for which mock data exists.
    -   Keys in `mockPatientAssessments` were corrected to use hyphens (e.g., `muscle-strength_0`) to match the dynamically generated measure IDs, resolving data display issues.
    -   The "Measure" column header is now left-aligned.
    -   Linter warnings (unused imports, `hasOwnProperty`) addressed.
    -   A message "No assessment data available." is shown if the filtered list of measures with mock data is empty.

## Active Decisions & Considerations

### API Path Structure
- **Date**: 2025-05-26
- **Focus**: Refining UI for Patient Profile, specifically the Clinical Assessments tab. Ongoing backend integration for EMG data.
- **Recent Changes**:
    - **UI Enhancements for `PatientProfile.tsx` and `ClinicalAssessments.tsx`**:
        -   In `PatientProfile.tsx`:
            -   Tabs updated to "Sessions", "Clinical Assessments", "Notes". "Overview" tab and its content (e.g., `EmgVisualization`, `TreatmentTimeline`) were removed.
            -   "Clinical Assessments" tab now uses the new `ClinicalAssessments` component instead of `TreatmentConfig`.
            -   "Edit Assessment" button in the "Clinical Assessments" tab header changed to "Manage Assessments" (subsequently updated to "Add Assessment" and "View Progress" buttons).
            -   Tab styling ( `TabsList` and `TabsTrigger` in `PatientProfile.tsx`) updated to align with the styling in `frontend/src/pages/dashboard/index.tsx`, including icons (`Calendar`, `FileEdit`, `FilePlus`).
        -   In `ClinicalAssessments.tsx`:
            -   Component created in `frontend/src/components/patients/clinical-assessments.tsx`.
            -   Initial implementation listed assessment categories.
            -   Iteratively improved UI:
                -   Card view with reduced padding and two-column grid for measures.
                -   Table view implemented with colored badges for categories (with tooltips), "Measure", "Last Value" (later removed), and "Last Assessed" columns.
                -   Mock data (`mockPatientAssessments`) added to populate the table, with logic to display data or "N/A".
                -   Corrected mock data keys to match generated measure IDs (hyphens vs. underscores).
                -   Filtered measures to display only those with mock data.
                -   "Last Value" column removed.
                -   "Measure" column header aligned to the left.
            -   Linter warnings (unused imports, `hasOwnProperty`) addressed.
    - **C3D Processing & EMG Analysis Components** (previous focus, largely stable):
        - Successfully fixed C3D file upload functionality by aligning API route prefixes
        - Fixed Docker configuration for ezc3d library dependencies using a single-stage build approach
        - Added system dependencies for runtime support of scientific libraries
        - Added proper location block for `/v1/` paths to proxy to backend
        - Ensured consistent routing for all API endpoints

### Nginx Configuration Refinement (2025-05-24)
- Added proper location block for `/v1/` paths to proxy to backend
- Ensured consistent routing for all API endpoints

### UI Enhancements for Patient Profile & Clinical Assessments (2025-05-26)
-   **`PatientProfile.tsx`**:
    -   Tabs modified to "Sessions", "Clinical Assessments", "Notes". "Overview" tab and its content (e.g., `EmgVisualization`, `TreatmentTimeline`) were removed.
    -   "Clinical Assessments" tab now uses the new `ClinicalAssessments` component instead of `TreatmentConfig`.
    -   "Edit Assessment" button in the "Clinical Assessments" tab header changed to "Manage Assessments" (subsequently updated to "Add Assessment" and "View Progress" buttons).
    -   Tab styling ( `TabsList` and `TabsTrigger` in `PatientProfile.tsx`) updated to align with the styling in `frontend/src/pages/dashboard/index.tsx`, including icons (`Calendar`, `FileEdit`, `FilePlus`).
-   **`ClinicalAssessments.tsx`** (`frontend/src/components/patients/clinical-assessments.tsx`):
    -   Created as a new component.
    -   UI evolved from a simple list of assessment categories to a card-based layout, and finally to a table-based layout.
    -   The table displays columns for "Category" (using a colored `Badge` with a `Tooltip`), "Measure", and "Last Assessed". The "Last Value" column was removed.
    -   Mock data (`mockPatientAssessments`) was introduced and integrated to populate the table. The displayed data is filtered to only include measures for which mock data exists.
    -   Keys in `mockPatientAssessments` were corrected to use hyphens (e.g., `muscle-strength_0`) to match the dynamically generated measure IDs, resolving data display issues.
    -   The "Measure" column header is now left-aligned.
    -   Linter warnings (unused imports, `hasOwnProperty`) addressed.
    -   A message "No assessment data available." is shown if the filtered list of measures with mock data is empty.

## Active Decisions & Considerations

### API Path Structure
- **Date**: 2025-05-26
- **Focus**: Refining UI for Patient Profile, specifically the Clinical Assessments tab. Ongoing backend integration for EMG data.
- **Recent Changes**:
    - **UI Enhancements for `PatientProfile.tsx` and `ClinicalAssessments.tsx`**:
        -   In `PatientProfile.tsx`:
            -   Tabs updated to "Sessions", "Clinical Assessments", "Notes". "Overview" tab and its content (e.g., `EmgVisualization`, `TreatmentTimeline`) were removed.
            -   "Clinical Assessments" tab now uses the new `ClinicalAssessments` component instead of `TreatmentConfig`.
            -   "Edit Assessment" button in the "Clinical Assessments" tab header changed to "Manage Assessments" (subsequently updated to "Add Assessment" and "View Progress" buttons).
            -   Tab styling ( `TabsList` and `TabsTrigger` in `PatientProfile.tsx`) updated to align with the styling in `frontend/src/pages/dashboard/index.tsx`, including icons (`Calendar`, `FileEdit`, `FilePlus`).
        -   In `ClinicalAssessments.tsx`:
            -   Component created in `frontend/src/components/patients/clinical-assessments.tsx`.
            -   Initial implementation listed assessment categories.
            -   Iteratively improved UI:
                -   Card view with reduced padding and two-column grid for measures.
                -   Table view implemented with colored badges for categories (with tooltips), "Measure", "Last Value" (later removed), and "Last Assessed" columns.
                -   Mock data (`mockPatientAssessments`) added to populate the table, with logic to display data or "N/A".
                -   Corrected mock data keys to match generated measure IDs (hyphens vs. underscores).
                -   Filtered measures to display only those with mock data.
                -   "Last Value" column removed.
                -   "Measure" column header aligned to the left.
            -   Linter warnings (unused imports, `hasOwnProperty`) addressed.
    - **C3D Processing & EMG Analysis Components** (previous focus, largely stable):
        - Successfully fixed C3D file upload functionality by aligning API route prefixes
        - Fixed Docker configuration for ezc3d library dependencies using a single-stage build approach
        - Added system dependencies for runtime support of scientific libraries
        - Added proper location block for `/v1/` paths to proxy to backend
        - Ensured consistent routing for all API endpoints

### Nginx Configuration Refinement (2025-05-24)
- Added proper location block for `/v1/` paths to proxy to backend
- Ensured consistent routing for all API endpoints

### UI Enhancements for Patient Profile & Clinical Assessments (2025-05-26)
-   **`PatientProfile.tsx`**:
    -   Tabs modified to "Sessions", "Clinical Assessments", "Notes". "Overview" tab and its content (e.g., `EmgVisualization`, `TreatmentTimeline`) were removed.
    -   "Clinical Assessments" tab now uses the new `ClinicalAssessments` component instead of `TreatmentConfig`.
    -   "Edit Assessment" button in the "Clinical Assessments" tab header changed to "Manage Assessments" (subsequently updated to "Add Assessment" and "View Progress" buttons).
    -   Tab styling ( `TabsList` and `TabsTrigger` in `PatientProfile.tsx`) updated to align with the styling in `frontend/src/pages/dashboard/index.tsx`, including icons (`Calendar`, `FileEdit`, `FilePlus`).
-   **`ClinicalAssessments.tsx`** (`frontend/src/components/patients/clinical-assessments.tsx`):
    -   Created as a new component.
    -   UI evolved from a simple list of assessment categories to a card-based layout, and finally to a table-based layout.
    -   The table displays columns for "Category" (using a colored `Badge` with a `Tooltip`), "Measure", and "Last Assessed". The "Last Value" column was removed.
    -   Mock data (`mockPatientAssessments`) was introduced and integrated to populate the table. The displayed data is filtered to only include measures for which mock data exists.
    -   Keys in `mockPatientAssessments` were corrected to use hyphens (e.g., `muscle-strength_0`) to match the dynamically generated measure IDs, resolving data display issues.
    -   The "Measure" column header is now left-aligned.
    -   Linter warnings (unused imports, `hasOwnProperty`) addressed.
    -   A message "No assessment data available." is shown if the filtered list of measures with mock data is empty.

## Active Decisions & Considerations

### API Path Structure
- **Date**: 2025-05-26
- **Focus**: Refining UI for Patient Profile, specifically the Clinical Assessments tab. Ongoing backend integration for EMG data.
- **Recent Changes**:
    - **UI Enhancements for `PatientProfile.tsx` and `ClinicalAssessments.tsx`**:
        -   In `PatientProfile.tsx`:
            -   Tabs updated to "Sessions", "Clinical Assessments", "Notes". "Overview" tab and its content (e.g., `EmgVisualization`, `TreatmentTimeline`) were removed.
            -   "Clinical Assessments" tab now uses the new `ClinicalAssessments` component instead of `TreatmentConfig`.
            -   "Edit Assessment" button in the "Clinical Assessments" tab header changed to "Manage Assessments" (subsequently updated to "Add Assessment" and "View Progress" buttons).
            -   Tab styling ( `TabsList` and `TabsTrigger` in `PatientProfile.tsx`) updated to align with the styling in `frontend/src/pages/dashboard/index.tsx`, including icons (`Calendar`, `FileEdit`, `FilePlus`).
        -   In `ClinicalAssessments.tsx`:
            -   Component created in `frontend/src/components/patients/clinical-assessments.tsx`.
            -   Initial implementation listed assessment categories.
            -   Iteratively improved UI:
                -   Card view with reduced padding and two-column grid for measures.
                -   Table view implemented with colored badges for categories (with tooltips), "Measure", "Last Value" (later removed), and "Last Assessed" columns.
                -   Mock data (`mockPatientAssessments`) added to populate the table, with logic to display data or "N/A".
                -   Corrected mock data keys to match generated measure IDs (hyphens vs. underscores).
                -   Filtered measures to display only those with mock data.
                -   "Last Value" column removed.
                -   "Measure" column header aligned to the left.
            -   Linter warnings (unused imports, `hasOwnProperty`) addressed.
    - **C3D Processing & EMG Analysis Components** (previous focus, largely stable):
        - Successfully fixed C3D file upload functionality by aligning API route prefixes
        - Fixed Docker configuration for ezc3d library dependencies using a single-stage build approach
        - Added system dependencies for runtime support of scientific libraries
        - Added proper location block for `/v1/` paths to proxy to backend
        - Ensured consistent routing for all API endpoints

### Nginx Configuration Refinement (2025-05-24)
- Added proper location block for `/v1/` paths to proxy to backend
- Ensured consistent routing for all API endpoints

### UI Enhancements for Patient Profile & Clinical Assessments (2025-05-26)
-   **`PatientProfile.tsx`**:
    -   Tabs modified to "Sessions", "Clinical Assessments", "Notes". "Overview" tab and its content (e.g., `EmgVisualization`, `TreatmentTimeline`) were removed.
    -   "Clinical Assessments" tab now uses the new `ClinicalAssessments` component instead of `TreatmentConfig`.
    -   "Edit Assessment" button in the "Clinical Assessments" tab header changed to "Manage Assessments" (subsequently updated to "Add Assessment" and "View Progress" buttons).
    -   Tab styling ( `TabsList` and `TabsTrigger` in `PatientProfile.tsx`) updated to align with the styling in `frontend/src/pages/dashboard/index.tsx`, including icons (`Calendar`, `FileEdit`, `FilePlus`).
-   **`ClinicalAssessments.tsx`** (`frontend/src/components/patients/clinical-assessments.tsx`):
    -   Created as a new component.
    -   UI evolved from a simple list of assessment categories to a card-based layout, and finally to a table-based layout.
    -   The table displays columns for "Category" (using a colored `Badge` with a `Tooltip`), "Measure", and "Last Assessed". The "Last Value" column was removed.
    -   Mock data (`mockPatientAssessments`) was introduced and integrated to populate the table. The displayed data is filtered to only include measures for which mock data exists.
    -   Keys in `mockPatientAssessments` were corrected to use hyphens (e.g., `muscle-strength_0`) to match the dynamically generated measure IDs, resolving data display issues.
    -   The "Measure" column header is now left-aligned.
    -   Linter warnings (unused imports, `hasOwnProperty`) addressed.
    -   A message "No assessment data available." is shown if the filtered list of measures with mock data is empty.

## Active Decisions & Considerations

### API Path Structure
- **Date**: 2025-05-26
- **Focus**: Refining UI for Patient Profile, specifically the Clinical Assessments tab. Ongoing backend integration for EMG data.
- **Recent Changes**:
    - **UI Enhancements for `PatientProfile.tsx` and `ClinicalAssessments.tsx`**:
        -   In `PatientProfile.tsx`:
            -   Tabs updated to "Sessions", "Clinical Assessments", "Notes". "Overview" tab and its content (e.g., `EmgVisualization`, `TreatmentTimeline`) were removed.
            -   "Clinical Assessments" tab now uses the new `ClinicalAssessments` component instead of `TreatmentConfig`.
            -   "Edit Assessment" button in the "Clinical Assessments" tab header changed to "Manage Assessments" (subsequently updated to "Add Assessment" and "View Progress" buttons).
            -   Tab styling ( `TabsList` and `TabsTrigger` in `PatientProfile.tsx`) updated to align with the styling in `frontend/src/pages/dashboard/index.tsx`, including icons (`Calendar`, `FileEdit`, `FilePlus`).
        -   In `ClinicalAssessments.tsx`:
            -   Component created in `frontend/src/components/patients/clinical-assessments.tsx`.
            -   Initial implementation listed assessment categories.
            -   Iteratively improved UI:
                -   Card view with reduced padding and two-column grid for measures.
                -   Table view implemented with colored badges for categories (with tooltips), "Measure", "Last Value" (later removed), and "Last Assessed" columns.
                -   Mock data (`mockPatientAssessments`) added to populate the table, with logic to display data or "N/A".
                -   Corrected mock data keys to match generated measure IDs (hyphens vs. underscores).
                -   Filtered measures to display only those with mock data.
                -   "Last Value" column removed.
                -   "Measure" column header aligned to the left.
            -   Linter warnings (unused imports, `hasOwnProperty`) addressed.
    - **C3D Processing & EMG Analysis Components** (previous focus, largely stable):
        - Successfully fixed C3D file upload functionality by aligning API route prefixes
        - Fixed Docker configuration for ezc3d library dependencies using a single-stage build approach
        - Added system dependencies for runtime support of scientific libraries
        - Added proper location block for `/v1/` paths to proxy to backend
        - Ensured consistent routing for all API endpoints

### Nginx Configuration Refinement (2025-05-24)
- Added proper location block for `/v1/` paths to proxy to backend
- Ensured consistent routing for all API endpoints

### UI Enhancements for Patient Profile & Clinical Assessments (2025-05-26)
-   **`PatientProfile.tsx`**:
    -   Tabs modified to "Sessions", "Clinical Assessments", "Notes". "Overview" tab and its content (e.g., `EmgVisualization`, `TreatmentTimeline`) were removed.
    -   "Clinical Assessments" tab now uses the new `ClinicalAssessments` component instead of `TreatmentConfig`.
    -   "Edit Assessment" button in the "Clinical Assessments" tab header changed to "Manage Assessments" (subsequently updated to "Add Assessment" and "View Progress" buttons).
    -   Tab styling ( `TabsList` and `TabsTrigger` in `PatientProfile.tsx`) updated to align with the styling in `frontend/src/pages/dashboard/index.tsx`, including icons (`Calendar`, `FileEdit`, `FilePlus`).
-   **`ClinicalAssessments.tsx`** (`frontend/src/components/patients/clinical-assessments.tsx`):
    -   Created as a new component.
    -   UI evolved from a simple list of assessment categories to a card-based layout, and finally to a table-based layout.
    -   The table displays columns for "Category" (using a colored `Badge` with a `Tooltip`), "Measure", and "Last Assessed". The "Last Value" column was removed.
    -   Mock data (`mockPatientAssessments`) was introduced and integrated to populate the table. The displayed data is filtered to only include measures for which mock data exists.
    -   Keys in `mockPatientAssessments` were corrected to use hyphens (e.g., `muscle-strength_0`) to match the dynamically generated measure IDs, resolving data display issues.
    -   The "Measure" column header is now left-aligned.
    -   Linter warnings (unused imports, `hasOwnProperty`) addressed.
    -   A message "No assessment data available." is shown if the filtered list of measures with mock data is empty.

## Active Decisions & Considerations

### API Path Structure
- **Date**: 2025-05-26
- **Focus**: Refining UI for Patient Profile, specifically the Clinical Assessments tab. Ongoing backend integration for EMG data.
- **Recent Changes**:
    - **UI Enhancements for `PatientProfile.tsx` and `ClinicalAssessments.tsx`**:
        -   In `PatientProfile.tsx`:
            -   Tabs updated to "Sessions", "Clinical Assessments", "Notes". "Overview" tab and its content (e.g., `EmgVisualization`, `TreatmentTimeline`) were removed.
            -   "Clinical Assessments" tab now uses the new `ClinicalAssessments` component instead of `TreatmentConfig`.
            -   "Edit Assessment" button in the "Clinical Assessments" tab header changed to "Manage Assessments" (subsequently updated to "Add Assessment" and "View Progress" buttons).
            -   Tab styling ( `TabsList` and `TabsTrigger` in `PatientProfile.tsx`) updated to align with the styling in `frontend/src/pages/dashboard/index.tsx`, including icons (`Calendar`, `FileEdit`, `FilePlus`).
        -   In `ClinicalAssessments.tsx`:
            -   Component created in `frontend/src/components/patients/clinical-assessments.tsx`.
            -   Initial implementation listed assessment categories.
            -   Iteratively improved UI:
                -   Card view with reduced padding and two-column grid for measures.
                -   Table view implemented with colored badges for categories (with tooltips), "Measure", "Last Value" (later removed), and "Last Assessed" columns.
                -   Mock data (`mockPatientAssessments`) added to populate the table, with logic to display data or "N/A".
                -   Corrected mock data keys to match generated measure IDs (hyphens vs. underscores).
                -   Filtered measures to display only those with mock data.
                -   "Last Value" column removed.
                -   "Measure" column header aligned to the left.
            -   Linter warnings (unused imports, `hasOwnProperty`) addressed.
    - **C3D Processing & EMG Analysis Components** (previous focus, largely stable):
        - Successfully fixed C3D file upload functionality by aligning API route prefixes
        - Fixed Docker configuration for ezc3d library dependencies using a single-stage build approach
        - Added system dependencies for runtime support of scientific libraries
        - Added proper location block for `/v1/` paths to proxy to backend
        - Ensured consistent routing for all API endpoints

### Nginx Configuration Refinement (2025-05-24)
- Added proper location block for `/v1/` paths to proxy to backend
- Ensured consistent routing for all API endpoints

### UI Enhancements for Patient Profile & Clinical Assessments (2025-05-26)
-   **`PatientProfile.tsx`**:
    -   Tabs modified to "Sessions", "Clinical Assessments", "Notes". "Overview" tab and its content (e.g., `EmgVisualization`, `TreatmentTimeline`) were removed.
    -   "Clinical Assessments" tab now uses the new `ClinicalAssessments` component instead of `TreatmentConfig`.
    -   "Edit Assessment" button in the "Clinical Assessments" tab header changed to "Manage Assessments" (subsequently updated to "Add Assessment" and "View Progress" buttons).
    -   Tab styling ( `TabsList` and `TabsTrigger` in `PatientProfile.tsx`) updated to align with the styling in `frontend/src/pages/dashboard/index.tsx`, including icons (`Calendar`, `FileEdit`, `FilePlus`).
-   **`ClinicalAssessments.tsx`** (`frontend/src/components/patients/clinical-assessments.tsx`):
    -   Created as a new component.
    -   UI evolved from a simple list of assessment categories to a card-based layout, and finally to a table-based layout.
    -   The table displays columns for "Category" (using a colored `Badge` with a `Tooltip`), "Measure", and "Last Assessed". The "Last Value" column was removed.
    -   Mock data (`mockPatientAssessments`) was introduced and integrated to populate the table. The displayed data is filtered to only include measures for which mock data exists.
    -   Keys in `mockPatientAssessments` were corrected to use hyphens (e.g., `muscle-strength_0`) to match the dynamically generated measure IDs, resolving data display issues.
    -   The "Measure" column header is now left-aligned.
    -   Linter warnings (unused imports, `hasOwnProperty`) addressed.
    -   A message "No assessment data available." is shown if the filtered list of measures with mock data is empty.

## Active Decisions & Considerations

### API Path Structure
- **Date**: 2025-05-26
- **Focus**: Refining UI for Patient Profile, specifically the Clinical Assessments tab. Ongoing backend integration for EMG data.
- **Recent Changes**:
    - **UI Enhancements for `PatientProfile.tsx` and `ClinicalAssessments.tsx`**:
        -   In `PatientProfile.tsx`:
            -   Tabs updated to "Sessions", "Clinical Assessments", "Notes". "Overview" tab and its content (e.g., `EmgVisualization`, `TreatmentTimeline`) were removed.
            -   "Clinical Assessments" tab now uses the new `ClinicalAssessments` component instead of `TreatmentConfig`.
            -   "Edit Assessment" button in the "Clinical Assessments" tab header changed to "Manage Assessments" (subsequently updated to "Add Assessment" and "View Progress" buttons).
            -   Tab styling ( `TabsList` and `TabsTrigger` in `PatientProfile.tsx`) updated to align with the styling in `frontend/src/pages/dashboard/index.tsx`, including icons (`Calendar`, `FileEdit`, `FilePlus`).
        -   In `ClinicalAssessments.tsx`:
            -   Component created in `frontend/src/components/patients/clinical-assessments.tsx`.
            -   Initial implementation listed assessment categories.
            -   Iteratively improved UI:
                -   Card view with reduced padding and two-column grid for measures.
                -   Table view implemented with colored badges for categories (with tooltips), "Measure", "Last Value" (later removed), and "Last Assessed" columns.
                -   Mock data (`mockPatientAssessments`) added to populate the table, with logic to display data or "N/A".
                -   Corrected mock data keys to match generated measure IDs (hyphens vs. underscores).
                -   Filtered measures to display only those with mock data.
                -   "Last Value" column removed.
                -   "Measure" column header aligned to the left.
            -   Linter warnings (unused imports, `hasOwnProperty`) addressed.
    - **C3D Processing & EMG Analysis Components** (previous focus, largely stable):
        - Successfully fixed C3D file upload functionality by aligning API route prefixes
        - Fixed Docker configuration for ezc3d library dependencies using a single-stage build approach
        - Added system dependencies for runtime support of scientific libraries
        - Added proper location block for `/v1/` paths to proxy to backend
        - Ensured consistent routing for all API endpoints

### Nginx Configuration Refinement (2025-05-24)
- Added proper location block for `/v1/` paths to proxy to backend
- Ensured consistent routing for all API endpoints

### UI Enhancements for Patient Profile & Clinical Assessments (2025-05-26)
-   **`PatientProfile.tsx`**:
    -   Tabs modified to "Sessions", "Clinical Assessments", "Notes". "Overview" tab and its content (e.g., `EmgVisualization`, `TreatmentTimeline`) were removed.
    -   "Clinical Assessments" tab now uses the new `ClinicalAssessments` component instead of `TreatmentConfig`.
    -   "Edit Assessment" button in the "Clinical Assessments" tab header changed to "Manage Assessments" (subsequently updated to "Add Assessment" and "View Progress" buttons).
    -   Tab styling ( `TabsList` and `TabsTrigger` in `PatientProfile.tsx`) updated to align with the styling in `frontend/src/pages/dashboard/index.tsx`, including icons (`Calendar`, `FileEdit`, `FilePlus`).
-   **`ClinicalAssessments.tsx`** (`frontend/src/components/patients/clinical-assessments.tsx`):
    -   Created as a new component.
    -   UI evolved from a simple list of assessment categories to a card-based layout, and finally to a table-based layout.
    -   The table displays columns for "Category" (using a colored `Badge` with a `Tooltip`), "Measure", and "Last Assessed". The "Last Value" column was removed.
    -   Mock data (`mockPatientAssessments`) was introduced and integrated to populate the table. The displayed data is filtered to only include measures for which mock data exists.
    -   Keys in `mockPatientAssessments` were corrected to use hyphens (e.g., `muscle-strength_0`) to match the dynamically generated measure IDs, resolving data display issues.
    -   The "Measure" column header is now left-aligned.
    -   Linter warnings (unused imports, `hasOwnProperty`) addressed.
    -   A message "No assessment data available." is shown if the filtered list of measures with mock data is empty.

## Active Decisions & Considerations

### API Path Structure
- **Date**: 2025-05-26
- **Focus**: Refining UI for Patient Profile, specifically the Clinical Assessments tab. Ongoing backend integration for EMG data.
- **Recent Changes**:
    - **UI Enhancements for `PatientProfile.tsx` and `ClinicalAssessments.tsx`**:
        -   In `PatientProfile.tsx`:
            -   Tabs updated to "Sessions", "Clinical Assessments", "Notes". "Overview" tab and its content (e.g., `EmgVisualization`, `TreatmentTimeline`) were removed.
            -   "Clinical Assessments" tab now uses the new `ClinicalAssessments` component instead of `TreatmentConfig`.
            -   "Edit Assessment" button in the "Clinical Assessments" tab header changed to "Manage Assessments" (subsequently updated to "Add Assessment" and "View Progress" buttons).
            -   Tab styling ( `TabsList` and `TabsTrigger` in `PatientProfile.tsx`) updated to align with the styling in `frontend/src/pages/dashboard/index.tsx`, including icons (`Calendar`, `FileEdit`, `FilePlus`).
        -   In `ClinicalAssessments.tsx`:
            -   Component created in `frontend/src/components/patients/clinical-assessments.tsx`.
            -   Initial implementation listed assessment categories.
            -   Iteratively improved UI:
                -   Card view with reduced padding and two-column grid for measures.
                -   Table view implemented with colored badges for categories (with tooltips), "Measure", "Last Value" (later removed), and "Last Assessed" columns.
                -   Mock data (`mockPatientAssessments`) added to populate the table, with logic to display data or "N/A".
                -   Corrected mock data keys to match generated measure IDs (hyphens vs. underscores).
                -   Filtered measures to display only those with mock data.
                -   "Last Value" column removed.
                -   "Measure" column header aligned to the left.
            -   Linter warnings (unused imports, `hasOwnProperty`) addressed.
    - **C3D Processing & EMG Analysis Components** (previous focus, largely stable):
        - Successfully fixed C3D file upload functionality by aligning API route prefixes
        - Fixed Docker configuration for ezc3d library dependencies using a single-stage build approach
        - Added system dependencies for runtime support of scientific libraries
        - Added proper location block for `/v1/` paths to proxy to backend
        - Ensured consistent routing for all API endpoints

### Nginx Configuration Refinement (2025-05-24)
- Added proper location block for `/v1/` paths to proxy to backend
- Ensured consistent routing for all API endpoints

### UI Enhancements for Patient Profile & Clinical Assessments (2025-05-26)
-   **`PatientProfile.tsx`**:
    -   Tabs modified to "Sessions", "Clinical Assessments", "Notes". "Overview" tab and its content (e.g., `EmgVisualization`, `TreatmentTimeline`) were removed.
    -   "Clinical Assessments" tab now uses the new `ClinicalAssessments` component instead of `TreatmentConfig`.
    -   "Edit Assessment" button in the "Clinical Assessments" tab header changed to "Manage Assessments" (subsequently updated to "Add Assessment" and "View Progress" buttons).
    -   Tab styling ( `TabsList` and `TabsTrigger` in `PatientProfile.tsx`) updated to align with the styling in `frontend/src/pages/dashboard/index.tsx`, including icons (`Calendar`, `FileEdit`, `FilePlus`).
-   **`ClinicalAssessments.tsx`** (`frontend/src/components/patients/clinical-assessments.tsx`):
    -   Created as a new component.
    -   UI evolved from a simple list of assessment categories to a card-based layout, and finally to a table-based layout.
    -   The table displays columns for "Category" (using a colored `Badge` with a `Tooltip`), "Measure", and "Last Assessed". The "Last Value" column was removed.
    -   Mock data (`mockPatientAssessments`) was introduced and integrated to populate the table. The displayed data is filtered to only include measures for which mock data exists.
    -   Keys in `mockPatientAssessments` were corrected to use hyphens (e.g., `muscle-strength_0`) to match the dynamically generated measure IDs, resolving data display issues.
    -   The "Measure" column header is now left-aligned.
    -   Linter warnings (unused imports, `hasOwnProperty`) addressed.
    -   A message "No assessment data available." is shown if the filtered list of measures with mock data is empty.

## Active Decisions & Considerations

### API Path Structure
- **Date**: 2025-05-26
- **Focus**: Refining UI for Patient Profile, specifically the Clinical Assessments tab. Ongoing backend integration for EMG data.
- **Recent Changes**:
    - **UI Enhancements for `PatientProfile.tsx` and `ClinicalAssessments.tsx`**:
        -   In `PatientProfile.tsx`:
            -   Tabs updated to "Sessions", "Clinical Assessments", "Notes". "Overview" tab and its content (e.g., `EmgVisualization`, `TreatmentTimeline`) were removed.
            -   "Clinical Assessments" tab now uses the new `ClinicalAssessments` component instead of `TreatmentConfig`.
            -   "Edit Assessment" button in the "Clinical Assessments" tab header changed to "Manage Assessments" (subsequently updated to "Add Assessment" and "View Progress" buttons).
            -   Tab styling ( `TabsList` and `TabsTrigger` in `PatientProfile.tsx`) updated to align with the styling in `frontend/src/pages/dashboard/index.tsx`, including icons (`Calendar`, `FileEdit`, `FilePlus`).
        -   In `ClinicalAssessments.tsx`:
            -   Component created in `frontend/src/components/patients/clinical-assessments.tsx`.
            -   Initial implementation listed assessment categories.
            -   Iteratively improved UI:
                -   Card view with reduced padding and two-column grid for measures.
                -   Table view implemented with colored badges for categories (with tooltips), "Measure", "Last Value" (later removed), and "Last Assessed" columns.
                -   Mock data (`mockPatientAssessments`) added to populate the table, with logic to display data or "N/A".
                -   Corrected mock data keys to match generated measure IDs (hyphens vs. underscores).
                -   Filtered measures to display only those with mock data.
                -   "Last Value" column removed.
                -   "Measure" column header aligned to the left.
            -   Linter warnings (unused imports, `hasOwnProperty`) addressed.
    - **C3D Processing & EMG Analysis Components** (previous focus, largely stable):
        - Successfully fixed C3D file upload functionality by aligning API route prefixes
        - Fixed Docker configuration for ezc3d library dependencies using a single-stage build approach
        - Added system dependencies for runtime support of scientific libraries
        - Added proper location block for `/v1/` paths to proxy to backend
        - Ensured consistent routing for all API endpoints

### Nginx Configuration Refinement (2025-05-24)
- Added proper location block for `/v1/` paths to proxy to backend
- Ensured consistent routing for all API endpoints

### UI Enhancements for Patient Profile & Clinical Assessments (2025-05-26)
-   **`PatientProfile.tsx`**:
    -   Tabs modified to "Sessions", "Clinical Assessments", "Notes". "Overview" tab and its content (e.g., `EmgVisualization`, `TreatmentTimeline`) were removed.
    -   "Clinical Assessments" tab now uses the new `ClinicalAssessments` component instead of `TreatmentConfig`.
    -   "Edit Assessment" button in the "Clinical Assessments" tab header changed to "Manage Assessments" (subsequently updated to "Add Assessment" and "View Progress" buttons).
    -   Tab styling ( `TabsList` and `TabsTrigger` in `PatientProfile.tsx`) updated to align with the styling in `frontend/src/pages/dashboard/index.tsx`, including icons (`Calendar`, `FileEdit`, `FilePlus`).
-   **`ClinicalAssessments.tsx`** (`frontend/src/components/patients/clinical-assessments.tsx`):
    -   Created as a new component.
    -   UI evolved from a simple list of assessment categories to a card-based layout, and finally to a table-based layout.
    -   The table displays columns for "Category" (using a colored `Badge` with a `Tooltip`), "Measure", and "Last Assessed". The "Last Value" column was removed.
    -   Mock data (`mockPatientAssessments`) was introduced and integrated to populate the table. The displayed data is filtered to only include measures for which mock data exists.
    -   Keys in `mockPatientAssessments` were corrected to use hyphens (e.g., `muscle-strength_0`) to match the dynamically generated measure IDs, resolving data display issues.
    -   The "Measure" column header is now left-aligned.
    -   Linter warnings (unused imports, `hasOwnProperty`) addressed.
    -   A message "No assessment data available." is shown if the filtered list of measures with mock data is empty.

## Active Decisions & Considerations

### API Path Structure
- **Date**: 2025-05-26
- **Focus**: Refining UI for Patient Profile, specifically the Clinical Assessments tab. Ongoing backend integration for EMG data.
- **Recent Changes**:
    - **UI Enhancements for `PatientProfile.tsx` and `ClinicalAssessments.tsx`**:
        -   In `PatientProfile.tsx`:
            -   Tabs updated to "Sessions", "Clinical Assessments", "Notes". "Overview" tab and its content (e.g., `EmgVisualization`, `TreatmentTimeline`) were removed.
            -   "Clinical Assessments" tab now uses the new `ClinicalAssessments` component instead of `TreatmentConfig`.
            -   "Edit Assessment" button in the "Clinical Assessments" tab header changed to "Manage Assessments" (subsequently updated to "Add Assessment" and "View Progress" buttons).
            -   Tab styling ( `TabsList` and `TabsTrigger` in `PatientProfile.tsx`) updated to align with the styling in `frontend/src/pages/dashboard/index.tsx`, including icons (`Calendar`, `FileEdit`, `FilePlus`).
        -   In `ClinicalAssessments.tsx`:
            -   Component created in `frontend/src/components/patients/clinical-assessments.tsx`.
            -   Initial implementation listed assessment categories.
            -   Iteratively improved UI:
                -   Card view with reduced padding and two-column grid for measures.
                -   Table view implemented with colored badges for categories (with tooltips), "Measure", "Last Value" (later removed), and "Last Assessed" columns.
                -   Mock data (`mockPatientAssessments`) added to populate the table, with logic to display data or "N/A".
                -   Corrected mock data keys to match generated measure IDs (hyphens vs. underscores).
                -   Filtered measures to display only those with mock data.
                -   "Last Value" column removed.
                -   "Measure" column header aligned to the left.
            -   Linter warnings (unused imports, `hasOwnProperty`) addressed.
    - **C3D Processing & EMG Analysis Components** (previous focus, largely stable):
        - Successfully fixed C3D file upload functionality by aligning API route prefixes
        - Fixed Docker configuration for ezc3d library dependencies using a single-stage build approach
        - Added system dependencies for runtime support of scientific libraries
        - Added proper location block for `/v1/` paths to proxy to backend
        - Ensured consistent routing for all API endpoints

### Nginx Configuration Refinement (2025-05-24)
- Added proper location block for `/v1/` paths to proxy to backend
- Ensured consistent routing for all API endpoints

### UI Enhancements for Patient Profile & Clinical Assessments (2025-05-26)
-   **`PatientProfile.tsx`**:
    -   Tabs modified to "Sessions", "Clinical Assessments", "Notes". "Overview" tab and its content (e.g., `EmgVisualization`, `TreatmentTimeline`) were removed.
    -   "Clinical Assessments" tab now uses the new `ClinicalAssessments` component instead of `TreatmentConfig`.
    -   "Edit Assessment" button in the "Clinical Assessments" tab header changed to "Manage Assessments" (subsequently updated to "Add Assessment" and "View Progress" buttons).
    -   Tab styling ( `TabsList` and `TabsTrigger` in `PatientProfile.tsx`) updated to align with the styling in `frontend/src/pages/dashboard/index.tsx`, including icons (`Calendar`, `FileEdit`, `FilePlus`).
-   **`ClinicalAssessments.tsx`** (`frontend/src/components/patients/clinical-assessments.tsx`):
    -   Created as a new component.
    -   UI evolved from a simple list of assessment categories to a card-based layout, and finally to a table-based layout.
    -   The table displays columns for "Category" (using a colored `Badge` with a `Tooltip`), "Measure", and "Last Assessed". The "Last Value" column was removed.
    -   Mock data (`mockPatientAssessments`) was introduced and integrated to populate the table. The displayed data is filtered to only include measures for which mock data exists.
    -   Keys in `mockPatientAssessments` were corrected to use hyphens (e.g., `muscle-strength_0`) to match the dynamically generated measure IDs, resolving data display issues.
    -   The "Measure" column header is now left-aligned.
    -   Linter warnings (unused imports, `hasOwnProperty`) addressed.
    -   A message "No assessment data available." is shown if the filtered list of measures with mock data is empty.

## Active Decisions & Considerations

### API Path Structure
- **Date**: 2025-05-26
- **Focus**: Refining UI for Patient Profile, specifically the Clinical Assessments tab. Ongoing backend integration for EMG data.
- **Recent Changes**:
    - **UI Enhancements for `PatientProfile.tsx` and `ClinicalAssessments.tsx`**:
        -   In `PatientProfile.tsx`:
            -   Tabs updated to "Sessions", "Clinical Assessments", "Notes". "Overview" tab and its content (e.g., `EmgVisualization`, `TreatmentTimeline`) were removed.
            -   "Clinical Assessments" tab now uses the new `ClinicalAssessments` component instead of `TreatmentConfig`.
            -   "Edit Assessment" button in the "Clinical Assessments" tab header changed to "Manage Assessments" (subsequently updated to "Add Assessment" and "View Progress" buttons).
            -   Tab styling ( `TabsList` and `TabsTrigger` in `PatientProfile.tsx`) updated to align with the styling in `frontend/src/pages/dashboard/index.tsx`, including icons (`Calendar`, `FileEdit`, `FilePlus`).
        -   In `ClinicalAssessments.tsx`:
            -   Component created in `frontend/src/components/patients/clinical-assessments.tsx`.
            -   Initial implementation listed assessment categories.
            -   Iteratively improved UI:
                -   Card view with reduced padding and two-column grid for measures.
                -   Table view implemented with colored badges for categories (with tooltips), "Measure", "Last Value" (later removed), and "Last Assessed" columns.
                -   Mock data (`mockPatientAssessments`) added to populate the table, with logic to display data or "N/A".
                -   Corrected mock data keys to match generated measure IDs (hyphens vs. underscores).
                -   Filtered measures to display only those with mock data.
                -   "Last Value" column removed.
                -   "Measure" column header aligned to the left.
            -   Linter warnings (unused imports, `hasOwnProperty`) addressed.
    - **C3D Processing & EMG Analysis Components** (previous focus, largely stable):
        - Successfully fixed C3D file upload functionality by aligning API route prefixes
        - Fixed Docker configuration for ezc3d library dependencies using a single-stage build approach
        - Added system dependencies for runtime support of scientific libraries
        - Added proper location block for `/v1/` paths to proxy to backend
        - Ensured consistent routing for all API endpoints

### Nginx Configuration Refinement (2025-05-24)
- Added proper location block for `/v1/` paths to proxy to backend
- Ensured consistent routing for all API endpoints

### UI Enhancements for Patient Profile & Clinical Assessments (2025-05-26)
-   **`PatientProfile.tsx`**:
    -   Tabs modified to "Sessions", "Clinical Assessments", "Notes". "Overview" tab and its content (e.g., `EmgVisualization`, `TreatmentTimeline`) were removed.
    -   "Clinical Assessments" tab now uses the new `ClinicalAssessments` component instead of `TreatmentConfig`.
    -   "Edit Assessment" button in the "Clinical Assessments" tab header changed to "Manage Assessments" (subsequently updated to "Add Assessment" and "View Progress" buttons).
    -   Tab styling ( `TabsList` and `TabsTrigger` in `PatientProfile.tsx`) updated to align with the styling in `frontend/src/pages/dashboard/index.tsx`, including icons (`Calendar`, `FileEdit`, `FilePlus`).
-   **`ClinicalAssessments.tsx`** (`frontend/src/components/patients/clinical-assessments.tsx`):
    -   Created as a new component.
    -   UI evolved from a simple list of assessment categories to a card-based layout, and finally to a table-based layout.
    -   The table displays columns for "Category" (using a colored `Badge` with a `Tooltip`), "Measure", and "Last Assessed". The "Last Value" column was removed.
    -   Mock data (`mockPatientAssessments`) was introduced and integrated to populate the table. The displayed data is filtered to only include measures for which mock data exists.
    -   Keys in `mockPatientAssessments` were corrected to use hyphens (e.g., `muscle-strength_0`) to match the dynamically generated measure IDs, resolving data display issues.
    -   The "Measure" column header is now left-aligned.
    -   Linter warnings (unused imports, `hasOwnProperty`) addressed.
    -   A message "No assessment data available." is shown if the filtered list of measures with mock data is empty.

## Active Decisions & Considerations

### API Path Structure
- **Date**: 2025-05-26
- **Focus**: Refining UI for Patient Profile, specifically the Clinical Assessments tab. Ongoing backend integration for EMG data.
- **Recent Changes**:
    - **UI Enhancements for `PatientProfile.tsx` and `ClinicalAssessments.tsx`**:
        -   In `PatientProfile.tsx`:
            -   Tabs updated to "Sessions", "Clinical Assessments", "Notes". "Overview" tab and its content (e.g., `EmgVisualization`, `TreatmentTimeline`) were removed.
            -   "Clinical Assessments" tab now uses the new `ClinicalAssessments` component instead of `TreatmentConfig`.
            -   "Edit Assessment" button in the "Clinical Assessments" tab header changed to "Manage Assessments" (subsequently updated to "Add Assessment" and "View Progress" buttons).
            -   Tab styling ( `TabsList` and `TabsTrigger` in `PatientProfile.tsx`) updated to align with the styling in `frontend/src/pages/dashboard/index.tsx`, including icons (`Calendar`, `FileEdit`, `FilePlus`).
        -   In `ClinicalAssessments.tsx`:
            -   Component created in `frontend/src/components/patients/clinical-assessments.tsx`.
            -   Initial implementation listed assessment categories.
            -   Iteratively improved UI:
                -   Card view with reduced padding and two-column grid for measures.
                -   Table view implemented with colored badges for categories (with tooltips), "Measure", "Last Value" (later removed), and "Last Assessed" columns.
                -   Mock data (`mockPatientAssessments`) added to populate the table, with logic to display data or "N/A".
                -   Corrected mock data keys to match generated measure IDs (hyphens vs. underscores).
                -   Filtered measures to display only those with mock data.
                -   "Last Value" column removed.
                -   "Measure" column header aligned to the left.
            -   Linter warnings (unused imports, `hasOwnProperty`) addressed.
    - **C3D Processing & EMG Analysis Components** (previous focus, largely stable):
        - Successfully fixed C3D file upload functionality by aligning API route prefixes
        - Fixed Docker configuration for ezc3d library dependencies using a single-stage build approach
        - Added system dependencies for runtime support of scientific libraries
        - Added proper location block for `/v1/` paths to proxy to backend
        - Ensured consistent routing for all API endpoints

### Nginx Configuration Refinement (2025-05-24)
- Added proper location block for `/v1/` paths to proxy to backend
- Ensured consistent routing for all API endpoints

### UI Enhancements for Patient Profile & Clinical Assessments (2025-05-26)
-   **`PatientProfile.tsx`**:
    -   Tabs modified to "Sessions", "Clinical Assessments", "Notes". "Overview" tab and its content (e.g., `EmgVisualization`, `TreatmentTimeline`) were removed.
    -   "Clinical Assessments" tab now uses the new `ClinicalAssessments` component instead of `TreatmentConfig`.
    -   "Edit Assessment" button in the "Clinical Assessments" tab header changed to "Manage Assessments" (subsequently updated to "Add Assessment" and "View Progress" buttons).
    -   Tab styling ( `TabsList` and `TabsTrigger` in `PatientProfile.tsx`) updated to align with the styling in `frontend/src/pages/dashboard/index.tsx`, including icons (`Calendar`, `FileEdit`, `FilePlus`).
-   **`ClinicalAssessments.tsx`** (`frontend/src/components/patients/clinical-assessments.tsx`):
    -   Created as a new component.
    -   UI evolved from a simple list of assessment categories to a card-based layout, and finally to a table-based layout.
    -   The table displays columns for "Category" (using a colored `Badge` with a `Tooltip`), "Measure", and "Last Assessed". The "Last Value" column was removed.
    -   Mock data (`mockPatientAssessments`) was introduced and integrated to populate the table. The displayed data is filtered to only include measures for which mock data exists.
    -   Keys in `mockPatientAssessments` were corrected to use hyphens (e.g., `muscle-strength_0`) to match the dynamically generated measure IDs, resolving data display issues.
    -   The "Measure" column header is now left-aligned.
    -   Linter warnings (unused imports, `hasOwnProperty`) addressed.
    -   A message "No assessment data available." is shown if the filtered list of measures with mock data is empty.

## Active Decisions & Considerations

### API Path Structure
- **Date**: 2025-05-26
- **Focus**: Refining UI for Patient Profile, specifically the Clinical Assessments tab. Ongoing backend integration for EMG data.
- **Recent Changes**:
    - **UI Enhancements for `PatientProfile.tsx` and `ClinicalAssessments.tsx`**:
        -   In `PatientProfile.tsx`:
            -   Tabs updated to "Sessions", "Clinical Assessments", "Notes". "Overview" tab and its content (e.g., `EmgVisualization`, `TreatmentTimeline`) were removed.
            -   "Clinical Assessments" tab now uses the new `ClinicalAssessments` component instead of `TreatmentConfig`.
            -   "Edit Assessment" button in the "Clinical Assessments" tab header changed to "Manage Assessments" (subsequently updated to "Add Assessment" and "View Progress" buttons).
            -   Tab styling ( `TabsList` and `TabsTrigger` in `PatientProfile.tsx`) updated to align with the styling in `frontend/src/pages/dashboard/index.tsx`, including icons (`Calendar`, `FileEdit`, `FilePlus`).
        -   In `ClinicalAssessments.tsx`:
            -   Component created in `frontend/src/components/patients/clinical-assessments.tsx`.
            -   Initial implementation listed assessment categories.
            -   Iteratively improved UI:
                -   Card view with reduced padding and two-column grid for measures.
                -   Table view implemented with colored badges for categories (with tooltips), "Measure", "Last Value" (later removed), and "Last Assessed" columns.
                -   Mock data (`mockPatientAssessments`) added to populate the table, with logic to display data or "N/A".
                -   Corrected mock data keys to match generated measure IDs (hyphens vs. underscores).
                -   Filtered measures to display only those with mock data.
                -   "Last Value" column removed.
                -   "Measure" column header aligned to the left.
            -   Linter warnings (unused imports, `hasOwnProperty`) addressed.
    - **C3D Processing & EMG Analysis Components** (previous focus, largely stable):
        - Successfully fixed C3D file upload functionality by aligning API route prefixes
        - Fixed Docker configuration for ezc3d library dependencies using a single-stage build approach
        - Added system dependencies for runtime support of scientific libraries
        - Added proper location block for `/v1/` paths to proxy to backend
        - Ensured consistent routing for all API endpoints

### Nginx Configuration Refinement (2025-05-24)
- Added proper location block for `/v1/` paths to proxy to backend
- Ensured consistent routing for all API endpoints

### UI Enhancements for Patient Profile & Clinical Assessments (2025-05-26)
-   **`PatientProfile.tsx`**:
    -   Tabs modified to "Sessions", "Clinical Assessments", "Notes". "Overview" tab and its content (e.g., `EmgVisualization`, `TreatmentTimeline`) were removed.
    -   "Clinical Assessments" tab now uses the new `ClinicalAssessments` component instead of `TreatmentConfig`.
    -   "Edit Assessment" button in the "Clinical Assessments" tab header changed to "Manage Assessments" (subsequently updated to "Add Assessment" and "View Progress" buttons).
    -   Tab styling ( `TabsList` and `TabsTrigger` in `PatientProfile.tsx`) updated to align with the styling in `frontend/src/pages/dashboard/index.tsx`, including icons (`Calendar`, `FileEdit`, `FilePlus`).
-   **`ClinicalAssessments.tsx`** (`frontend/src/components/patients/clinical-assessments.tsx`):
    -   Created as a new component.
    -   UI evolved from a simple list of assessment categories to a card-based layout, and finally to a table-based layout.
    -   The table displays columns for "Category" (using a colored `Badge` with a `Tooltip`), "Measure", and "Last Assessed". The "Last Value" column was removed.
    -   Mock data (`mockPatientAssessments`) was introduced and integrated to populate the table. The displayed data is filtered to only include measures for which mock data exists.
    -   Keys in `mockPatientAssessments` were corrected to use hyphens (e.g., `muscle-strength_0`) to match the dynamically generated measure IDs, resolving data display issues.
    -   The "Measure" column header is now left-aligned.
    -   Linter warnings (unused imports, `hasOwnProperty`) addressed.
    -   A message "No assessment data available." is shown if the filtered list of measures with mock data is empty.

## Active Decisions & Considerations

### API Path Structure
- **Date**: 2025-05-26
- **Focus**: Refining UI for Patient Profile, specifically the Clinical Assessments tab. Ongoing backend integration for EMG data.
- **Recent Changes**:
    - **UI Enhancements for `PatientProfile.tsx` and `ClinicalAssessments.tsx`**:
        -   In `PatientProfile.tsx`:
            -   Tabs updated to "Sessions", "Clinical Assessments", "Notes". "Overview" tab and its content (e.g., `EmgVisualization`, `TreatmentTimeline`) were removed.
            -   "Clinical Assessments" tab now uses the new `ClinicalAssessments` component instead of `TreatmentConfig`.
            -   "Edit Assessment" button in the "Clinical Assessments" tab header changed to "Manage Assessments" (subsequently updated to "Add Assessment" and "View Progress" buttons).
            -   Tab styling ( `TabsList` and `TabsTrigger` in `PatientProfile.tsx`) updated to align with the styling in `frontend/src/pages/dashboard/index.tsx`, including icons (`Calendar`, `FileEdit`, `FilePlus`).
        -   In `ClinicalAssessments.tsx`:
            -   Component created in `frontend/src/components/patients/clinical-assessments.tsx`.
            -   Initial implementation listed assessment categories.
            -   Iteratively improved UI:
                -   Card view with reduced padding and two-column grid for measures.
                -   Table view implemented with colored badges for categories (with tooltips), "Measure", "Last Value" (later removed), and "Last Assessed" columns.
                -   Mock data (`mockPatientAssessments`) added to populate the table, with logic to display data or "N/A".
                -   Corrected mock data keys to match generated measure IDs (hyphens vs. underscores).
                -   Filtered measures to display only those with mock data.
                -   "Last Value" column removed.
                -   "Measure" column header aligned to the left.
            -   Linter warnings (unused imports, `hasOwnProperty`) addressed.
    - **C3D Processing & EMG Analysis Components** (previous focus, largely stable):
        - Successfully fixed C3D file upload functionality by aligning API route prefixes
        - Fixed Docker configuration for ezc3d library dependencies using a single-stage build approach
        - Added system dependencies for runtime support of scientific libraries
        - Added proper location block for `/v1/` paths to proxy to backend
        - Ensured consistent routing for all API endpoints

### Nginx Configuration Refinement (2025-05-24)
- Added proper location block for `/v1/` paths to proxy to backend
- Ensured consistent routing for all API endpoints

### UI Enhancements for Patient Profile & Clinical Assessments (2025-05-26)
-   **`PatientProfile.tsx`**:
    -   Tabs modified to "Sessions", "Clinical Assessments", "Notes". "Overview" tab and its content (e.g., `EmgVisualization`, `TreatmentTimeline`) were removed.
    -   "Clinical Assessments" tab now uses the new `ClinicalAssessments` component instead of `TreatmentConfig`.
    -   "Edit Assessment" button in the "Clinical Assessments" tab header changed to "Manage Assessments" (subsequently updated to "Add Assessment" and "View Progress" buttons).
    -   Tab styling ( `TabsList` and `TabsTrigger` in `PatientProfile.tsx`) updated to align with the styling in `frontend/src/pages/dashboard/index.tsx`, including icons (`Calendar`, `FileEdit`, `FilePlus`).
-   **`ClinicalAssessments.tsx`** (`frontend/src/components/patients/clinical-assessments.tsx`):
    -   Created as a new component.
    -   UI evolved from a simple list of assessment categories to a card-based layout, and finally to a table-based layout.
    -   The table displays columns for "Category" (using a colored `Badge` with a `Tooltip`), "Measure", and "Last Assessed". The "Last Value" column was removed.
    -   Mock data (`mockPatientAssessments`) was introduced and integrated to populate the table. The displayed data is filtered to only include measures for which mock data exists.
    -   Keys in `mockPatientAssessments` were corrected to use hyphens (e.g., `muscle-strength_0`) to match the dynamically generated measure IDs, resolving data display issues.
    -   The "Measure" column header is now left-aligned.
    -   Linter warnings (unused imports, `hasOwnProperty`) addressed.
    -   A message "No assessment data available." is shown if the filtered list of measures with mock data is empty.

## Active Decisions & Considerations

### API Path Structure
- **Date**: 2025-05-26
- **Focus**: Refining UI for Patient Profile, specifically the Clinical Assessments tab. Ongoing backend integration for EMG data.
- **Recent Changes**:
    - **UI Enhancements for `PatientProfile.tsx` and `ClinicalAssessments.tsx`**:
        -   In `PatientProfile.tsx`:
            -   Tabs updated to "Sessions", "Clinical Assessments", "Notes". "Overview" tab and its content (e.g., `EmgVisualization`, `TreatmentTimeline`) were removed.
            -   "Clinical Assessments" tab now uses the new `ClinicalAssessments` component instead of `TreatmentConfig`.
            -   "Edit Assessment" button in the "Clinical Assessments" tab header changed to "Manage Assessments" (subsequently updated to "Add Assessment" and "View Progress" buttons).
            -   Tab styling ( `TabsList` and `TabsTrigger` in `PatientProfile.tsx`) updated to align with the styling in `frontend/src/pages/dashboard/index.tsx`, including icons (`Calendar`, `FileEdit`, `FilePlus`).
        -   In `ClinicalAssessments.tsx`:
            -   Component created in `frontend/src/components/patients/clinical-assessments.tsx`.
            -   Initial implementation listed assessment categories.
            -   Iteratively improved UI:
                -   Card view with reduced padding and two-column grid for measures.
                -   Table view implemented with colored badges for categories (with tooltips), "Measure", "Last Value" (later removed), and "Last Assessed" columns.
                -   Mock data (`mockPatientAssessments`) added to populate the table, with logic to display data or "N/A".
                -   Corrected mock data keys to match generated measure IDs (hyphens vs. underscores).
                -   Filtered measures to display only those with mock data.
                -   "Last Value" column removed.
                -   "Measure" column header aligned to the left.
            -   Linter warnings (unused imports, `hasOwnProperty`) addressed.
    - **C3D Processing & EMG Analysis Components** (previous focus, largely stable):
        - Successfully fixed C3D file upload functionality by aligning API route prefixes
        - Fixed Docker configuration for ezc3d library dependencies using a single-stage build approach
        - Added system dependencies for runtime support of scientific libraries
        - Added proper location block for `/v1/` paths to proxy to backend
        - Ensured consistent routing for all API endpoints

### Nginx Configuration Refinement (2025-05-24)
- Added proper location block for `/v1/` paths to proxy to backend
- Ensured consistent routing for all API endpoints

### UI Enhancements for Patient Profile & Clinical Assessments (2025-05-26)
-   **`PatientProfile.tsx`**:
    -   Tabs modified to "Sessions", "Clinical Assessments", "Notes". "Overview" tab and its content (e.g., `EmgVisualization`, `TreatmentTimeline`) were removed.
    -   "Clinical Assessments" tab now uses the new `ClinicalAssessments` component instead of `TreatmentConfig`.
    -   "Edit Assessment" button in the "Clinical Assessments" tab header changed to "Manage Assessments" (subsequently updated to "Add Assessment" and "View Progress" buttons).
    -   Tab styling ( `TabsList` and `TabsTrigger` in `PatientProfile.tsx`) updated to align with the styling in `frontend/src/pages/dashboard/index.tsx`, including icons (`Calendar`, `FileEdit`, `FilePlus`).
-   **`ClinicalAssessments.tsx`** (`frontend/src/components/patients/clinical-assessments.tsx`):
    -   Created as a new component.
    -   UI evolved from a simple list of assessment categories to a card-based layout, and finally to a table-based layout.
    -   The table displays columns for "Category" (using a colored `Badge` with a `Tooltip`), "Measure", and "Last Assessed". The "Last Value" column was removed.
    -   Mock data (`mockPatientAssessments`) was introduced and integrated to populate the table. The displayed data is filtered to only include measures for which mock data exists.
    -   Keys in `mockPatientAssessments` were corrected to use hyphens (e.g., `muscle-strength_0`) to match the dynamically generated measure IDs, resolving data display issues.
    -   The "Measure" column header is now left-aligned.
    -   Linter warnings (unused imports, `hasOwnProperty`) addressed.
    -   A message "No assessment data available." is shown if the filtered list of measures with mock data is empty.

## Active Decisions & Considerations

### API Path Structure
- **Date**: 2025-05-26
- **Focus**: Refining UI for Patient Profile, specifically the Clinical Assessments tab. Ongoing backend integration for EMG data.
- **Recent Changes**:
    - **UI Enhancements for `PatientProfile.tsx` and `ClinicalAssessments.tsx`**:
        -   In `PatientProfile.tsx`:
            -   Tabs updated to "Sessions", "Clinical Assessments", "Notes". "Overview" tab and its content (e.g., `EmgVisualization`, `TreatmentTimeline`) were removed.
            -   "Clinical Assessments" tab now uses the new `ClinicalAssessments` component instead of `TreatmentConfig`.
            -   "Edit Assessment" button in the "Clinical Assessments" tab header changed to "Manage Assessments" (subsequently updated to "Add Assessment" and "View Progress" buttons).
            -   Tab styling ( `TabsList` and `TabsTrigger` in `PatientProfile.tsx`) updated to align with the styling in `frontend/src/pages/dashboard/index.tsx`, including icons (`Calendar`, `FileEdit`, `FilePlus`).
        -   In `ClinicalAssessments.tsx`:
            -   Component created in `frontend/src/components/patients/clinical-assessments.tsx`.
            -   Initial implementation listed assessment categories.
            -   Iteratively improved UI:
                -   Card view with reduced padding and two-column grid for measures.
                -   Table view implemented with colored badges for categories (with tooltips), "Measure", "Last Value" (later removed), and "Last Assessed" columns.
                -   Mock data (`mockPatientAssessments`) added to populate the table, with logic to display data or "N/A".
                -   Corrected mock data keys to match generated measure IDs (hyphens vs. underscores).
                -   Filtered measures to display only those with mock data.
                -   "Last Value" column removed.
                -   "Measure" column header aligned to the left.
            -   Linter warnings (unused imports, `hasOwnProperty`) addressed.
    - **C3D Processing & EMG Analysis Components** (previous focus, largely stable):
        - Successfully fixed C3D file upload functionality by aligning API route prefixes
        - Fixed Docker configuration for ezc3d library dependencies using a single-stage build approach
        - Added system dependencies for runtime support of scientific libraries
        - Added proper location block for `/v1/` paths to proxy to backend
        - Ensured consistent routing for all API endpoints

### Nginx Configuration Refinement (2025-05-24)
- Added proper location block for `/v1/` paths to proxy to backend
- Ensured consistent routing for all API endpoints

### UI Enhancements for Patient Profile & Clinical Assessments (2025-05-26)
-   **`PatientProfile.tsx`**:
    -   Tabs modified to "Sessions", "Clinical Assessments", "Notes". "Overview" tab and its content (e.g., `EmgVisualization`, `TreatmentTimeline`) were removed.
    -   "Clinical Assessments" tab now uses the new `ClinicalAssessments` component instead of `TreatmentConfig`.
    -   "Edit Assessment" button in the "Clinical Assessments" tab header changed to "Manage Assessments" (subsequently updated to "Add Assessment" and "View Progress" buttons).
    -   Tab styling ( `TabsList` and `TabsTrigger` in `PatientProfile.tsx`) updated to align with the styling in `frontend/src/pages/dashboard/index.tsx`, including icons (`Calendar`, `FileEdit`, `FilePlus`).
-   **`ClinicalAssessments.tsx`** (`frontend/src/components/patients/clinical-assessments.tsx`):
    -   Created as a new component.
    -   UI evolved from a simple list of assessment categories to a card-based layout, and finally to a table-based layout.
    -   The table displays columns for "Category" (using a colored `Badge` with a `Tooltip`), "Measure", and "Last Assessed". The "Last Value" column was removed.
    -   Mock data (`mockPatientAssessments`) was introduced and integrated to populate the table. The displayed data is filtered to only include measures for which mock data exists.
    -   Keys in `mockPatientAssessments` were corrected to use hyphens (e.g., `muscle-strength_0`) to match the dynamically generated measure IDs, resolving data display issues.
    -   The "Measure" column header is now left-aligned.
    -   Linter warnings (unused imports, `hasOwnProperty`) addressed.
    -   A message "No assessment data available." is shown if the filtered list of measures with mock data is empty.

## Active Decisions & Considerations

### API Path Structure
- **Date**: 2025-05-26
- **Focus**: Refining UI for Patient Profile, specifically the Clinical Assessments tab. Ongoing backend integration for EMG data.
- **Recent Changes**:
    - **UI Enhancements for `PatientProfile.tsx` and `ClinicalAssessments.tsx`**:
        -   In `PatientProfile.tsx`:
            -   Tabs updated to "Sessions", "Clinical Assessments", "Notes". "Overview" tab and its content (e.g., `EmgVisualization`, `TreatmentTimeline`) were removed.
            -   "Clinical Assessments" tab now uses the new `ClinicalAssessments` component instead of `TreatmentConfig`.
            -   "Edit Assessment" button in the "Clinical Assessments" tab header changed to "Manage Assessments" (subsequently updated to "Add Assessment" and "View Progress" buttons).
            -   Tab styling ( `TabsList` and `TabsTrigger` in `PatientProfile.tsx`) updated to align with the styling in `frontend/src/pages/dashboard/index.tsx`, including icons (`Calendar`, `FileEdit`, `FilePlus`).
        -   In `ClinicalAssessments.tsx`:
            -   Component created in `frontend/src/components/patients/clinical-assessments.tsx`.
            -   Initial implementation listed assessment categories.
            -   Iteratively improved UI:
                -   Card view with reduced padding and two-column grid for measures.
                -   Table view implemented with colored badges for categories (with tooltips), "Measure", "Last Value" (later removed), and "Last Assessed" columns.
                -   Mock data (`mockPatientAssessments`) added to populate the table, with logic to display data or "N/A".
                -   Corrected mock data keys to match generated measure IDs (hyphens vs. underscores).
                -   Filtered measures to display only those with mock data.
                -   "Last Value" column removed.
                -   "Measure" column header aligned to the left.
            -   Linter warnings (unused imports, `hasOwnProperty`) addressed.
    - **C3D Processing & EMG Analysis Components** (previous focus, largely stable):
        - Successfully fixed C3D file upload functionality by aligning API route prefixes
        - Fixed Docker configuration for ezc3d library dependencies using a single-stage build approach
        - Added system dependencies for runtime support of scientific libraries
        - Added proper location block for `/v1/` paths to proxy to backend
        - Ensured consistent routing for all API endpoints

### Nginx Configuration Refinement (2025-05-24)
- Added proper location block for `/v1/` paths to proxy to backend
- Ensured consistent routing for all API endpoints

### UI Enhancements for Patient Profile & Clinical Assessments (2025-05-26)
-   **`PatientProfile.tsx`**:
    -   Tabs modified to "Sessions", "Clinical Assessments", "Notes". "Overview" tab and its content (e.g., `EmgVisualization`, `TreatmentTimeline`) were removed.
    -   "Clinical Assessments" tab now uses the new `ClinicalAssessments` component instead of `TreatmentConfig`.
    -   "Edit Assessment" button in the "Clinical Assessments" tab header changed to "Manage Assessments" (subsequently updated to "Add Assessment" and "View Progress" buttons).
    -   Tab styling ( `TabsList` and `TabsTrigger` in `PatientProfile.tsx`) updated to align with the styling in `frontend/src/pages/dashboard/index.tsx`, including icons (`Calendar`, `FileEdit`, `FilePlus`).
-   **`ClinicalAssessments.tsx`** (`frontend/src/components/patients/clinical-assessments.tsx`):
    -   Created as a new component.
    -   UI evolved from a simple list of assessment categories to a card-based layout, and finally to a table-based layout.
    -   The table displays columns for "Category" (using a colored `Badge` with a `Tooltip`), "Measure", and "Last Assessed". The "Last Value" column was removed.
    -   Mock data (`mockPatientAssessments`) was introduced and integrated to populate the table. The displayed data is filtered to only include measures for which mock data exists.
    -   Keys in `mockPatientAssessments` were corrected to use hyphens (e.g., `muscle-strength_0`) to match the dynamically generated measure IDs, resolving data display issues.
    -   The "Measure" column header is now left-aligned.
    -   Linter warnings (unused imports, `hasOwnProperty`) addressed.
    -   A message "No assessment data available." is shown if the filtered list of measures with mock data is empty.

## Active Decisions & Considerations

### API Path Structure
- **Date**: 2025-05-26
- **Focus**: Refining UI for Patient Profile, specifically the Clinical Assessments tab. Ongoing backend integration for EMG data.
- **Recent Changes**:
    - **UI Enhancements for `PatientProfile.tsx` and `ClinicalAssessments.tsx`**:
        -   In `PatientProfile.tsx`:
            -   Tabs updated to "Sessions", "Clinical Assessments", "Notes". "Overview" tab and its content (e.g., `EmgVisualization`, `TreatmentTimeline`) were removed.
            -   "Clinical Assessments" tab now uses the new `ClinicalAssessments` component instead of `TreatmentConfig`.
            -   "Edit Assessment" button in the "Clinical Assessments" tab header changed to "Manage Assessments" (subsequently updated to "Add Assessment" and "View Progress" buttons).
            -   Tab styling ( `TabsList` and `TabsTrigger` in `PatientProfile.tsx`) updated to align with the styling in `frontend/src/pages/dashboard/index.tsx`, including icons (`Calendar`, `FileEdit`, `FilePlus`).
        -   In `ClinicalAssessments.tsx`:
            -   Component created in `frontend/src/components/patients/clinical-assessments.tsx`.
            -   Initial implementation listed assessment categories.
            -   Iteratively improved UI:
                -   Card view with reduced padding and two-column grid for measures.
                -   Table view implemented with colored badges for categories (with tooltips), "Measure", "Last Value" (later removed), and "Last Assessed" columns.
                -   Mock data (`mockPatientAssessments`) added to populate the table, with logic to display data or "N/A".
                -   Corrected mock data keys to match generated measure IDs (hyphens vs. underscores).
                -   Filtered measures to display only those with mock data.
                -   "Last Value" column removed.
                -   "Measure" column header aligned to the left.
            -   Linter warnings (unused imports, `hasOwnProperty`) addressed.
    - **C3D Processing & EMG Analysis Components** (previous focus, largely stable):
        - Successfully fixed C3D file upload functionality by aligning API route prefixes
        - Fixed Docker configuration for ezc3d library dependencies using a single-stage build approach
        - Added system dependencies for runtime support of scientific libraries
        - Added proper location block for `/v1/` paths to proxy to backend
        - Ensured consistent routing for all API endpoints

### Nginx Configuration Refinement (2025-05-24)
- Added proper location block for `/v1/` paths to proxy to backend
- Ensured consistent routing for all API endpoints

### UI Enhancements for Patient Profile & Clinical Assessments (2025-05-26)
-   **`PatientProfile.tsx`**:
    -   Tabs modified to "Sessions", "Clinical Assessments", "Notes". "Overview" tab and its content (e.g., `EmgVisualization`, `TreatmentTimeline`) were removed.
    -   "Clinical Assessments" tab now uses the new `ClinicalAssessments` component instead of `TreatmentConfig`.
    -   "Edit Assessment" button in the "Clinical Assessments" tab header changed to "Manage Assessments" (subsequently updated to "Add Assessment" and "View Progress" buttons).
    -   Tab styling ( `TabsList` and `TabsTrigger` in `PatientProfile.tsx`) updated to align with the styling in `frontend/src/pages/dashboard/index.tsx`, including icons (`Calendar`, `FileEdit`, `FilePlus`).
-   **`ClinicalAssessments.tsx`** (`frontend/src/components/patients/clinical-assessments.tsx`):
    -   Created as a new component.
    -   UI evolved from a simple list of assessment categories to a card-based layout, and finally to a table-based layout.
    -   The table displays columns for "Category" (using a colored `Badge` with a `Tooltip`), "Measure", and "Last Assessed". The "Last Value" column was removed.
    -   Mock data (`mockPatientAssessments`) was introduced and integrated to populate the table. The displayed data is filtered to only include measures for which mock data exists.
    -   Keys in `mockPatientAssessments` were corrected to use hyphens (e.g., `muscle-strength_0`) to match the dynamically generated measure IDs, resolving data display issues.
    -   The "Measure" column header is now left-aligned.
    -   Linter warnings (unused imports, `hasOwnProperty`) addressed.
    -   A message "No assessment data available." is shown if the filtered list of measures with mock data is empty.

## Active Decisions & Considerations

### API Path Structure
- **Date**: 2025-05-26
- **Focus**: Refining UI for Patient Profile, specifically the Clinical Assessments tab. Ongoing backend integration for EMG data.
- **Recent Changes**:
    - **UI Enhancements for `PatientProfile.tsx` and `ClinicalAssessments.tsx`**:
        -   In `PatientProfile.tsx`:
            -   Tabs updated to "Sessions", "Clinical Assessments", "Notes". "Overview" tab and its content (e.g., `EmgVisualization`, `TreatmentTimeline`) were removed.
            -   "Clinical Assessments" tab now uses the new `ClinicalAssessments` component instead of `TreatmentConfig`.
            -   "Edit Assessment" button in the "Clinical Assessments" tab header changed to "Manage Assessments" (subsequently updated to "Add Assessment" and "View Progress" buttons).
            -   Tab styling ( `TabsList` and `TabsTrigger` in `PatientProfile.tsx`) updated to align with the styling in `frontend/src/pages/dashboard/index.tsx`, including icons (`Calendar`, `FileEdit`, `FilePlus`).
        -   In `ClinicalAssessments.tsx`:
            -   Component created in `frontend/src/components/patients/clinical-assessments.tsx`.
            -   Initial implementation listed assessment categories.
            -   Iteratively improved UI:
                -   Card view with reduced padding and two-column grid for measures.
                -   Table view implemented with colored badges for categories (with tooltips), "Measure", "Last Value" (later removed), and "Last Assessed" columns.
                -   Mock data (`mockPatientAssessments`) added to populate the table, with logic to display data or "N/A".
                -   Corrected mock data keys to match generated measure IDs (hyphens vs. underscores).
                -   Filtered measures to display only those with mock data.
                -   "Last Value" column removed.
                -   "Measure" column header aligned to the left.
            -   Linter warnings (unused imports, `hasOwnProperty`) addressed.
    - **C3D Processing & EMG Analysis Components** (previous focus, largely stable):
        - Successfully fixed C3D file upload functionality by aligning API route prefixes
        - Fixed Docker configuration for ezc3d library dependencies using a single-stage build approach
        - Added system dependencies for runtime support of scientific libraries
        - Added proper location block for `/v1/` paths to proxy to backend
        - Ensured consistent routing for all API endpoints

### Nginx Configuration Refinement (2025-05-24)
- Added proper location block for `/v1/` paths to proxy to backend
- Ensured consistent routing for all API endpoints

### UI Enhancements for Patient Profile & Clinical Assessments (2025-05-26)
-   **`PatientProfile.tsx`**:
    -   Tabs modified to "Sessions", "Clinical Assessments", "Notes". "Overview" tab and its content (e.g., `EmgVisualization`, `TreatmentTimeline`) were removed.
    -   "Clinical Assessments" tab now uses the new `ClinicalAssessments` component instead of `TreatmentConfig`.
    -   "Edit Assessment" button in the "Clinical Assessments" tab header changed to "Manage Assessments" (subsequently updated to "Add Assessment" and "View Progress" buttons).
    -   Tab styling ( `TabsList` and `TabsTrigger` in `PatientProfile.tsx`) updated to align with the styling in `frontend/src/pages/dashboard/index.tsx`, including icons (`Calendar`, `FileEdit`, `FilePlus`).
-   **`ClinicalAssessments.tsx`** (`frontend/src/components/patients/clinical-assessments.tsx`):
    -   Created as a new component.
    -   UI evolved from a simple list of assessment categories to a card-based layout, and finally to a table-based layout.
    -   The table displays columns for "Category" (using a colored `Badge` with a `Tooltip`), "Measure", and "Last Assessed". The "Last Value" column was removed.
    -   Mock data (`mockPatientAssessments`) was introduced and integrated to populate the table. The displayed data is filtered to only include measures for which mock data exists.
    -   Keys in `mockPatientAssessments` were corrected to use hyphens (e.g., `muscle-strength_0`) to match the dynamically generated measure IDs, resolving data display issues.
    -   The "Measure" column header is now left-aligned.
    -   Linter warnings (unused imports, `hasOwnProperty`) addressed.
    -   A message "No assessment data available." is shown if the filtered list of measures with mock data is empty.

## Active Decisions & Considerations

### API Path Structure
- **Date**: 2025-05-26
- **Focus**: Refining UI for Patient Profile, specifically the Clinical Assessments tab. Ongoing backend integration for EMG data.
- **Recent Changes**:
    - **UI Enhancements for `PatientProfile.tsx` and `ClinicalAssessments.tsx`**:
        -   In `PatientProfile.tsx`:
            -   Tabs updated to "Sessions", "Clinical Assessments", "Notes". "Overview" tab and its content (e.g., `EmgVisualization`, `TreatmentTimeline`) were removed.
            -   "Clinical Assessments" tab now uses the new `ClinicalAssessments` component instead of `TreatmentConfig`.
            -   "Edit Assessment" button in the "Clinical Assessments" tab header changed to "Manage Assessments" (subsequently updated to "Add Assessment" and "View Progress" buttons).
            -   Tab styling ( `TabsList` and `TabsTrigger` in `PatientProfile.tsx`) updated to align with the styling in `frontend/src/pages/dashboard/index.tsx`, including icons (`Calendar`, `FileEdit`, `FilePlus`).
        -   In `ClinicalAssessments.tsx`:
            -   Component created in `frontend/src/components/patients/clinical-assessments.tsx`.
            -   Initial implementation listed assessment categories.
            -   Iteratively improved UI:
                -   Card view with reduced padding and two-column grid for measures.
                -   Table view implemented with colored badges for categories (with tooltips), "Measure", "Last Value" (later removed), and "Last Assessed" columns.
                -   Mock data (`mockPatientAssessments`) added to populate the table, with logic to display data or "N/A".
                -   Corrected mock data keys to match generated measure IDs (hyphens vs. underscores).
                -   Filtered measures to display only those with mock data.
                -   "Last Value" column removed.
                -   "Measure" column header aligned to the left.
            -   Linter warnings (unused imports, `hasOwnProperty`) addressed.
    - **C3D Processing & EMG Analysis Components** (previous focus, largely stable):
        - Successfully fixed C3D file upload functionality by aligning API route prefixes
        - Fixed Docker configuration for ezc3d library dependencies using a single-stage build approach
        - Added system dependencies for runtime support of scientific libraries
        - Added proper location block for `/v1/` paths to proxy to backend
        - Ensured consistent routing for all API endpoints

### Nginx Configuration Refinement (2025-05-24)
- Added proper location block for `/v1/` paths to proxy to backend
- Ensured consistent routing for all API endpoints

### UI Enhancements for Patient Profile & Clinical Assessments (2025-05-26)
-   **`PatientProfile.tsx`**:
    -   Tabs modified to "Sessions", "Clinical Assessments", "Notes". "Overview" tab and its content (e.g., `EmgVisualization`, `TreatmentTimeline`) were removed.
    -   "Clinical Assessments" tab now uses the new `ClinicalAssessments` component instead of `TreatmentConfig`.
    -   "Edit Assessment" button in the "Clinical Assessments" tab header changed to "Manage Assessments" (subsequently updated to "Add Assessment" and "View Progress" buttons).
    -   Tab styling ( `TabsList` and `TabsTrigger` in `PatientProfile.tsx`) updated to align with the styling in `frontend/src/pages/dashboard/index.tsx`, including icons (`Calendar`, `FileEdit`, `FilePlus`).
-   **`ClinicalAssessments.tsx`** (`frontend/src/components/patients/clinical-assessments.tsx`):
    -   Created as a new component.
    -   UI evolved from a simple list of assessment categories to a card-based layout, and finally to a table-based layout.
    -   The table displays columns for "Category" (using a colored `Badge` with a `Tooltip`), "Measure", and "Last Assessed". The "Last Value" column was removed.
    -   Mock data (`mockPatientAssessments`) was introduced and integrated to populate the table. The displayed data is filtered to only include measures for which mock data exists.
    -   Keys in `mockPatientAssessments` were corrected to use hyphens (e.g., `muscle-strength_0`) to match the dynamically generated measure IDs, resolving data display issues.
    -   The "Measure" column header is now left-aligned.
    -   Linter warnings (unused imports, `hasOwnProperty`) addressed.
    -   A message "No assessment data available." is shown if the filtered list of measures with mock data is empty.

## Active Decisions & Considerations

### API Path Structure
- **Date**: 2025-05-26
- **Focus**: Refining UI for Patient Profile, specifically the Clinical Assessments tab. Ongoing backend integration for EMG data.
- **Recent Changes**:
    - **UI Enhancements for `PatientProfile.tsx` and `ClinicalAssessments.tsx`**:
        -   In `PatientProfile.tsx`:
            -   Tabs updated to "Sessions", "Clinical Assessments", "Notes". "Overview" tab and its content (e.g., `EmgVisualization`, `TreatmentTimeline`) were removed.
            -   "Clinical Assessments" tab now uses the new `ClinicalAssessments` component instead of `TreatmentConfig`.
            -   "Edit Assessment" button in the "Clinical Assessments" tab header changed to "Manage Assessments" (subsequently updated to "Add Assessment" and "View Progress" buttons).
            -   Tab styling ( `TabsList` and `TabsTrigger` in `PatientProfile.tsx`) updated to align with the styling in `frontend/src/pages/dashboard/index.tsx`, including icons (`Calendar`, `FileEdit`, `FilePlus`).
        -   In `ClinicalAssessments.tsx`:
            -   Component created in `frontend/src/components/patients/clinical-assessments.tsx`.
            -   Initial implementation listed assessment categories.
            -   Iteratively improved UI:
                -   Card view with reduced padding and two-column grid for measures.
                -   Table view implemented with colored badges for categories (with tooltips), "Measure", "Last Value" (later removed), and "Last Assessed" columns.
                -   Mock data (`mockPatientAssessments`) added to populate the table, with logic to display data or "N/A".
                -   Corrected mock data keys to match generated measure IDs (hyphens vs. underscores).
                -   Filtered measures to display only those with mock data.
                -   "Last Value" column removed.
                -   "Measure" column header aligned to the left.
            -   Linter warnings (unused imports, `hasOwnProperty`) addressed.
    - **C3D Processing & EMG Analysis Components** (previous focus, largely stable):
        - Successfully fixed C3D file upload functionality by aligning API route prefixes
        - Fixed Docker configuration for ezc3d library dependencies using a single-stage build approach
        - Added system dependencies for runtime support of scientific libraries
        - Added proper location block for `/v1/` paths to proxy to backend
        - Ensured consistent routing for all API endpoints

### Nginx Configuration Refinement (2025-05-24)
- Added proper location block for `/v1/` paths to proxy to backend
- Ensured consistent routing for all API endpoints

### UI Enhancements for Patient Profile & Clinical Assessments (2025-05-26)
-   **`PatientProfile.tsx`**:
    -   Tabs modified to "Sessions", "Clinical Assessments", "Notes". "Overview" tab and its content (e.g., `EmgVisualization`, `TreatmentTimeline`) were removed.
    -   "Clinical Assessments" tab now uses the new `ClinicalAssessments` component instead of `TreatmentConfig`.
    -   "Edit Assessment" button in the "Clinical Assessments" tab header changed to "Manage Assessments" (subsequently updated to "Add Assessment" and "View Progress" buttons).
    -   Tab styling ( `TabsList` and `TabsTrigger` in `PatientProfile.tsx`) updated to align with the styling in `frontend/src/pages/dashboard/index.tsx`, including icons (`Calendar`, `FileEdit`, `FilePlus`).
-   **`ClinicalAssessments.tsx`** (`frontend/src/components/patients/clinical-assessments.tsx`):
    -   Created as a new component.
    -   UI evolved from a simple list of assessment categories to a card-based layout, and finally to a table-based layout.
    -   The table displays columns for "Category" (using a colored `Badge` with a `Tooltip`), "Measure", and "Last Assessed". The "Last Value" column was removed.
    -   Mock data (`mockPatientAssessments`) was introduced and integrated to populate the table. The displayed data is filtered to only include measures for which mock data exists.
    -   Keys in `mockPatientAssessments` were corrected to use hyphens (e.g., `muscle-strength_0`) to match the dynamically generated measure IDs, resolving data display issues.
    -   The "Measure" column header is now left-aligned.
    -   Linter warnings (unused imports, `hasOwnProperty`) addressed.
    -   A message "No assessment data available." is shown if the filtered list of measures with mock data is empty.

## Active Decisions & Considerations

### API Path Structure
- **Date**: 2025-05-26
- **Focus**: Refining UI for Patient Profile, specifically the Clinical Assessments tab. Ongoing backend integration for EMG data.
- **Recent Changes**:
    - **UI Enhancements for `PatientProfile.tsx` and `ClinicalAssessments.tsx`**:
        -   In `PatientProfile.tsx`:
            -   Tabs updated to "Sessions", "Clinical Assessments", "Notes". "Overview" tab and its content (e.g., `EmgVisualization`, `TreatmentTimeline`) were removed.
            -   "Clinical Assessments" tab now uses the new `ClinicalAssessments` component instead of `TreatmentConfig`.
            -   "Edit Assessment" button in the "Clinical Assessments" tab header changed to "Manage Assessments" (subsequently updated to "Add Assessment" and "View Progress" buttons).
            -   Tab styling ( `TabsList` and `TabsTrigger` in `PatientProfile.tsx`) updated to align with the styling in `frontend/src/pages/dashboard/index.tsx`, including icons (`Calendar`, `FileEdit`, `FilePlus`).
        -   In `ClinicalAssessments.tsx`:
            -   Component created in `frontend/src/components/patients/clinical-assessments.tsx`.
            -   Initial implementation listed assessment categories.
            -   Iteratively improved UI:
                -   Card view with reduced padding and two-column grid for measures.
                -   Table view implemented with colored badges for categories (with tooltips), "Measure", "Last Value" (later removed), and "Last Assessed" columns.
                -   Mock data (`mockPatientAssessments`) added to populate the table, with logic to display data or "N/A".
                -   Corrected mock data keys to match generated measure IDs (hyphens vs. underscores).
                -   Filtered measures to display only those with mock data.
                -   "Last Value" column removed.
                -   "Measure" column header aligned to the left.
            -   Linter warnings (unused imports, `hasOwnProperty`) addressed.
    - **C3D Processing & EMG Analysis Components** (previous focus, largely stable):
        - Successfully fixed C3D file upload functionality by aligning API route prefixes
        - Fixed Docker configuration for ezc3d library dependencies using a single-stage build approach
        - Added system dependencies for runtime support of scientific libraries
        - Added proper location block for `/v1/` paths to proxy to backend
        - Ensured consistent routing for all API endpoints

### Nginx Configuration Refinement (2025-05-24)
- Added proper location block for `/v1/` paths to proxy to backend
- Ensured consistent routing for all API endpoints

### UI Enhancements for Patient Profile & Clinical Assessments (2025-05-26)
-   **`PatientProfile.tsx`**:
    -   Tabs modified to "Sessions", "Clinical Assessments", "Notes". "Overview" tab and its content (e.g., `EmgVisualization`, `TreatmentTimeline`) were removed.
    -   "Clinical Assessments" tab now uses the new `ClinicalAssessments` component instead of `TreatmentConfig`.
    -   "Edit Assessment" button in the "Clinical Assessments" tab header changed to "Manage Assessments" (subsequently updated to "Add Assessment" and "View Progress" buttons).
    -   Tab styling ( `TabsList` and `TabsTrigger` in `PatientProfile.tsx`) updated to align with the styling in `frontend/src/pages/dashboard/index.tsx`, including icons (`Calendar`, `FileEdit`, `FilePlus`).
-   **`ClinicalAssessments.tsx`** (`frontend/src/components/patients/clinical-assessments.tsx`):
    -   Created as a new component.
    -   UI evolved from a simple list of assessment categories to a card-based layout, and finally to a table-based layout.
    -   The table displays columns for "Category" (using a colored `Badge` with a `Tooltip`), "Measure", and "Last Assessed". The "Last Value" column was removed.
    -   Mock data (`mockPatientAssessments`) was introduced and integrated to populate the table. The displayed data is filtered to only include measures for which mock data exists.
    -   Keys in `mockPatientAssessments` were corrected to use hyphens (e.g., `muscle-strength_0`) to match the dynamically generated measure IDs, resolving data display issues.
    -   The "Measure" column header is now left-aligned.
    -   Linter warnings (unused imports, `hasOwnProperty`) addressed.
    -   A message "No assessment data available." is shown if the filtered list of measures with mock data is empty.

## Active Decisions & Considerations

### API Path Structure
- **Date**: 2025-05-26
- **Focus**: Refining UI for Patient Profile, specifically the Clinical Assessments tab. Ongoing backend integration for EMG data.
- **Recent Changes**:
    - **UI Enhancements for `PatientProfile.tsx` and `ClinicalAssessments.tsx`**:
        -   In `PatientProfile.tsx`:
            -   Tabs updated to "Sessions", "Clinical Assessments", "Notes". "Overview" tab and its content (e.g., `EmgVisualization`, `TreatmentTimeline`) were removed.
            -   "Clinical Assessments" tab now uses the new `ClinicalAssessments` component instead of `TreatmentConfig`.
            -   "Edit Assessment" button in the "Clinical Assessments" tab header changed to "Manage Assessments" (subsequently updated to "Add Assessment" and "View Progress" buttons).
            -   Tab styling ( `TabsList` and `TabsTrigger` in `PatientProfile.tsx`) updated to align with the styling in `frontend/src/pages/dashboard/index.tsx`, including icons (`Calendar`, `FileEdit`, `FilePlus`).
        -   In `ClinicalAssessments.tsx`:
            -   Component created in `frontend/src/components/patients/clinical-assessments.tsx`.
            -   Initial implementation listed assessment categories.
            -   Iteratively improved UI:
                -   Card view with reduced padding and two-column grid for measures.
                -   Table view implemented with colored badges for categories (with tooltips), "Measure", "Last Value" (later removed), and "Last Assessed" columns.
                -   Mock data (`mockPatientAssessments`) added to populate the table, with logic to display data or "N/A".
                -   Corrected mock data keys to match generated measure IDs (hyphens vs. underscores).
                -   Filtered measures to display only those with mock data.
                -   "Last Value" column removed.
                -   "Measure" column header aligned to the left.
            -   Linter warnings (unused imports, `hasOwnProperty`) addressed.
    - **C3D Processing & EMG Analysis Components** (previous focus, largely stable):
        - Successfully fixed C3D file upload functionality by aligning API route prefixes
        - Fixed Docker configuration for ezc3d library dependencies using a single-stage build approach
        - Added system dependencies for runtime support of scientific libraries
        - Added proper location block for `/v1/` paths to proxy to backend
        - Ensured consistent routing for all API endpoints

### Nginx Configuration Refinement (2025-05-24)
- Added proper location block for `/v1/` paths to proxy to backend
- Ensured consistent routing for all API endpoints

### UI Enhancements for Patient Profile & Clinical Assessments (2025-05-26)
-   **`PatientProfile.tsx`**:
    -   Tabs modified to "Sessions", "Clinical Assessments", "Notes". "Overview" tab and its content (e.g., `EmgVisualization`, `TreatmentTimeline`) were removed.
    -   "Clinical Assessments" tab now uses the new `ClinicalAssessments` component instead of `TreatmentConfig`.
    -   "Edit Assessment" button in the "Clinical Assessments" tab header changed to "Manage Assessments" (subsequently updated to "Add Assessment" and "View Progress" buttons).
    -   Tab styling ( `TabsList` and `TabsTrigger` in `PatientProfile.tsx`) updated to align with the styling in `frontend/src/pages/dashboard/index.tsx`, including icons (`Calendar`, `FileEdit`, `FilePlus`).
-   **`ClinicalAssessments.tsx`** (`frontend/src/components/patients/clinical-assessments.tsx`):
    -   Created as a new component.
    -   UI evolved from a simple list of assessment categories to a card-based layout, and finally to a table-based layout.
    -   The table displays columns for "Category" (using a colored `Badge` with a `Tooltip`), "Measure", and "Last Assessed". The "Last Value" column was removed.
    -   Mock data (`mockPatientAssessments`) was introduced and integrated to populate the table. The displayed data is filtered to only include measures for which mock data exists.
    -   Keys in `mockPatientAssessments` were corrected to use hyphens (e.g., `muscle-strength_0`) to match the dynamically generated measure IDs, resolving data display issues.
    -   The "Measure" column header is now left-aligned.
    -   Linter warnings (unused imports, `hasOwnProperty`) addressed.
    -   A message "No assessment data available." is shown if the filtered list of measures with mock data is empty.

## Active Decisions & Considerations

### API Path Structure
- **Date**: 2025-05-26
- **Focus**: Refining UI for Patient Profile, specifically the Clinical Assessments tab. Ongoing backend integration for EMG data.
- **Recent Changes**:
    - **UI Enhancements for `PatientProfile.tsx` and `ClinicalAssessments.tsx`**:
        -   In `PatientProfile.tsx`:
            -   Tabs updated to "Sessions", "Clinical Assessments", "Notes". "Overview" tab and its content (e.g., `EmgVisualization`, `TreatmentTimeline`) were removed.
            -   "Clinical Assessments" tab now uses the new `ClinicalAssessments` component instead of `TreatmentConfig`.
            -   "Edit Assessment" button in the "Clinical Assessments" tab header changed to "Manage Assessments" (subsequently updated to "Add Assessment" and "View Progress" buttons).
            -   Tab styling ( `TabsList` and `TabsTrigger` in `PatientProfile.tsx`) updated to align with the styling in `frontend/src/pages/dashboard/index.tsx`, including icons (`Calendar`, `FileEdit`, `FilePlus`).
        -   In `ClinicalAssessments.tsx`:
            -   Component created in `frontend/src/components/patients/clinical-assessments.tsx`.
            -   Initial implementation listed assessment categories.
            -   Iteratively improved UI:
                -   Card view with reduced padding and two-column grid for measures.
                -   Table view implemented with colored badges for categories (with tooltips), "Measure", "Last Value" (later removed), and "Last Assessed" columns.
                -   Mock data (`mockPatientAssessments`) added to populate the table, with logic to display data or "N/A".
                -   Corrected mock data keys to match generated measure IDs (hyphens vs. underscores).
                -   Filtered measures to display only those with mock data.
                -   "Last Value" column removed.
                -   "Measure" column header aligned to the left.
            -   Linter warnings (unused imports, `hasOwnProperty`) addressed.
    - **C3D Processing & EMG Analysis Components** (previous focus, largely stable):
        - Successfully fixed C3D file upload functionality by aligning API route prefixes
        - Fixed Docker configuration for ezc3d library dependencies using a single-stage build approach
        - Added system dependencies for runtime support of scientific libraries
        - Added proper location block for `/v1/` paths to proxy to backend
        - Ensured consistent routing for all API endpoints

### Nginx Configuration Refinement (2025-05-24)
- Added proper location block for `/v1/` paths to proxy to backend
- Ensured consistent routing for all API endpoints

### UI Enhancements for Patient Profile & Clinical Assessments (2025-05-26)
-   **`PatientProfile.tsx`**:
    -   Tabs modified to "Sessions", "Clinical Assessments", "Notes". "Overview" tab and its content (e.g., `EmgVisualization`, `TreatmentTimeline`) were removed.
    -   "Clinical Assessments" tab now uses the new `ClinicalAssessments` component instead of `TreatmentConfig`.
    -   "Edit Assessment" button in the "Clinical Assessments" tab header changed to "Manage Assessments" (subsequently updated to "Add Assessment" and "View Progress" buttons).
    -   Tab styling ( `TabsList` and `TabsTrigger` in `PatientProfile.tsx`) updated to align with the styling in `frontend/src/pages/dashboard/index.tsx`, including icons (`Calendar`, `FileEdit`, `FilePlus`).
-   **`ClinicalAssessments.tsx`** (`frontend/src/components/patients/clinical-assessments.tsx`):
    -   Created as a new component.
    -   UI evolved from a simple list of assessment categories to a card-based layout, and finally to a table-based layout.
    -   The table displays columns for "Category" (using a colored `Badge` with a `Tooltip`), "Measure", and "Last Assessed". The "Last Value" column was removed.
    -   Mock data (`mockPatientAssessments`) was introduced and integrated to populate the table. The displayed data is filtered to only include measures for which mock data exists.
    -   Keys in `mockPatientAssessments` were corrected to use hyphens (e.g., `muscle-strength_0`) to match the dynamically generated measure IDs, resolving data display issues.
    -   The "Measure" column header is now left-aligned.
    -   Linter warnings (unused imports, `hasOwnProperty`) addressed.
    -   A message "No assessment data available." is shown if the filtered list of measures with mock data is empty.

## Active Decisions & Considerations

### API Path Structure
- **Date**: 2025-05-26
- **Focus**: Refining UI for Patient Profile, specifically the Clinical Assessments tab. Ongoing backend integration for EMG data.
- **Recent Changes**:
    - **UI Enhancements for `PatientProfile.tsx` and `ClinicalAssessments.tsx`**:
        -   In `PatientProfile.tsx`:
            -   Tabs updated to "Sessions", "Clinical Assessments", "Notes". "Overview" tab and its content (e.g., `EmgVisualization`, `TreatmentTimeline`) were removed.
            -   "Clinical Assessments" tab now uses the new `ClinicalAssessments` component instead of `TreatmentConfig`.
            -   "Edit Assessment" button in the "Clinical Assessments" tab header changed to "Manage Assessments" (subsequently updated to "Add Assessment" and "View Progress" buttons).
            -   Tab styling ( `TabsList` and `TabsTrigger` in `PatientProfile.tsx`) updated to align with the styling in `frontend/src/pages/dashboard/index.tsx`, including icons (`Calendar`, `FileEdit`, `FilePlus`).
        -   In `ClinicalAssessments.tsx`:
            -   Component created in `frontend/src/components/patients/clinical-assessments.tsx`.
            -   Initial implementation listed assessment categories.
            -   Iteratively improved UI:
                -   Card view with reduced padding and two-column grid for measures.
                -   Table view implemented with colored badges for categories (with tooltips), "Measure", "Last Value" (later removed), and "Last Assessed" columns.
                -   Mock data (`mockPatientAssessments`) added to populate the table, with logic to display data or "N/A".
                -   Corrected mock data keys to match generated measure IDs (hyphens vs. underscores).
                -   Filtered measures to display only those with mock data.
                -   "Last Value" column removed.
                -   "Measure" column header aligned to the left.
            -   Linter warnings (unused imports, `hasOwnProperty`) addressed.
    - **C3D Processing & EMG Analysis Components** (previous focus, largely stable):
        - Successfully fixed C3D file upload functionality by aligning API route prefixes
        - Fixed Docker configuration for ezc3d library dependencies using a single-stage build approach
        - Added system dependencies for runtime support of scientific libraries
        - Added proper location block for `/v1/` paths to proxy to backend
        - Ensured consistent routing for all API endpoints

### Nginx Configuration Refinement (2025-05-24)
- Added proper location block for `/v1/` paths to proxy to backend
- Ensured consistent routing for all API endpoints

### UI Enhancements for Patient Profile & Clinical Assessments (2025-05-26)
-   **`PatientProfile.tsx`**:
    -   Tabs modified to "Sessions", "Clinical Assessments", "Notes". "Overview" tab and its content (e.g., `EmgVisualization`, `TreatmentTimeline`) were removed.
    -   "Clinical Assessments" tab now uses the new `ClinicalAssessments` component instead of `TreatmentConfig`.
    -   "Edit Assessment" button in the "Clinical Assessments" tab header changed to "Manage Assessments" (subsequently updated to "Add Assessment" and "View Progress" buttons).
    -   Tab styling ( `TabsList` and `TabsTrigger` in `PatientProfile.tsx`) updated to align with the styling in `frontend/src/pages/dashboard/index.tsx`, including icons (`Calendar`, `FileEdit`, `FilePlus`).
-   **`ClinicalAssessments.tsx`** (`frontend/src/components/patients/clinical-assessments.tsx`):
    -   Created as a new component.
    -   UI evolved from a simple list of assessment categories to a card-based layout, and finally to a table-based layout.
    -   The table displays columns for "Category" (using a colored `Badge` with a `Tooltip`), "Measure", and "Last Assessed". The "Last Value" column was removed.
    -   Mock data (`mockPatientAssessments`) was introduced and integrated to populate the table. The displayed data is filtered to only include measures for which mock data exists.
    -   Keys in `mockPatientAssessments` were corrected to use hyphens (e.g., `muscle-strength_0`) to match the dynamically generated measure IDs, resolving data display issues.
    -   The "Measure" column header is now left-aligned.
    -   Linter warnings (unused imports, `hasOwnProperty`) addressed.
    -   A message "No assessment data available." is shown if the filtered list of measures with mock data is empty.

## Active Decisions & Considerations

### API Path Structure
- **Date**: 2025-05-26
- **Focus**: Refining UI for Patient Profile, specifically the Clinical Assessments tab. Ongoing backend integration for EMG data.
- **Recent Changes**:
    - **UI Enhancements for `PatientProfile.tsx` and `ClinicalAssessments.tsx`**:
        -   In `PatientProfile.tsx`:
            -   Tabs updated to "Sessions", "Clinical Assessments", "Notes". "Overview" tab and its content (e.g., `EmgVisualization`, `TreatmentTimeline`) were removed.
            -   "Clinical Assessments" tab now uses the new `ClinicalAssessments` component instead of `TreatmentConfig`.
            -   "Edit Assessment" button in the "Clinical Assessments" tab header changed to "Manage Assessments" (subsequently updated to "Add Assessment" and "View Progress" buttons).
            -   Tab styling ( `TabsList` and `TabsTrigger` in `PatientProfile.tsx`) updated to align with the styling in `frontend/src/pages/dashboard/index.tsx`, including icons (`Calendar`, `FileEdit`, `FilePlus`).
        -   In `ClinicalAssessments.tsx`:
            -   Component created in `frontend/src/components/patients/clinical-assessments.tsx`.
            -   Initial implementation listed assessment categories.
            -   Iteratively improved UI:
                -   Card view with reduced padding and two-column grid for measures.
                -   Table view implemented with colored badges for categories (with tooltips), "Measure", "Last Value" (later removed), and "Last Assessed" columns.
                -   Mock data (`mockPatientAssessments`) added to populate the table, with logic to display data or "N/A".
                -   Corrected mock data keys to match generated measure IDs (hyphens vs. underscores).
                -   Filtered measures to display only those with mock data.
                -   "Last Value" column removed.
                -   "Measure" column header aligned to the left.
            -   Linter warnings (unused imports, `hasOwnProperty`) addressed.
    - **C3D Processing & EMG Analysis Components** (previous focus, largely stable):
        - Successfully fixed C3D file upload functionality by aligning API route prefixes
        - Fixed Docker configuration for ezc3d library dependencies using a single-stage build approach
        - Added system dependencies for runtime support of scientific libraries
        - Added proper location block for `/v1/` paths to proxy to backend
        - Ensured consistent routing for all API endpoints

### Nginx Configuration Refinement (2025-05-24)
- Added proper location block for `/v1/` paths to proxy to backend
- Ensured consistent routing for all API endpoints

### UI Enhancements for Patient Profile & Clinical Assessments (2025-05-26)
-   **`PatientProfile.tsx`**:
    -   Tabs modified to "Sessions", "Clinical Assessments", "Notes". "Overview" tab and its content (e.g., `EmgVisualization`, `TreatmentTimeline`) were removed.
    -   "Clinical Assessments" tab now uses the new `ClinicalAssessments` component instead of `TreatmentConfig`.
    -   "Edit Assessment" button in the "Clinical Assessments" tab header changed to "Manage Assessments" (subsequently updated to "Add Assessment" and "View Progress" buttons).
    -   Tab styling ( `TabsList` and `TabsTrigger` in `PatientProfile.tsx`) updated to align with the styling in `frontend/src/pages/dashboard/index.tsx`, including icons (`Calendar`, `FileEdit`, `FilePlus`).
-   **`ClinicalAssessments.tsx`** (`frontend/src/components/patients/clinical-assessments.tsx`):
    -   Created as a new component.
    -   UI evolved from a simple list of assessment categories to a card-based layout, and finally to a table-based layout.
    -   The table displays columns for "Category" (using a colored `Badge` with a `Tooltip`), "Measure", and "Last Assessed". The "Last Value" column was removed.
    -   Mock data (`mockPatientAssessments`) was introduced and integrated to populate the table. The displayed data is filtered to only include measures for which mock data exists.
    -   Keys in `mockPatientAssessments` were corrected to use hyphens (e.g., `muscle-strength_0`) to match the dynamically generated measure IDs, resolving data display issues.
    -   The "Measure" column header is now left-aligned.
    -   Linter warnings (unused imports, `hasOwnProperty`) addressed.
    -   A message "No assessment data available." is shown if the filtered list of measures with mock data is empty.

## Active Decisions & Considerations

### API Path Structure
- **Date**: 2025-05-26
- **Focus**: Refining UI for Patient Profile, specifically the Clinical Assessments tab. Ongoing backend integration for EMG data.
- **Recent Changes**:
    - **UI Enhancements for `PatientProfile.tsx` and `ClinicalAssessments.tsx`**:
        -   In `PatientProfile.tsx`:
            -   Tabs updated to "Sessions", "Clinical Assessments", "Notes". "Overview" tab and its content (e.g., `EmgVisualization`, `TreatmentTimeline`) were removed.
            -   "Clinical Assessments" tab now uses the new `ClinicalAssessments` component instead of `TreatmentConfig`.
            -   "Edit Assessment" button in the "Clinical Assessments" tab header changed to "Manage Assessments" (subsequently updated to "Add Assessment" and "View Progress" buttons).
            -   Tab styling ( `TabsList` and `TabsTrigger` in `PatientProfile.tsx`) updated to align with the styling in `frontend/src/pages/dashboard/index.tsx`, including icons (`Calendar`, `FileEdit`, `FilePlus`).
        -   In `ClinicalAssessments.tsx`:
            -   Component created in `frontend/src/components/patients/clinical-assessments.tsx`.
            -   Initial implementation listed assessment categories.
            -   Iteratively improved UI:
                -   Card view with reduced padding and two-column grid for measures.
                -   Table view implemented with colored badges for categories (with tooltips), "Measure", "Last Value" (later removed), and "Last Assessed" columns.
                -   Mock data (`mockPatientAssessments`) added to populate the table, with logic to display data or "N/A".
                -   Corrected mock data keys to match generated measure IDs (hyphens vs. underscores).
                -   Filtered measures to display only those with mock data.
                -   "Last Value" column removed.
                -   "Measure" column header aligned to the left.
            -   Linter warnings (unused imports, `hasOwnProperty`) addressed.
    - **C3D Processing & EMG Analysis Components** (previous focus, largely stable):
        - Successfully fixed C3D file upload functionality by aligning API route prefixes
        - Fixed Docker configuration for ezc3d library dependencies using a single-stage build approach
        - Added system dependencies for runtime support of scientific libraries
        - Added proper location block for `/v1/` paths to proxy to backend
        - Ensured consistent routing for all API endpoints

### Nginx Configuration Refinement (2025-05-24)
- Added proper location block for `/v1/` paths to proxy to backend
- Ensured consistent routing for all API endpoints

### UI Enhancements for Patient Profile & Clinical Assessments (2025-05-26)
-   **`PatientProfile.tsx`**:
    -   Tabs modified to "Sessions", "Clinical Assessments", "Notes". "Overview" tab and its content (e.g., `EmgVisualization`, `TreatmentTimeline`) were removed.
    -   "Clinical Assessments" tab now uses the new `ClinicalAssessments` component instead of `TreatmentConfig`.
    -   "Edit Assessment" button in the "Clinical Assessments" tab header changed to "Manage Assessments" (subsequently updated to "Add Assessment" and "View Progress" buttons).
    -   Tab styling ( `TabsList` and `TabsTrigger` in `PatientProfile.tsx`) updated to align with the styling in `frontend/src/pages/dashboard/index.tsx`, including icons (`Calendar`, `FileEdit`, `FilePlus`).
-   **`ClinicalAssessments.tsx`** (`frontend/src/components/patients/clinical-assessments.tsx`):
    -   Created as a new component.
    -   UI evolved from a simple list of assessment categories to a card-based layout, and finally to a table-based layout.
    -   The table displays columns for "Category" (using a colored `Badge` with a `Tooltip`), "Measure", and "Last Assessed". The "Last Value" column was removed.
    -   Mock data (`mockPatientAssessments`) was introduced and integrated to populate the table. The displayed data is filtered to only include measures for which mock data exists.
    -   Keys in `mockPatientAssessments` were corrected to use hyphens (e.g., `muscle-strength_0`) to match the dynamically generated measure IDs, resolving data display issues.
    -   The "Measure" column header is now left-aligned.
    -   Linter warnings (unused imports, `hasOwnProperty`) addressed.
    -   A message "No assessment data available." is shown if the filtered list of measures with mock data is empty.

## Active Decisions & Considerations

### API Path Structure
- **Date**: 2025-05-26
- **Focus**: Refining UI for Patient Profile, specifically the Clinical Assessments tab. Ongoing backend integration for EMG data.
- **Recent Changes**:
    - **UI Enhancements for `PatientProfile.tsx` and `ClinicalAssessments.tsx`**:
        -   In `PatientProfile.tsx`:
            -   Tabs updated to "Sessions", "Clinical Assessments", "Notes". "Overview" tab and its content (e.g., `EmgVisualization`, `TreatmentTimeline`) were removed.
            -   "Clinical Assessments" tab now uses the new `ClinicalAssessments` component instead of `TreatmentConfig`.
            -   "Edit Assessment" button in the "Clinical Assessments" tab header changed to "Manage Assessments" (subsequently updated to "Add Assessment" and "View Progress" buttons).
            -   Tab styling ( `TabsList` and `TabsTrigger` in `PatientProfile.tsx`) updated to align with the styling in `frontend/src/pages/dashboard/index.tsx`, including icons (`Calendar`, `FileEdit`, `FilePlus`).
        -   In `ClinicalAssessments.tsx`:
            -   Component created in `frontend/src/components/patients/clinical-assessments.tsx`.
            -   Initial implementation listed assessment categories.
            -   Iteratively improved UI:
                -   Card view with reduced padding and two-column grid for measures.
                -   Table view implemented with colored badges for categories (with tooltips), "Measure", "Last Value" (later removed), and "Last Assessed" columns.
                -   Mock data (`mockPatientAssessments`) added to populate the table, with logic to display data or "N/A".
                -   Corrected mock data keys to match generated measure IDs (hyphens vs. underscores).
                -   Filtered measures to display only those with mock data.
                -   "Last Value" column removed.
                -   "Measure" column header aligned to the left.
            -   Linter warnings (unused imports, `hasOwnProperty`) addressed.
    - **C3D Processing & EMG Analysis Components** (previous focus, largely stable):
        - Successfully fixed C3D file upload functionality by aligning API route prefixes
        - Fixed Docker configuration for ezc3d library dependencies using a single-stage build approach
        - Added system dependencies for runtime support of scientific libraries
        - Added proper location block for `/v1/` paths to proxy to backend
        - Ensured consistent routing for all API endpoints

### Nginx Configuration Refinement (2025-05-24)
- Added proper location block for `/v1/` paths to proxy to backend
- Ensured consistent routing for all API endpoints

### UI Enhancements for Patient Profile & Clinical Assessments (2025-05-26)
-   **`PatientProfile.tsx`**:
    -   Tabs modified to "Sessions", "Clinical Assessments", "Notes". "Overview" tab and its content (e.g., `EmgVisualization`, `TreatmentTimeline`) were removed.
    -   "Clinical Assessments" tab now uses the new `ClinicalAssessments` component instead of `TreatmentConfig`.
    -   "Edit Assessment" button in the "Clinical Assessments" tab header changed to "Manage Assessments" (subsequently updated to "Add Assessment" and "View Progress" buttons).
    -   Tab styling ( `TabsList` and `TabsTrigger` in `PatientProfile.tsx`) updated to align with the styling in `frontend/src/pages/dashboard/index.tsx`, including icons (`Calendar`, `FileEdit`, `FilePlus`).
-   **`ClinicalAssessments.tsx`** (`frontend/src/components/patients/clinical-assessments.tsx`):
    -   Created as a new component.
    -   UI evolved from a simple list of assessment categories to a card-based layout, and finally to a table-based layout.
    -   The table displays columns for "Category" (using a colored `Badge` with a `Tooltip`), "Measure", and "Last Assessed". The "Last Value" column was removed.
    -   Mock data (`mockPatientAssessments`) was introduced and integrated to populate the table. The displayed data is filtered to only include measures for which mock data exists.
    -   Keys in `mockPatientAssessments` were corrected to use hyphens (e.g., `muscle-strength_0`) to match the dynamically generated measure IDs, resolving data display issues.
    -   The "Measure" column header is now left-aligned.
    -   Linter warnings (unused imports, `hasOwnProperty`) addressed.
    -   A message "No assessment data available." is shown if the filtered list of measures with mock data is empty.

## Active Decisions & Considerations

### API Path Structure
- **Date**: 2025-05-26
- **Focus**: Refining UI for Patient Profile, specifically the Clinical Assessments tab. Ongoing backend integration for EMG data.
- **Recent Changes**:
    - **UI Enhancements for `PatientProfile.tsx` and `ClinicalAssessments.tsx`**:
        -   In `PatientProfile.tsx`:
            -   Tabs updated to "Sessions", "Clinical Assessments", "Notes". "Overview" tab and its content (e.g., `EmgVisualization`, `TreatmentTimeline`) were removed.
            -   "Clinical Assessments" tab now uses the new `ClinicalAssessments` component instead of `TreatmentConfig`.
            -   "Edit Assessment" button in the "Clinical Assessments" tab header changed to "Manage Assessments" (subsequently updated to "Add Assessment" and "View Progress" buttons).
            -   Tab styling ( `TabsList` and `TabsTrigger` in `PatientProfile.tsx`) updated to align with the styling in `frontend/src/pages/dashboard/index.tsx`, including icons (`Calendar`, `FileEdit`, `FilePlus`).
        -   In `ClinicalAssessments.tsx`:
            -   Component created in `frontend/src/components/patients/clinical-assessments.tsx`.
            -   Initial implementation listed assessment categories.
            -   Iteratively improved UI:
                -   Card view with reduced padding and two-column grid for measures.
                -   Table view implemented with colored badges for categories (with tooltips), "Measure", "Last Value" (later removed), and "Last Assessed" columns.
                -   Mock data (`mockPatientAssessments`) added to populate the table, with logic to display data or "N/A".
                -   Corrected mock data keys to match generated measure IDs (hyphens vs. underscores).
                -   Filtered measures to display only those with mock data.
                -   "Last Value" column removed.
                -   "Measure" column header aligned to the left.
            -   Linter warnings (unused imports, `hasOwnProperty`) addressed.
    - **C3D Processing & EMG Analysis Components** (previous focus, largely stable):
        - Successfully fixed C3D file upload functionality by aligning API route prefixes
        - Fixed Docker configuration for ezc3d library dependencies using a single-stage build approach
        - Added system dependencies for runtime support of scientific libraries
        - Added proper location block for `/v1/` paths to proxy to backend
        - Ensured consistent routing for all API endpoints

### Nginx Configuration Refinement (2025-05-24)
- Added proper location block for `/v1/` paths to proxy to backend
- Ensured consistent routing for all API endpoints

### UI Enhancements for Patient Profile & Clinical Assessments (2025-05-26)
-   **`PatientProfile.tsx`**:
    -   Tabs modified to "Sessions", "Clinical Assessments", "Notes". "Overview" tab and its content (e.g., `EmgVisualization`, `TreatmentTimeline`) were removed.
    -   "Clinical Assessments" tab now uses the new `ClinicalAssessments` component instead of `TreatmentConfig`.
    -   "Edit Assessment" button in the "Clinical Assessments" tab header changed to "Manage Assessments" (subsequently updated to "Add Assessment" and "View Progress" buttons).
    -   Tab styling ( `TabsList` and `TabsTrigger` in `PatientProfile.tsx`) updated to align with the styling in `frontend/src/pages/dashboard/index.tsx`, including icons (`Calendar`, `FileEdit`, `FilePlus`).
-   **`ClinicalAssessments.tsx`** (`frontend/src/components/patients/clinical-assessments.tsx`):
    -   Created as a new component.
    -   UI evolved from a simple list of assessment categories to a card-based layout, and finally to a table-based layout.
    -   The table displays columns for "Category" (using a colored `Badge` with a `Tooltip`), "Measure", and "Last Assessed". The "Last Value" column was removed.
    -   Mock data (`mockPatientAssessments`) was introduced and integrated to populate the table. The displayed data is filtered to only include measures for which mock data exists.
    -   Keys in `mockPatientAssessments` were corrected to use hyphens (e.g., `muscle-strength_0`) to match the dynamically generated measure IDs, resolving data display issues.
    -   The "Measure" column header is now left-aligned.
    -   Linter warnings (unused imports, `hasOwnProperty`) addressed.
    -   A message "No assessment data available." is shown if the filtered list of measures with mock data is empty.

## Active Decisions & Considerations

### API Path Structure
- **Date**: 2025-05-26
- **Focus**: Refining UI for Patient Profile, specifically the Clinical Assessments tab. Ongoing backend integration for EMG data.
- **Recent Changes**:
    - **UI Enhancements for `PatientProfile.tsx` and `ClinicalAssessments.tsx`**:
        -   In `PatientProfile.tsx`:
            -   Tabs updated to "Sessions", "Clinical Assessments", "Notes". "Overview" tab and its content (e.g., `EmgVisualization`, `TreatmentTimeline`) were removed.
            -   "Clinical Assessments" tab now uses the new `ClinicalAssessments` component instead of `TreatmentConfig`.
            -   "Edit Assessment" button in the "Clinical Assessments" tab header changed to "Manage Assessments" (subsequently updated to "Add Assessment" and "View Progress" buttons).
            -   Tab styling ( `TabsList` and `TabsTrigger` in `PatientProfile.tsx`) updated to align with the styling in `frontend/src/pages/dashboard/index.tsx`, including icons (`Calendar`, `FileEdit`, `FilePlus`).
        -   In `ClinicalAssessments.tsx`:
            -   Component created in `frontend/src/components/patients/clinical-assessments.tsx`.
            -   Initial implementation listed assessment categories.
            -   Iteratively improved UI:
                -   Card view with reduced padding and two-column grid for measures.
                -   Table view implemented with colored badges for categories (with tooltips), "Measure", "Last Value" (later removed), and "Last Assessed" columns.
                -   Mock data (`mockPatientAssessments`) added to populate the table, with logic to display data or "N/A".
                -   Corrected mock data keys to match generated measure IDs (hyphens vs. underscores).
                -   Filtered measures to display only those with mock data.
                -   "Last Value" column removed.
                -   "Measure" column header aligned to the left.
            -   Linter warnings (unused imports, `hasOwnProperty`) addressed.
    - **C3D Processing & EMG Analysis Components** (previous focus, largely stable):
        - Successfully fixed C3D file upload functionality by aligning API route prefixes
        - Fixed Docker configuration for ezc3d library dependencies using a single-stage build approach
        - Added system dependencies for runtime support of scientific libraries
        - Added proper location block for `/v1/` paths to proxy to backend
        - Ensured consistent routing for all API endpoints

### Nginx Configuration Refinement (2025-05-24)
- Added proper location block for `/v1/` paths to proxy to backend
- Ensured consistent routing for all API endpoints

### UI Enhancements for Patient Profile & Clinical Assessments (2025-05-26)
-   **`PatientProfile.tsx`**:
                -   Filtered