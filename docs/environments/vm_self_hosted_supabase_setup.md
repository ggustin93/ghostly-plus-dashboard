# Full Application Deployment on VUB VM (Frontend, Backend, Supabase)

This guide provides a step-by-step tutorial for deploying the complete GHOSTLY+ application (frontend, backend, and self-hosted Supabase) on a VUB Virtual Machine using Docker and Nginx. This setup is intended for a production-like environment.

**Key Technologies:** Docker, Docker Compose, Nginx, Supabase (Self-Hosted).

## 1. VM Prerequisites & Initial Setup

Ensure the VUB VM meets these requirements before proceeding.

### 1.1. Operating System
*   **Recommendation:** Use the latest stable Ubuntu Server LTS release.
    *   As of early 2024, **Ubuntu 24.04.2 LTS (“Noble Numbat”)** is a strong candidate (final point release expected Feb 2025, but current 24.04.x is stable).
    *   LTS versions offer long-term support (e.g., until April 2029 for 24.04) and up-to-date security.
*   Verify your current OS version if the VM is already provisioned.

### 1.2. Install Essential Tools
Update package lists and install Git, Docker, and Docker Compose.
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
*   Ensure the Docker daemon is active: `sudo systemctl status docker` (should be active/running). Enable it to start on boot: `sudo systemctl enable docker`.

### 1.3. VM Access & Security
*   **SSH Access:** You need SSH access to the VM with a user account that has `sudo` privileges.
*   **User Privileges:** Ensure your user can run `docker` commands (either via `sudo` or by being in the `docker` group).

### 1.4. Network Configuration
*   **Static IP:** The VM must have a static IP address assigned by VUB IT.
*   **DNS Records:** Coordinate with VUB IT to configure DNS records pointing to the VM's static IP. Examples:
    *   `dashboard.yourproject.vub.be` (for Frontend)
    *   `api.yourproject.vub.be` (for Backend API)
    *   `supabase.yourproject.vub.be` (for Supabase services - Kong gateway, Studio)
    *   Adjust these based on your project's naming scheme. These will be used in Nginx and application configurations.
*   **Technical Steps:**
    *   **Static IP:** Request from VUB IT, providing VM details. They will either configure it or provide network details (IP, subnet, gateway, DNS servers) for manual OS-level configuration (e.g., via `netplan` on Ubuntu).
    *   **DNS Records:** After obtaining the static IP, request VUB IT to create 'A' records for your chosen hostnames pointing to this IP.

### 1.5. Firewall Configuration
*   Coordinate with VUB IT to ensure the VM's firewall (e.g., `ufw` on Ubuntu or an external VUB firewall) allows inbound traffic on:
    *   **Port 22 (TCP):** For SSH access (ensure this is restricted to trusted IPs if possible).
    *   **Port 80 (TCP):** For HTTP (Nginx will handle this, initially for Let's Encrypt challenges).
    *   **Port 443 (TCP):** For HTTPS (Nginx will handle secure traffic).
*   Internal Docker ports (e.g., Supabase's 8000, your app's internal ports) should generally *not* be directly exposed to the public internet by the VM's firewall; Nginx will manage public access.
*   **Technical Steps:**
    *   **VUB Perimeter Firewall:** Request VUB IT to open TCP ports 22 (SSH, restricted to trusted IPs), 80 (HTTP), and 443 (HTTPS) to your VM's static IP.
    *   **Local VM Firewall (e.g., `ufw`):** On the VM, install `ufw` if not present. Allow necessary services (`sudo ufw allow ssh`, `sudo ufw allow http`, `sudo ufw allow https`) and then enable it (`sudo ufw enable`). Ensure SSH is allowed before enabling.

### 1.6. VM Resource Allocation (Recommendations)
For a full-stack application with Supabase, Nginx, frontend, and backend services:
*   **CPU:** Minimum 2 vCPUs, **Recommended: 4+ vCPUs**.
*   **RAM:** Minimum 8 GB, **Recommended: 16 GB** or more (PostgreSQL benefits greatly).
*   **Storage:** Minimum 50-80 GB **SSD**, **Recommended: 100 GB+ SSD** (consider OS, Docker images, database growth, logs).
*   When requesting the VM from VUB IT, provide these recommendations and explain your stack. Inquire about scalability.

## 2. Deploying GHOSTLY+ Application Components (Frontend & Backend)

These steps assume your GHOSTLY+ application (frontend and backend) is containerized using Docker and managed with a `docker-compose.yml` file.

### 2.1. Clone Your Application Repository
On the VUB VM, clone your main application repository (which includes frontend, backend, and their Docker configurations).
```bash
# Example:
git clone https://your-git-repository-url/ghostly-plus-dashboard.git
cd ghostly-plus-dashboard
```

### 2.2. Configure Application Environment Variables
Your frontend and backend will likely require `.env` files. Create these from their respective `.env.example` files and populate them for the VUB VM environment.
*   **Frontend `.env` (e.g., in `frontend/.env`):**
    *   `VITE_API_BASE_URL=https://api.yourproject.vub.be` (or the appropriate public API URL served by Nginx)
    *   `VITE_SUPABASE_URL=https://supabase.yourproject.vub.be`
    *   `VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_from_supabase_setup` (This will be set in Supabase's .env later)
*   **Backend `.env` (e.g., in `backend/.env`):**
    *   `DATABASE_URL="postgresql://postgres:[YOUR_SUPABASE_DB_PASSWORD]@[VM_IP_OR_LOCALHOST_IF_SAME_DOCKER_NETWORK_AS_SUPABASE]:5432/postgres"`
        *   Note: If Supabase runs in a different Docker network accessible by IP, use VM IP. If you plan to put them on the same custom Docker network, you might be able to use the Supabase DB service name. For simplicity here, we assume Supabase DB might be accessed via `localhost` or its internal Docker IP if Nginx is proxying to it, but more typically the backend will directly connect to Supabase's PostgreSQL port. For now, plan to use `localhost` if Supabase DB is on the same VM. The Supabase DB password will be set later.
    *   `JWT_SECRET_KEY=your_application_specific_jwt_secret` (if your backend issues its own JWTs, distinct from Supabase's)
    *   Any other necessary API keys or configuration.
*   **Security:** Never commit populated `.env` files with real secrets to Git. Use `.gitignore`.

### 2.3. Build Application Docker Images (If Necessary)
If your `docker-compose.yml` for the application builds images locally (e.g., from Dockerfiles):
```bash
# Navigate to the directory containing your application's main docker-compose.yml
cd /path/to/ghostly-plus-dashboard
docker compose build # Or: docker compose build frontend backend
```
If you use pre-built images from a registry, this step can be skipped (Docker Compose will pull them).

### 2.4. Start Frontend & Backend Services
Use your application's `docker-compose.yml` to start the frontend and backend services.
```bash
# Ensure you are in the directory with your app's docker-compose.yml
docker compose up -d frontend backend # Or simply 'docker compose up -d' if it defines all services
```

### 2.5. Verify Frontend & Backend Services (Internally)
Check that your application containers are running.
```bash
docker compose ps
# Check logs if needed
docker compose logs frontend
docker compose logs backend
```
At this stage, they might not be publicly accessible until Nginx is configured. You can test internal connectivity if services expose ports on `localhost` (e.g., `curl http://localhost:INTERNAL_PORT`).

## 3. Deploying Self-Hosted Supabase

Follow these steps on the VUB VM to set up a separate Supabase instance.

### 3.1. Clone Supabase Docker Repository
```bash
git clone --depth 1 https://github.com/supabase/supabase
```

### 3.2. Set Up Supabase Configuration Directory
It's good practice to keep Supabase Docker configurations separate.
```bash
mkdir ~/supabase-selfhosted
cp -rf supabase/docker/* ~/supabase-selfhosted/
cd ~/supabase-selfhosted
```

### 3.3. Critical: Configure Supabase Environment Variables
Edit `~/supabase-selfhosted/.env` (copied from `.env.example`). **Replace ALL placeholders with strong, unique values.**

*   **PostgreSQL Settings:**
    *   `POSTGRES_PASSWORD`: A very strong, unique password. **Save this securely; your backend will need it.**
*   **API Gateway & JWT:**
    *   `JWT_SECRET`: Cryptographically strong random string (min. 32 chars). **Generate a new one.**
    *   `ANON_KEY`: Public API key. Supabase docs explain how to generate this from `JWT_SECRET` (role: `anon`).
    *   `SERVICE_ROLE_KEY`: Admin key. Generate from `JWT_SECRET` (role: `service_role`). **Keep highly secure.**
*   **Public URLs (Use your VUB DNS records):**
    *   `SITE_URL=https://dashboard.yourproject.vub.be` (Your main application's public URL)
    *   `SUPABASE_PUBLIC_URL=https://supabase.yourproject.vub.be` (Base URL for Supabase services, accessed via Nginx)
    *   `ADDITIONAL_REDIRECT_URLS`: Comma-separated list if needed (e.g., `https://api.yourproject.vub.be/auth/callback`).
*   **Email SMTP Configuration (for Auth features like password resets):**
    *   `SMTP_ADMIN_EMAIL`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_SENDER_NAME`, `SMTP_AUTH_METHOD`, `SMTP_SECURE_ENABLED`. Obtain details from VUB IT or your email provider.
*   **Supabase Studio (Dashboard) Authentication:**
    *   `DASHBOARD_USERNAME`: Change from default `supabase`.
    *   `DASHBOARD_PASSWORD`: Strong, unique password. **Do NOT use the default.**
*   **Other Variables:** Review all defaults in `.env.example` and change if necessary.
*   **Security Best Practices:**
    *   Use a password manager.
    *   Restrict read access to this `.env` file on the VM (`chmod 600 ~/supabase-selfhosted/.env`).
    *   **Never commit the populated `.env` file to Git.**

### 3.4. Pull Supabase Docker Images
```bash
# In ~/supabase-selfhosted directory
docker compose pull
```

### 3.5. Start Supabase Services
```bash
# In ~/supabase-selfhosted directory
docker compose up -d
```

### 3.6. Verify Supabase Services
```bash
# In ~/supabase-selfhosted directory
docker compose ps
```
All Supabase services (db, kong, auth, studio, etc.) should be `running (healthy)`. Check logs if issues: `docker compose logs <service_name>`.

### 3.7. Initial Supabase Access (Verification)
Before Nginx is set up, Supabase Studio is often accessible via the Kong gateway's default port (usually 8000, check Supabase's `docker-compose.yml`).
*   URL: `http://<VM_STATIC_IP>:8000`
*   Login with `DASHBOARD_USERNAME` and `DASHBOARD_PASSWORD` from Supabase's `.env`.
*   API: `http://<VM_STATIC_IP>:8000/rest/v1/`, `http://<VM_STATIC_IP>:8000/auth/v1/`
This is for initial verification; public access will be via Nginx over HTTPS.

## 4. Database Schema Migration to VM Supabase

Apply your application's database schema (developed locally) to the new self-hosted Supabase instance.

### 4.1. Apply Migrations
*   Ensure Supabase CLI is installed (locally or on a machine that can access the VM's database port).
*   From your main application project directory (e.g., `ghostly-plus-dashboard`):
    ```bash
    # Replace placeholders with actual values from Supabase's .env on the VM
    # The DB host here is the VM's IP, as Supabase DB port 5432 is mapped to the VM.
    export SUPABASE_DB_PASSWORD='[YOUR_VM_SUPABASE_POSTGRES_PASSWORD]'
    npx supabase db push --db-url "postgresql://postgres:${SUPABASE_DB_PASSWORD}@[VM_STATIC_IP]:5432/postgres"
    ```
    Alternatively, if running this command from the VM itself, and Supabase containers are running, you might use `localhost` or the Docker service name if they are on the same custom Docker network. Accessing via the mapped port `[VM_STATIC_IP]:5432` is generally reliable.

## 5. Nginx Reverse Proxy & SSL for All Services

Configure Nginx on the VUB VM to act as the single, secure entry point for your frontend, backend, and Supabase services.

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
*   **Enable the site:** `sudo ln -s /etc/nginx/sites-available/ghostly_platform.conf /etc/nginx/sites-enabled/`
*   **Test Nginx config:** `sudo nginx -t`
*   **If successful, reload Nginx:** `sudo systemctl reload nginx`

### 5.4. Implement SSL/TLS with Let's Encrypt (Certbot)
Secure all your public domains with HTTPS.

1.  **Install Certbot and Nginx Plugin:**
    ```bash
    sudo apt install certbot python3-certbot-nginx -y
    ```
2.  **Obtain SSL Certificates:**
    Run Certbot for each domain group defined in your Nginx config. Certbot will automatically modify your Nginx configuration to include SSL settings and set up HTTPS.
    ```bash
    # For frontend (dashboard)
    sudo certbot --nginx -d dashboard.yourproject.vub.be
    # For backend API
    sudo certbot --nginx -d api.yourproject.vub.be
    # For Supabase
    sudo certbot --nginx -d supabase.yourproject.vub.be
    ```
    Follow the prompts (enter email, agree to ToS). Choose to redirect HTTP to HTTPS when asked.
3.  **Verify Auto-Renewal:**
    Certbot should set up a cron job or systemd timer for automatic renewal. Test it:
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

Access your services via their public HTTPS URLs.

*   **Frontend:** `https://dashboard.yourproject.vub.be`
*   **Backend API:** (e.g., a health check endpoint) `https://api.yourproject.vub.be/health`
*   **Supabase:**
    *   Studio: `https://supabase.yourproject.vub.be` (should redirect to Studio login if SITE_URL/SUPABASE_PUBLIC_URL are set correctly for Kong to route to Studio) or verify specific paths like `/rest/v1/` or `/auth/v1/` through this domain.
    *   Ensure your frontend application can connect to Supabase using `https://supabase.yourproject.vub.be` and the `ANON_KEY`.
    *   Ensure your backend application can connect to the Supabase database.

## 7. Production Best Practices & Ongoing Management

### 7.1. Security Hardening
*   **Strong Secrets:** Double-check all `.env` files and configurations for strong, unique passwords and secrets.
*   **File Permissions:** Restrict access to sensitive files (e.g., `.env` files, Nginx SSL private keys).
*   **OS & Package Updates:** Regularly update the VM's operating system and all installed packages: `sudo apt update && sudo apt upgrade -y`.
*   **Docker Security:** Keep Docker and Docker Compose updated. Review Docker's security best practices.
*   **Firewall:** Ensure VM firewall rules are strict, only allowing necessary inbound traffic (HTTPS on 443, SSH on 22).

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
        PGPASSWORD=$DB_PASSWORD pg_dump -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -F c -b -v -f "$BACKUP_DIR/$DB_NAME-$DATE.backup"
        # Remove old backups (e.g., older than 7 days)
        find $BACKUP_DIR -type f -mtime +7 -name '*.backup' -delete
        ```
    *   Schedule this script with `cron`.
*   **Supabase Storage Volumes:**
    *   The Supabase `docker-compose.yml` defines volumes (e.g., for database data, storage files). Identify these paths (`~/supabase-selfhosted/volumes/db/data`, `~/supabase-selfhosted/volumes/storage/`) and back them up regularly (e.g., using `rsync` or `tar`).
*   **Application Data Volumes:** If your frontend/backend uses Docker volumes for persistent data, back these up too.
*   **Backup Storage:** Store backups securely, preferably encrypted and off-VM (e.g., cloud storage bucket).

### 7.3. Monitoring & Logging
*   **Nginx Logs:** `/var/log/nginx/access.log` and `/var/log/nginx/error.log` (and any custom logs you defined).
*   **Application Logs:** Use `docker compose logs frontend` and `docker compose logs backend` (from your app's directory). Configure log rotation if needed.
*   **Supabase Logs:** `docker compose logs <supabase_service_name>` (from `~/supabase-selfhosted`).
*   **System Monitoring:** Use tools like `htop`, `vmstat`, `df` or set up a more comprehensive monitoring solution (e.g., Prometheus, Grafana) for CPU, memory, disk, and network usage.

### 7.4. Updating Application Components
1.  `cd /path/to/ghostly-plus-dashboard`
2.  `git pull` (to get new code)
3.  `docker compose build` (if images are built from source)
4.  `docker compose pull` (if using pre-built images specified by tag, and the tag was updated)
5.  `docker compose up -d` (to recreate containers with new images/code)
6.  Monitor logs and test.

### 7.5. Updating Supabase
1.  `cd ~/supabase-selfhosted`
2.  Review Supabase release notes for breaking changes.
3.  Optionally, update the `supabase/supabase` git repository clone itself if major changes to `docker-compose.yml` or `.env.example` are expected (less common for routine image updates).
4.  Modify image versions in `~/supabase-selfhosted/docker-compose.yml` to desired new versions.
5.  `docker compose pull` (to fetch the new image versions)
6.  `docker compose up -d` (this will stop, remove, and recreate containers using the new images; usually involves brief downtime).
7.  Monitor logs and test Supabase functionality.

### 7.6. Managing Docker Services
*   **Application (Frontend/Backend):**
    *   `cd /path/to/ghostly-plus-dashboard`
    *   `docker compose stop [service_name]`
    *   `docker compose start [service_name]`
    *   `docker compose restart [service_name]`
    *   `docker compose down` (stops and removes containers, networks)
*   **Supabase:**
    *   `cd ~/supabase-selfhosted`
    *   (Similar `docker compose` commands as above)
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
*   **Permission Denied:** For Docker commands, ensure your user is in the `docker` group or use `sudo`. For file access, check permissions.
*   **Port Conflicts:** Ensure no other services on the VM are using ports 80, 443 (for Nginx) or other ports intended for Docker services' internal use if you're mapping them directly to the host (which is generally avoided when Nginx is the entry point).

This guide provides a comprehensive approach. Always adapt paths, service names, and configurations to your specific project setup. Refer to official documentation for each technology (Docker, Nginx, Supabase) for further details. 