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

## Clinical Trial Overview

The GHOSTLY+ project is centered around a clinical trial with NCT05258500 identifier that investigates the effectiveness of EMG-driven serious games for muscle rehabilitation. The trial has two primary research questions:

1. The effectiveness of the Ghostly app (as an additional training to conventional therapy) in relation to strength gain
2. The effect of Blood Flow Restriction (BFR) during isometric strength training compared to standard isometric strength training

## Target Populations

The study includes three distinct patient populations, each with their own randomized controlled trial (RCT):

1. **Stroke Patients**: Acute and subacute stroke patients with score of 19 or lower on the knee and hip movement test of the Motricity Index
2. **Hospitalized Elderly**: Patients 65+ years with 14 or less repetitions on the 30-seconds sit-to-stand test
3. **COVID-19/ICU Patients**: Recovering COVID-19 patients and ICU patients with a score of 2 or less for manual muscle testing of the quadriceps muscle

## Treatment Arms

Each population is randomized into three treatment groups:

1. **Ghostly App (Group A)**: Conventional therapy plus the Ghostly app for isometric quadriceps training
   - Three sets of twelve repetitions at 75% MVC 
   - Three training protocols: Standard (120s rest between sets), Cluster set 1 (10s rest between reps), Cluster set 2 (30s rest after 3 consecutive reps)

2. **Ghostly App + BFR (Group B)**: Conventional therapy plus Ghostly app with Blood Flow Restriction
   - Four sets of 15 repetitions, each contraction lasting three seconds
   - Training intensity at 100% MVC with two minutes rest between sets
   - Cuff pressure set at 50% of arterial occlusion pressure

3. **Control Group (Leaflet)**: Conventional therapy plus leaflet-based exercise instructions
   - Matched with Ghostly game in terms of repetitions, sets and rest intervals
   - Performed without supervision of therapist
   - Acts as control condition for the Ghostly intervention

## Primary Outcome Measures

- Change in quadriceps muscle strength from baseline to 2 weeks of intervention (measured with MicroFET dynamometer)
- Change in quadriceps muscle strength from baseline to 6 weeks or hospital discharge (measured with MicroFET dynamometer)

## Secondary Outcome Measures

1. **Quadriceps Measurements**:
   - Change in cross-sectional area (ultrasound)
   - Change in pennation angle (ultrasound)
   - Change in echo intensity (ultrasound)
   - All measured at both 2 weeks and 6 weeks/discharge

2. **Body Composition**:
   - Change in body impedance (Quadscan 4000 device)

3. **Functional Outcomes**:
   - Length of hospital stay
   - Change in time spent bedridden
   - Population-specific measures:
     - Motricity Index for stroke patients
     - 30-seconds sit-to-stand test for elderly
     - Manual muscle testing for COVID-19/ICU patients

4. **User Experience**:
   - Global Perceived Effect (GPE) questionnaire
   - Therapy compliance and adherence
   - Modified USE (Usefulness, Satisfaction, Ease of use) questionnaire

## Analysis Approach

- Statistical analysis using SPSS 27 (IBM)
- Significance level of 0.05 throughout
- Descriptive statistics of baseline characteristics
- Normal distribution assessment using Levene's test
- Two-way repeated measures ANOVA to assess differences in dependent variables
- Tukey post-hoc test to compare mean differences for true significance
- For USE questionnaire: percentage distribution of items and mean scores for subscales

## Web Dashboard Requirements

The web dashboard must support:

1. Visualization of EMG data for quadriceps muscle contractions
2. Tracking of strength gains and other quadriceps metrics over time
3. Comparison between treatment groups (Ghostly, Ghostly+BFR, Control)
4. Analysis of 2-week and 6-week intervention outcomes
5. Export of data for statistical analysis in SPSS
6. Population-specific assessment tracking
7. User experience measurement and analysis

## User Perspectives

- **Therapists**: Need to monitor individual patient progress, compare with baseline, and adjust treatment parameters
- **Researchers**: Need to analyze treatment effects across populations and treatment arms, export data for statistical analysis
- **Administrators**: Need to manage the clinical trial across multiple sites while ensuring data security and integrity 