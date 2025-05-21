---
description: Explains why the GHOSTLY+ Dashboard project exists, the problems it solves, its intended user experience, and its role within the GHOSTLY+ clinical research project.
source_documents: [docs/prd.md](mdc:docs/prd.md), [docs/00_PROJECT_DEFINITION/ressources/2024_ghostly_proposal.md](mdc:docs/00_PROJECT_DEFINITION/ressources/2024_ghostly_proposal.md)
---

# GHOSTLY+ Dashboard: Product Context

## 1. Why This Project Exists: The Problem

The GHOSTLY+ project addresses **muscle strength loss in hospitalized elderly patients**, a significant clinical issue leading to:
- Rapid decline in muscle mass (1-5% per day of bed rest, >10% loss during a hospital stay for sarcopenic older adults).
- Significant reduction in muscle strength (10-15% loss per week of complete rest).
- **Hospitalization-Associated Disability (HAD)**: Affects ~30% of older adults admitted to acute care, involving newfound inability to perform basic activities of daily living (ADLs).
- Slower post-hospitalization recovery.
- Increased risk of falls and injuries.
- Decreased autonomy and quality of life.
- Higher frequency of hospital readmissions and increased mortality rates.

(Source: [docs/00_PROJECT_DEFINITION/ressources/2024_ghostly_proposal.md](mdc:docs/00_PROJECT_DEFINITION/ressources/2024_ghostly_proposal.md) - Rationale and state-of-the-art; [docs/prd.md](mdc:docs/prd.md) Section 1.2)

### Unmet Needs (from [docs/00_PROJECT_DEFINITION/ressources/2024_ghostly_proposal.md](mdc:docs/00_PROJECT_DEFINITION/ressources/2024_ghostly_proposal.md))
1.  **Unmet Need 1**: Immobilized patients need alternative options for exercising to limit muscle strength loss and functional decline during hospitalization. (High-load dynamic exercises are often not possible; isometric exercises are preferred for early-stay rehabilitation.)
2.  **Unmet Need 2**: Immobilized patients need to be motivated to adhere to exercise schemes in non-supervised treatment time. (Adherence is low, ~50% in older adults, limiting effectiveness of unsupervised exercise.)
3.  **Unmet Need 3**: Serious games need to be adapted to the target population. (Current games often lack end-user input, evidence-based recommendations, and effective Dynamic Difficulty Adjustment (DDA), leading to variable quality and effectiveness.)

## 2. The GHOSTLY+ Intervention: A Proposed Solution

To address these unmet needs, the GHOSTLY+ project proposes a combined intervention:
- **Blood Flow Restriction (BFR)**: Applied during low-load isometric resistance exercises, BFR has shown comparable effects to high-load dynamic exercises in improving muscle outcomes. (Addresses Unmet Need 1)
- **EMG-Driven Serious Game (GHOSTLY+ app)**: An adaptation of the existing Ghostly app, co-created with clinicians and end-users, to facilitate muscle training in non-therapy time. It uses sEMG biofeedback to control game-play, aiming to increase motivation, adherence, and provide indirect supervision. The game will be adapted for the specific needs of immobilized older patients, incorporate BFR protocols, and focus on self-determination and ease of unsupervised use. (Addresses Unmet Needs 2 & 3)

(Source: [docs/00_PROJECT_DEFINITION/ressources/2024_ghostly_proposal.md](mdc:docs/00_PROJECT_DEFINITION/ressources/2024_ghostly_proposal.md) - Rationale and state-of-the-art, Approach and work programme)

## 3. What The Dashboard Aims to Solve: Supporting the GHOSTLY+ Intervention & Research

The GHOSTLY+ system (GHOSTLY+ game + EMG sensors + BFR) will generate significant data related to patient characteristics, intervention parameters, sEMG activity, game performance, and clinical outcomes. The **Web Dashboard** is crucial for:

-   **Centralized & Structured Data Management**: Overcoming issues of data siloed on tablets or in disparate spreadsheets. The dashboard will leverage a defined database schema (see `docs/00_PROJECT_DEFINITION/database_schema_simplified_research.md`) to manage complex, hierarchical data (e.g., patients, rehabilitation sessions, multiple game sessions per rehab session, clinical assessments, EMG metrics, game stats).
-   **Efficient Intervention Delivery & Monitoring**: Providing therapists with tools to configure GHOSTLY+ sessions (game, BFR, MVC), input clinical data, and monitor patient engagement and physiological responses in near real-time.
-   **Remote Monitoring & Patient Follow-up**: Enabling therapists and researchers to track progress and adherence effectively, even across multiple sites.
-   **Comparative Analysis & Outcome Evaluation**: Facilitating robust analysis of pseudonymized data to compare intervention vs. control groups, track outcomes over time, and explore relationships between intervention parameters, sEMG metrics, game engagement, and clinical results. This supports WP5 (Data Analyses) of the FWO proposal.
-   **Supporting the RCT**: Managing participant data (enrollment, pseudo-anonymization, cohort assignment), intervention details (as per WP2 & WP3), and diverse outcome measures for the multicenter clinical trial (WP4), ensuring data integrity and accessibility for analysis.
-   **Implementation Science Data Capture**: Storing data relevant to understanding implementation context (adherence, engagement, DDA usage) to inform frameworks like Proctor's and CFIR (WP4, WP5).

(Source: [docs/prd.md](mdc:docs/prd.md) Section 2.3; [docs/00_PROJECT_DEFINITION/ressources/2024_ghostly_proposal.md](mdc:docs/00_PROJECT_DEFINITION/ressources/2024_ghostly_proposal.md) - WP2, WP4, WP5; `docs/00_PROJECT_DEFINITION/UX_UI_specifications.md`)

## 4. How The Dashboard Should Work: Proposed Solution & User Goals

The Web Dashboard, as part of the GHOSTLY+ system, will provide a centralized, secure platform with role-specific functionalities for therapists, researchers, and administrators involved in the clinical trial and patient care. These are detailed in `docs/00_PROJECT_DEFINITION/UX_UI_specifications.md` (Sections 3 & 4).

### 4.1 For Therapists/Clinicians:
The dashboard empowers therapists to efficiently deliver and monitor the GHOSTLY+ intervention. Key goals and functionalities include:
-   **Patient & Session Management**: View personalized dashboards, manage patient profiles (demographics, medical history, consent), schedule and log Rehabilitation Sessions and their constituent Game Sessions.
-   **Intervention Configuration**: Configure GHOSTLY+ game parameters (MVC calibration, levels, DDA review), sEMG sensor selection, and BFR protocols for each session.
-   **Clinical Data Input**: Input and track comprehensive clinical assessment data (strength, morphology, functional tests, QoL questionnaires, adherence, adverse events) at designated timepoints (T0, T1, T2).
-   **Progress Monitoring**: Review detailed analyses of individual Game Sessions (EMG visualizations, sEMG-derived metrics for activation/fatigue, game performance statistics), view historical trends, and compare current session data against baselines.
-   **Documentation & Reporting**: Add session-specific notes and generate GHOSTLY+ progress reports summarizing sEMG/game metrics and clinical outcomes.

(Source: [docs/prd.md](mdc:docs/prd.md) Section 3.1.1; `docs/00_PROJECT_DEFINITION/UX_UI_specifications.md` Section 3.1 & 4.1)

### 4.2 For Researchers:
The dashboard serves as an analytical tool for evaluating intervention effectiveness and implementation dynamics using pseudonymized data. Key goals and functionalities include:
-   **Study Oversight**: Monitor RCT progress (recruitment, retention, data collection completeness, adherence rates across cohorts and sites).
-   **Data Exploration**: Access and explore pseudonymized sEMG signals, derived metrics, game statistics, DDA parameters, and clinical outcome measures.
-   **Comparative Analysis**: Compare outcome measures across patients and cohorts (Intervention vs. Control), visualize changes over time.
-   **Data Export**: Export comprehensive, pseudonymized datasets in formats suitable for external statistical software (e.g., SPSS, REDCap-compatible), including all WP2 data points and clinical measures.

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

## 6. GHOSTLY+ Clinical Trial Overview (FWO Proposal Details)

(Source: [docs/00_PROJECT_DEFINITION/ressources/2024_ghostly_proposal.md](mdc:docs/00_PROJECT_DEFINITION/ressources/2024_ghostly_proposal.md) - Phase 2, WP3, WP4)

The GHOSTLY+ project is centered around a **multicentered two-arm randomized controlled trial (RCT)** utilizing a Hybrid Type 1 design to evaluate the therapeutic effectiveness of GHOSTLY+ while also gathering information about the implementation process. It will be conducted at three hospital sites (UZB, UZA, and UZL Pellenberg).

- **Study Participants**: Adults aged 65 years and older who are not able to bear weight (e.g., due to surgery), with an anticipated hospitalization of ~14 days. Cognitive impairment and contraindications for BFR/exercise are exclusion criteria.
- **Sample Size**: Target of 120 patients (60 per group), accounting for dropout.
- **Randomization**: 1:1 ratio to intervention or control group, using permuted block randomization, managed centrally via an IWRS.

### 6.1 Target Populations (Broader Context - Not all part of the FWO proposal's primary RCT focus which is on immobilized older adults)

The FWO proposal focuses on **immobilized older adults**. The previous PRD mentioned other populations for the Ghostly app (Stroke, COVID/ICU). For the GHOSTLY+ dashboard related to the FWO proposal, the primary focus is:

1.  **Hospitalized Immobilized Older Adults (≥65 years)**: Requiring support for lower body mobility and inability to transfer independently. (Primary focus of the FWO proposal RCT for GHOSTLY+).

*(The PRD previously listed Stroke and COVID-19/ICU patients. While the Ghostly app has been tested with these, the FWO proposal for GHOSTLY+ specifically targets immobilized older adults for its main RCT. The dashboard should primarily support this, but awareness of other potential uses of the core Ghostly game is useful.)*

### 6.2 Treatment Arms (for the FWO Proposal RCT - Immobilized Older Adults)

Participants are randomized into two groups:

1.  **Intervention Group (GHOSTLY+) (n=60)**:
    -   Receives conventional therapy PLUS the GHOSTLY+ intervention.
    -   GHOSTLY+ intervention: Isometric strength training using the GHOSTLY+ game with BFR.
    -   Frequency: At least 5 times per week, for 10 minutes per session (or until hospital discharge).
    -   BFR: Smart cuff on proximal limb, 50% of Arterial Occlusion Pressure (AOP).
    -   Game Intensity: Target of 75% of individualized Maximum Voluntary Contraction (MVC), assessed via the game.
    -   Protocol: Three levels (sets) of twelve repetitions, with two minutes rest between levels.

2.  **Control Group (n=60)**:
    -   Receives conventional therapy ONLY.

*(The PRD previously described three arms for other populations. The FWO proposal for GHOSTLY+ details a two-arm trial for immobilized older adults.)*

### 6.3 Primary Outcome Measure (Effectiveness)

- **Muscle strength loss at hospital discharge**, measured by MicroFet (handheld dynamometer).

### 6.4 Secondary Outcome Measures (Effectiveness & Implementation)

1.  **Muscle Measures**:
    -   Maximal isometric muscle strength (MicroFet).
    -   Muscle mass (cross-sectional area of M. Rectus Femoris via bedside ultrasound).
    -   EMG signals from game sensors.
2.  **Functional & Other Measures**:
    -   Independence in functional ambulation.
    -   Functional strength/endurance (30-second sit-to-stand test, once weight-bearing).
    -   Duration of time spent immobilized, length of hospital stay.
    -   Therapy compliance and adherence rates (game logs, questionnaires).
    -   User experience feedback (questionnaires, interviews).
3.  **Implementation Outcomes (Proctor's Framework & CFIR)**:
    -   Acceptability, Adoption, Fidelity, Penetration, Feasibility, Sustainability.
    -   Assessed via mixed-methods (administrative data, dashboard data, site staff surveys, interviews, focus groups).

### 6.5 Data Collection Timepoints
-   T0: Prior to intervention/standard care (baseline).
-   T1: After 1 week.
-   T2: At hospital discharge.

## 7. Web Dashboard Requirements (Supporting the GHOSTLY+ RCT)

The web dashboard must support:
1.  Visualization of EMG data for relevant muscle contractions (e.g., quadriceps) during GHOSTLY+ sessions, expanded to include comprehensive display of sEMG-derived metrics (muscle fatigue indicators, estimated muscle strength, estimated muscle mass using methods like RMS, MAV/MAD, spectral analysis, sEMG-force modeling, regression models) and detailed game statistics (engagement, adherence) as defined in WP2.3.
2.  Tracking of muscle strength (MicroFet), muscle mass (ultrasound), and other collected metrics over time (T0, T1, T2). The dashboard will display these clinically measured values and facilitate the comparison with sEMG-derived estimations of strength and mass developed in WP2.3.
3.  Comparison between GHOSTLY+ intervention group and control group, utilizing both clinical outcomes and the sEMG-derived/game-log metrics.
4.  Management of participant data, including demographics, group allocation, and session logs.
5.  Input/tracking of adherence and compliance data, including automated calculation from game logs (WP2.3) and potentially manual entry of questionnaire data.
6.  Storage and retrieval of user experience feedback (e.g., survey responses, interview notes if digitized).
7.  Export of pseudonymized data for statistical analysis (e.g., for SPSS as mentioned in proposal's WP5), ensuring all relevant sEMG metrics and game data are included.
8.  Secure data handling, respecting pseudonymization and GDPR (data to be stored in REDCap as per proposal, dashboard interaction needs to be compliant).
9.  Display and reporting of data related to Dynamic Difficulty Adjustment (DDA) mechanisms (WP2.4), if applicable for therapist/researcher review, as this data will be stored and accessible via the dashboard (WP2.5).

## 8. User Perspectives (within the GHOSTLY+ RCT context)

- **Therapists**: Need to monitor individual patient progress with GHOSTLY+, ensure adherence to protocol, manage BFR and game settings, and document session details.
- **Researchers**: Need to analyze treatment effects, compare intervention vs. control, manage data from multiple sites, track implementation outcomes, and export data for comprehensive statistical analysis.
- **Study Coordinators/PIs**: Need to oversee trial progress, manage randomization, monitor recruitment, ensure data quality and integrity across sites.
- **Data Managers/Analysts**: Need tools for data cleaning, quality checks, and preparing datasets for analysis as per the Data Management Plan (DMP). 