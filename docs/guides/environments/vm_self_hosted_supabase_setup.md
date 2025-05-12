# Full Application Deployment on VUB VM (Frontend, Backend, Supabase)

> **Note:** This document outlines the planned deployment process for the GHOSTLY+ application on the VUB VM. As the project is in its early stages, some details or specific commands may evolve. Always refer to the latest version and cross-reference with the project's Memory Bank (`memory-bank/`) for the most current information and context.

This guide provides a step-by-step tutorial for deploying the complete GHOSTLY+ application (frontend, backend, and self-hosted Supabase) on a VUB Virtual Machine using Docker and Nginx. This setup is intended for a production-like environment.

**Key Technologies:** Docker, Docker Compose, Nginx, Supabase (Self-Hosted).

## 1. VM Prerequisites & Initial Setup

The VUB VM should meet the following requirements prior to proceeding with the deployment.

### 1.1. Operating System
*   **Recommendation:** Use the latest stable Ubuntu Server LTS release.
    *   As of early 2024, **Ubuntu 24.04.2 LTS ("Noble Numbat")** is a strong candidate (final point release expected Feb 2025, but current 24.04.x is stable).
    *   LTS versions offer long-term support (e.g., until April 2029 for 24.04) and up-to-date security.
*   The current OS version should be verified if the VM is already provisioned.

### 1.2. Install Essential Tools
Package lists should be updated, followed by the installation of Git, Docker, and Docker Compose.
```bash
sudo apt update
sudo apt upgrade -y # Optional: upgrade existing packages
sudo apt install git curl wget -y

# Install Docker Engine (official script or package manager method)
# See: https://docs.docker.com/engine/install/ubuntu/
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER # Add your user to the docker group (re-login or new shell needed)
rm get-docker.sh

# Verify Docker installation
docker --version

# Install Docker Compose (plugin is usually included with recent Docker installs)
# If 'docker compose' (with a space) works, you're set.
# If not, check Docker's official documentation for the latest Compose installation.
docker compose version
```
*   The Docker daemon status can be verified using `sudo systemctl status docker` (it should be active/running). It is recommended to enable it to start on boot via `sudo systemctl enable docker`.

### 1.3. VM Access & Security
*   **SSH Access:** SSH access to the VM is required with a user account that has `sudo` privileges.
*   **User Privileges:** The user account should have the capability to run `docker` commands (either via `sudo` or by being in the `docker` group).

### 1.4. Network Configuration
*   **Static IP:** A static IP address for the VM, assigned by VUB IT, is a prerequisite.
*   **DNS Records:** Coordination with VUB IT is necessary to configure DNS records pointing to the VM's static IP. Examples:
    *   `dashboard.yourproject.vub.be` (for Frontend)
    *   `api.yourproject.vub.be` (for Backend API)
    *   `supabase.yourproject.vub.be` (for Supabase services - Kong gateway, Studio)
    *   These examples may be adjusted based on the project's specific naming scheme. These will be used in Nginx and application configurations.
*   **Technical Steps:**
    *   **Static IP:** A request should be made to VUB IT, providing VM details. They will either configure it or provide network details (IP, subnet, gateway, DNS servers) for manual OS-level configuration (e.g., via `netplan` on Ubuntu).
    *   **DNS Records:** After obtaining the static IP, VUB IT should be requested to create 'A' records for the chosen hostnames pointing to this IP.

### 1.5. Firewall Configuration
*   Coordination with VUB IT is required to ensure the VM's firewall (e.g., `ufw` on Ubuntu or an external VUB firewall) allows inbound traffic on:
    *   **Port 22 (TCP):** For SSH access (ensure this is restricted to trusted IPs if possible).
    *   **Port 80 (TCP):** For HTTP (Nginx will handle this, initially for Let's Encrypt challenges).
    *   **Port 443 (TCP):** For HTTPS (Nginx will handle secure traffic).
*   Internal Docker ports (e.g., Supabase's 8000, your app's internal ports) should generally *not* be directly exposed to the public internet by the VM's firewall; Nginx will manage public access.
*   **Technical Steps:**
    *   **VUB Perimeter Firewall:** A request should be submitted to VUB IT to open TCP ports 22 (SSH, which should ideally be restricted to trusted IPs), 80 (HTTP), and 443 (HTTPS) to the VM's static IP.
    *   **Local VM Firewall (e.g., `ufw`):** If `ufw` is not present on the VM, it should be installed. Necessary services (`sudo ufw allow ssh`, `sudo ufw allow http`, `sudo ufw allow https`) can then be allowed, followed by enabling `ufw` (`sudo ufw enable`). It is important to ensure SSH is allowed before `ufw` is enabled.

### 1.6. VM Resource Allocation (Recommendations)
For a full-stack application with Supabase, Nginx, frontend, and backend services:
*   **CPU:** Minimum 2 vCPUs, **Recommended: 4+ vCPUs**.
*   **RAM:** Minimum 8 GB, **Recommended: 16 GB** or more (PostgreSQL benefits greatly).
*   **Storage:** Minimum 50-80 GB **SSD**, **Recommended: 100 GB+ SSD** (consider OS, Docker images, database growth, logs).
*   It is advisable to communicate these resource recommendations and the nature of the technical stack (full-stack application with database services) when liaising with VUB IT for VM provisioning. Inquiries regarding future scalability options for the allocated VM resources are also recommended at that stage.

## 2. Deploying GHOSTLY+ Application Components (Frontend & Backend)

The following steps outline the deployment process assuming the GHOSTLY+ application (frontend and backend) is containerized using Docker and managed with a `docker-compose.yml` file.

### 2.1. Clone Your Application Repository
On the VUB VM, clone your main application repository (which includes frontend, backend, and their Docker configurations).
```bash
# Example:
git clone https://your-git-repository-url/ghostly-plus-dashboard.git
cd ghostly-plus-dashboard
```

### 2.2. Configure Application Environment Variables
The frontend and backend components typically require `.env` files for configuration. These can be created by copying their respective `.env.example` files and populating them for the VUB VM environment.
*   **Frontend `.env` (e.g., in `frontend/.env`):**
    *   `VITE_API_BASE_URL=https://api.yourproject.vub.be` (Public API URL via Nginx)
    *   `VITE_SUPABASE_URL=https://supabase.yourproject.vub.be`
    *   `VITE_SUPABASE_ANON_KEY=your_supabase_anon_key` (This value must match `ANON_KEY` in the root project `.env` file)
*   **Backend `.env` (e.g., in `backend/.env`):**
    *   `DATABASE_URL="postgresql://postgres:[YOUR_SUPABASE_DB_PASSWORD_FROM_ROOT_ENV]@[SUPABASE_DB_SERVICE_NAME_OR_IP]:5432/postgres"`
        *   Note: `[YOUR_SUPABASE_DB_PASSWORD_FROM_ROOT_ENV]` must match `POSTGRES_PASSWORD` in the root project `.env` file.
        *   `[SUPABASE_DB_SERVICE_NAME_OR_IP]` will typically be `localhost` if the backend and Supabase run on the same VM (ports are mapped), or the Docker service name of the Supabase database (e.g., `db`) if the application and Supabase containers are on the same custom Docker network.
    *   `JWT_SECRET_KEY=your_application_specific_jwt_secret` (if your backend issues its own JWTs, distinct from Supabase's)
    *   Any other necessary API keys or configuration.
*   **Important:** The primary source for Supabase-related environment variables (`POSTGRES_PASSWORD`, `JWT_SECRET`, `ANON_KEY`, `SERVICE_ROLE_KEY`, etc.) is the root `.env` file of the `ghostly-plus-dashboard` project. Ensure consistency. Application-specific `.env` files (`frontend/.env`, `backend/.env`) might reference these or be used for variables not shared globally.

### 2.3. Build Application Docker Images (If Necessary)
If the application's `docker-compose.yml` is configured to build images locally (e.g., from Dockerfiles):
```bash
# Navigate to the directory containing your application's main docker-compose.yml
cd /path/to/ghostly-plus-dashboard
docker compose build # Or: docker compose build frontend backend
```
If you use pre-built images from a registry, this step can be skipped (Docker Compose will pull them).

### 2.4. Start Frontend & Backend Services
The application's `docker-compose.yml` is used to start the frontend and backend services.
```bash
# Ensure you are in the directory with your app's docker-compose.yml
docker compose up -d frontend backend # Or simply 'docker compose up -d' if it defines all services
```

### 2.5. Verify Frontend & Backend Services (Internally)
The status of the application containers can be checked to ensure they are running.
```bash
docker compose ps
# Check logs if needed
docker compose logs frontend
docker compose logs backend
```
At this stage, they might not be publicly accessible until Nginx is configured. Internal connectivity can be tested if services expose ports on `localhost` (e.g., `curl http://localhost:INTERNAL_PORT`).

## 3. Deploying Self-Hosted Supabase

The Supabase self-hosted instance is managed via Docker Compose configuration files located within the `ghostly-plus-dashboard` project itself, under the `supabase_config/` directory. This setup was chosen to simplify deployment and manage M1 Mac compatibility issues during local development.

### 3.1. Navigate to Project Directory
It should be ensured that the current working directory is the `ghostly-plus-dashboard` directory on the VUB VM (cloned in step 2.1).

### 3.2. Critical: Configure Root Environment File (`.env`)
All Supabase environment variables, along with application-specific ones, are managed in a single `.env` file at the root of the `ghostly-plus-dashboard` project directory on the VM.

1.  If it doesn't exist, create it by copying from `supabase_config/.env.example` (which should be present in your cloned `ghostly-plus-dashboard` repository):
    ```bash
    # In /path/to/ghostly-plus-dashboard directory on the VM
    cp supabase_config/.env.example .env
    ```
2.  **This root `.env` file requires editing.** **ALL placeholders must be replaced with strong, unique values.**
    *   This file will be used by both the application's `docker-compose.yml` and Supabase's `supabase_config/docker-compose.yml`.

*   **PostgreSQL Settings:**
    *   `POSTGRES_PASSWORD`: A very strong, unique password. **Save this securely; your backend will need it.**
*   **API Gateway & JWT:**
    *   `JWT_SECRET`: Cryptographically strong random string (min. 32 chars). **Generate a new one.**
    *   `ANON_KEY`: Public API key. Supabase docs explain how to generate this from `JWT_SECRET` (role: `anon`).
    *   `SERVICE_ROLE_KEY`: Admin key. Generate from `JWT_SECRET` (role: `service_role`). **This key must be kept highly secure.**
*   **Public URLs (Use your VUB DNS records):**
    *   `SITE_URL=https://dashboard.yourproject.vub.be` (Your main application's public URL)
    *   `SUPABASE_PUBLIC_URL=https://supabase.yourproject.vub.be` (Base URL for Supabase services, accessed via Nginx)
    *   `ADDITIONAL_REDIRECT_URLS`: Comma-separated list if needed (e.g., `https://api.yourproject.vub.be/auth/callback`).
*   **Email SMTP Configuration (for Auth features like password resets):**
    *   `SMTP_ADMIN_EMAIL`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_SENDER_NAME`, `SMTP_AUTH_METHOD`, `SMTP_SECURE_ENABLED`. Obtain details from VUB IT or your email provider.
*   **Supabase Studio (Dashboard) Authentication:**
    *   `DASHBOARD_USERNAME`: Change from default `supabase`.
    *   `DASHBOARD_PASSWORD`: Strong, unique password. **The default password should not be used.**
*   **Other Variables:** All default values in `.env.example` should be reviewed and modified if necessary.
*   **Security Best Practices:**
    *   Utilizing a password manager is recommended for storing sensitive credentials.
    *   Read access to this `.env` file on the VM should be restricted (e.g., `chmod 600 .env`).
    *   **The populated `.env` file must not be committed to Git.**

### 3.3. Pull Supabase Docker Images
From the root of the `ghostly-plus-dashboard` directory:
```bash
# In /path/to/ghostly-plus-dashboard directory
docker compose -f supabase_config/docker-compose.yml pull
```

### 3.4. Start Supabase Services
From the root of the `ghostly-plus-dashboard` directory:
```bash
# In /path/to/ghostly-plus-dashboard directory
docker compose -f supabase_config/docker-compose.yml up -d
```

### 3.5. Verify Supabase Services
From the root of the `ghostly-plus-dashboard` directory:
```bash
# In /path/to/ghostly-plus-dashboard directory
docker compose -f supabase_config/docker-compose.yml ps
```
All Supabase services (db, kong, auth, studio, etc.) should be `running (healthy)`. Logs can be consulted if issues arise: `docker compose -f supabase_config/docker-compose.yml logs <service_name>`.

### 3.6. Initial Supabase Access (Verification)
Prior to Nginx setup, Supabase Studio is generally accessible via the Kong gateway's default port (usually 8000, as defined in Supabase's `docker-compose.yml`).
*   URL: `http://<VM_STATIC_IP>:8000`
*   Access is granted using the `DASHBOARD_USERNAME` and `DASHBOARD_PASSWORD` defined in the root `.env` file.
*   API: `http://<VM_STATIC_IP>:8000/rest/v1/`, `http://<VM_STATIC_IP>:8000/auth/v1/`
This is for initial verification; public access will be via Nginx over HTTPS.

## 4. Database Schema Migration to VM Supabase

The application's database schema, previously developed locally, should be applied to the newly deployed self-hosted Supabase instance.

### 4.1. Apply Migrations
*   Installation of the Supabase CLI is a prerequisite (locally or on a machine that can access the VM's database port).
*   From your main application project directory (e.g., `ghostly-plus-dashboard`):
    ```bash
    # Replace placeholders with actual values from Supabase's .env on the VM
    # The DB host here is the VM's IP, as Supabase DB port 5432 is mapped to the VM.
    export SUPABASE_DB_PASSWORD='[YOUR_VM_SUPABASE_POSTGRES_PASSWORD]'
    npx supabase db push --db-url "postgresql://postgres:${SUPABASE_DB_PASSWORD}@[VM_STATIC_IP]:5432/postgres"
    ```
    Alternatively, if running this command from the VM itself, and Supabase containers are running, you might use `localhost` or the Docker service name if they are on the same custom Docker network. Accessing via the mapped port `[VM_STATIC_IP]:5432` is generally reliable.

## 5. Nginx Reverse Proxy & SSL for All Services

Nginx is to be configured on the VUB VM to serve as the single, secure entry point for the frontend, backend, and Supabase services.

### 5.1. Install Nginx
If Nginx is not already installed on the VM (e.g., as part of your application's Docker setup or as a system service):
```bash
sudo apt update
sudo apt install nginx -y
sudo systemctl enable nginx
sudo systemctl start nginx
sudo systemctl status nginx # Should be active/running
```

### 5.2. Unified Nginx Configuration Strategy
*   **Overview:** Nginx will listen on ports 80/443 and route requests based on the `server_name` (domain/subdomain) to the appropriate internal Docker service.
*   **DNS Examples:**
    *   `dashboard.yourproject.vub.be` -> Frontend App
    *   `api.yourproject.vub.be` -> Backend API
    *   `supabase.yourproject.vub.be` -> Supabase Services (Kong Gateway)
*   Nginx configuration files are typically in `/etc/nginx/nginx.conf` (main), `/etc/nginx/conf.d/` (custom configs), and `/etc/nginx/sites-available/` with symlinks to `/etc/nginx/sites-enabled/`.

### 5.3. Create Nginx Server Blocks (Site Configurations)
Create a new configuration file, e.g., `/etc/nginx/sites-available/ghostly_platform.conf`.

```nginx
# /etc/nginx/sites-available/ghostly_platform.conf

# Frontend Application
server {
    listen 80;
    listen [::]:80;
    server_name dashboard.yourproject.vub.be; # Your frontend domain

    # For Let's Encrypt, add location for challenges if not handled by certbot plugin
    # location ~ /.well-known/acme-challenge {
    #     allow all;
    #     root /var/www/html; # Or a directory Certbot can write to
    # }

    location / {
        # Assuming your frontend app (e.g., Vue, React) is served by a Docker container
        # named 'ghostly_frontend' (from your app's docker-compose) listening internally on port 5173.
        # If Nginx is running as a system service (not in Docker), use localhost and the mapped port.
        # If Nginx is also a Docker container on the same network, use the service name.
        proxy_pass http://localhost:5173; # Adjust port if different
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        # WebSocket support for Vite HMR (if applicable in production build, usually not)
        # or other WebSocket needs of your frontend
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}

# Backend API
server {
    listen 80;
    listen [::]:80;
    server_name api.yourproject.vub.be; # Your backend API domain

    location / {
        # Assuming your backend API (e.g., FastAPI) is served by a Docker container
        # named 'ghostly_backend' listening internally on port 8000.
        proxy_pass http://localhost:8000; # Adjust port if different
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        # If your backend API paths don't include a base like /api/, no rewrite needed here.
        # If your backend expects paths like /users but is accessed via api.yourdomain.com/users
    }
}

# Supabase Services (Kong Gateway)
server {
    listen 80;
    listen [::]:80;
    server_name supabase.yourproject.vub.be; # Your Supabase domain

    location / {
        # Supabase Kong gateway, typically running on port 8000 internally on the VM.
        proxy_pass http://localhost:8000; # This is Supabase's Kong port, not your backend's.
        proxy_set_header Host $http_host; # Use $http_host for Supabase
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host $http_host; # Important for Supabase

        # WebSocket support for Supabase Realtime
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```
*   The site can be enabled using: `sudo ln -s /etc/nginx/sites-available/ghostly_platform.conf /etc/nginx/sites-enabled/`
*   The Nginx configuration should be tested with: `sudo nginx -t`
*   If the test is successful, Nginx can be reloaded using: `sudo systemctl reload nginx`

### 5.4. Implement SSL/TLS with Let's Encrypt (Certbot)
All public domains should be secured with HTTPS.

1.  **Install Certbot and Nginx Plugin:**
    ```bash
    sudo apt install certbot python3-certbot-nginx -y
    ```
2.  **Obtain SSL Certificates:**
    Certbot should be run for each domain group defined in the Nginx config. Certbot will automatically modify the Nginx configuration to include SSL settings and set up HTTPS.
    ```bash
    # For frontend (dashboard)
    sudo certbot --nginx -d dashboard.yourproject.vub.be
    # For backend API
    sudo certbot --nginx -d api.yourproject.vub.be
    # For Supabase
    sudo certbot --nginx -d supabase.yourproject.vub.be
    ```
    The prompts provided by Certbot should be followed (e.g., entering an email address, agreeing to Terms of Service). It is recommended to choose the option to redirect HTTP traffic to HTTPS when prompted.
3.  **Verify Auto-Renewal:**
    Certbot typically configures a cron job or systemd timer for automatic certificate renewal. This can be tested using:
    ```bash
    sudo certbot renew --dry-run
    ```
4.  Nginx configuration will now be updated by Certbot to include `listen 443 ssl;` and certificate paths.

### 5.5. Test Nginx Configuration & Restart/Reload
After Certbot modifies the configs:
```bash
sudo nginx -t
sudo systemctl reload nginx # Or restart: sudo systemctl restart nginx
```

## 6. Final Application Testing

The deployed services should be accessed and tested via their public HTTPS URLs.

*   **Frontend:** `https://dashboard.yourproject.vub.be`
*   **Backend API:** (e.g., a health check endpoint) `https://api.yourproject.vub.be/health`
*   **Supabase:**
    *   Studio: `https://supabase.yourproject.vub.be` (should redirect to Studio login if SITE_URL/SUPABASE_PUBLIC_URL are set correctly for Kong to route to Studio) or verify specific paths like `/rest/v1/` or `/auth/v1/` through this domain.
    *   Verification should be made that the frontend application can connect to Supabase using `https://supabase.yourproject.vub.be` and the `ANON_KEY`.
    *   Verification should be made that the backend application can connect to the Supabase database.

## 7. Production Best Practices & Ongoing Management

### 7.1. Security Hardening
*   **Strong Secrets:** All `.env` files and configurations should be double-checked for strong, unique passwords and secrets.
*   **File Permissions:** Access to sensitive files (e.g., `.env` files, Nginx SSL private keys) should be restricted.
*   **OS & Package Updates:** The VM's operating system and all installed packages should be regularly updated: `sudo apt update && sudo apt upgrade -y`.
*   **Docker Security:** Docker and Docker Compose should be kept updated, and Docker's security best practices reviewed.
*   **Firewall:** VM firewall rules should be configured strictly, only allowing necessary inbound traffic (HTTPS on 443, SSH on 22).

### 7.2. Automated Backups
*   **Supabase PostgreSQL Database:**
    *   Use `pg_dump` from within or outside the Supabase DB container. Example cron job script:
        ```bash
        # Example: /opt/scripts/backup_supabase_db.sh
        #!/bin/bash
        DB_USER="postgres"
        DB_PASSWORD="[YOUR_SUPABASE_DB_PASSWORD]"
        DB_HOST="localhost" # If Supabase DB port is mapped to VM's localhost
        DB_PORT="5432" # Supabase DB default port
        DB_NAME="postgres"
        BACKUP_DIR="/srv/backups/supabase_db"
        DATE=$(date +%Y-%m-%d_%H-%M-%S)

        mkdir -p $BACKUP_DIR
        PGPASSWORD=$DB_PASSWORD docker exec supabase-db pg_dump -U $DB_USER -d $DB_NAME -F c -b -v -f "/tmp/$DB_NAME-$DATE.backup" && docker cp supabase-db:/tmp/$DB_NAME-$DATE.backup "$BACKUP_DIR/$DB_NAME-$DATE.backup" && docker exec supabase-db rm "/tmp/$DB_NAME-$DATE.backup"
        # Remove old backups (e.g., older than 7 days)
        find $BACKUP_DIR -type f -mtime +7 -name '*.backup' -delete
        ```
    *   Schedule this script with `cron`.
*   **Supabase Storage Volumes:**
    *   The Supabase `docker-compose.yml` defines volumes (e.g., for database data, storage files). These paths (e.g., within `supabase_config/volumes/`) should be identified and backed up regularly (e.g., using `rsync` or `tar`).
*   **Application Data Volumes:** If the frontend/backend utilizes Docker volumes for persistent data, these should also be backed up.
*   **Backup Storage:** Backups should be stored securely, preferably encrypted and off-VM (e.g., cloud storage bucket).

### 7.3. Monitoring & Logging
*   **Nginx Logs:** `/var/log/nginx/access.log` and `/var/log/nginx/error.log` (and any custom logs defined).
*   **Application Logs:** Use `docker compose logs frontend` and `docker compose logs backend` (from the app's directory). Configure log rotation if needed.
*   **Supabase Logs:** `docker compose -f supabase_config/docker-compose.yml logs <supabase_service_name>` (from the project root).
*   **System Monitoring:** Tools such as `htop`, `vmstat`, `df` can be used, or a more comprehensive monitoring solution (e.g., Prometheus, Grafana) may be set up for CPU, memory, disk, and network usage.

### 7.4. Updating Application Components
1.  `cd /path/to/ghostly-plus-dashboard`
2.  `git pull` (to get new code)
3.  `docker compose build` (if images are built from source)
4.  `docker compose pull` (if using pre-built images specified by tag, and the tag was updated)
5.  `docker compose up -d` (to recreate containers with new images/code)
6.  Monitor logs and test.

### 7.5. Updating Supabase
1.  `cd /path/to/ghostly-plus-dashboard` (Navigate to your project root)
2.  Review Supabase release notes for breaking changes.
3.  Optionally, update your project's `supabase_config/` files if there are structural updates from the official Supabase repository (less common for routine image updates).
4.  Modify image versions in `supabase_config/docker-compose.yml` to desired new versions.
5.  `docker compose -f supabase_config/docker-compose.yml pull` (to fetch the new image versions)
6.  `docker compose -f supabase_config/docker-compose.yml up -d` (this will stop, remove, and recreate containers using the new images; usually involves brief downtime).
7.  Monitor logs and test Supabase functionality.

### 7.6. Managing Docker Services
*   **Application (Frontend/Backend):**
    *   `cd /path/to/ghostly-plus-dashboard`
    *   `docker compose stop [service_name]` (uses `docker-compose.yml` in current dir)
    *   `docker compose start [service_name]`
    *   `docker compose restart [service_name]`
    *   `docker compose down`
*   **Supabase:**
    *   `cd /path/to/ghostly-plus-dashboard`
    *   `docker compose -f supabase_config/docker-compose.yml stop [service_name]`
    *   `docker compose -f supabase_config/docker-compose.yml start [service_name]`
    *   `docker compose -f supabase_config/docker-compose.yml restart [service_name]`
    *   `docker compose -f supabase_config/docker-compose.yml down`
*   **Viewing all running containers:** `docker ps -a`
*   **Removing unused Docker resources:** `docker system prune -a --volumes` (Use with caution, removes all stopped containers, unused networks, dangling images, and optionally volumes).

## 8. Troubleshooting Tips

*   **Nginx Errors:** Check `sudo nginx -t`. Examine Nginx error logs (`/var/log/nginx/error.log`). Common issues: port conflicts, incorrect `proxy_pass` URLs, SSL certificate problems.
*   **"502 Bad Gateway":** Nginx can't reach the upstream service (your app container or Supabase Kong).
    *   Verify the upstream service (e.g., `ghostly_frontend`, `ghostly_backend`, Supabase Kong) is running: `docker ps`.
    *   Check upstream service logs: `docker compose logs <service_name>`.
    *   Ensure `proxy_pass` in Nginx config points to the correct internal host/port or Docker service name and port.
    *   Firewall issues (less likely if Nginx and services are on the same VM and proxying to `localhost` or Docker service names).
*   **Application Errors:** Check container logs for your frontend or backend.
*   **Supabase Errors:** Check logs for the specific Supabase service (e.g., `supabase-kong`, `supabase-auth`, `supabase-db`).
*   **Database Connection Issues (App to Supabase DB):**
    *   Verify `DATABASE_URL` in your backend's `.env`.
    *   Ensure the Supabase PostgreSQL container is running and its port (e.g., 5432) is accessible from your backend container (either via `localhost` if mapped, or via Docker network service name).
    *   Check Supabase DB logs.
*   **Permission Denied:** For Docker commands, ensure the user is in the `docker` group or use `sudo`. For file access, check permissions.
*   **Port Conflicts:** Ensure no other services on the VM are using ports 80, 443 (for Nginx) or other ports intended for Docker services' internal use if mapping them directly to the host (which is generally avoided when Nginx is the entry point).

This guide provides a comprehensive approach. Paths, service names, and configurations should always be adapted to the specific project setup. Reference to the official documentation for each technology (Docker, Nginx, Supabase) is recommended for further details. 