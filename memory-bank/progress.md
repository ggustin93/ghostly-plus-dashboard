---
description: Tracks what works, what's left to build, current status, known issues, and the evolution of project decisions for the GHOSTLY+ Dashboard.
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

### Phase 3: Authentication and Authorization System (Supporting WP2, WP3, WP4, WP5)
1. ✅ Implement basic email/password login (Done in consolidated React frontend).
2. ✅ Implement session management (Done via Supabase client/Context).
3. ⏳ Integrate password reset functionality (Requires UI form and potentially Supabase Edge Function/backend logic).
4. ⏳ Add user registration functionality (If needed, likely requires admin action or separate form).
5. ⏳ Set up role-based access control (RBAC) - Requires defining roles (e.g., in a `profiles` table) and checking them.
6. ⏳ Develop admin interface for user management (Current focus - `/admin` page).

### Phase 4: Basic Dashboard Components (Supporting WP2, WP3, WP4, WP5)
1. 🔄 Create responsive dashboard layout (e.g., using Shadcn components, potentially a sidebar/header).
2. 🔄 Implement navigation menu (within the dashboard layout).
3. 🔄 Design and build dashboard homepage (main content area after login).
4. ✅ Develop user profile page (`/account` - basic version done).
5. ✅ Implement C3D file upload component with processing options.
6. ✅ Create EMG analysis visualization component.
7. ✅ Add dashboard quick-access card for C3D uploads.
8. ⏳ **Support for RCT Management (WP3, WP4):**
    -   Participant list views with status indicators (recruited, active, completed, dropout).
    -   Forms/interface for logging baseline (T0), 1-week (T1), and discharge (T2) assessment data (MicroFet, ultrasound findings, functional tests, questionnaire summaries if not externally managed).
    -   Interface for managing/viewing BFR cuff pressure settings (e.g., AOP, %MVC used) per session if logged.
    -   Tracking adherence to intervention (e.g., GHOSTLY+ session frequency, duration from game logs).

### Phase 5: Data Processing and Visualization (Supporting WP2, WP4, WP5)
1. ✅ Create API (FastAPI) for C3D file processing (Basic endpoint created at `/v1/c3d/upload`).
2. ✅ Implement file upload functionality (Frontend API client created with TypeScript interfaces).
3. 🔄 Develop 3D visualization components (possibly using libraries like Three.js) - *Currently EMG waveform vis is 2D, 3D might be for biomechanical models if relevant later.*
4. 🔄 Create data analysis and reporting modules (potentially leveraging the separate Python analytics service).
    -   Generation of reports for individual patients (clinical progress).
    -   Tools for researchers to compare groups (Intervention vs. Control) based on collected outcome measures.
5. ⏳ Implement additional validation for file uploads.
6. ⏳ Add more detailed error handling for file processing.
7. ⏳ Add visualization options for different muscle groups.
8. ⏳ **Implement sEMG-derived metrics calculation in backend (WP2, WP5):** As per proposal (fatigue, strength, mass estimation) and display relevant metrics/reports in dashboard.
9. ⏳ **Data Export (WP5):** Robust export functionality for pseudonymized data in formats suitable for SPSS/REDCap.

### Phase 6: Integration with Existing Game (GHOSTLY+ game - WP2)
1. 🔄 Establish API endpoints for game data exchange (C3D upload is one part; potentially DDA parameters, game settings, detailed logs).
2. 🔄 Implement user progress synchronization.
3. 🔄 Develop game session management.

### Phase 7: Advanced Features
1. 🔄 Implement data export functionality.
2. 🔄 Create therapist annotation tools.
3. 🔄 Develop patient progress tracking.

### Phase 8: Testing and Optimization
1. 🔄 Set up automated testing framework.
2. 🔄 Perform security audit.
3. 🔄 Optimize performance.
4. 🔄 Conduct user acceptance testing.

### Phase 9: Deployment and Documentation (Supporting WP6 - Utilisation)
1. 🔄 Create deployment scripts.
2. 🔄 Prepare user and administrator documentation (including details for physiotherapists on using dashboard for GHOSTLY+ protocol).
3. 🔄 Develop maintenance procedures.
4. ⏳ **Prepare for Multi-Site Data Handling (WP3, WP4):** Ensure dashboard can segregate or tag data by hospital site (UZB, UZA, UZL Pellenberg) if needed for analysis or site-specific views.

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