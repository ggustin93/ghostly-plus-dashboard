---
description: Explains why the GHOSTLY+ Dashboard project exists, the problems it solves, its intended user experience, and its role within the GHOSTLY+ clinical research project.
source_documents: [docs/prd.md](mdc:docs/prd.md), [docs/00_PROJECT_DEFINITION/ressources/2024_ghostly_proposal.md](mdc:docs/00_PROJECT_DEFINITION/ressources/2024_ghostly_proposal.md), [docs/00_PROJECT_DEFINITION/ressources/data_management_plan.md](mdc:docs/00_PROJECT_DEFINITION/ressources/data_management_plan.md)
---

# GHOSTLY+ Dashboard: Product Context

## 1. Why This Project Exists: The Problem

(Source: `docs/00_PROJECT_DEFINITION/ressources/data_management_plan.md` - Project Abstract; [docs/00_PROJECT_DEFINITION/ressources/2024_ghostly_proposal.md](mdc:docs/00_PROJECT_DEFINITION/ressources/2024_ghostly_proposal.md) - Rationale)

Older adults hospitalized for extended periods face a high risk of **hospital-associated disability (HAD)**, a condition marked by rapid loss of muscle mass and strength due to immobility. These declines can occur within days and are associated with:
- Prolonged hospital stays.
- Increased dependency and inability to perform basic activities of daily living (ADLs).
- Slower post-hospitalization recovery.
- Increased risk of falls and injuries.
- Decreased autonomy and quality of life.
- Higher frequency of hospital readmissions and even mortality.

Traditional strength training methods, especially high-load resistance training, are often unsuitable for frail or post-operative patients.

### Unmet Needs (from [docs/00_PROJECT_DEFINITION/ressources/2024_ghostly_proposal.md](mdc:docs/00_PROJECT_DEFINITION/ressources/2024_ghostly_proposal.md) and `data_management_plan.md`)
1.  **Unmet Need 1**: Immobilized patients need alternative, safe, and effective options for exercising to limit muscle strength loss and functional decline during hospitalization.
2.  **Unmet Need 2**: Patients need to be motivated and adhere to exercise schemes, especially during non-supervised treatment time, to maximize rehabilitation benefits.
3.  **Unmet Need 3**: Rehabilitation tools like serious games need to be evidence-based, adapted to the target population (older, frail adults), and designed to encourage adherence and engagement.

## 2. The GHOSTLY+ Intervention: A Proposed Solution

(Source: `docs/00_PROJECT_DEFINITION/ressources/data_management_plan.md` - Project Abstract; [docs/00_PROJECT_DEFINITION/ressources/2024_ghostly_proposal.md](mdc:docs/00_PROJECT_DEFINITION/ressources/2024_ghostly_proposal.md) - Approach)

To address these challenges, the **GHOSTLY+ system** was developed. It combines:
- **Low-load isometric training with Blood Flow Restriction (BFR)**: This approach has shown comparable benefits to high-load training and excellent safety in clinical populations, making it suitable for frail or post-operative patients. (Addresses Unmet Need 1)
- **EMG-Driven Serious Game (GHOSTLY+ app)**: An interactive game that uses sEMG biofeedback to encourage voluntary muscle contractions during non-therapy time. It is designed to be motivating, personalized, and coupled with BFR to boost muscle adaptations. (Addresses Unmet Needs 2 & 3)

The intervention aims to be a low-risk, motivating, and personalized alternative to traditional resistance training, potentially alleviating physiotherapy workloads and improving rehabilitation outcomes.

## 3. What The Dashboard Aims to Solve: Supporting the GHOSTLY+ Intervention & Research

(Source: `docs/00_PROJECT_DEFINITION/ressources/data_management_plan.md`; [docs/prd.md](mdc:docs/prd.md) Section 2.3; `docs/00_PROJECT_DEFINITION/UX_UI_specifications.md`)

The GHOSTLY+ system (game + EMG sensors + BFR) will generate significant and diverse data. The **Web Dashboard** is crucial for:

-   **Centralized & Structured Data Management**: Managing data related to patient characteristics, intervention parameters (EMG, BFR, game settings), sEMG activity, game performance, and a wide range of clinical outcomes (strength, mass, function, cognition, etc.) as specified in `docs/00_PROJECT_DEFINITION/ressources/data_management_plan.md`. This overcomes issues of siloed or unstructured data, leveraging the database schema in `docs/00_PROJECT_DEFINITION/database_schema_simplified_research.md` and aligning with data storage solutions like Pixiu and REDCap for specific datasets.
-   **Efficient Intervention Delivery & Monitoring**: Providing therapists with tools to configure GHOSTLY+ sessions (game, BFR, MVC calibration per protocol), input detailed clinical assessment data (e.g., dynamometer readings, ultrasound measurements, FAC, STS scores, MMSE), and monitor patient engagement and physiological responses.
-   **Remote Monitoring & Patient Follow-up**: Enabling therapists and researchers to track progress and adherence effectively across the three hospital sites involved in the RCT.
-   **Comparative Analysis & Outcome Evaluation**: Facilitating robust analysis of pseudonymized data to compare intervention vs. control groups, track primary and secondary outcomes over time, and explore relationships between intervention parameters, sEMG metrics, game engagement, and clinical results. This directly supports the analytical needs of the RCT outlined in `docs/00_PROJECT_DEFINITION/ressources/data_management_plan.md`.
-   **Supporting the Multicenter RCT**: Managing participant data (enrollment, pseudo-anonymization, cohort assignment), intervention details, and the diverse outcome measures (as listed in `data_management_plan.md`) for the trial, ensuring data integrity, ethical compliance (consent, GDPR), and accessibility for analysis.
-   **Implementation Science Data Capture**: Storing data relevant to evaluating implementation outcomes (acceptability, adoption, fidelity, feasibility, penetration, sustainability) using frameworks like Proctor's and CFIR, as detailed in `docs/00_PROJECT_DEFINITION/ressources/data_management_plan.md`.

## 4. How The Dashboard Should Work: Proposed Solution & User Goals

The Web Dashboard, as part of the GHOSTLY+ system, will provide a centralized, secure platform with role-specific functionalities for therapists, researchers, and administrators involved in the clinical trial and patient care. These are detailed in `docs/00_PROJECT_DEFINITION/UX_UI_specifications.md` (Sections 3 & 4).

### 4.1 For Therapists/Clinicians:
The dashboard empowers therapists to efficiently deliver and monitor the GHOSTLY+ intervention. Key goals and functionalities include:
-   **Patient & Session Management**: View personalized dashboards, manage patient profiles (demographics, medical history, consent), schedule and log Rehabilitation Sessions and their constituent Game Sessions.
-   **Intervention Configuration**: Configure GHOSTLY+ game parameters (MVC calibration, levels, DDA review), sEMG sensor selection, and BFR protocols for each session.
-   **Clinical Data Input**: Input and track comprehensive clinical assessment data (e.g., muscle strength from dynamometer, muscle mass from ultrasound, FAC, STS, MMSE, QoL questionnaires, adherence, adverse events, as per `data_management_plan.md`) at designated timepoints (T0, T1, T2).
-   **Progress Monitoring**: Review detailed analyses of individual Game Sessions (EMG visualizations, sEMG-derived metrics for activation/fatigue, game performance statistics), view historical trends, and compare current session data against baselines.
-   **Documentation & Reporting**: Add session-specific notes and generate GHOSTLY+ progress reports summarizing sEMG/game metrics and clinical outcomes.

(Source: [docs/prd.md](mdc:docs/prd.md) Section 3.1.1; `docs/00_PROJECT_DEFINITION/UX_UI_specifications.md` Section 3.1 & 4.1)

### 4.2 For Researchers:
The dashboard serves as an analytical tool for evaluating intervention effectiveness and implementation dynamics using pseudonymized data. Key goals and functionalities include:
-   **Study Oversight**: Monitor RCT progress (recruitment, retention, data collection completeness, adherence rates across cohorts and sites).
-   **Data Exploration**: Access and explore pseudonymized sEMG signals, derived metrics, game statistics, DDA parameters, and all primary/secondary clinical outcome measures as defined in `docs/00_PROJECT_DEFINITION/ressources/data_management_plan.md`.
-   **Comparative Analysis**: Compare outcome measures across patients and cohorts (Intervention vs. Control), visualize changes over time.
-   **Data Export**: Export comprehensive, pseudonymized datasets (including all data types listed in `data_management_plan.md`) in formats suitable for external statistical software (e.g., SPSS, REDCap-compatible).

(Source: [docs/prd.md](mdc:docs/prd.md) Section 3.1.2; `docs/00_PROJECT_DEFINITION/UX_UI_specifications.md` Section 3.2 & 4.2)

### 4.3 For System Administrators:
The dashboard provides tools for ensuring the system's operational integrity, security, and compliance. Key goals and functionalities include:
-   **System Health Monitoring**: Monitor platform performance, storage usage, and error logs.
-   **User & Access Management**: Manage user accounts (therapists, researchers, admins, etc.) and granular role-based permissions, including assigning patients to therapists.
-   **Data Integrity & Management**: Oversee data backups, restores, and archiving; ensure correct association of Game Sessions to Rehabilitation Sessions; manage logging of sEMG metrics and game stats; and oversee data export/synchronization with systems like REDCap.

(Source: `docs/00_PROJECT_DEFINITION/UX_UI_specifications.md` Section 3.3 & 4.3)

## 5. User Experience Goals

As detailed in `docs/00_PROJECT_DEFINITION/UX_UI_specifications.md` (Section 2), the UX goals emphasize:
-   **Clarity and Intuitiveness**: Interfaces must be easy to understand, especially for complex data like EMG signals and clinical assessments. Navigation should be straightforward for all user roles.
-   **Efficiency**: Users should be able to perform their core tasks (e.g., data entry for therapists, data exploration for researchers, user management for admins) quickly and with minimal friction.
-   **Role-Specific Design**: Dashboards and functionalities must be tailored to the specific needs, workflows, and technical comfort levels of Therapists, Researchers, and Administrators.
-   **Data Integrity & Trust**: Users must be confident in the accuracy of the data presented and the security of the system handling sensitive patient information.
-   **Actionability**: Information presented (e.g., patient alerts for therapists, data quality flags for researchers) should lead to clear next steps or decisions.
-   **Accessibility**: Adherence to WCAG 2.1 Level AA, ensuring usability for individuals with diverse abilities and needs, including multilingual support (English, Dutch, French).
-   **Responsiveness**: Optimal viewing and interaction on primary target devices (desktops and tablets in clinical/research settings).

## 6. GHOSTLY+ Clinical Trial Overview (Based on `data_management_plan.md`)

(Source: `docs/00_PROJECT_DEFINITION/ressources/data_management_plan.md`)

The GHOSTLY+ TBM project is centered around a **multicenter, two-arm, parallel-group, randomized controlled trial (RCT)** with a **Hybrid Type 1 design**. This design evaluates the therapeutic effectiveness of the GHOSTLY+ intervention while simultaneously gathering information about its implementation process.

- **Trial Registration & Ethics:** Ethical approvals will be obtained from FAGG and relevant committees for UZ Brussel, UZ Leuven, and UZ Antwerpen. The trial will adhere to GDPR and informed consent procedures.
- **Study Sites:** UZ Brussel, UZA (Antwerpen), and UZ Leuven Pellenberg.
- **Study Participants:** 120 hospitalized older adults (≥65 years) with restricted lower-limb mobility who are non-weight-bearing or at high risk of muscle deconditioning.
    - Key exclusion criteria: Cognitive impairment (MMSE score to be considered), contraindications to physical exercise or BFR.
- **Sample Size:** Target of 120 patients (60 per group), accounting for potential dropout.
- **Randomization:** 1:1 allocation to either the intervention or control group, likely using permuted block randomization managed centrally (e.g., via IWRS).

### 6.1 Treatment Arms

Participants are randomized into two groups:

1.  **Intervention Group (GHOSTLY+) (n=60)**:
    -   Receives standard physiotherapy care PLUS the GHOSTLY+ intervention.
    -   **GHOSTLY+ Intervention Details:**
        -   Frequency: Minimum of five sessions per week.
        -   Duration: For two weeks, or until hospital discharge if sooner.
        -   Exercise: Isometric muscle contractions of the lower limb(s).
        -   Intensity: Target of 75% of the participant's Maximum Voluntary Contraction (MVC), determined via in-app calibration.
        -   BFR: Partial Blood Flow Restriction applied at 50% of Arterial Occlusion Pressure (AOP).
        -   Protocol: Three sets of 12 repetitions per session, with rest intervals between sets.

2.  **Control Group (n=60)**:
    -   Receives standard physiotherapy care ONLY.

### 6.2 Primary Outcome Measure (Effectiveness)

- **Lower-limb muscle strength at hospital discharge**, assessed using a handheld dynamometer (e.g., MicroFet).

### 6.3 Secondary Outcome Measures (Effectiveness & Implementation)

**(Detailed in `data_management_plan.md` - Section 1)**
1.  **Muscle Measures**:
    -   Maximal isometric muscle strength (handheld dynamometer).
    -   Muscle mass (cross-sectional area of the M. Rectus Femoris via bedside ultrasound).
    -   sEMG signal characteristics from game sensors (e.g., fatigue index, RMS amplitude).
2.  **Functional & Other Clinical Measures**:
    -   Functional capacity: 30-second sit-to-stand test (once weight-bearing), Functional Ambulation Category (FAC).
    -   Cognitive function (e.g., Mini-Mental State Examination - MMSE).
    -   Duration of time spent bedridden, hospital length of stay.
    -   Therapy adherence (game logs, questionnaires) and user experience (usability, satisfaction via questionnaires, interviews).
3.  **Implementation Outcomes (Proctor's Framework & CFIR)**:
    -   Acceptability, Adoption, Fidelity, Feasibility, Penetration, Sustainability.
    -   Assessed via mixed-methods (administrative records, staff surveys, app usage logs from dashboard, structured interviews with patients and care providers).

### 6.4 Data Collection Timepoints

-   **T0:** Baseline (prior to intervention/standard care initiation).
-   **T1:** After 1 week of intervention/standard care.
-   **T2:** At hospital discharge.

## 7. Web Dashboard Requirements (Supporting the GHOSTLY+ RCT - Aligned with `data_management_plan.md`)

The web dashboard must support:
1.  Visualization of EMG data for relevant muscle contractions during GHOSTLY+ sessions, including sEMG-derived metrics (muscle fatigue, activation, potentially strength/mass estimations - WP2.3) and game statistics (engagement, adherence - WP2.3).
2.  Tracking of primary and secondary outcomes over time (T0, T1, T2), including:
    - Muscle strength (dynamometer values).
    - Muscle mass (ultrasound CSA values).
    - Functional tests (STS counts, FAC scores).
    - Cognitive scores (MMSE).
    - Adherence metrics (from game logs, questionnaires).
    - User experience data (from questionnaires).
3.  Comparison between GHOSTLY+ intervention group and control group, utilizing both clinical outcomes and sEMG-derived/game-log metrics.
4.  Management of participant data from the three hospital sites, including demographics, group allocation, session logs, and consent status, adhering to pseudonymization protocols.
5.  Input/tracking of adherence and compliance data, including automated calculation from game logs and manual entry from questionnaires/logs.
6.  Storage and retrieval of qualitative data summaries or links (e.g., interview notes if digitized and permissible for dashboard access) and implementation logs.
7.  Export of pseudonymized data suitable for statistical analysis (e.g., for SPSS, REDCap), ensuring all data types listed in the `data_management_plan.md` (personal, medical, physiological, functional, ultrasound, qualitative summaries, game metrics, study protocols) are appropriately handled and exportable where relevant.
8.  Secure data handling, respecting pseudonymization, GDPR, ethical approvals, and data sharing agreements as outlined in `data_management_plan.md` (including interaction with Pixiu and REDCap as data storage/archive solutions).
9.  Display and reporting of data related to Dynamic Difficulty Adjustment (DDA) mechanisms (WP2.4), if applicable for therapist/researcher review.

## 8. User Perspectives (within the GHOSTLY+ RCT context, informed by `data_management_plan.md`)

- **Therapists**: Need to monitor individual patient progress with GHOSTLY+, ensure adherence to the specified intervention protocol (75% MVC, 50% AOP, 3x12 reps, ≥5 sessions/week), manage BFR and game settings, input diverse clinical assessment data (dynamometer, ultrasound, FAC, STS, MMSE), and document session details across multiple hospital sites.
- **Researchers**: Need to analyze treatment effects on primary and secondary outcomes, compare intervention vs. control, manage data from three sites, track implementation outcomes (acceptability, adoption, etc.), and export comprehensive, pseudonymized datasets for statistical analysis as per the `data_management_plan.md`.
- **Study Coordinators/PIs (e.g., Eva Swinnen, Mahyar Firouzi as per DMP)**: Need to oversee trial progress across all sites, manage randomization, monitor recruitment, ensure data quality and integrity, and ensure adherence to the DMP.
- **Data Managers (e.g., Carlos Cevallos Barragan as per DMP)**: Need tools for data cleaning, quality checks, ensuring compliance with data documentation (READMEs, codebooks), and preparing datasets for analysis as per the `data_management_plan.md`. 