---
description: Foundational document outlining core requirements and goals for the GHOSTLY+ Dashboard project.
source_documents: [docs/prd.md](mdc:docs/prd.md), [docs/task-summary.md](mdc:docs/task-summary.md)
---

# GHOSTLY+ Dashboard: Project Brief

## 1. Project Purpose & Scope

GHOSTLY+ is an applied research project aimed at combating muscle strength loss in hospitalized elderly patients. This brief focuses on the development of the **GHOSTLY+ Web Dashboard**, a critical component for patient monitoring, intervention support, data analysis, and facilitating the GHOSTLY+ clinical trial.

The dashboard will provide a centralized platform for **Therapists, Researchers, and System Administrators** to manage patient data, configure GHOSTLY+ intervention parameters (including game settings and BFR protocols), visualize EMG signals and game metrics from the GHOSTLY+ serious game, track clinical and intervention-specific outcomes, and generate reports, all in accordance with the roles and functionalities detailed in the `docs/00_PROJECT_DEFINITION/UX_UI_specifications.md` document.

## 2. Proposed Solution Overview

The Web Dashboard will:
- Integrate with the GHOSTLY+ EMG-driven serious game (adapted from OpenFeasyo on Android tablets) and sEMG sensors (e.g., Delsys Trigno Avanti, with potential for others as per WP2).
- Provide secure authentication and granular role-based access for Therapists, Researchers, and Administrators, each with tailored interfaces and functionalities as specified in `docs/00_PROJECT_DEFINITION/UX_UI_specifications.md`.
- Offer robust patient and cohort management, including pseudo-anonymization and tracking throughout the clinical trial.
- Feature advanced EMG data visualization (raw signals, processed metrics), game performance analysis tools, and display of comprehensive clinical assessment data. This includes specific sEMG-derived metrics for muscle activation, fatigue, and potentially force/mass estimations, alongside game engagement/adherence statistics (WP2.3).
- Enable detailed management of **Rehabilitation Sessions** and their constituent **Game Sessions**, including configuration of game parameters, DDA settings (WP2.4), and BFR protocols.
- Facilitate the generation of clinical and research reports, with export capabilities for external analysis (e.g., REDCap, SPSS).
- Adhere to strict security and GDPR compliance standards, leveraging a structured database (as outlined in `docs/00_PROJECT_DEFINITION/database_schema_simplified_research.md`) for handling sensitive medical data.
- Be built with a modern tech stack: React (frontend), FastAPI (backend), and self-hosted Supabase (database, auth, storage).

## 3. Primary Functional Objectives (User-Centric)

The dashboard aims to deliver specific functionalities tailored to each primary user role, as detailed in `docs/00_PROJECT_DEFINITION/UX_UI_specifications.md` (Section 3 & 4):

### 3.1 For Therapists/Clinicians
-   Efficiently manage their assigned patients within the GHOSTLY+ trial.
-   Configure and log **Rehabilitation Sessions** and **Game Sessions**, including GHOSTLY+ game parameters, MVC calibrations, and BFR settings.
-   Input, track, and review comprehensive clinical assessment data (e.g., muscle strength, morphology, functional tests, QoL) and GHOSTLY+ specific adherence/contextual data.
-   Monitor patient progress through visualizations of EMG data, sEMG-derived metrics (activation, fatigue), and game performance statistics.
-   Document session-specific observations and generate GHOSTLY+ progress reports.

### 3.2 For Researchers
-   Oversee RCT progress, including recruitment, data collection completeness, and intervention adherence.
-   Access, explore, and analyze pseudonymized patient data, including detailed clinical outcomes, sEMG metrics, game statistics, and DDA parameters.
-   Perform cohort comparisons (Intervention vs. Control) and visualize outcome changes over time.
-   Export comprehensive datasets for external statistical analysis (e.g., SPSS, REDCap compatible formats).

### 3.3 For System Administrators
-   Ensure the smooth, secure, and compliant operation of the GHOSTLY+ Dashboard.
-   Manage user accounts, roles, and granular permissions for all study personnel.
-   Monitor system health, performance, and storage usage.
-   Oversee data integrity, including backup/restore operations, and manage data flows (e.g., to REDCap).
-   Ensure correct association and logging of all study data, including C3D files, sEMG metrics, and game statistics.

## 4. Key Non-Functional Requirements

- **Security & Privacy**: End-to-end encryption, pseudonymization, GDPR compliance, audit logs, secure authentication (including optional 2FA).
- **Performance**: Fast page loads (<2s), support for 100+ concurrent users, efficient C3D file processing.
- **Accessibility**: WCAG 2.1 Level AA compliance, multilingual support (EN, NL, FR).
- **Availability & Reliability**: High availability (99.5%+), daily backups, disaster recovery.

## 5. High-Level Project Phases (from [task-summary.md](mdc:docs/task-summary.md))

1.  **Infrastructure Setup**: Project config, Docker/Nginx, Supabase, Auth system, DB schema, C3D parser.
2.  **Core Functionality**: Patient & Cohort management, OpenFeasyo integration, Backend API.
3.  **Visualization & Analysis**: EMG data viz, game performance components, session management, report generation. **This includes the implementation of displays for sEMG-derived metrics (fatigue, strength, mass estimation) and game engagement/adherence reports (WP2.3, WP2.5).**
4.  **Security & Compliance**: Data encryption, pseudonymization, GDPR features.
5.  **User Interfaces**: Therapist & Researcher dashboards, advanced EMG analytics, multilingual & accessibility.
6.  **Finalization & Deployment**: Performance optimization, security testing, deployment pipeline, documentation, user testing.

## 6. Key Development Points (from [task-summary.md](mdc:docs/task-summary.md))

1.  **Simplified Deployment**: Optimized Docker and Nginx configuration.
2.  **Unified Authentication**: Common system between the game and web dashboard.
3.  **Data Security**: Encryption and pseudonymization for medical data.
4.  **Modular Architecture**: Clear separation between frontend, backend, and services.
5.  **Adapted Interface**: Dashboards specific to therapist and researcher needs.

This brief serves as the foundation for the GHOSTLY+ Dashboard development, guiding technical and product decisions. 