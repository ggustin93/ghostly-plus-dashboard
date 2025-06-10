---
description: Foundational document outlining core requirements and goals for the GHOSTLY+ Dashboard project.
source_documents: [docs/prd.md](mdc:docs/prd.md), [docs/task-summary.md](mdc:docs/task-summary.md), [docs/00_PROJECT_DEFINITION/ressources/data_management_plan.md](mdc:docs/00_PROJECT_DEFINITION/ressources/data_management_plan.md)
---

# GHOSTLY+ Dashboard: Project Brief

## 1. Project Purpose & Scope

GHOSTLY+ is an applied research project (GHOSTLY+ TBM, FWO-funded, 2025-2028, PI: Eva Swinnen) aimed at combating **hospital-associated disability (HAD)**, specifically muscle strength and mass loss, in **hospitalized older adults (≥65 years)** due to immobility. This brief focuses on the development of the **GHOSTLY+ Web Dashboard**, a critical component for patient monitoring, intervention support, data analysis, and facilitating the GHOSTLY+ clinical trial.

The GHOSTLY+ intervention involves an **interactive, EMG-driven serious game coupled with Blood Flow Restriction (BFR)** to encourage voluntary muscle contractions and boost muscle adaptations.

The clinical trial is a **multicenter, randomized controlled trial (RCT)** with a Hybrid Type 1 design across UZ Brussel, UZA, and UZ Leuven Pellenberg, enrolling **120 hospitalized older adults** with restricted lower-limb mobility. Participants will be assigned to a control group (standard physiotherapy) or an intervention group (standard care + GHOSTLY+ training). The GHOSTLY+ intervention includes a minimum of five sessions per week for two weeks (or until discharge), involving isometric muscle contractions at 75% of MVC under partial BFR (50% AOP), with three sets of 12 repetitions per session.

The dashboard will provide a centralized platform for **Therapists, Researchers, and System Administrators** to manage patient data, configure GHOSTLY+ intervention parameters (including game settings and BFR protocols), visualize EMG signals and game metrics, track clinical and intervention-specific outcomes, and generate reports, all in accordance with the roles and functionalities detailed in `docs/00_PROJECT_DEFINITION/UX_UI_specifications.md` and data handling practices outlined in `docs/00_PROJECT_DEFINITION/ressources/data_management_plan.md`.

**Primary outcome of the RCT:** Lower-limb muscle strength at discharge (assessed via handheld dynamometer).
**Secondary outcomes include:** Muscle mass (ultrasound of rectus femoris CSA), functional capacity (30-second sit-to-stand, Functional Ambulation Category), therapy adherence, user experience, time bedridden, hospital length of stay, cognitive function (MMSE), and sEMG characteristics. Implementation outcomes (acceptability, adoption, fidelity, etc.) will also be evaluated.

## 2. Proposed Solution Overview

The Web Dashboard will:
- Integrate with the GHOSTLY+ EMG-driven serious game (adapted from OpenFeasyo on Android tablets) and sEMG sensors (e.g., Delsys Trigno Avanti, with potential for others as per WP2 and `data_management_plan.md`).
- Provide secure authentication and granular role-based access for Therapists, Researchers, and Administrators, each with tailored interfaces and functionalities as specified in `docs/00_PROJECT_DEFINITION/UX_UI_specifications.md`.
- Offer robust patient and cohort management, including pseudo-anonymization and tracking throughout the multicenter clinical trial, aligned with the `data_management_plan.md`.
- Feature advanced EMG data visualization (raw signals, processed metrics), game performance analysis tools, and display of comprehensive clinical assessment data as defined in the `data_management_plan.md` (e.g., dynamometry, ultrasound, FAC, STS, MMSE). This includes specific sEMG-derived metrics for muscle activation, fatigue, and potentially force/mass estimations, alongside game engagement/adherence statistics (WP2.3).
- Enable detailed management of **Rehabilitation Sessions** and their constituent **Game Sessions**, including configuration of game parameters, DDA settings (WP2.4), and BFR protocols (target 75% MVC, 50% AOP, 3x12 reps).
- Facilitate the generation of clinical and research reports, with export capabilities for external analysis (e.g., to support analysis in SPSS and data management in systems like REDCap as mentioned in `data_management_plan.md`).
- Adhere to strict security and GDPR compliance standards, leveraging a structured database (as outlined in `docs/00_PROJECT_DEFINITION/database_schema_simplified_research.md`) and data management protocols (see `data_management_plan.md`) for handling sensitive medical data, including ethical approvals and consent.
- Be built with a modern tech stack: React (frontend), FastAPI (backend), and self-hosted Supabase (database, auth, storage), with consideration for data storage on VUB SharePoint, Pixiu, and REDCap for specific data types as per the `data_management_plan.md`.

## 3. Primary Functional Objectives (User-Centric)

The dashboard aims to deliver specific functionalities tailored to each primary user role, as detailed in `docs/00_PROJECT_DEFINITION/UX_UI_specifications.md` (Section 3 & 4), supporting the data collection and management needs outlined in `docs/00_PROJECT_DEFINITION/ressources/data_management_plan.md`.

### 3.1 For Therapists/Clinicians
-   Efficiently manage their assigned patients within the GHOSTLY+ trial across multiple hospital sites.
-   Configure and log **Rehabilitation Sessions** and **Game Sessions**, including GHOSTLY+ game parameters, MVC calibrations (target 75%), and BFR settings (target 50% AOP).
-   Input, track, and review comprehensive clinical assessment data (e.g., muscle strength via dynamometer, muscle mass via ultrasound, FAC, STS, MMSE, QoL) and GHOSTLY+ specific adherence/contextual data, as per the RCT protocol in `data_management_plan.md`.
-   Monitor patient progress through visualizations of EMG data, sEMG-derived metrics (activation, fatigue), and game performance statistics.
-   Document session-specific observations and generate GHOSTLY+ progress reports.

### 3.2 For Researchers
-   Oversee RCT progress across UZ Brussel, UZA, and UZ Leuven Pellenberg, including recruitment, data collection completeness (for all primary and secondary outcomes), and intervention adherence.
-   Access, explore, and analyze pseudonymized patient data, including detailed clinical outcomes (dynamometry, ultrasound, FAC, STS, MMSE etc.), sEMG metrics, game statistics, and DDA parameters, according to the variables defined in `data_management_plan.md`.
-   Perform cohort comparisons (Intervention vs. Control) and visualize outcome changes over time.
-   Export comprehensive datasets (including all data types listed in `data_management_plan.md`) for external statistical analysis (e.g., SPSS, REDCap compatible formats).
-   Access data supporting implementation science evaluation (acceptability, adoption, fidelity etc.).

### 3.3 For System Administrators
-   Ensure the smooth, secure, and compliant operation of the GHOSTLY+ Dashboard.
-   Manage user accounts, roles, and granular permissions for all study personnel.
-   Monitor system health, performance, and storage usage.
-   Oversee data integrity, including backup/restore operations (as per `data_management_plan.md` which details VUB SharePoint, Pixiu, REDCap, and encrypted HDDs), and manage data flows (e.g., to REDCap).
-   Ensure correct association and logging of all study data, including C3D files, sEMG metrics, and game statistics.

## 4. Key Non-Functional Requirements

- **Security & Privacy**: End-to-end encryption, pseudonymization (as per `data_management_plan.md`), GDPR compliance (including management of informed consent and ethical approvals from FAGG and hospital ethics committees), audit logs, secure authentication (including optional 2FA). Data handling must align with VUB privacy registers and collaboration agreement stipulations.
- **Data Retention & Archiving**: Adherence to data retention policies outlined in `data_management_plan.md` (e.g., min 10 years, 25 years for clinical trial data, 30 for medical research data), with data archived on Pixiu.
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