# GHOSTLY+ Technology Stack

This document outlines the key technologies used in the GHOSTLY+ system, organized by technical domain.

> **Note:** For the system's layered architecture perspective, see [Architecture Overview](architecture_overview.md). The sections below correspond approximately to these architecture layers:
> - Frontend → Layer 1: Client Applications
> - Game Client → Layer 1: Client Applications
> - Backend → Layers 3-4: API Gateway & Business Services
> - Data Platform → Layer 5: Data Platform
> - DevOps & Infrastructure → Layers 2 & 6: Security/Access & Infrastructure
> - Security & Compliance → Cross-cutting across layers

## Frontend

**Vue.js 3** - Modern JavaScript framework for building the therapist, researcher, and admin interfaces.
- **Tailwind CSS** - Utility-first CSS framework for efficient styling
- **shadcn-vue** - Pre-built accessible UI components
- **Pinia** - State management for Vue applications
- **Vue Router** - Handles navigation between dashboard views

## Game Client

**OpenFeasyo/C#** - C# framework for rehabilitation games running on Android tablets.
- Interfaces with **Delsys Trigno EMG sensors** to capture muscle activity
- Generates **C3D files** containing rehabilitation session data

## Backend

**FastAPI (Python)** - High-performance web framework for building APIs.
- **Pydantic** - Data validation and settings management using Python type annotations
- **SQLAlchemy** - SQL toolkit and Object-Relational Mapping (ORM) for database interactions
- **python-jose** - Library for JWT token validation

## Data Platform

**Supabase** (self-hosted) - Open source Firebase alternative providing:
- **PostgreSQL** - Robust relational database with Row Level Security (RLS)
  - Configured with proper indices for query performance
  - Implements database-level constraints for data integrity
  - Uses declarative RLS policies for fine-grained access control
- **Supabase Auth** - Authentication service with JWT support
  - Manages user sessions and role-based permissions
  - Supports email/password authentication with MFA options
  - Integrates with API through JWT validation
- **Supabase Storage** - File storage for C3D files and generated reports
  - Secures files with access policies linked to database roles
  - Handles versioning of rehabilitation session recordings
  - Provides optimized retrieval for dashboard visualizations

## DevOps & Infrastructure

**Docker** - Containerization for consistent deployment environments
  - **Docker Compose** - Multi-container orchestration with defined service dependencies
  - Separates application into microservices for better isolation and scalability
  - Enables reproducible builds with version pinning
  - **Docker volumes** - For data persistence between container restarts
- **Nginx** - High-performance web server and reverse proxy
  - Provides **SSL termination** - The process where Nginx handles the encryption/decryption of HTTPS traffic, relieving backend services from this computational overhead. It receives encrypted requests from clients, decrypts them, and forwards them to internal services.
  - Offers load balancing and caching capabilities
  - Works with **Let's Encrypt** for automatic SSL certificate management
- **VUB Private VM** - Hosting infrastructure provided by the university
  - Runs all containerized services with appropriate resource allocation
  - **Backup solution** - External backup system for database and file storage
  - Provides monitoring capabilities
  - Meets institutional security requirements for clinical data

## Security & Compliance

**HTTPS/SSL** - Secure communication
- **Let's Encrypt** - Free, automated, and open certificate authority providing TLS certificates
- **JWT (JSON Web Tokens)** - Secure authentication
- **PostgreSQL RLS** - Row-level security for GDPR-compliant data access control
- **Fernet** - Symmetric encryption for sensitive data

## Additional Tools

**Chart.js/D3.js** - Data visualization libraries
- **Python Data Science Stack** (NumPy, Pandas) - For analytics processing

## Presentation Format


```
[Vue.js Logo]     | Layer 1 - Client Applications
shadcn/ui         | Modern JavaScript framework for building the
tailwindcss       | therapist, researcher, and admin interfaces.
------------------|----------------------------------------
[Nginx Logo]      | Layer 2 - Security & Access Layer
                  | High-performance web server and reverse proxy
                  | for secure routing and SSL termination.
------------------|----------------------------------------
[FastAPI Logo]    | Layer 3 - API Gateway
                  | Python-based REST API with comprehensive
                  | validation and automatic documentation.
------------------|----------------------------------------
[Python Logo]     | Layer 4 - Business Services
                  | Core application logic and analytics services
                  | for processing rehabilitation data.
------------------|----------------------------------------
[Supabase Logo]   | Layer 5 - Data Platform
                  | Supabase (self-hosted) provides a complete data solution:
                  | • PostgreSQL with Row-Level Security for GDPR compliance
                  | • Authentication with secure JWT implementation
                  | • Storage system for C3D files and reports
------------------|----------------------------------------
[Docker Logo]     | Layer 6 - Infrastructure
                  | Docker containerization with Docker Compose orchestration,
                  | running on VUB Private VM with external backup solutions,
                  | monitoring, and resource management for all services.
```

