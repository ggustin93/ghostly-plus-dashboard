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

The GHOSTLY+ system (GHOSTLY+ game + EMG sensors + BFR) will generate significant data. The **Web Dashboard** is crucial for:
- **Centralized Data Management**: Overcoming issues of data siloed on tablets.
- **Remote Monitoring & Patient Follow-up**: Enabling therapists and researchers to track progress and adherence effectively.
- **Comparative Analysis**: Facilitating analysis between patients, treatment arms, and potentially across multiple hospital sites involved in the RCT.
- **Measuring Progression & Outcomes**: Providing tools to quantify patient improvement and the effectiveness of the GHOSTLY+ intervention.
- **Supporting the RCT**: Managing participant data, intervention details, and outcome measures for the multicenter clinical trial.

(Source: [docs/prd.md](mdc:docs/prd.md) Section 2.3; [docs/00_PROJECT_DEFINITION/ressources/2024_ghostly_proposal.md](mdc:docs/00_PROJECT_DEFINITION/ressources/2024_ghostly_proposal.md) - WP2, WP4, WP5)

## 4. How The Dashboard Should Work: Proposed Solution & User Goals

The Web Dashboard, as part of the GHOSTLY+ system, will provide a centralized, secure platform for therapists and researchers involved in the clinical trial and patient care.

### 4.1 For Therapists:
Therapists need a tool to efficiently monitor their patients' rehabilitation process. The dashboard should allow them to:
- **View session results**: Access and review data from each patient's game session (EMG signals, game metrics).
- **Visualize data**: Understand complex EMG data through clear, interactive visualizations.
- **Track progress**: Monitor how a patient is progressing over time and across sessions.
- **Configure exercise programs**: (Potentially) Tailor rehabilitation programs within the system.
- **Compare cohorts**: (Potentially) Analyze data for groups of patients.
- **Generate reports**: Create clinical summaries for patient records or discussions.

(Source: [docs/prd.md](mdc:docs/prd.md) Section 3.1.1)

### 4.2 For Researchers:
Researchers require a platform for robust data analysis and export. The dashboard should enable them to:
- **Conduct comparative analysis**: Analyze data across different patients, cohorts, and potentially sites.
- **Export data**: Obtain raw and processed data in various formats (CSV, Excel) for external statistical tools.
- **Generate statistics**: View multi-site statistics and aggregated data.
- **Filter and segment data**: Isolate specific data subsets for focused analysis.

(Source: [docs/prd.md](mdc:docs/prd.md) Section 3.1.2)

## 5. User Experience Goals

While not explicitly detailed as "UX Goals" in the PRD or proposal, the functional requirements imply a need for:
- **Clarity and Intuitiveness**: Easy-to-understand interfaces, especially for complex EMG data.
- **Efficiency**: Quick access to relevant patient data and analysis tools.
- **Role-Specific Views**: Interfaces tailored to the distinct needs and workflows of therapists versus researchers.
- **Accessibility**: Usable by individuals with varying technical skills and potentially with assistive technologies (WCAG 2.1 AA).
- **Responsiveness**: A seamless experience across different devices (desktop, tablet).
- **Trust and Security**: Users must feel confident that sensitive patient data is handled securely and privately.

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
1.  Visualization of EMG data for relevant muscle contractions (e.g., quadriceps) during GHOSTLY+ sessions.
2.  Tracking of muscle strength (MicroFet), muscle mass (ultrasound), and other collected metrics over time (T0, T1, T2).
3.  Comparison between GHOSTLY+ intervention group and control group.
4.  Management of participant data, including demographics, group allocation, and session logs.
5.  Input/tracking of adherence and compliance data.
6.  Storage and retrieval of user experience feedback (e.g., survey responses, interview notes if digitized).
7.  Export of pseudonymized data for statistical analysis (e.g., for SPSS as mentioned in proposal's WP5).
8.  Secure data handling, respecting pseudonymization and GDPR (data to be stored in REDCap as per proposal, dashboard interaction needs to be compliant).

## 8. User Perspectives (within the GHOSTLY+ RCT context)

- **Therapists**: Need to monitor individual patient progress with GHOSTLY+, ensure adherence to protocol, manage BFR and game settings, and document session details.
- **Researchers**: Need to analyze treatment effects, compare intervention vs. control, manage data from multiple sites, track implementation outcomes, and export data for comprehensive statistical analysis.
- **Study Coordinators/PIs**: Need to oversee trial progress, manage randomization, monitor recruitment, ensure data quality and integrity across sites.
- **Data Managers/Analysts**: Need tools for data cleaning, quality checks, and preparing datasets for analysis as per the Data Management Plan (DMP). 