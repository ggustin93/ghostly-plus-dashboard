# GHOSTLY+ System Architecture Overview

## Introduction

The GHOSTLY+ system extends the existing GHOSTLY rehabilitation game platform with a comprehensive web dashboard, analytics capabilities, and multi-center support. This document explains the system's architecture in straightforward terms for all project stakeholders.

## System Architecture at a Glance

GHOSTLY+ follows a modern, layered architecture that prioritizes security, scalability, and maintainability. The system comprises six distinct layers, each with a specific purpose:

### 1. Client Applications

**What it is:** The user-facing interfaces that different stakeholders interact with.

**Components:**
- Web Dashboard (Vue.js) with separate interfaces for:
  - Therapists to monitor patient progress and manage treatments
  - Researchers to analyze data across patients and centers
  - Administrators to manage system access and settings
- GHOSTLY Game (OpenFeasyo/C#) running on Android tablets with EMG sensors

**Business value:** Provides intuitive, role-appropriate interfaces that make rehabilitation data accessible and actionable for all stakeholders while ensuring patients engage with effective, gamified therapy.

### 2. Security & Access Layer

**What it is:** The system's front door that secures and directs incoming traffic.

**Components:**
- Nginx reverse proxy with SSL encryption

**Business value:** Protects sensitive patient data, ensures secure communications, and efficiently directs traffic to appropriate services, reducing security risks and improving system reliability.

### 3. API Gateway

**What it is:** The central access point for all data operations.

**Components:**
- FastAPI (Python) REST API with comprehensive validation and documentation

**Business value:** Provides a consistent interface for accessing system functionality, enforces data validation rules, offers automatic API documentation, and streamlines development of new features.

### 4. Business Services

**What it is:** The brain of the system that implements core functionality and analytics.

**Components:**
- Core Application Services handling patient data, session management, and clinical operations
- Analytics Services processing rehabilitation data to generate insights and progress metrics

**Business value:** Separates business logic into maintainable, testable units that can evolve independently, enabling more rapid development cycles and easier adaptation to new research findings or clinical requirements.

### 5. Data Platform

**What it is:** The centralized system for data storage, authentication, and file management.

**Components:**
- Supabase (self-hosted) providing:
  - Authentication with JWT tokens
  - PostgreSQL database with row-level security
  - Storage solution for rehabilitation session data (C3D files) and reports

**Business value:** Ensures consistent data access control, maintains data integrity, implements GDPR compliance at the database level, and simplifies authentication across the entire platform.

### 6. Infrastructure

**What it is:** The foundation all other components run on.

**Components:**
- Docker containerization
- VUB Private Virtual Machine hosting

**Business value:** Creates consistent, reproducible environments from development to production, simplifies deployment and updates, and meets institutional hosting requirements for clinical data.

## Key Data Flows

1. **Rehabilitation Session Flow:**
   - Patient performs exercises with the GHOSTLY game and EMG sensors
   - Game uploads session data securely to the API
   - Data is stored in the database and file storage
   - Therapists and researchers access and analyze the data via the dashboard

2. **Authentication Flow:**
   - Users authenticate directly with Supabase Auth
   - Secure JWT tokens are issued
   - All subsequent API requests include these tokens
   - API verifies token validity before processing requests

3. **Analytics Flow:**
   - Raw rehabilitation data is processed by analytics services
   - Insights and metrics are generated and stored
   - Researchers access these insights through specialized dashboard views
   - Therapists receive simplified progress indicators for clinical decision-making

## GDPR & Security Considerations

The architecture embeds privacy and security at multiple levels:

- **Data Pseudonymization:** Patient identifiers are separated from clinical data
- **Row-Level Security:** Database enforces access control at the data level
- **End-to-End Encryption:** Sensitive data is protected in transit and at rest
- **Access Controls:** Users only see data appropriate to their role
- **Audit Logging:** System maintains logs of all data access and changes
- **Patient Data Rights:** Architecture supports data export and deletion requests

## Conclusion

The GHOSTLY+ architecture provides a secure, scalable foundation for rehabilitation gaming and analytics. By separating concerns into distinct layers, the system can evolve and adapt to changing requirements while maintaining core functionality. This architecture supports the project's key goals of improving rehabilitation outcomes through gamification, enhancing clinical decision-making through analytics, and enabling multi-center research collaboration. 