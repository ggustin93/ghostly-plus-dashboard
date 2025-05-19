# Ghostly+ Dashboard: Functional Design and UI/UX Specifications

## 1. Introduction
This document outlines the user interfaces for the Ghostly+ Dashboard, a web application supporting an EMG-driven serious game designed to combat muscle strength loss in hospitalized elderly patients. The dashboard is a critical component for monitoring patient progress, analyzing EMG data, and managing the overall system and clinical trial. A key aspect of the system is that a single **Rehabilitation Session** (an overall therapy appointment) can involve one or more **Game Sessions**, with each Game Session typically generating a C3D data file.

### 1.1. Purpose of This Document

- Detail the functional capabilities of each screen from a user's perspective.
- Define user experience (UX) goals, interaction patterns, and layout guidance.
- Provide a clear reference for UI design and implementation.
- Establish a consistent design language.
- Define essential vs. non-essential features to guide development prioritization.

> **Cross-reference**: For project scope, goals, and detailed functional requirements, see the [Product Requirements Document (PRD)](prd.md). For overall project context, see [Product Context](mdc:memory-bank/productContext.md). **For specific details on game adaptation, sEMG metrics, sensor integration, and Dynamic Difficulty Adjustment (DDA) relevant to the dashboard, see [WP2 Proposal Detailed](mdc:docs/00_PROJECT_DEFINITION/ressources/WP2_proposal_detailed.md).**

### 1.2. Technical Context

The Ghostly+ Dashboard UI will be built using:
- **Framework**: React with Vite
- **UI Library**: Tailwind CSS with shadcn/ui components (React version: https://ui.shadcn.com/)
- **State Management**: Appropriate React state management solutions.
- **Authentication**: Supabase Auth will be used for managing user identities and providing JWT-based authentication.
- **Data Handling**: Supabase will serve as the primary database for persisting application data. C3D files from game sessions will be stored using Supabase Storage. All data interactions will be mediated by a FastAPI (Python) backend API, which will handle business logic and interact with Supabase services.

Designers should leverage shadcn/ui (React) component patterns. For API interaction understanding, consult the development team regarding data contracts relevant to the UI.

## 2. Design System Guidelines

(Placeholder: To be defined - Typography, Color Palette, Component Patterns)

### 2.1. Accessibility Requirements

- Multilingual support (English, Dutch, French).
- Target WCAG 2.1 Level AA compliance.
- Ensure minimum contrast ratios (e.g., 4.5:1 for text).
- Color should not be the sole means of conveying information.

## 3. User Roles and Access Patterns (Personas)

The dashboard serves three primary user roles. Permissions should be granular enough to accommodate various study personnel (e.g., Study Nurses, Project Coordinators) with specific data access or input needs.

### 3.1. Persona: Therapist/Clinician (Clinical Focus)
-   **Primary Goal**: To efficiently deliver and monitor the GHOSTLY+ intervention for their assigned hospitalized elderly patients, track clinical outcomes, and manage individual patient rehabilitation progress.
-   **Context**: Works directly with patients, configures game and BFR parameters, inputs clinical assessment data, and needs quick access to session results and progress trends to inform patient care.

### 3.2. Persona: Researcher (Analytical Focus)
-   **Primary Goal**: To analyze pseudonymized data from the GHOSTLY+ clinical trial to evaluate intervention effectiveness, study implementation outcomes, and generate insights for publication and future research.
-   **Context**: Works with aggregated and pseudonymized data from multiple patients and sites, needs tools for cohort comparison, data exploration, statistical analysis (or export for such), and tracking overall study progress.

### 3.3. Persona: Administrator (System & Operational Focus)
-   **Primary Goal**: To ensure the smooth operation of the GHOSTLY+ Dashboard, manage user access and permissions, maintain data integrity and security, and support the logistical aspects of the multi-site clinical trial.
-   **Context**: Oversees the entire platform, manages user accounts, monitors system health and performance, handles data backups, and configures system-level settings.

## 4. Screen Specifications

### 4.1. Therapist Interface

#### T1. Home Dashboard (Essential)
-   **Primary Focus**: Provide therapists with a quick overview of their patients, upcoming/recent **Rehabilitation Sessions**, and daily tasks, with clear indication of study arms and alerts.
-   **Key Features (User Stories)**:
    For the **Therapist**:
    1.  I want to see a list of my assigned patients with clear status indicators (e.g., activity, alerts, assigned study arm) so that I can quickly identify who needs attention and manage them according to protocol.
    2.  I want to view my daily schedule with upcoming **Rehabilitation Sessions** so that I can manage my time and prepare for patient interactions.
    3.  I want to see summaries of recent **Rehabilitation Sessions**, with an overview of completed **Game Sessions** and key aggregated metrics, **including sEMG-derived metrics (WP2.3) and game engagement/adherence statistics (WP2.3),** so that I can stay informed about their immediate progress.
    4.  I want to see actionable items or alerts (e.g., missed **Rehabilitation Sessions**, declining metrics from **Game Sessions**, **potential issues flagged by DDA (WP2.4)**) so that I can promptly address potential issues.
    5.  I want to be able to filter and sort my patient list (e.g., by status, name, assigned group, recent activity) so that I can easily find specific patients or organize my view.
    6.  I want quick access to view detailed patient information from the dashboard so that I can navigate efficiently.
    7.  I want to schedule new patient **Rehabilitation Sessions** directly from my dashboard or calendar view so that I can manage appointments easily.
    8.  (Non-essential) I want a notification center for system updates or messages so that I am aware of important system-wide information.
-   **Layout Guidance**:
    -   Consider a card-based grid or a list view for patients and **Rehabilitation Sessions**, highlighting priority items.
    -   Allow expansion of a Rehabilitation Session entry to show its constituent Game Sessions if relevant here.
    -   Responsive design for desktop and tablet use in clinical settings.
    -   Persistent header with user information and global navigation.

#### T2. Patient Profile (Essential)
-   **Primary Focus**: Offer therapists a comprehensive view of a patient's information, clinical assessments, and treatment history, clearly delineating **Rehabilitation Sessions** and their constituent **Game Sessions (C3D files)**, including detailed BFR application.
-   **Key Features (User Stories)**:
    For the **Therapist**:
    1.  I want to view patient demographics and relevant medical history (including MMSE scores if applicable, noting exclusion <23/30) so that I have full context for treatment.
    2.  I want to input and view key clinical outcome measures (e.g., MicroFET for muscle strength, ultrasound for muscle mass, 30s sit-to-stand) at specific assessment time points (T0, T1, T2) so that I can track objective progress.
    3.  I want to see historical EMG performance graphs with trends and relevant sEMG metrics **(including those for fatigue, strength, and mass estimation as per WP2.3)**, with options to view data aggregated at the **Rehabilitation Session** level or for individual **Game Sessions**, so that I can monitor muscle activation and fatigue patterns over time.
    4.  I want to view a **Rehabilitation Session** calendar with attendance records, where each entry can be expanded to show details of its **Game Sessions** (including **game statistics for engagement/adherence per WP2.3**) and provide links to their detailed analysis, so that I can review specific intervention details.
    5.  I want to see a visualization of the treatment plan timeline, including detailed BFR parameters used (e.g., measured Arterial Occlusion Pressure (AOP), target %AOP, actual cuff pressure, duration) for each relevant **Game Session** within a **Rehabilitation Session**, so that I can understand the applied interventions.
    6.  I want to add, edit, and view clinical notes and observations, potentially at both the **Rehabilitation Session** and individual **Game Session** level, so that I can document important subjective information and care details.
    7.  I want to toggle data visualizations between different time periods so that I can analyze short-term and long-term trends.
    8.  I want to filter data visualizations (e.g., by muscle groups, specific metrics, specific **Game Sessions** within a **Rehabilitation Session**, **potentially by sensor type if multiple are supported per WP2.2**) so that I can focus on relevant information.
    9.  I need a clear way to upload or associate multiple C3D files (from multiple **Game Sessions**, **potentially from different sEMG sensors per WP2.2**) to a single **Rehabilitation Session** if manual upload is necessary.
-   **Layout Guidance**:
    -   Tab-based information architecture with a persistent patient header.
    -   Clear visual distinction or hierarchy between **Rehabilitation Session** overview and **Game Session** details.
    -   Responsive charts and data tables.
    -   Consider a split view for displaying patient information alongside visualizations.

#### T3. Session Analysis (Essential)
-   **Primary Focus**: Enable therapists to conduct a detailed post-session review of a specific **Game Session (C3D file)**, including EMG data (advanced metrics like RMS, MAV/MAD, fatigue indices, force estimations, muscle mass estimations, all as outlined in **WP2.3**, presented in a clinically meaningful way), game performance (including **engagement/adherence statistics from WP2.3**), DDA parameters used (**WP2.4**), and BFR application details, with context of the overall **Rehabilitation Session** it belongs to. **Consideration for data from different sEMG sensors (WP2.2) if applicable.**
-   **Key Features (User Stories)**:
    For the **Therapist**:
    1.  I want to view muscle activation heat maps comparing left/right symmetry for a selected **Game Session** so that I can assess balanced muscle engagement.
    2.  I want to see peak contraction graphs with target thresholds (e.g., %MVC achieved) for a selected **Game Session** so that I can evaluate effort and performance against goals.
    3.  I want to review **Game Session** duration and intensity metrics, **and detailed game statistics (how often played, levels, time per level, activation points, inactivity periods - WP2.3)** so that I can quantify the exercise dose and engagement for that specific game play.
    4.  I want to see key sEMG-derived metrics (e.g., RMS, MAV/MAD, VAR, spectral fatigue indicators like Dimitrov's index, time-frequency analysis features from Hilber-Huang, force/effort estimations, muscle mass estimations, as outlined in proposal **WP2.3**) for a selected **Game Session**, presented meaningfully, so that I can understand muscle response during that game play. **These metrics should be clearly distinguished from clinically measured outcomes.**
    5.  I want to view any BFR parameters applied during the selected **Game Session** so that I can correlate them with EMG data and outcomes for that game play.
    6.  I want to compare data from the current **Game Session** against baseline and previous **Game Sessions** (potentially within the same or different **Rehabilitation Sessions**) so that I can track progress effectively.
    7.  I want to easily navigate between different **Game Sessions** within the same **Rehabilitation Session** from this analysis view.
    8.  **I want to see how DDA algorithms (WP2.4) adjusted game parameters during the session, if this information is relevant for review.**
-   **Layout Guidance**:
    -   Consider a split view with a main visualization panel and a sidebar for metrics/controls.
    -   Include a timeline scrubber for navigating session recordings.
    -   Allow metrics panels to be collapsible to maximize visualization space.

#### T4. Treatment Configuration (Essential)
-   **Primary Focus**: Allow therapists to prescribe exercises, set up GHOSTLY+ game parameters (including guiding MVC calibration and **reviewing/adjusting DDA settings from WP2.4**), and define BFR protocols for an upcoming **Rehabilitation Session**, understanding that this might involve configuring parameters for one or more anticipated **Game Sessions**. **The system should allow selection of sEMG sensor if multiple options are available (WP2.2).**
-   **Key Features (User Stories)**:
    For the **Therapist**:
    1.  I want to guide the patient through an MVC calibration process within the GHOSTLY+ system (**potentially adapted based on gameplay as per WP2.4**), which will apply to subsequent **Game Sessions** within the **Rehabilitation Session**, so that exercise intensity (e.g., target 75% MVC) is appropriately individualized.
    2.  I want to adjust game difficulty levels (including new levels from **WP2.1**) and review/configure DDA parameters (**adaptive muscle contraction detection and adaptive level progression from WP2.4**) for anticipated **Game Sessions** so that I can tailor the challenge to the patient.
    3.  I want to set overall **Rehabilitation Session** duration, and define the number of repetitions/sets (e.g., discrimination of long vs short contractions from **WP2.1**), and rest intervals for each planned **Game Session** within it, aligned with training protocols, so that I can define the exercise structure.
    4.  I want to configure blood flow restriction parameters (e.g., target %AOP based on measured AOP, cuff pressure, duration) for each relevant **Game Session** so that I can implement the BFR protocol accurately.
    5.  I want to select exercise types with clear muscle targeting guides so that I can ensure the correct muscles are being exercised.
    6.  I want to save treatment configurations as templates so that I can reuse them for multiple patients or sessions.
    7.  I want to preview the effects of parameter changes, ideally with visual feedback, so that I understand the configuration before applying it.
    8.  (Non-essential) I want to be able to sequence exercises (e.g., via drag-and-drop) so that I can create a custom workout flow.
    9.  (Non-essential) I want to copy settings from previous successful sessions so that I can quickly replicate effective configurations.
    10. **If multiple sEMG sensors are supported (WP2.2), I want to select the sensor to be used for the session.**
-   **Layout Guidance**:
    -   Wizard-style interface or multi-step form for guided configuration.
    -   Provide visual feedback on parameter changes.
    -   Consider a side panel showing a real-time summary of the configuration.

#### T5. Progress Reports (Non-essential)
-   **Primary Focus**: Facilitate documentation and outcome measurement for clinical and research communication, with clear export options compatible with REDCap. **Reports should include sEMG-derived metrics and game engagement/adherence statistics (WP2.3).**
-   **Key Features (User Stories)**:
    For the **Therapist**:
    1.  I want to generate customizable reports so that I can summarize patient progress for records or team discussions.
    2.  I want to include longitudinal progress charts for key clinical outcomes (MicroFET, ultrasound, functional tests) and sEMG metrics **(including fatigue, strength, mass estimations, and game engagement/adherence data from WP2.3)**, with milestone markers (T0, T1, T2), so that I can visually demonstrate changes over time.
    3.  I want to create printable/exportable summary sheets (e.g., PDF, and formats suitable for easy data entry or import into REDCap) so that I can share information easily and comply with study data management.
    4.  I want to select specific metrics and time periods for report inclusion so that I can tailor reports to specific needs.
    5.  I want to choose between different chart types for data representation in reports so that information is presented effectively.
-   **Layout Guidance**:
    -   Document-style interface with a preview panel.
    -   Split screen with configuration options on one side and a live preview of the report on the other.

### 4.2. Researcher Interface
*Note: All patient data displayed in the Researcher Interface must be pseudonymized to maintain privacy and support blinded outcome assessment for the RCT.*

#### R1. Study Dashboard (Essential)
-   **Primary Focus**: Provide researchers with an overview of the RCT progress, cohort status, data collection (acknowledging that **Rehabilitation Sessions** may contain multiple **Game Session** data points, **including sEMG metrics and game statistics from WP2.3, and DDA parameters from WP2.4**), and key implementation science outcomes across multiple sites.
-   **Key Features (User Stories)**:
    For the **Researcher**:
    1.  I want to view study cohorts (e.g., Intervention GHOSTLY+ vs. Control) with participant counts and key demographics so that I can monitor study composition.
    2.  I want to track recruitment and retention metrics, filterable by study site (UZB, UZA, UZL Pellenberg), so that I can assess trial enrollment and participant engagement.
    3.  I want to visualize compliance and adherence rates for the intervention (e.g., completion of prescribed **Rehabilitation Sessions** and intended **Game Sessions** within them, **based on game statistics and sEMG activity from WP2.3**) so that I can understand how well the protocol is being followed.
    4.  I want to see data collection progress for key outcome measures, **including sEMG-derived metrics and game statistics (WP2.3),** so that I can monitor the completeness of the dataset.
    5.  (Non-essential for MVP, but important for SA3) I want an overview of data related to implementation science outcomes (e.g., acceptability, adoption, fidelity, feasibility, penetration, sustainability summaries, potentially derived from dashboard-captured intervention logs or therapist inputs if designed for this) so that I can assess how the intervention is being implemented according to Proctor's Framework and CFIR.
    6.  I want to filter dashboard data by study parameters (e.g., age range, specific conditions, site) so that I can focus on specific subgroups.
    7.  I want to export summary statistics from the dashboard so that I can use them in reports or presentations.
    8.  I want to compare high-level metrics between different cohorts so that I can get an initial sense of trends.
-   **Layout Guidance**:
    -   Executive dashboard style with hierarchical information (KPIs with drill-down).
    -   Grid of metric cards or charts with consistent styling.

#### R2. Data Explorer (Essential)
-   **Primary Focus**: Enable researchers to perform advanced data analysis and visualization of pseudonymized RCT data, with the ability to analyze individual **Game Sessions (C3D files, potentially from different sensor types per WP2.2)** or aggregate data at the **Rehabilitation Session** level, **including all sEMG-derived metrics, game statistics (WP2.3), and DDA parameters (WP2.4)**, and robust export to SPSS and REDCap.
-   **Key Features (User Stories)**:
    For the **Researcher**:
    1.  I want to browse raw and processed pseudonymized sEMG signals from individual **Game Sessions** with filtering options (including advanced metrics like fatigue indices (e.g., Dimitrov's), force estimations, mass estimations, time-frequency analysis features - all as per **WP2.3**) so that I can conduct in-depth EMG analysis.
    2.  I want tools to compare all collected outcome measures (clinical and **sEMG-derived/game-based from WP2.3**) across multiple patients and cohorts, with options to analyze per **Game Session** or aggregate per **Rehabilitation Session**, so that I can identify trends and differences.
    3.  I want access to descriptive statistical analysis modules or clear export options for statistical software (e.g., SPSS) and clinical trial databases (e.g., REDCap-compatible formats), **ensuring all WP2 data (sEMG metrics, game stats, DDA info) is included,** so that I can perform robust statistical testing and data management.
    4.  I want to apply complex filters across multiple data dimensions (**potentially including sEMG sensor type used, WP2.2**) so that I can isolate specific datasets for analysis.
    5.  I want to save and reuse analysis configurations so that I can efficiently repeat common analyses.
    6.  I want to generate statistical summaries or reports on selected data segments so that I can document my findings.
    7.  I want to download raw or processed pseudonymized data (e.g., CSV, SPSS files, REDCap-compatible exports) for external processing or archival so that I have flexibility in my analysis workflow.
    8.  (Non-essential) I want pattern recognition visualizations for EMG or other data so that I can explore novel insights.
    9.  (Non-essential) I want an annotation and tagging system for data segments so that I can mark events or features of interest.
-   **Layout Guidance**:
    -   Workbench style with multiple configurable tool/visualization areas.
    -   Resizable panels for a customizable workspace.
    -   Persistent filters and selection state for ease of use.

#### R3. Cohort Analysis (Essential)
-   **Primary Focus**: Facilitate group-level data analysis for comparing intervention effects in the RCT, **utilizing clinical outcomes, sEMG-derived metrics, and game engagement/adherence data (WP2.3).**
-   **Key Features (User Stories)**:
    For the **Researcher**:
    1.  I want to view demographic breakdowns by cohort so that I can understand the characteristics of each group.
    2.  I want to compare intervention vs. control groups for all primary and secondary outcomes (MicroFET, ultrasound, functional tests, sEMG metrics **including fatigue, strength, mass estimations, and game engagement/adherence from WP2.3**, etc.) at different time points (T0, T1, T2) so that I can evaluate treatment efficacy.
    3.  I want to visualize how outcome measures **(including sEMG-derived metrics and game statistics)** change over time for each cohort so that I can track progression.
    4.  I want to define inclusion/exclusion criteria for ad-hoc cohort creation or filtering so that I can refine my analysis groups.
    5.  (Non-essential) I want to apply basic statistical tests with parameter configuration directly within the dashboard so that I can get quick insights.
    6.  I want to highlight outliers or statistically significant findings in visualizations so that they are easily identifiable.
-   **Layout Guidance**:
    -   Split view with cohort selection/definition tools and analysis results/visualizations.
    -   Tabbed interface for different types of analyses or outcome measures.
    -   Result area should provide exportable visuals and data tables.

### 4.3. Administrator Interface

#### A1. System Overview (Essential)
-   **Primary Focus**: Enable administrators to monitor the platform's health, performance, and usage.
-   **Key Features (User Stories)**:
    For the **Administrator**:
    1.  I want to see a dashboard of user account statuses (e.g., active, locked) so that I can monitor user access.
    2.  I want to view system performance metrics (e.g., response times, server load if applicable) so that I can ensure the platform is running smoothly.
    3.  I want to see storage usage visualizations so that I can manage capacity.
    4.  I want to access error logs and alerts, filterable by severity, component, or time, so that I can identify and troubleshoot issues.
    5.  I want to acknowledge and resolve alerts so that I can track issue management.
    6.  I want to export system statistics and logs for reporting or auditing so that I can maintain records.
    7.  (Non-essential) I want a scheduled maintenance calendar and tools to announce maintenance windows so that users are informed.
-   **Layout Guidance**:
    -   "Mission control" style with clear status indicators and action panels.
    -   Timeline view for historical performance data.
    -   Highlighting for critical alerts.

#### A2. User Management (Essential)
-   **Primary Focus**: Provide administrators with tools for account administration and flexible permission management to accommodate all study personnel roles (e.g., PI, Project Coordinator, Study Nurse, PhD Student, Therapists, Geriatricians).
-   **Key Features (User Stories)**:
    For the **Administrator**:
    1.  I want to view a user directory with assigned roles and permissions so that I can manage user access effectively.
    2.  I want to add new users and assign them appropriate roles and granular permissions (covering Therapists, Researchers, Admins, and accommodating specific needs of Study Nurses, Project Coordinators, PIs, PhDs, etc.) so that new personnel can access the system securely and appropriately.
    3.  I want to edit existing user details, roles, and access rights so that I can maintain an up-to-date user base.
    4.  I want to review user activity logs (e.g., logins, key actions) so that I can audit system usage.
    5.  I want tools to manage password resets and account recovery/unlocking so that I can assist users with access issues.
    6.  I want to configure and manage a permission matrix or role-based access controls so that data access is appropriately restricted.
    7.  (Non-essential) I want tools for bulk user operations (e.g., importing users, batch role assignments) so that I can manage large numbers of users efficiently.
    8.  I want to assign patients to specific therapists so that caseloads can be managed and data access restricted appropriately within the platform.
-   **Layout Guidance**:
    -   Directory style with detailed user cards or a table view.
    -   Modal dialogs for user editing and creation.
    -   Tab-based organization for different user management functions (e.g., create user, manage roles).

#### A3. Institution Settings (Non-essential)
-   **Primary Focus**: Allow administrators to configure organization-level settings.
-   **Key Features (User Stories)**:
    For the **Administrator**:
    1.  I want to manage facility information (e.g., participating hospital sites) so that the system reflects the study structure.
    2.  (Future consideration) I want to configure department structures within an institution so that user organization can be more granular.
    3.  (Future consideration) I want options for branding and customization (e.g., logos) so that the dashboard can have an institutional look and feel.
    4.  (Future consideration) I want to manage integration settings for external systems (e.g., REDCap if direct integration is built) so that data flow can be configured.
    5.  (Future consideration) I want to manage licenses or quotas if applicable so that system usage is controlled.
-   **Layout Guidance**:
    -   Settings panel with categorized options.
    -   Form-based configuration with clear validation.
    -   Preview area for changes like branding, if applicable.

#### A4. Data Management (Essential)
-   **Primary Focus**: Equip administrators with tools for database administration, maintenance, ensuring data integrity (including correct association of multiple **Game Sessions/C3D files, potentially from different sEMG sensors per WP2.2,** to their parent **Rehabilitation Sessions**, and logging of **sEMG metrics, game stats, DDA parameters from WP2**), and overseeing data flows including to/from REDCap.
-   **Key Features (User Stories)**:
    For the **Administrator**:
    1.  I want to access a backup and restore interface so that I can ensure data safety and recoverability.
    2.  I want to schedule automated backups and initiate manual backups so that data is regularly protected.
    3.  I want tools for data purging (according to GDPR and study protocols) and archiving so that data lifecycle is managed.
    4.  I want to view database health indicators and performance metrics so that I can monitor the data backend.
    5.  I want import/export functionality for entire datasets or key tables (respecting pseudonymization, with options for REDCap-compatible formats, and ensuring the relational integrity of **Rehabilitation Sessions** and their **Game Sessions, including all WP2 data points**) so that data can be migrated or archived according to study protocols.
    6.  (Non-essential) I want an audit trail viewer for data modifications so that changes can be tracked.
    7.  I want tools to view and potentially correct associations between **Game Sessions (C3D files)** and **Rehabilitation Sessions** in case of upload errors or mismatches, **including managing data from different sEMG sensors (WP2.2) if necessary.**
    8.  I want to manage database schema (if exposed) and access control policies (e.g., RLS) so that data structure and security are maintained.
    9.  I want to oversee or manage data export/synchronization processes with REDCap for long-term archival and master clinical trial data management, ensuring GDPR compliance.
-   **Layout Guidance**:
    -   Technical administration panel, potentially with progressive disclosure for advanced options.
    -   Clear confirmation dialogs for destructive actions (e.g., purging, restoring).
    -   Status indicators for ongoing operations like backup or restore.

## 5. User Flow Diagrams

### 5.1. Therapist User Flow
```
T1 Home Dashboard → T2 Patient Profile → T3 Session Analysis ↔ T4 Treatment Configuration → T5 Progress Reports
```

### 5.2. Researcher User Flow
```
R1 Study Dashboard → R2 Data Explorer → R3 Cohort Analysis → R2 Data Explorer (with refined parameters)
```

### 5.3. Administrator User Flow
```
A1 System Overview → A2 User Management / A4 Data Management / A3 Institution Settings
```

## 6. Wireframe Placeholders

Each screen should have accompanying wireframes developed using Figma or a similar design tool. Wireframes should follow these guidelines:

1. Create variations for different viewport sizes (desktop, tablet, mobile)
2. Include both low-fidelity wireframes and high-fidelity mockups
3. Demonstrate key interaction states (hover, active, error, etc.)
4. Use consistent component styling across all screens
5. Include annotations explaining complex interactions or data visualizations

## 7. Development Priority

The development priority should follow this order:
1. Essential Therapist screens (T1-T4)
2. Essential Administrator screens (A1, A2, A4)
3. Essential Researcher screens (R1-R3)
4. Non-essential screens across all roles

## 8. MVP Feature Prioritization

This section identifies the minimal features required for the initial release (MVP) versus features that can be implemented in subsequent iterations.

### 8.1. Must-Have (MVP) Features
1.  **Therapist Interface**
    - T1: View patient list with basic filtering and status; see daily schedule.
    - T2: View/edit patient profile (demographics, basic EMG history, clinical outcomes, notes, **and summaries of sEMG-derived metrics/game engagement from WP2.3**).
    - T3: Basic EMG visualization (heat maps, simple metrics); compare current session to baseline. **Display key sEMG metrics (WP2.3) and relevant game stats (WP2.3).**
    - T4: Configure core game parameters (including DDA review - **WP2.4**), session structure, and BFR controls. **Allow sEMG sensor selection if applicable (WP2.2).**
2.  **Administrator Interface**
    - A2: Create user accounts and assign basic roles (Therapist, Researcher, Admin).
    - A4: Perform basic data backup and restore operations.
3.  **Core Functionality**
    - User authentication and secure session management.
    - Implementation of row-level security for data access.
    - Ensuring patient data is pseudonymized for researcher views.

### 8.2. Should-Have (Second Release)
1.  **Therapist Enhancements**
    - Advanced EMG data comparison tools (session-to-session, limb-to-limb).
    - Detailed session history views with trend analysis capabilities.
    - Ability to save and use treatment configuration templates.
2.  **Researcher Basic Features**
    - R1: Study dashboard with patient counts, recruitment/retention metrics, **and overview of adherence/compliance based on WP2.3 data.**
    - R2: Simple data export capabilities (e.g., CSV) for pseudonymized data, **including sEMG metrics and game stats from WP2.3.**
3.  **Administrator Additions**
    - A1: System monitoring dashboard with error logs and basic performance metrics.

### 8.3. Nice-to-Have (Future Releases)
1.  **Advanced Features**
    - T5: Comprehensive, customizable progress report generation.
    - R3: Advanced cohort analysis tools with in-dashboard statistical summaries.
    - A3: Full institution settings, branding, and external system integration management.
2.  **Enhanced Data Visualization**
    - Pattern recognition tools for EMG data.
    - Advanced data filtering and annotation capabilities.
3.  **Workflow Optimizations**
    - Bulk user/patient management operations.
    - Automated data analysis suggestions or alerts.

## 9. EMG Visualization Requirements

The dashboard must support visualization of various EMG metrics that are essential for therapist assessment and research analysis. These visualizations should be integrated into the Therapist Interface (particularly T3) and Researcher Interface (R2).

> **Note:** For detailed information about EMG metrics implementation, algorithms, and processing requirements, please refer to the [EMG Analysis Technical Documentation](../technical/emg_analysis.md) **and the [WP2 Proposal Detailed](mdc:docs/00_PROJECT_DEFINITION/ressources/WP2_proposal_detailed.md) (Task 2.3).**

### 9.1. EMG Data Visualization Guidelines

When designing EMG visualization components:

1. Use consistent color coding for muscle groups.
2. Provide clear thresholds for normal/abnormal readings or target ranges (e.g., based on %MVC).
3. Include appropriate scales and units for all metrics displayed.
4. Allow for comparison between sessions, against baseline, and between limbs or cohorts.
5. Design for both overview (trends, summaries) and detailed inspection (specific events, signal characteristics).
6. Support different chart types (line, heat map, bar, scatter plots) as appropriate for the data.
7. Consider color-blind friendly palettes for all visualizations.
8. Visualizations should aim to represent key sEMG metrics identified in the project proposal (**WP2 Task 2.3 in [WP2_proposal_detailed.md](mdc:docs/00_PROJECT_DEFINITION/ressources/WP2_proposal_detailed.md)**), such as those related to muscle activation levels (e.g., RMS, MAV/MAD, VAR), muscle fatigue (e.g., spectral changes like Dimitrov\'s index, time-frequency analysis via Hilber-Huang), and potentially muscle force/effort estimations and muscle mass estimations, in a clinically and scientifically meaningful way. **The dashboard should also display game statistics relevant to user engagement and adherence (WP2.3).** The dashboard should prioritize clear, interpretable visualizations for therapists, while offering researchers access to more detailed or raw metric data if needed. **Consider how to represent data if multiple sEMG sensor types are used (WP2.2).**

## 10. Requirements Traceability Matrix

This section maps each UI screen to the functional requirements outlined in the [Product Requirements Document](prd.md) **and relevant tasks in the [WP2 Proposal Detailed](mdc:docs/00_PROJECT_DEFINITION/ressources/WP2_proposal_detailed.md)** that it fulfills, ensuring complete coverage of all requirements.

_To Do_
