---
description: Explains why the GHOSTLY+ Dashboard project exists, the problems it solves, and its intended user experience.
source_documents: [docs/prd.md](mdc:docs/prd.md)
---

# GHOSTLY+ Dashboard: Product Context

## 1. Why This Project Exists: The Problem

The GHOSTLY+ project addresses **muscle strength loss in hospitalized elderly patients**, a significant clinical issue leading to:
- Slower post-hospitalization recovery.
- Increased risk of falls and injuries.
- Decreased autonomy and quality of life.
- Higher frequency of hospital readmissions.

(Source: [docs/prd.md](mdc:docs/prd.md) Section 1.2)

## 2. What The Dashboard Aims to Solve: Limitations of the GHOSTLY+ System *Without* the Dashboard

The existing GHOSTLY+ system (OpenFeasyo game + EMG sensors) collects valuable data. However, *without the new Web Dashboard*, the current setup has limitations that the dashboard aims to overcome:
- **Lack of centralized patient data**: Data is stored locally on tablets.
- **Inability for remote monitoring**: Clinicians cannot easily track patient progress remotely.
- **Difficulty in comparative analysis**: Challenging to compare data between patients or cohorts.
- **Lack of tools to measure progression**: Limited means to quantify patient improvement over time.

(Source: [docs/prd.md](mdc:docs/prd.md) Section 2.3)

## 3. How The Dashboard Should Work: Proposed Solution & User Goals

The Web Dashboard, as part of the GHOSTLY+ system (which includes the EMG-driven game and sensors), will provide a centralized, secure platform for therapists and researchers.

### 3.1 For Therapists:
Therapists need a tool to efficiently monitor their patients' rehabilitation process. The dashboard should allow them to:
- **View session results**: Access and review data from each patient's game session (EMG signals, game metrics).
- **Visualize data**: Understand complex EMG data through clear, interactive visualizations.
- **Track progress**: Monitor how a patient is progressing over time and across sessions.
- **Configure exercise programs**: (Potentially) Tailor rehabilitation programs within the system.
- **Compare cohorts**: (Potentially) Analyze data for groups of patients.
- **Generate reports**: Create clinical summaries for patient records or discussions.

(Source: [docs/prd.md](mdc:docs/prd.md) Section 3.1.1)

### 3.2 For Researchers:
Researchers require a platform for robust data analysis and export. The dashboard should enable them to:
- **Conduct comparative analysis**: Analyze data across different patients, cohorts, and potentially sites.
- **Export data**: Obtain raw and processed data in various formats (CSV, Excel) for external statistical tools.
- **Generate statistics**: View multi-site statistics and aggregated data.
- **Filter and segment data**: Isolate specific data subsets for focused analysis.

(Source: [docs/prd.md](mdc:docs/prd.md) Section 3.1.2)

## 4. User Experience Goals

While not explicitly detailed as "UX Goals" in the PRD, the functional requirements imply a need for:
- **Clarity and Intuitiveness**: Easy-to-understand interfaces, especially for complex EMG data.
- **Efficiency**: Quick access to relevant patient data and analysis tools.
- **Role-Specific Views**: Interfaces tailored to the distinct needs and workflows of therapists versus researchers.
- **Accessibility**: Usable by individuals with varying technical skills and potentially with assistive technologies (WCAG 2.1 AA).
- **Responsiveness**: A seamless experience across different devices (desktop, tablet).
- **Trust and Security**: Users must feel confident that sensitive patient data is handled securely and privately. 