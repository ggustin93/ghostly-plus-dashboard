---
description: Foundational document outlining core requirements and goals for the GHOSTLY+ Dashboard project.
source_documents: [docs/prd.md](mdc:docs/prd.md), [docs/task-summary.md](mdc:docs/task-summary.md)
---

# GHOSTLY+ Dashboard: Project Brief

## 1. Project Purpose & Scope

GHOSTLY+ is an applied research project aimed at combating muscle strength loss in hospitalized elderly patients. This brief focuses on the development of the **GHOSTLY+ Web Dashboard**, a critical component for patient monitoring, data analysis, and facilitating research.

The dashboard will provide a centralized platform for therapists and researchers to manage patient data, visualize EMG signals and game metrics from the existing OpenFeasyo serious game, track progress, and generate reports.

## 2. Proposed Solution Overview

The Web Dashboard will:
- Integrate with the existing EMG-driven serious game (OpenFeasyo on Android tablets) and Delsys Trigno Avanti EMG sensors.
- Provide secure authentication and role-based access for therapists, researchers, and administrators.
- Offer robust patient and cohort management functionalities.
- Feature advanced EMG data visualization and game performance analysis tools.
- Enable session management and the generation of clinical and research reports.
- Adhere to strict security and GDPR compliance standards for handling sensitive medical data.
- Be built with a modern tech stack: Vue.js 3 (frontend), FastAPI (backend), and self-hosted Supabase (database, auth, storage).

## 3. Primary Functional Objectives

### 3.1 For Therapists
- View results of their patients' game sessions.
- Visualize EMG signals and game metrics.
- Track individual patient progress over time.
- Configure exercise programs (details TBD).
- Compare patient cohorts (if applicable to their role).
- Generate clinical reports.

### 3.2 For Researchers
- Conduct comparative data analysis across patients and cohorts.
- Export data (raw and processed) for external analyses.
- Generate multi-site statistics (if applicable).
- Filter and segment data based on various criteria.

## 4. Key Non-Functional Requirements

- **Security & Privacy**: End-to-end encryption, pseudonymization, GDPR compliance, audit logs, secure authentication (including optional 2FA).
- **Performance**: Fast page loads (<2s), support for 100+ concurrent users, efficient C3D file processing.
- **Accessibility**: WCAG 2.1 Level AA compliance, multilingual support (EN, NL, FR).
- **Availability & Reliability**: High availability (99.5%+), daily backups, disaster recovery.

## 5. High-Level Project Phases (from [task-summary.md](mdc:docs/task-summary.md))

1.  **Infrastructure Setup**: Project config, Docker/Nginx, Supabase, Auth system, DB schema, C3D parser.
2.  **Core Functionality**: Patient & Cohort management, OpenFeasyo integration, Backend API.
3.  **Visualization & Analysis**: EMG data viz, game performance components, session management, report generation.
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