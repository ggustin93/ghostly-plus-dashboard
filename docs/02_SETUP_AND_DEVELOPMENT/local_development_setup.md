# GHOSTLY+ Local Development Environment

> **Note:** This document provides a concise guide for local development setup. For comprehensive project context, always refer to the Memory Bank, particularly `activeContext.md` and `techContext.md`.

## Prerequisites

- **Git** ([git-scm.com](https://git-scm.com/))
- **Node.js** (v18+) ([nodejs.org](https://nodejs.org/))
- **Python** (v3.10+) ([python.org](https://python.org/))
- **Poetry** ([python-poetry.org](https://python-poetry.org/))
- **Docker** with adequate resources ([docker.com](https://www.docker.com/products/docker-desktop/))

## Project Setup

```bash
# Clone repository
git clone <repository_url>
cd ghostly-plus-dashboard

# Backend setup (FastAPI)
cd backend
poetry install
cd ..

# Frontend setup (Next.js - current framework)
cd frontend-2  # Note: frontend-2 is the current Next.js implementation
npm install
cd ..
```

## Supabase Setup (Manual Docker Compose)

> **Important:** We use a manual Docker Compose setup instead of `npx supabase start` due to compatibility issues with Apple M1 chips.

### 1. Configuration Files

1. Create environment files:
   ```bash
   # Create project root .env (required for Docker socket location)
   cp .env.example .env
   
   # Create Supabase config .env
   cp supabase_config/.env.example supabase_config/.env
   ```

2. Configure the JWT secret and keys:
   ```bash
   # Edit supabase_config/.env to set a unique JWT_SECRET
   # Ensure ANON_KEY and SERVICE_ROLE_KEY are derived from the same JWT_SECRET
   ```

### 2. Starting Services

```bash
# Start Supabase services
docker compose -f supabase_config/docker-compose.yml up -d
```

### 3. Access Points

- **Supabase Studio:** http://localhost:54323
- **API Gateway:** http://localhost:8000
- **Frontend:** http://localhost:3000 (Next.js) or http://localhost:5173 (Vue)
- **Backend API:** http://localhost:8080

### 4. Storage Buckets Setup

Storage buckets (`c3d-files`, `reports`, `avatars`, `temp-uploads`) can be created:
- Via Supabase Studio (recommended)
- Or using the provided script (may require troubleshooting):
  ```bash
  cd docs/environments
  bash install_supabase_js.sh
  node create_storage_buckets.js
  ```

### 5. Authentication Notes

Due to complex header management between Supabase client and server:

- Direct API testing with `curl` can help isolate frontend vs. backend issues
- Ensure consistent JWT configuration across all services
- Frontend must restart after `.env` changes (Vite requires this)
- Consider custom fetch implementation for authentication as described in Memory Bank if issues persist

### 6. Service Management

```bash
# Stop services
docker compose -f supabase_config/docker-compose.yml down

# View logs
docker compose -f supabase_config/docker-compose.yml logs -f
```

## Common Issues

- **exec format error**: Use `platform: linux/arm64` in docker-compose for M1/M2 Macs
- **Authentication failures**: Verify JWT_SECRET consistency and restart services after changes
- **Module resolution errors**: May require npm cache clear or `--legacy-peer-deps` flag
- **CORS issues**: Use `supabase_config_cors_config.sh` to update Kong configuration

## Testing Production Deployment Locally with Coolify

If you want to test the production deployment process locally before deploying to the VUB VM, you can install Coolify on your local machine:

```bash
# Install Coolify locally (requires Docker)
curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash
```

After installation:

1. Access Coolify at `http://localhost:8000` and create your admin account
2. Add your local machine as a server in Coolify
3. Create a project for GHOSTLY+ testing
4. Upload or connect to your repository containing the Docker Compose files
5. Configure the environment variables:
   - Use the same structure as your production environment
   - Adjust network settings for local development (use `host.docker.internal` instead of container names for services running outside Coolify)
6. Deploy and test the application

This local Coolify setup provides a safe environment to validate your deployment process before applying it to the production VUB VM.

> **Note for M1/M2 Mac users**: You may encounter architecture compatibility issues with some Coolify services on Apple Silicon. Use the `platform: linux/amd64` setting in your Docker Compose files where needed.

This guide represents our current understanding and may evolve as we learn more. Issues and improvements are welcome. 