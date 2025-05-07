# GHOSTLY+ Dashboard: Development Environment Setup

This document outlines the steps required to set up your local development environment for the GHOSTLY+ Dashboard project. It covers initial project setup and the local Supabase environment using the Supabase CLI.

## 1. Prerequisites

Before you begin, ensure you have the following installed and configured:

-   **Git**: For version control. ([https://git-scm.com/](https://git-scm.com/))
-   **Node.js and npm**: For frontend development (Vue.js, Vite) and managing Node-based CLIs. Recommended Node.js version: 18.x or later. ([https://nodejs.org/](https://nodejs.org/))
-   **Python**: For backend development (FastAPI). Recommended Python version: 3.10 or later. ([https://www.python.org/](https://www.python.org/))
-   **Poetry**: For Python dependency management (recommended for the backend). ([https://python-poetry.org/](https://python-poetry.org/))
-   **Docker**: Docker Desktop (macOS/Windows) or an equivalent Docker environment (e.g., Rancher Desktop for Linux) is **crucial**. Supabase local development relies heavily on Docker to run its services. Ensure Docker is installed, running, and properly configured (e.g., sufficient resources allocated) before proceeding with Supabase setup. [Download Docker](https://www.docker.com/products/docker-desktop/)

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

## 3. Local Supabase Setup (via Supabase CLI)

This section details how to set up a local Supabase instance using the Supabase CLI. This local instance will provide database, authentication, and storage services for your development work.

### 3.1. Install Supabase CLI

The Supabase CLI is used to manage your local Supabase stack. Install it as a development dependency in the project root (`ghostly-plus-dashboard`):

```bash
npm install supabase --save-dev
```

To verify the installation, you can run:

```bash
npx supabase --version
```

### 3.2. Initialize Supabase in Your Project

Navigate to the project root directory (`ghostly-plus-dashboard`). Then, run the following command to initialize Supabase for your project:

```bash
npx supabase init
```

This command creates a new directory named `supabase` in your project root. This directory contains configuration files (like `config.toml` and migration scripts) for your local Supabase instance and **should be committed to your version control system (Git)**.

### 3.3. Understanding the Docker Environments

It's important to understand how Docker is used in this project for local development:

-   **Application Stack (`docker-compose.yml` in project root):**
    -   The `docker-compose.yml` file located in the root of the `ghostly-plus-dashboard` project is responsible for managing your core application services: the **backend** (FastAPI), **frontend** (Vue.js/Vite), and **nginx** (reverse proxy).
    -   You typically start these services with `docker-compose up -d`.

-   **Supabase Stack (Managed by Supabase CLI):**
    -   When you run `npx supabase start` (see next step), the Supabase CLI downloads and manages a **separate set of Docker containers** specifically for all Supabase services (PostgreSQL, GoTrue Auth, Storage, Realtime, Supabase Studio, etc.).
    -   These Supabase containers are *not* defined in your project's root `docker-compose.yml`.

-   **Concurrent Operation:**
    -   For local development, these two Docker environments (your application stack and the Supabase stack) will run **concurrently**.
    -   Your application (running in its Docker containers) will connect to the Supabase services (running in their CLI-managed Docker containers) using the local URLs (e.g., API at `http://localhost:54321`) provided by `npx supabase start`.

This CLI-driven approach for local Supabase is chosen for its convenience and ease of use during development. It is distinct from manually integrating Supabase services into your main application's `docker-compose.yml`, which would be a more complex setup typically considered for a dedicated server or production-like self-hosting (relevant to Phase 2 of Task 2).

### 3.4. Start Local Supabase Services

Once initialized, you can start all the local Supabase services by running the following command from your project root:

```bash
npx supabase start
```

The first time you run this, it might take a few minutes as it needs to download the necessary Supabase Docker images. Subsequent starts will be much faster.

Upon successful startup, the CLI will output important information, including:

-   **API URL**: Typically `http://localhost:54321` (for your application to interact with Supabase services via HTTP)
-   **DB URL**: Typically `postgresql://postgres:postgres@localhost:54322/postgres` (for direct database connections if needed, e.g., with a GUI tool)
-   **Studio URL**: Typically `http://localhost:54323` (web interface to manage your local Supabase instance)
-   **Inbucket URL**: Typically `http://localhost:54324` (for testing email functionalities like sign-up confirmations locally)
-   **Anon Key**: The default public API key for anonymous access.
-   **Service Role Key**: The default secret API key for administrative access (bypasses Row Level Security; use with caution).

**Note these URLs and keys, especially the API URL and Anon Key, as your frontend and backend applications will need them to connect to your local Supabase services.**

### 3.5. Accessing Supabase Studio

Supabase Studio provides a web-based interface to manage your local Supabase instance. You can:
-   View and manage your database tables.
-   Manage users for authentication.
-   Set up storage buckets.
-   Write and test SQL queries.
-   And more.

Access it by navigating to the **Studio URL** (usually `http://localhost:54323`) in your web browser.

### 3.6. Stopping Local Supabase Services

When you're done with your development session, you can stop the local Supabase services without losing your data by running:

```bash
npx supabase stop
```

### 3.7. Local CLI Development Mode: Keys & Configuration

For local development managed by the Supabase CLI:

-   The default API keys (`anon key`, `service_role key`) provided by `supabase start` are suitable for local development.
-   The underlying JWT secret and other sensitive configurations are managed automatically by the CLI for the local environment.
-   Project-specific Supabase configurations (like database schema migrations, custom database functions, roles) are primarily managed through files within the `supabase` directory, especially `supabase/config.toml` and migration files in `supabase/migrations/`.

### 3.8. Resource Considerations

-   **Docker Resources**: Ensure Docker Desktop (or your Docker environment) is allocated sufficient CPU, RAM, and disk space. If Supabase services run slowly or your machine becomes unresponsive, check Docker's resource settings.
-   **Disk Space**: Docker images and volumes (especially for the database) can consume significant disk space over time. Periodically prune unused Docker resources if needed.

---

This setup provides a fully functional local Supabase environment, enabling you to develop and test features that rely on its database, authentication, and storage capabilities.

---
*(This document will be updated as more development environment components are configured, e.g., backend/frontend specific run commands, environment variables for application services, etc.)* 