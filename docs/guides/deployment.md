# Deployment Guide

This document provides instructions for deploying the Ghostly+ system in various environments. It covers deployment models, requirements, and step-by-step procedures.

## Deployment Models

The Ghostly+ system supports three deployment models, each with different characteristics:

### 1. Centralized Model

All hospitals connect to a central VUB instance.

- **Pros**: Simplest setup, centralized data management, easier updates
- **Cons**: Single point of failure, potential network latency for remote sites
- **Best for**: Small-scale deployments, closely related research sites

### 2. Hybrid Model

Core data at VUB with local processing at each site.

- **Pros**: Reduced latency for local operations, resilience to network issues
- **Cons**: More complex setup, data synchronization challenges
- **Best for**: Geographically distributed research sites with reliable internet

### 3. Distributed Model

Independent instances with anonymized data sharing.

- **Pros**: Maximum privacy, local control, highly resilient
- **Cons**: Most complex setup, potential data inconsistencies
- **Best for**: Sites with strict data sovereignty requirements, international collaborations

## Deployment Requirements

### Hardware Requirements

- **Server** (per instance):
  - CPU: 4+ cores
  - RAM: 8+ GB
  - Storage: 100+ GB (SSD preferred)
  - Network: 100+ Mbps

### Software Requirements

- Docker and Docker Compose
- Nginx (for production deployments)
- SSL certificates for secure HTTPS connections
- Backup solution with off-site capability

### Access Requirements

- SSH access for deployment and maintenance
- Firewall rules allowing necessary ports (HTTP/HTTPS)
- SMTP server access for email notifications (optional)

## Deployment Steps

### Pre-deployment

1. **Prepare environment variables**
   - Copy `.env.example` to `.env`
   - Fill in required values (database credentials, API keys, etc.)
   - Set environment-specific configurations (dev/test/prod)

2. **Prepare SSL certificates**
   - Obtain SSL certificates for your domain(s)
   - Place certificates in the appropriate directory (`./nginx/certs/`)

### Docker Deployment

1. **Build containers**
   ```bash
   docker-compose build
   ```

2. **Initialize database**
   ```bash
   docker-compose run --rm backend python -m app.tools.init_db
   ```

3. **Start the application**
   ```bash
   docker-compose up -d
   ```

4. **Verify deployment**
   ```bash
   docker-compose ps  # Check container status
   curl https://your-domain.com/api/health  # Check API health
   ```

### VM Deployment (VUB)

For deployment on VUB's private VM, follow these specific steps:

1. Connect to the VM via SSH
   ```bash
   ssh user@vm-hostname
   ```

2. Clone the repository
   ```bash
   git clone https://github.com/username/ghostly-plus.git
   cd ghostly-plus
   ```

3. Follow the Docker Deployment steps above

## Post-Deployment Tasks

1. **Create initial admin user**
   ```bash
   docker-compose exec backend python -m app.tools.create_admin
   ```

2. **Configure backup schedule**
   ```bash
   # Add to crontab
   echo "0 2 * * * cd /path/to/ghostly-plus && ./scripts/backup.sh" | sudo tee -a /etc/crontab
   ```

3. **Set up monitoring** (recommended)
   - Configure server monitoring using your preferred tool
   - Set up alert notifications for critical errors

## Maintenance Procedures

### Updates

1. Pull latest changes
   ```bash
   git pull
   ```

2. Rebuild and restart containers
   ```bash
   docker-compose down
   docker-compose build
   docker-compose up -d
   ```

### Backup and Restore

#### Regular Backups

```bash
./scripts/backup.sh
```

This script:
- Creates a dump of the PostgreSQL database
- Archives C3D files and reports
- Encrypts the backup
- Transfers it to the backup storage location

#### Restore from Backup

```bash
./scripts/restore.sh backup-file.enc
```

## Troubleshooting

### Common Issues

- **Database connection errors**
  - Check database credentials in `.env`
  - Verify PostgreSQL container is running

- **Missing EMG data**
  - Check C3D file storage path configuration
  - Verify upload permissions

- **Authentication failures**
  - Confirm Supabase URL and key configuration
  - Check JWT secret consistency

### Logs

Access logs for diagnostics:

```bash
# API logs
docker-compose logs -f backend

# Frontend logs
docker-compose logs -f frontend

# Database logs
docker-compose logs -f db
```

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Supabase Self-Hosting Guide](https://supabase.io/docs/guides/hosting/docker) 