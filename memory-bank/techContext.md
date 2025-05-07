---
description: Details the technologies, development setup, technical constraints, dependencies, and tool usage patterns for the GHOSTLY+ Dashboard.
source_documents: [docs/prd.md](mdc:docs/prd.md) (Section 4), [docs/security.md](mdc:docs/security.md)
---

# GHOSTLY+ Dashboard: Technical Context

## 1. Core Technologies

-   **Frontend (Web Dashboard)**:
    -   Framework: **Vue.js 3** (Composition API)
    -   UI Library: **Tailwind CSS v4** with **shadcn/ui** components
    -   State Management: **Pinia**
    -   Routing: **Vue Router**
    -   Charting: **Chart.js** (primary, D3.js as potential for complex visualizations)
    -   Build Tool: **Vite**
    -   Language: **TypeScript**
    -   **Component Notes**:
        - Shadcn/UI components require `/* @vue-ignore */` directive for interface extensions in Vue 3.5+
        - Example: `interface Props extends /* @vue-ignore */ PrimitiveProps { ... }`
        - This is an intentional Vue 3.5+ compiler behavior for type safety ([GitHub issue](https://github.com/vuejs/core/issues/10504))
        - Use consistently across all Shadcn components
    
    -   **Example (Shadcn/UI Button with Tailwind):**
        ```vue
        <script setup lang="ts">
        import { Button } from '@/components/ui/button'
        </script>

        <template>
          <Button variant="outline" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Click Me
          </Button>
        </template>
        ```
    (Source: [docs/prd.md](mdc:docs/prd.md) 4.2.1, 4.10)

-   **Backend (API & Services)**:
    -   Framework: **FastAPI** (Python 3.10+)
    -   Data Validation: **Pydantic**
    -   Database Interaction: **SQLAlchemy Core or ORM**
    -   Authentication (JWT Verification): **python-jose** or similar
    -   Async Processing: FastAPI native, potentially **Celery** for long tasks.
    -   Data Analysis: **NumPy, Pandas, SciPy**
    -   Report Generation: **reportlab** or HTML-to-PDF rendering.
    (Source: [docs/prd.md](mdc:docs/prd.md) 4.3.1)

-   **Data Infrastructure (Self-Hosted)**:
    -   Platform: **Supabase**
    -   Database: **PostgreSQL 15+** (with RLS, `pgcrypto` or app-level encryption)
    -   Authentication: **Supabase Auth** (JWT-based, optional 2FA/MFA with TOTP)
    -   File Storage: **Supabase Storage** (for C3D, PDF reports, data exports)
    (Source: [docs/prd.md](mdc:docs/prd.md) 4.4.1, 4.4.2; [docs/security.md](mdc:docs/security.md))

-   **Existing System Components**: (to integrate with)
    -   Game: **OpenFeasyo** (MonoGame/C# on Android Tablets) - *Modifiable*
    -   Sensors: **Delsys Trigno Avanti EMG sensors**
    (Source: [docs/prd.md](mdc:docs/prd.md) 4.1.1)

-   **Security Specific**: 
    -   Encryption: **Fernet** (Python Cryptography library for application-level encryption)
    -   Hashing for Pseudonymization: **SHA-256**
    (Source: [docs/prd.md](mdc:docs/prd.md) 4.5.1; [docs/security.md](mdc:docs/security.md) Sections 3, 4)

## 2. Development & Deployment Environment

-   **Containerization**: **Docker** & **Docker Compose**
    -   Separate Dockerfiles for backend (FastAPI) and frontend (Vue.js - multi-stage builds).
    -   `docker-compose.yml` for local development orchestration of application services (backend, frontend, nginx).
    -   Local Supabase services (PostgreSQL, Auth, Storage, Studio, etc.) are managed via a separate `supabase_config/docker-compose.yml` and a root `.env` file, due to M1 compatibility issues with `npx supabase start`.
    (Source: [docs/prd.md](mdc:docs/prd.md) 4.6.1, 4.10, and project experience)
-   **Version Control**: **Git**
-   **Web Server/Reverse Proxy (Production)**: **Nginx**
    (Source: [docs/prd.md](mdc:docs/prd.md) 4.10)
-   **Development Proxy**: Vite dev server proxy (`server.proxy` in `vite.config.ts`) to forward API requests to backend container during local development. (Source: [docs/prd.md](mdc:docs/prd.md) 4.10 Notes)
-   **Package Management**:
    -   Backend (Python): **Poetry** (recommended) or `requirements.txt`.
    -   Frontend (Node.js): **npm** or **yarn** (via `package.json`).
    (Source: [docs/prd.md](mdc:docs/prd.md) 4.10)

## 3. Technical Constraints & Considerations

-   **Deployment Target**: VUB Private Virtual Machine. This dictates self-hosting for Supabase and overall infrastructure control.
-   **Data Sensitivity**: Handling of EMG data and patient PII requires strict adherence to GDPR and robust security measures (encryption, pseudonymization, RLS, secure authentication).
-   **Existing Game Modification**: The OpenFeasyo game (C#) needs to be modified to integrate Supabase Auth (likely via REST API calls to Supabase Auth endpoints) and implement direct authenticated C3D file uploads to the FastAPI backend.
-   **C3D File Processing**: Efficient parsing and processing of potentially large C3D files.
-   **Interoperability**: Ensuring smooth communication between the C# game, Python backend, Vue.js frontend, and Supabase services.

## 4. Key Tool Usage Patterns

-   **Supabase Auth**: Centralized authentication for both the game and web dashboard, issuing JWTs. Supports optional 2FA/MFA.
-   **Supabase Database (PostgreSQL)**: Stores structured application data. RLS is critical for access control. Data encryption is managed at the application layer (FastAPI) or via `pgcrypto`.
-   **Supabase Storage**: Securely stores C3D files and generated reports, with access controlled via policies integrated with user authentication.
-   **FastAPI**: Serves as the main API gateway, handling all business logic, data transformation (encryption/decryption, pseudonymization), and interactions with Supabase.
-   **Vue.js (with Pinia & Vue Router)**: Manages frontend state (including auth token), navigation, and component-based UI rendering.
-   **Docker**: Standardizes development and deployment environments, ensuring consistency.
-   **Nginx**: In production, acts as a reverse proxy, serves static frontend assets, and forwards API requests to the FastAPI backend.

## 5. Dependencies (Examples from PRD)

-   **Frontend**: `vue`, `vue-router`, `pinia`, `tailwindcss`, `chart.js`, `axios` (or `fetch` for API calls), `shadcn-ui` related packages.
-   **Backend**: `fastapi`, `uvicorn`, `pydantic`, `sqlalchemy`, `python-jose` (or similar for JWT), `numpy`, `pandas`, `scipy`, `cryptography` (for Fernet), `reportlab` (or similar for PDF generation), Supabase Python client (if used directly, though often interaction is via SQLAlchemy/direct DB connection for self-hosted).

(Refer to [docs/prd.md](mdc:docs/prd.md) Section 4.10 for recommended project structure which implies these dependencies.)

## Development Tooling & Resources

-   **Context7**: Consider using the Context7 MCP tool (`resolve-library-id` followed by `get-library-docs`) to fetch up-to-date, version-specific documentation and code examples for libraries. This is particularly helpful for ensuring AI assistants have accurate information and for verifying library usage against the latest official sources.

### Environment Setup Guides

Detailed setup instructions for different project environments are available:
- [Local CLI Development Setup](mdc:docs/environments/local_cli_development_setup.md)
- [VM Self-Hosted Supabase Setup](mdc:docs/environments/vm_self_hosted_supabase_setup.md)

## Outstanding Technical Questions 

-   **Example (Shadcn/UI Button with Tailwind):**
    ```vue
    <script setup lang="ts">
    import { Button } from '@/components/ui/button'
    </script>

    <template>
      <Button variant="outline" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Click Me
      </Button>
    </template>
    ```

## 6. Known Issues & Troubleshooting

### 6.1. Supabase CLI on M1 Macs (`exec format error` / Studio Unhealthy) - RESOLVED

-   **Problem**: When running `npx supabase start` on M1 Macs, users might encounter `exec format error` for the `postgrest` container and an `unhealthy` status for the `supabase_studio` container. This prevents Supabase Studio from being accessible and can indicate issues with other Supabase services.
-   **Cause**: This is often due to Docker images used by the Supabase CLI not being fully compatible with the ARM64 architecture of M1 Macs, even with Rosetta 2 installed. Specific services like PostgREST or Supabase Studio might pull images that cause an `exec format error`.
-   **Attempted Solutions (as of 2025-05-07 for GHOSTLY+ Dashboard project)**:
    -   Multiple attempts with `npx supabase start` after ensuring Docker Desktop was running, disk space cleared, Rosetta 2 installed, Supabase CLI updated, and Docker system pruned.
    -   These attempts consistently failed with `exec format error` for `postgrest`.
-   **Resolution (2025-05-07)**:
    -   Switched to a manual Docker Compose setup for Supabase services.
    -   Cloned the official `supabase/supabase` repository to obtain their `docker/` configuration files.
    -   Copied `supabase/docker/*` files (specifically `docker-compose.yml` and others from the `docker` directory) to a project directory `supabase_config/`.
    -   Created a root `.env` file from `supabase/docker/.env.example` (obtained from the cloned repo) and populated it with necessary secrets and configurations (including `DOCKER_SOCKET_LOCATION=/var/run/docker.sock`).
    -   Ensured shell environment variables did not override the `.env` file by unsetting them for the session where necessary.
    -   Modified `supabase_config/docker-compose.yml` to add platform specification to the `rest` (PostgREST) service definition. Initially tried `platform: linux/arm64`, which still resulted in `postgrest` restarting. Successfully resolved by using `platform: linux/amd64`, forcing x86_64 emulation for `postgrest`.
    -   Successfully launched all Supabase services, including a stable `postgrest`, using `docker compose -f supabase_config/docker-compose.yml up -d` from the project root.
-   **Key Takeaway**: For M1 Mac users experiencing `exec format error` with `npx supabase start` for `postgrest`, a manual Docker Compose setup is a viable workaround. Explicitly setting `platform: linux/amd64` for the `postgrest` service in the `docker-compose.yml` can force successful emulation when native ARM64 or `platform: linux/arm64` fails. Ensure the root `.env` file is correctly configured and not overridden by shell environment variables.

-   **Next Steps / Potential Solutions (To Investigate Further)**:
    -   Reset Docker Desktop to factory settings (Caution: will remove all existing images/containers/volumes).
    -   Search for specific GitHub issues on Supabase CLI or related Docker image repositories regarding M1 `exec format error`.
    -   Investigate Docker Desktop settings on M1, particularly "Use Virtualization framework" and Rosetta emulation options.
    -   Consider manually defining Supabase services in the project's main `docker-compose.yml` using known ARM64-compatible images as an alternative to the Supabase CLI's local management, though this increases setup complexity.
    -   **Update (2025-05-07)**: A more targeted Perplexity search for GitHub issues or specific Docker Desktop M1 settings related to "exec format error" for PostgREST or "Supabase Studio unhealthy" did not immediately yield a definitive, simple fix. The issue appears rooted in Docker image compatibility on ARM64/M1 architecture. Further investigation into Docker Desktop settings (e.g., "Use Virtualization framework," ensuring "Use Rosetta for x86_64/amd64 emulation on Apple Silicon" is enabled) or deeper dives into Supabase GitHub issues threads are needed. 