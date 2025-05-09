# GHOSTLY+ Dashboard: Development Environment Setup

This document outlines the steps required to set up your local development environment for the GHOSTLY+ Dashboard project. It covers initial project setup and the local Supabase environment.

**IMPORTANT NOTE ON LOCAL SUPABASE SETUP:** Due to compatibility issues encountered on Apple M1 Macs with the standard Supabase CLI workflow (`npx supabase init` and `npx supabase start`), this project uses a **manual Docker Compose setup for local Supabase services**. This approach is similar to the self-hosting model and provides greater control for resolving architecture-specific problems. While the Supabase CLI might be used for specific tasks like migration generation in the future (with caution), the core local Supabase environment is managed as described in section 3.2 onwards.

## 1. Prerequisites

Before you begin, ensure you have the following installed and configured:

-   **Git**: For version control. ([https://git-scm.com/](https://git-scm.com/))
-   **Node.js and npm**: For frontend development (Vue.js, Vite) and managing Node-based CLIs. Recommended Node.js version: 18.x or later. ([https://nodejs.org/](https://nodejs.org/))
-   **Python**: For backend development (FastAPI). Recommended Python version: 3.10 or later. ([https://www.python.org/](https://www.python.org/))
-   **Poetry**: For Python dependency management (recommended for the backend). ([https://python-poetry.org/](https://python-poetry.org/))
-   **Docker**: Docker Desktop (macOS/Windows) or an equivalent Docker environment (e.g., Rancher Desktop for Linux) is **crucial**. Supabase local development relies heavily on Docker to run its services. Ensure Docker is installed, running, and properly configured (e.g., sufficient resources allocated). [Download Docker](https://www.docker.com/products/docker-desktop/)

## 2. Initial Project Clone and Application Dependencies

1.  **Clone the Repository** (if you haven't already):
    ```bash
    # Replace <repository_url> with the actual Git repository URL
    git clone <repository_url>
    cd ghostly-plus-dashboard
    ```

2.  **Install Backend Dependencies** (using Poetry):
    ```bash
    cd backend
    poetry install
    cd ..
    ```

3.  **Install Frontend Dependencies** (using npm):
    ```bash
    cd frontend
    npm install
    cd ..
    ```

## 3. Local Supabase Setup (Manual Docker Compose / Self-Hosted Approach)

This section details how to set up a local Supabase instance using a manual Docker Compose configuration, which we've adopted due to M1 Mac compatibility issues with the standard Supabase CLI local development commands.

### 3.1. Understanding Our Approach

-   **M1 Mac Issue**: The standard `npx supabase init` followed by `npx supabase start` commands led to `exec format error` for some Supabase services (e.g., `postgrest`) on Apple M1 hardware.
-   **Our Solution**: We use the official Supabase Docker setup, typically intended for self-hosting, for our local development. The necessary Docker Compose files and configurations have been adapted and are located in the `supabase_config/` directory in the project root.
-   **Supabase CLI Usage**: While `npx supabase init` might not be directly used to manage the *running* local instance in our setup, the CLI itself (`npx supabase`) can still be useful for other tasks such as generating database migration files. However, always test CLI commands carefully in the context of our manual setup.

### 3.2. Configuration Files

-   **`supabase_config/docker-compose.yml`**: This is the primary file that defines all the Supabase services (PostgreSQL, GoTrue Auth, Storage, Kong API Gateway, Studio, etc.) for our local environment.
-   **`supabase_config/.env`**: This file (which you need to create from `supabase_config/.env.example` if it doesn't exist) contains all the necessary environment variables for the Supabase services, including API keys, JWT secrets, and database credentials. **This file is critical and should NOT be committed to version control.**
-   **Project Root `.env`**: A `.env` file in the *project root* (`ghostly-plus-dashboard/.env`) is also essential, as it's used by the `supabase_config/docker-compose.yml` to set variables like `DOCKER_SOCKET_LOCATION`. Ensure this is correctly populated as per project guidelines.

### 3.3. Starting Local Supabase Services

To start all the local Supabase services, navigate to the project root and run:

```bash
docker compose -f supabase_config/docker-compose.yml up -d
```

The first time you run this, it might take a few minutes as it needs to download the Docker images. Subsequent starts will be faster.

Upon successful startup, the services will be accessible based on the configurations in `supabase_config/.env` and `supabase_config/docker-compose.yml`. Key access points are:

-   **API Gateway (Kong)**: `http://localhost:8000` (This is the main entry point for your application to interact with Supabase services).
-   **Supabase Studio URL**: `http://localhost:54323` (Web interface to manage your local Supabase instance).
-   **Database Port (PostgreSQL)**: Typically `5432` (as defined in `supabase_config/.env`).
-   **Other service ports**: Refer to `supabase_config/docker-compose.yml` and `supabase_config/.env`.

**API Keys and Secrets**:
-   **Anon Key (`ANON_KEY`)**: Public API key for client-side anonymous access. Found in `supabase_config/.env`.
-   **Service Role Key (`SERVICE_ROLE_KEY`)**: Secret API key for administrative server-side access. Found in `supabase_config/.env`. **Never expose this in client code.**
-   **JWT Secret (`JWT_SECRET`)**: Secret used to sign and verify JWTs. Found in `supabase_config/.env`.

Your frontend and backend applications will use these values (typically sourced from their own environment variables that you align with `supabase_config/.env`) to connect to the local Supabase services.

### 3.4. Accessing Supabase Studio

Supabase Studio provides a web-based interface to manage your local Supabase instance. You can:
-   View and manage your database tables.
-   Manage users for authentication.
-   Set up storage buckets.
-   Write and test SQL queries.
-   And more.

Access it by navigating to `http://localhost:54323` in your web browser. You may need credentials defined in `supabase_config/.env` (e.g., for Studio itself or the database).

### 3.5. Stopping Local Supabase Services

When you're done with your development session, you can stop the local Supabase services without losing your data by running from the project root:

```bash
docker compose -f supabase_config/docker-compose.yml down
```

### 3.6. Resource Considerations

-   **Docker Resources**: Ensure Docker Desktop (or your Docker environment) is allocated sufficient CPU, RAM, and disk space. If Supabase services run slowly or your machine becomes unresponsive, check Docker's resource settings.
-   **Disk Space**: Docker images and volumes (especially for the database) can consume significant disk space over time. Periodically prune unused Docker resources if needed (e.g., `docker system prune -a --volumes`).

---

This setup provides a fully functional local Supabase environment, enabling you to develop and test features that rely on its database, authentication, and storage capabilities, while working around M1-specific CLI issues.

---
*(This document will be updated as more development environment components are configured, e.g., backend/frontend specific run commands, environment variables for application services, etc.)* 