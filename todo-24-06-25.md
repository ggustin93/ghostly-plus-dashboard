# GHOSTLY+ Project - Action Plan (2024-06-25)

This document outlines the necessary adjustments to the prototype based on the updated project requirements and decisions made on 2024-06-25.

---

## 1. Authentication & User Management

### 1.1. Game App (Patient)
-   [ ] **Task:** Create a new patient login screen.
    -   **Details:** The screen should accept a Patient ID (PID) and a password.
    -   **Trial Logic:** Initially, this will be for the `PID + shared password` flow.
-   [ ] **Task:** Implement the patient authentication logic against the backend.
-   [ ] **Task:** Design and implement an in-app guide for patients covering login, MVC calibration, and BFR cuff application.
-   [ ] **Task:** Plan for future implementation of email/password login (UI mockups, backend changes).

### 1.2. Dashboard (Therapist/Researcher/Admin)
-   [ ] **Task:** Enhance the login screen to clarify it's for staff (Therapists, Researchers, Admins).
-   [ ] **Task:** Implement a self-registration/signup workflow for new therapists and researchers.
    -   **Details:** This flow should allow users to request an account, which an admin may need to approve.
-   [ ] **Task:** Create a new UI for therapists to manage their assigned patients.
    -   **Details:** This should include a feature to reset a patient's password.

### 1.3. Backend
-   [ ] **Task:** Create a new API endpoint for patient authentication (`/api/auth/patient/login`).
-   [ ] **Task:** Update the user model to differentiate between Patients and Staff (Therapist, Admin, etc.), potentially with a role field.
-   [ ] **Task:** Implement the logic for the therapist/researcher self-registration flow.
-   [ ] **Task:** Implement the endpoint for therapists to reset patient passwords.

---

## 2. Dashboard Enhancements & Changes

### **Prototype for Therapist Interview (2024-06-26)**
This section lists the specific, high-impact UI changes to create a clickable, non-functional mockup for the therapist meeting.

-   [ ] **Task: Redesign the Main Dashboard Layout.**
    -   **Details:** Modify the top-level summary cards. Replace "Upcoming Sessions" with "Patients with Alerts". Consider adding a card for "Weekly Avg. Performance".
-   [ ] **Task: Create "Priority Patients to Review" component.**
    -   **Details:** A new component to display a prioritized list of up to 5 patients needing attention. Each item should show the patient's name and the specific reason for the alert (e.g., "Low Performance", "Poor Adherence"). Design a positive empty state for when no patients have alerts.
-   [ ] **Task: Create "Recent Session Activity" component.**
    -   **Details:** A new feed component showing the last ~10 sessions in reverse chronological order. Each item should show `[Date] - [Patient Name] - [Performance Score 🟢🟡🔴]` and link to the detailed analysis view.
-   [ ] **Task: Mockup the "Performance Analysis" view.**
    -   **Details:** Create a static screen based on the `EMG C3D Analyzer` image. This is the destination when a therapist clicks a patient.
-   [ ] **Task: Adjust navigation for the therapist view.**
    -   **Details:** Remove the "C3D Files" page/link from the main sidebar. It is not relevant to the core therapist workflow.

### **Frontend Dashboard Layout - Detailed Wireframe**

This section describes the expected component structure for the main dashboard view.

**1. Overall Structure:**
The layout will consist of a header with summary cards, followed by a two-column body.

```
+-------------------------------------------------------------------------+
|  [Header: "Dashboard"]                                                  |
+-------------------------------------------------------------------------+
|  [Component: SummaryCards]                                              |
+------------------------------------------+------------------------------+
|                                          |                              |
|  [Component: PriorityPatients]           |  [Component: RecentActivity] |
|  (Left Column, ~60% width)               |  (Right Column, ~40% width)  |
|                                          |                              |
+------------------------------------------+------------------------------+
```

**2. Component Breakdown:**

*   **`SummaryCards` Component:**
    *   A responsive flex container holding 3-4 `MetricCard` components.
    *   **Cards to implement:**
        1.  `Active Patients`: Displays total patient count.
        2.  `Patients with Alerts`: Displays count of patients meeting alert criteria. Should have a distinct visual style (e.g., accent color) to draw attention.
        3.  `Adherence Rate (Last 7d)`: Displays the percentage of completed vs. prescribed sessions across all patients in the last week.

*   **`PriorityPatients` Component:**
    *   This is the primary "triage" view.
    *   Contains a title: "Priority Patients to Review".
    *   Renders a list of `PatientAlertItem` components (max 5).
    -   **`PatientAlertItem` sub-component:**
        -   Displays `Avatar`, `Patient Name`.
        -   Displays the **reason** for the alert (e.g., "Low Performance", "Missed 2 Sessions") with an associated icon/color.
        -   The entire item should be clickable, linking to the patient's detailed analysis page.
    *   **Empty State:** When no patients have alerts, this component must display a positive message like "✅ All patients are on track."

*   **`RecentActivity` Component:**
    *   This is the "awareness" feed.
    -   Contains a title: "Recent Session Activity".
    -   Renders a list of `SessionActivityItem` components.
    -   **`SessionActivityItem` sub-component:**
        -   Displays `Date`, `Patient Name`.
        -   Displays the overall performance score with a color-coded dot (e.g., "98% 🟢").
        -   The entire item should be clickable, linking directly to that specific session's `PerformanceAnalysis` view.
    -   The component should be scrollable if the content exceeds the viewport height.

### 2.1. UI/UX & Feature Changes
-   [ ] **Task:** Remove the "Clinical Assessments" data entry feature and any related UI components from the patient profile page.
-   [ ] **Task:** Modify the Dashboard Calendar to act as a historical log.
    -   **Details:** It should only display completed sessions from the last 7 days and remove any functionality for scheduling future sessions.
-   [ ] **Task:** Update all patient lists and views to display identifiable patient information (e.g., full name) instead of just pseudo-IDs for the therapist role.
-   [ ] **Task:** Design and implement a UI for therapists to manually enter BFR parameters for a session (as a fallback).

### 2.2. Admin Features
-   [ ] **Task:** Create a new admin page for importing patient data.
    -   **Details:** This should allow an admin to upload a CSV file containing the mapping from `Pseudo-ID` to `Patient Details` (e.g., name, DOB).
-   [ ] **Task:** Create a UI for therapists to view the master list of patients from the import and assign specific patients to their own caseload.

### 2.3. Backend
-   [ ] **Task:** Modify all relevant patient data endpoints to return identifiable information for authorized therapists.
-   [ ] **Task:** Create the backend logic to handle the CSV import of patient data and store it.
-   [ ] **Task:** Create endpoints to support therapists assigning patients to themselves.
-   [ ] **Task:** Create an endpoint to allow manual entry of BFR data.
-   [ ] **Task: Create Dashboard Summary endpoint (`GET /api/dashboard/summary`).**
    -   **Details:** This endpoint should return aggregate data for the summary cards, such as `{ activePatients: 9, patientsWithAlerts: 3, weeklyAveragePerformance: 82 }`.
-   [ ] **Task: Create Priority Patients endpoint (`GET /api/dashboard/priority-patients`).**
    -   **Details:** Implement the business logic to identify patients who meet alert criteria (e.g., poor performance, low adherence, negative trend). Return a ranked list of up to 5 patients with the reason for the alert.
-   [ ] **Task: Create Recent Sessions endpoint (`GET /api/dashboard/recent-sessions`).**
    -   **Details:** Return a paginated list of the most recent sessions for the therapist's caseload, including performance scores and patient details.
-   [ ] **Task:** Research and establish a proof-of-concept for the secondary, off-site backup solution (e.g., syncing dumps to Supabase Storage or DigitalOcean Spaces).

---

## 3. Game App & Data Collection

-   [ ] **Task:** Enhance session data collection to capture the necessary inputs for the new compliance algorithm.
    -   **Details:** This includes logging the duration of each muscle contraction and the time taken to reach the 75% MVC target.
    -   **Note:** Awaiting final algorithm definition from the clinical team.
-   [ ] **Task:** Implement the in-app guide for patients (see 1.1).

---

## 4. Backend & Infrastructure

-   [ ] **Task:** Implement the more complex compliance algorithm once defined.
-   [ ] **Task:** Set up a daily `pg_dump` script on the production VM for primary backups.

---

## 5. Project Management & Documentation

-   [ ] **Task:** Update the Data Management Plan (`data_management_plan.md`) to include specifics about the game app and dashboard data storage and backup strategy.
-   [ ] **Task:** Schedule a follow-up meeting to discuss the "good contraction" algorithm for the compliance metric.
-   [ ] **Task:** Begin discussions on the appropriate open-source license for the dashboard. 