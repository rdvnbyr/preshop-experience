# 🐳 Docker Deployment Guide

This guide covers how to run the Places App using Docker and Docker Compose.

## 📋 Prerequisites

- Docker 20.10+
- Docker Compose 2.0+
- 4GB+ RAM available for containers
- 10GB+ disk space

## 🚀 Quick Start

### Development Environment

1. **Start development services:**

```bash
./docker-manager.sh dev:start
```

2. **Access services:**

- **Client:** http://localhost:3000
- **API:** http://localhost:4000
- **MongoDB:** localhost:27017

3. **Stop services:**

```bash
./docker-manager.sh dev:stop
```

### Production Environment

1. **Setup environment:**

```bash
cp .env.example .env
# Edit .env with your production values
```

2. **Start production services:**

```bash
./docker-manager.sh prod:start
```

3. **Access services:**

- **Application:** https://localhost (via Nginx)
- **Direct Client:** http://localhost:3000
- **Direct API:** http://localhost:4000

## 📊 Services Overview

| Service     | Port    | Description            |
| ----------- | ------- | ---------------------- |
| **nginx**   | 80, 443 | Reverse proxy with SSL |
| **client**  | 3000    | Next.js frontend       |
| **api**     | 4000    | Express.js backend     |
| **mongodb** | 27017   | MongoDB database       |
| **logger**  | -       | Shared logging package |

## 🛠️ Management Scripts

### Using Docker Manager

```bash
# Development
./docker-manager.sh dev:start      # Start dev environment
./docker-manager.sh dev:stop       # Stop dev environment
./docker-manager.sh dev:logs       # View all logs
./docker-manager.sh dev:logs api   # View API logs only
./docker-manager.sh dev:rebuild    # Rebuild and restart

# Production
./docker-manager.sh prod:start     # Start prod environment
./docker-manager.sh prod:stop      # Stop prod environment
./docker-manager.sh prod:logs      # View all logs
./docker-manager.sh prod:rebuild   # Rebuild and restart

# Utilities
./docker-manager.sh status         # Show container status
./docker-manager.sh cleanup        # Clean up resources
./docker-manager.sh backup         # Create DB backup
./docker-manager.sh restore <file> # Restore DB backup
./docker-manager.sh help           # Show help
```

### Using NPM Scripts

```bash
# Development
npm run docker:dev              # Start dev environment
npm run docker:dev:stop         # Stop dev environment
npm run docker:dev:logs         # View dev logs

# Production
npm run docker:prod             # Start prod environment
npm run docker:prod:stop        # Stop prod environment
npm run docker:prod:logs        # View prod logs

# Utilities
npm run docker:status           # Show status
npm run docker:cleanup          # Cleanup
npm run docker:backup           # Create backup
```

## 🔧 Configuration

### Environment Variables

**Development (.env.dev):**

```env
NODE_ENV=development
MONGO_ROOT_USER=admin
MONGO_ROOT_PASSWORD=devpassword
JWT_SECRET=dev-jwt-secret
LOG_LEVEL=debug
```

**Production (.env):**

```env
NODE_ENV=production
MONGO_ROOT_USER=admin
MONGO_ROOT_PASSWORD=strong-password-here
JWT_SECRET=very-long-random-secret-key
LOG_LEVEL=info
NEXT_PUBLIC_API_URL=https://yourdomain.com
```

### Docker Compose Files

- **`docker-compose.yml`** - Production configuration
- **`docker-compose.dev.yml`** - Development configuration

### Container Configurations

**API Container:**

- Multi-stage build with logger package
- Health checks enabled
- Log volume mounting
- Security hardening

**Client Container:**

- Next.js standalone build
- Optimized for production
- Health checks via API endpoint

**MongoDB Container:**

- Persistent data volumes
- Initialization scripts
- Authentication configured

## 📁 Directory Structure

```
exp-next/
├── docker/                     # Docker configuration
│   ├── mongodb/               # MongoDB init scripts
│   └── nginx/                 # Nginx configuration
├── backups/                   # Database backups
├── docker-compose.yml         # Production compose
├── docker-compose.dev.yml     # Development compose
├── docker-manager.sh          # Management script
├── .env.example              # Environment template
└── .env.dev                  # Development environment
```

## 🔐 Security

### Production Security Features

- **Non-root containers** - All services run as non-root users
- **SSL/TLS encryption** - Nginx handles SSL termination
- **Security headers** - CSP, HSTS, XSS protection
- **Rate limiting** - API and app rate limits via Nginx
- **Network isolation** - Services communicate via Docker network

### SSL Certificate Setup

1. **Generate self-signed certificate (development):**

```bash
mkdir -p docker/nginx/ssl
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout docker/nginx/ssl/key.pem \
  -out docker/nginx/ssl/cert.pem
```

2. **Use Let's Encrypt (production):**

```bash
# Install certbot and generate certificates
# Copy certificates to docker/nginx/ssl/
```

## 📊 Monitoring & Logs

### Health Checks

All services include health checks:

- **API:** `/health` endpoint
- **Client:** `/api/health` endpoint
- **MongoDB:** Connection ping

### Log Management

**Centralized logging:**

- API logs: `/app/logs/` volume
- MongoDB logs: Docker logs
- Nginx logs: Docker logs

**Log viewing:**

```bash
# All logs
docker-compose logs -f

# Specific service
docker-compose logs -f api

# Follow new logs
docker-compose logs -f --tail=100
```

## 🔄 Database Management

### Backups

**Automatic backup:**

```bash
./docker-manager.sh backup
```

**Manual backup with MongoDB tools:**

```bash
docker exec places-app-mongodb mongodump \
  --archive=/tmp/backup.archive --gzip
docker cp places-app-mongodb:/tmp/backup.archive ./backups/
```

### Restore

**From backup file:**

```bash
./docker-manager.sh restore backup_20231009_143022.archive
```

**Manual restore:**

```bash
docker cp ./backups/backup.archive places-app-mongodb:/tmp/
docker exec places-app-mongodb mongorestore \
  --archive=/tmp/backup.archive --gzip --drop
```

## 🐛 Troubleshooting

### Common Issues

**Port conflicts:**

```bash
# Check what's using the port
lsof -i :3000
lsof -i :4000
lsof -i :27017

# Stop conflicting services
sudo systemctl stop nginx
sudo systemctl stop mongod
```

**Container won't start:**

```bash
# Check logs
docker-compose logs service-name

# Check container status
docker ps -a

# Rebuild container
docker-compose build --no-cache service-name
```

**Database connection issues:**

```bash
# Check MongoDB container
docker exec -it places-app-mongodb mongosh

# Verify network connectivity
docker network ls
docker network inspect places-network
```

**Out of disk space:**

```bash
# Clean up Docker resources
./docker-manager.sh cleanup

# Remove unused volumes
docker volume prune

# Remove unused images
docker image prune -a
```

### Performance Optimization

**Resource limits:**

```yaml
# Add to docker-compose.yml services
deploy:
  resources:
    limits:
      memory: 512M
      cpus: "0.5"
```

**Build optimization:**

```bash
# Use BuildKit for faster builds
export DOCKER_BUILDKIT=1
docker-compose build
```

## 🚀 Deployment

### Staging Deployment

1. **Setup staging environment:**

```bash
cp .env.example .env.staging
# Configure staging values
```

2. **Deploy with custom environment:**

```bash
docker-compose --env-file .env.staging up -d
```

### Production Deployment

1. **Prepare production server:**

```bash
# Install Docker & Docker Compose
# Clone repository
# Setup environment variables
```

2. **Deploy:**

```bash
./docker-manager.sh prod:start
```

3. **Setup SSL certificates:**

```bash
# Configure real SSL certificates
# Update nginx configuration
```

4. **Setup monitoring:**

```bash
# Configure log shipping
# Setup health check monitoring
# Configure backup schedule
```

## 📈 Scaling

### Horizontal Scaling

```yaml
# docker-compose.yml
services:
  api:
    deploy:
      replicas: 3

  client:
    deploy:
      replicas: 2
```

### Load Balancing

Update Nginx configuration for multiple API instances:

```nginx
upstream api_backend {
    server api_1:4000;
    server api_2:4000;
    server api_3:4000;
}
```

---

**For more information, see the main [README.md](../README.md)**
