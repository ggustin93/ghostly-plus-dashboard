# GHOSTLY+ Web Dashboard

## 1. Project Purpose & Scope

GHOSTLY+ is an applied research project aimed at combating muscle strength loss in hospitalized elderly patients. This project focuses on the development of the **GHOSTLY+ Web Dashboard**, a critical component for patient monitoring, data analysis, and facilitating research.

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

## 3. High-Level Project Phases

1.  **Infrastructure Setup**: Project config, Docker/Nginx, Supabase, Auth system, DB schema, C3D parser.
2.  **Core Functionality**: Patient & Cohort management, OpenFeasyo integration, Backend API.
3.  **Visualization & Analysis**: EMG data viz, game performance components, session management, report generation.
4.  **Security & Compliance**: Data encryption, pseudonymization, GDPR features.
5.  **User Interfaces**: Therapist & Researcher dashboards, advanced EMG analytics, multilingual & accessibility.
6.  **Finalization & Deployment**: Performance optimization, security testing, deployment pipeline, documentation, user testing.

*(More details can be found in the `docs/` and `memory-bank/` directories.)* 