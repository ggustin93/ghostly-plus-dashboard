# 🔐 GHOSTLY+ Application Security Overview

This document provides a **comprehensive explanation of the planned security architecture** for the GHOSTLY+ application, designed to handle **sensitive medical data** in a private environment (VUB virtual machine), using **Supabase (self-hosted/local), FastAPI, and Vue 3**.

## Table of Contents

- [🔐 GHOSTLY+ Application Security Overview](#-ghostly-application-security-overview)
  - [Table of Contents](#table-of-contents)
  - [1. Overview of Core Security Measures](#1-overview-of-core-security-measures)
    - [1.4. 🔑 User Authentication](#14--user-authentication)
    - [Optional: Two-Factor Authentication (2FA/MFA)](#optional-two-factor-authentication-2famfa)
    - [Detailed Authentication and Data Access Flow](#detailed-authentication-and-data-access-flow)
    - [1.5. 🧱 Authorization \& Access Control](#15--authorization--access-control)
      - [Technology: **Self-hosted Supabase with Row Level Security (RLS)**](#technology-self-hosted-supabase-with-row-level-security-rls)
    - [1.6. 🔒 Encryption of Sensitive Data (Planned)](#16--encryption-of-sensitive-data-planned)
      - [Planned Technology: **Fernet (Python Cryptography)**](#planned-technology-fernet-python-cryptography)
    - [1.7. 🔐 Pseudonymization (Planned)](#17--pseudonymization-planned)
      - [Planned Technology: **Cryptographic Hashing (SHA-256)**](#planned-technology-cryptographic-hashing-sha-256)
    - [1.8. 📦 Database Access Security (Self-hosted Supabase)](#18--database-access-security-self-hosted-supabase)
    - [1.9. 📡 Transport Security (HTTPS)](#19--transport-security-https)
    - [1.10. 🧪 Server and Infrastructure Isolation](#110--server-and-infrastructure-isolation)
      - [Visualizing Security Boundaries](#visualizing-security-boundaries)
      - [Local Supabase Deployment Notes](#local-supabase-deployment-notes)
    - [1.11. 🧾 Audit \& Logging (Planned)](#111--audit--logging-planned)
    - [1.12. 🛡️ C3D File Security](#112-️-c3d-file-security)
  - [2. Conclusion](#2-conclusion)
  - [3. References](#3-references)

---

## 1. Overview of Core Security Measures

This section outlines the comprehensive security strategy for the GHOSTLY+ application, designed to protect sensitive medical data across all architectural layers.

The GHOSTLY+ application implements a defense-in-depth approach with multiple security layers:

| Layer                    | Planned Protection Measures                                        |
| ------------------------ | ------------------------------------------------------------------ |
| **Frontend (Vue 3)**     | JWT handling, input sanitization (standard framework features)     |
| **API (FastAPI)**        | JWT validation, input validation, rate limiting (optional), encryption, pseudonymization |
| **Database (Local Supabase)** | RLS policies, backend-managed encryption, database-level security |
| **Transport**            | HTTPS/TLS (external access mandatory, internal recommended)        |
| **Infrastructure**       | Private VM, network controls, containerization (Docker)            |

The following core security measures are implemented throughout the application:

1.   User Authentication - Verifying user identity
2.   Authorization & Access Control - Enforcing appropriate access permissions
3.   Encryption of Sensitive Data - Protecting data confidentiality
4.   Pseudonymization - Enhancing privacy through data separation
5.   Database Access Security - Securing the data layer
6.   Transport Security - Protecting data in transit
7.   Server and Infrastructure Isolation - Securing the hosting environment
8.   Audit & Logging - Tracking security events
9.   C3D File Security - Specialized protection for medical data files

Each measure is detailed in the following sections, explaining implementation status and security benefits.

---

### 1.4. 🔑 User Authentication

**Core Technology**: **Self-hosted Supabase Auth** utilizing **JWT (JSON Web Tokens)**.

*   **Mechanism**:
    *   Users authenticate via email + password.
    *   Supabase Auth issues a signed JWT upon successful login.
    *   Clients (Vue.js Dashboard, C# Game) send the JWT with each API request.
    *   FastAPI backend verifies JWT validity (via Supabase public keys) before authorizing access.
    *   Client-side token expiration and refresh mechanisms are required.
*   **Key Principle: Unified Authentication**:
    *   **Single Source of Truth**: Both Game and Dashboard use the same self-hosted Supabase Auth instance.
    *   **Consistent Experience**: Identical credentials and authentication flow across applications.
    *   **Centralized Management**: User accounts, permissions, and password resets are managed centrally.
*   **Implementation Details**:
    *   **Game (C#/MonoGame)**: Requires REST API calls to Supabase Auth endpoints.
    *   **Dashboard (Vue.js)**: Will use the Supabase JavaScript client library.
    *   Both will handle JWTs validated by the FastAPI backend.
*   **Benefits**:
    *   Complete control over authentication data and flows (due to local deployment).
    *   Consistent security enforcement and simplified auditing.
    *   Reduced attack surface and improved user experience (single credential set).
*   **Status**:
    *   Supabase Auth infrastructure: Established (Task 1).
    *   JWT handling (Vue), validation (FastAPI), Game integration: Planned for **Task 2 (User Authentication & Authorization)**.
*   ✅ **Planned Result**: Only authenticated users can interact with the application.

### 1.4.1. Optional: Two-Factor Authentication (2FA/MFA)

*   **Availability**: Supabase Auth supports MFA (e.g., TOTP via authenticator apps).
*   **Implementation Status**: Optional feature, not planned for initial core functionality.
*   **Recommendation**: Offer as an optional security enhancement later if required.

### 1.4.2. Detailed Authentication and Data Access Flow

The following diagram illustrates the authentication sequence and subsequent data access patterns: