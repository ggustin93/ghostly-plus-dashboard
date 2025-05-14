# Ghostly+ Dashboard UI/UX Screens

## Introduction

This document outlines the user interfaces for the Ghostly+ Dashboard, a web application supporting an EMG-driven serious game designed to combat muscle strength loss in hospitalized elderly patients. The dashboard serves as a critical component for monitoring patient progress, analyzing EMG data, and managing the overall system.

### Purpose of This Document

- Provide a comprehensive reference for UI/UX designers implementing the Ghostly+ Dashboard
- Define essential vs. non-essential features to guide development prioritization
- Document interaction patterns and layout recommendations for each screen
- Establish a consistent design language across the application

> **Cross-reference**: For a comprehensive overview of the entire system, including the project scope, goals, and architecture, please see the [Product Requirements Document (PRD)](prd.md).

### Technical Context

The Ghostly+ Dashboard is built using:
- **Framework**: Vue.js 3 (Composition API)
- **UI Library**: Tailwind CSS 4 with shadcn/ui components (https://www.shadcn-vue.com/)
- **State Management**: Pinia
- **Authentication**: Supabase Auth with JWT
- **Data Storage**: Supabase (PostgreSQL + Storage)
- **Backend API**: FastAPI (Python) with automatic OpenAPI documentation generation

Designers should align their work with these technologies, leveraging shadcn/ui component patterns while maintaining the project's unique visual identity. For all API interactions, refer to the [API Endpoints Documentation](../technical/api/endpoints.md), which will be supplemented by FastAPI's auto-generated Swagger UI documentation during development.

## Design System Guidelines

### Typography
To be defined 

### Color Palette
To be defined

### Component Patterns
To be defined

### Accessibility Requirements
- Multilanguage
- WCAG 2.1 Level A compliance
- Minimum contrast ratio of 4.5:1 for text
- Color shouldn't be the only means of conveying information

## User Roles and Access Patterns

The dashboard serves three distinct user roles, each with specific access patterns:

1. **Therapists/Clinicians**: Focus on individual patient care, session configuration, and progress monitoring
2. **Researchers**: Analyze anonymized data across patient cohorts for research purposes
3. **Administrators**: Manage system configuration, user access, and data integrity

## Screen Specifications

### Therapist Interface

#### T1. Home Dashboard (Essential)
- **Primary Focus**: Quick overview and patient management
- **Key Components**:
  - Patient list with color-coded status indicators
  - Daily schedule with upcoming sessions
  - Recent session summaries with key metrics
  - Action items requiring attention (missed sessions, declining metrics)
  - Notification center for system updates and messages (Non-essential)
- **Interactions**: 
  - Filtering patients by status, name, or assigned group
  - Scheduling new sessions through calendar interface
  - Quick-access buttons for viewing detailed patient information
  - Sorting options for different views (alphabetical, recent activity, etc.)
- **Layout**: 
  - Card-based grid with priority items highlighted at top
  - Two-column layout on desktop, stacked on mobile
  - Fixed header with user info and global actions
  - Responsive design adapting to tablet view for clinical settings
- **Supabase Integration**:
  - Row-level security ensuring therapists only see their assigned patients

#### T2. Patient Profile (Essential)
- **Primary Focus**: Comprehensive patient information and history
- **Key Components**:
  - Patient demographics and medical history
  - Historical EMG performance graphs showing trends
  - Session calendar with attendance records
  - Treatment plan timeline visualization
  - Notes and observations section
- **Interactions**: 
  - Toggle between different time periods for trend analysis
  - Add and edit clinical notes with formatting options
  - View session details by clicking on calendar entries
  - Filter data visualization by muscle groups or metrics
- **Layout**: 
  - Tab-based information architecture with persistent patient header
  - Responsive charts that resize based on viewport
  - Split view showing patient info alongside visualization area
- **Supabase Integration**:
  - Patient data retrieved from PostgreSQL with proper RLS policies
  - Notes stored with optimistic UI updates for better UX

#### T3. Session Analysis (Essential)
- **Primary Focus**: Post-session EMG data review and assessment
- **Key Components**:
  - Muscle activation heat maps comparing left/right symmetry
  - Peak contraction graphs with target thresholds
  - Session duration and intensity metrics
  - Comparison tools for tracking progress against baseline
  - Screenshot capability for clinical documentation (Non-essential)
- **Interactions**: 
  - Zoom and pan functionality for detailed signal inspection
  - Time-based filtering of EMG signals
  - A/B comparison between different sessions
  - Range selection for focused analysis
- **Layout**: 
  - Split view with visualization panel and metrics sidebar
  - Timeline scrubber at bottom for navigating session recording
  - Collapsible metrics panel for focusing on visualizations
- **Supabase Integration**:
  - EMG data fetched from PostgreSQL with efficient query patterns
  - Session recordings accessed through Supabase Storage

#### T4. Treatment Configuration (Essential)
- **Primary Focus**: Exercise prescription and game parameter setup
- **Key Components**:
  - Game difficulty level adjustment sliders
  - Session duration and rest interval settings
  - Blood flow restriction parameter controls
  - Exercise type selection with muscle targeting guides
  - Pre-configured treatment templates (Non-essential)
- **Interactions**: 
  - Save configurations for reuse with multiple patients
  - Preview effects of parameter changes with visual feedback
  - Drag-and-drop exercise sequencing
  - Copy settings from previous successful sessions
- **Layout**: 
  - Wizard-style interface with visual feedback on parameter changes
  - Multi-step form with progress indicator
  - Side panel showing real-time updates to configuration
- **Supabase Integration**:
  - Treatment configurations stored in structured PostgreSQL tables
  - Templates shared across authorized therapists

#### T5. Progress Reports (Non-essential)
- **Primary Focus**: Documentation and outcome measurement
- **Key Components**:
  - Customizable report templates
  - Longitudinal progress charts with milestone markers
  - Printable/exportable summary sheets
  - Goal achievement tracking
  - Clinical outcome measures dashboard
- **Interactions**: 
  - Select metrics and time periods for inclusion
  - Choose between different chart types for data representation
  - Apply filters to focus on specific outcomes
  - Export to PDF or share via secure link
- **Layout**: 
  - Document-style interface with preview panel
  - Split screen with configuration options and live preview
- **Supabase Integration**:
  - Reports stored as documents in Supabase Storage
  - PDF generation handled by backend API

### Researcher Interface
*Note: All patient data is pseudonymized for researchers to maintain privacy while allowing analysis*

#### R1. Study Dashboard (Essential)
- **Primary Focus**: Research project overview and management
- **Key Components**:
  - Study cohorts with participant counts
  - Recruitment and retention metrics
  - Compliance rates visualization
  - Data collection progress bars
  - Protocol adherence metrics (Non-essential)
- **Interactions**: 
  - Filter data by study parameters (age, condition, etc.)
  - Create and save custom cohort definitions
  - Export summary statistics for external analysis
  - Compare metrics between different cohorts
- **Layout**: 
  - Executive dashboard style with hierarchical information display
  - Top-level KPIs with drill-down capabilities
  - Grid of metric cards with consistent visualization styles
- **Supabase Integration**:
  - Aggregated, pseudonymized data from PostgreSQL
  - RLS policies ensuring appropriate data access

#### R2. Data Explorer (Essential)
- **Primary Focus**: Advanced data analysis and visualization
- **Key Components**:
  - Raw EMG signal browser with filtering options
  - Multi-patient comparison tools
  - Statistical analysis modules
  - Pattern recognition visualizations (Non-essential)
  - Annotation and tagging system (Non-essential)
- **Interactions**: 
  - Apply complex filters across multiple dimensions
  - Save and reuse analysis configurations
  - Generate statistical reports on selected data segments
  - Download raw data for external processing
- **Layout**: 
  - Workbench style with multiple tools and visualization areas
  - Resizable panels for custom workspace configuration
  - Persistent filters and selection state
- **Supabase Integration**:
  - Complex queries against pseudonymized PostgreSQL data
  - Temporary tables for performance-intensive operations

#### R3. Cohort Analysis (Essential)
- **Primary Focus**: Group-level data analysis
- **Key Components**:
  - Demographic breakdowns
  - Intervention vs. control group comparisons
  - Outcome measure tracking across time points
  - Statistical significance indicators
  - Exclusion/inclusion management (Non-essential)
- **Interactions**: 
  - Define inclusion and exclusion criteria for cohorts
  - Apply statistical tests with parameter configuration
  - Highlight outliers or significant findings
  - Toggle between different visualization modes
- **Layout**: 
  - Split view with cohort selector and analysis results
  - Tabbed interface for different analysis types
  - Result area with exportable visuals and data tables
- **Supabase Integration**:
  - Aggregate queries with appropriate security policies
  - Real-time updates when cohort definitions change

### Administrator Interface

#### A1. System Overview (Essential)
- **Primary Focus**: Platform health and performance monitoring
- **Key Components**:
  - User account status dashboard
  - System performance metrics
  - Storage usage visualizations
  - Error logs and alerts
  - Scheduled maintenance calendar (Non-essential)
- **Interactions**: 
  - Filter logs by severity, component, or time period
  - Acknowledge and resolve alerts
  - Schedule system maintenance windows
  - Export system statistics for reporting
- **Layout**: 
  - Mission control style with status indicators and action panels
  - Timeline view for historical performance
  - Alert severity highlighting for quick issue identification
- **Supabase Integration**:
  - Monitoring Supabase service status and quota usage
  - Database performance metrics
  - Storage utilization tracking

#### A2. User Management (Essential)
- **Primary Focus**: Account administration and permissions
- **Key Components**:
  - User directory with role assignments
  - Permission matrix editor
  - Bulk user operations tools (Non-essential)
  - Activity logs by user
  - Password reset and account recovery tools
- **Interactions**: 
  - Add new users with role-based permissions
  - Edit existing user details and access rights
  - Review user activity and login history
  - Manage password resets and account lockouts
- **Layout**: 
  - Directory style with detailed user cards and batch action tools
  - Modal dialogs for user editing and creation
  - Tab-based organization for different user management functions
- **Supabase Integration**:
  - Direct integration with Supabase Auth
  - Role-based access control management
  - Custom claims for fine-grained permissions

#### A3. Institution Settings (Non-essential)
- **Primary Focus**: Organization-level configuration
- **Key Components**:
  - Facility information management
  - Department structure configuration
  - Branding and customization options
  - Integration settings for external systems
  - License management and quota allocation
- **Interactions**: 
  - Configure institution-specific parameters
  - Upload and manage custom branding assets
  - Define departmental hierarchy
  - Set up API integrations with other systems
- **Layout**: 
  - Settings panel with categorized options and preview capabilities
  - Form-based configuration with validation
  - Preview area showing applied changes
- **Supabase Integration**:
  - Organization data stored in dedicated PostgreSQL tables
  - Storage buckets for branding assets
  - Environment variable management for integrations

#### A4. Data Management (Essential)
- **Primary Focus**: Database administration and maintenance
- **Key Components**:
  - Backup and restore interface
  - Data purging and archiving tools
  - Database health indicators
  - Import/export functionality
  - Audit trail viewer (Non-essential)
- **Interactions**: 
  - Schedule automated backups
  - Initiate manual backup operations
  - Restore data from previous backups
  - Export data for external archiving
  - Review data modification history
- **Layout**: 
  - Technical administration panel with progressive disclosure of advanced options
  - Confirmation dialogs for destructive actions
  - Status indicators for ongoing operations
- **Supabase Integration**:
  - Direct management of Supabase database
  - Storage bucket administration
  - Database schema and RLS policy management
  - Integration with Supabase's scheduled functions for backups

## User Flow Diagrams

### Therapist User Flow
```
T1 Home Dashboard → T2 Patient Profile → T3 Session Analysis ↔ T4 Treatment Configuration → T5 Progress Reports
```

### Researcher User Flow
```
R1 Study Dashboard → R2 Data Explorer → R3 Cohort Analysis → R2 Data Explorer (with refined parameters)
```

### Administrator User Flow
```
A1 System Overview → A2 User Management / A4 Data Management / A3 Institution Settings
```

## Wireframe Placeholders

Each screen should have accompanying wireframes developed using Figma or a similar design tool. Wireframes should follow these guidelines:

1. Create variations for different viewport sizes (desktop, tablet, mobile)
2. Include both low-fidelity wireframes and high-fidelity mockups
3. Demonstrate key interaction states (hover, active, error, etc.)
4. Use consistent component styling across all screens
5. Include annotations explaining complex interactions or data visualizations

## Development Priority

The development priority should follow this order:
1. Essential Therapist screens (T1-T4)
2. Essential Administrator screens (A1, A2, A4)
3. Essential Researcher screens (R1-R3)
4. Non-essential screens across all roles

## MVP Feature Prioritization

This section identifies the minimal features required for the initial release (MVP) versus features that can be implemented in subsequent iterations.

### Must-Have (MVP) Features
1. **Therapist Interface**
   - T1: Patient list with basic filtering and status indicators
   - T2: Patient profile with demographic information and basic EMG history
   - T3: Basic EMG visualization (heat maps and simple metrics)
   - T4: Core game parameter settings and BFR controls

2. **Administrator Interface**
   - A2: User account creation and basic role management
   - A4: Basic backup and restore functionality

3. **Authentication & Security**
   - Supabase Auth integration
   - Row-level security implementation
   - Patient data pseudonymization

### Should-Have (Second Release)
1. **Therapist Enhancements**
   - Advanced EMG data comparison tools
   - Session history with trend analysis
   - Treatment templates

2. **Researcher Basic Features**
   - R1: Basic study dashboard with patient counts
   - R2: Simple data export capabilities

3. **Administrator Additions**
   - A1: System monitoring and error logs

### Nice-to-Have (Future Releases)
1. **Advanced Features**
   - T5: Complete progress reports and clinical documentation
   - R3: Advanced cohort analysis with statistical tools
   - A3: Institution settings and branding customization

2. **Enhanced Data Visualization**
   - Pattern recognition in EMG data
   - Advanced filtering and annotation tools
   - Real-time collaborative session review

3. **Workflow Optimizations**
   - Bulk operations for patient management
   - Advanced report generation
   - Automated data analysis suggestions

## EMG Visualization Requirements

The dashboard must support visualization of various EMG metrics that are essential for therapist assessment. These visualizations should be integrated into the Therapist Interface, particularly in the Session Analysis (T3) screen.

> **Note:** For detailed information about EMG metrics implementation, algorithms, and processing requirements, please refer to the [EMG Analysis Technical Documentation](../technical/emg_analysis.md).

### EMG Data Visualization Guidelines

When designing EMG visualization components:

1. Use consistent color coding for muscle groups
2. Provide clear thresholds for normal/abnormal readings
3. Include appropriate scales and units
4. Allow for comparison between sessions and baseline
5. Design for both overview and detailed inspection
6. Support different chart types (line, heat map, bar) as appropriate for the data
7. Consider color-blind friendly palettes for all visualizations

## Design Handoff Process

When preparing designs for development:

1. Export component specifications from design tools (spacing, sizing, colors)
2. Document component states and variations
3. Provide animations and transitions as prototypes or video recordings
4. Include responsive behavior notes for each component
5. Define data visualization parameters (axes, scales, legends)
6. Document accessibility considerations for complex interactions 

## Requirements Traceability Matrix

This section maps each UI screen to the functional requirements outlined in the [Product Requirements Document](prd.md) that it fulfills, ensuring complete coverage of all requirements.

### Therapist Interface Requirements Coverage

| PRD Requirement | Screen(s) | Implementation Status |
|----------------|-----------|----------------------|
| View results of patients' sessions (3.1.1) | T1, T3 | Essential (MVP) |
| Visualize EMG signals and game metrics (3.1.1) | T3 | Essential (MVP) |
| Track patient progress (3.1.1) | T2, T5 | Essential (T2), Non-essential (T5) |
| Configure exercise programs (3.1.1) | T4 | Essential (MVP) |
| Compare patient cohorts (3.1.1) | T3 | Essential (MVP) |
| Generate clinical reports (3.1.1) | T5 | Non-essential |
| Patient registration and profile (3.2.2) | T2 | Essential (MVP) |
| Program adherence tracking (3.2.2) | T2 | Essential (MVP) |
| Intervention history (3.2.2) | T2 | Essential (MVP) |

### Researcher Interface Requirements Coverage

| PRD Requirement | Screen(s) | Implementation Status |
|----------------|-----------|----------------------|
| Comparative data analysis (3.1.2) | R2, R3 | Essential (MVP) |
| Export data for external analyses (3.1.2) | R2 | Essential (MVP) |
| Generate multi-site statistics (3.1.2) | R1, R3 | Essential (MVP) |
| Filter and segment data (3.1.2) | R2 | Essential (MVP) |
| Create and manage patient cohorts (3.2.3) | R1, R3 | Essential (MVP) |
| Compare metrics across cohorts (3.2.3) | R3 | Essential (MVP) |
| Generate cohort-level reports (3.2.3) | R3 | Essential (MVP) |

### EMG Visualization Requirements Coverage

| PRD Requirement | Screen(s) | Implementation Status |
|----------------|-----------|----------------------|
| Temporal graphs of EMG signals (3.2.4) | T3, R2 | Essential (MVP) |
| Muscle strength analysis (3.2.4) | T3, R2 | Essential (MVP) |
| Muscle contraction detection (3.2.4) | T3, R2 | Essential (MVP) |
| Muscle fatigue analysis (3.2.4) | T3, R2 | Essential (MVP) |
| Session comparison (3.2.4) | T3, R2 | Essential (MVP) |

### Game Performance Analysis Coverage

| PRD Requirement | Screen(s) | Implementation Status |
|----------------|-----------|----------------------|
| Scores and progressions (3.2.5) | T1, T2, T3 | Essential (MVP) |
| Session duration and frequency (3.2.5) | T1, T2 | Essential (MVP) |
| EMG activity and game performance correlation (3.2.5) | T3, R2 | Essential (MVP) |
| Long-term trends (3.2.5) | T2, T5, R3 | Essential (T2), Non-essential (T5, R3) |

### Administrator Requirements Coverage

| PRD Requirement | Screen(s) | Implementation Status |
|----------------|-----------|----------------------|
| Authentication and Authorization (3.2.1) | A2 | Essential (MVP) |
| GDPR Compliance (3.3.2) | A4 | Essential (MVP) |
| Reports and Exports (3.2.6) | T5, R2, R3 | Essential (R2, R3), Non-essential (T5) |

### Potential Gaps and Recommended Updates

1. **Patient Assignment to Therapists**: While mentioned in 3.2.2, this functionality isn't explicitly covered in the current screens. Consider adding this to the A2 (User Management) screen.

2. **Reports and Exports**: The T5 screen (Progress Reports) is marked as non-essential, but reporting is a key requirement in 3.2.6. Consider making basic reporting essential or clarifying that R2/R3 satisfy the minimum reporting needs.

3. **Accessibility Requirements**: Section 3.3.3 of the PRD mentions multilingual support and WCAG compliance, which should be reflected in all screens as a cross-cutting concern.

4. **Authentication Features**: The detailed multi-level login system from 3.2.1 should be more explicitly described in screen A2 (User Management).

> **Note**: This traceability matrix should be updated whenever requirements in the PRD or screens in this document are changed to maintain alignment between documents. 