# Incident Management System - Deployment Guide

## Table of Contents
1. [System Overview](#system-overview)
2. [Prerequisites](#prerequisites)
3. [Environment Setup](#environment-setup)
4. [Quick Start](#quick-start)
5. [Microservices Architecture](#microservices-architecture)
6. [Docker Deployment](#docker-deployment)
7. [Development Workflow](#development-workflow)
8. [Monitoring & Operations](#monitoring--operations)
9. [Troubleshooting](#troubleshooting)
10. [Production Deployment](#production-deployment)

---

## System Overview

The Incident Management System is built as a **microservices architecture** with complete **containerization** using Docker and Docker Compose. The system has **zero cloud dependencies** and can run entirely on-premises or in any Docker-compatible environment.

### Key Features
- **10 Microservices** handling different business domains
- **Frontend**: Next.js 13+ with TypeScript and Tailwind CSS
- **Backend Services**: Node.js/NestJS microservices
- **Databases**: PostgreSQL 15 (7 isolated databases)
- **Caching**: Redis for performance optimization
- **Message Queue**: RabbitMQ for async communication
- **Search**: Elasticsearch for full-text search capabilities
- **Object Storage**: MinIO (S3-compatible)
- **Security**: ClamAV for virus scanning
- **Monitoring**: Prometheus + Grafana

---

## Prerequisites

### Required Software
- **Docker**: Version 24.0 or higher
- **Docker Compose**: Version 2.20 or higher
- **Git**: For source control
- **8GB RAM minimum** (16GB recommended)
- **20GB free disk space**

### Installation Instructions

#### Linux (Ubuntu/Debian)
```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo apt-get update
sudo apt-get install docker-compose-plugin

# Add user to docker group
sudo usermod -aG docker $USER
newgrp docker
```

#### macOS
```bash
# Install Docker Desktop
brew install --cask docker

# Verify installation
docker --version
docker-compose --version
```

#### Windows
1. Download and install Docker Desktop from docker.com
2. Enable WSL2 backend
3. Allocate at least 8GB RAM in Docker Desktop settings

---

## Environment Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd IncidentManagement
```

### 2. Create Environment File
Copy the example environment file and configure it:
```bash
cp .env.example .env
```

### 3. Configure Environment Variables
Edit `.env` file with your secure values:

**Critical Security Variables (MUST CHANGE):**
```bash
# Security & Authentication
JWT_SECRET=your-super-secret-jwt-key-change-in-production-min-32-chars
SESSION_SECRET=your-super-secret-session-key-change-in-production-min-32-chars

# Database
POSTGRES_PASSWORD=your-secure-postgres-password

# Redis
REDIS_PASSWORD=your-secure-redis-password

# RabbitMQ
RABBITMQ_DEFAULT_PASS=your-secure-rabbitmq-password

# Elasticsearch
ELASTICSEARCH_PASSWORD=your-secure-elastic-password

# MinIO
MINIO_ROOT_PASSWORD=your-secure-minio-password

# Monitoring
GRAFANA_ADMIN_PASSWORD=your-secure-grafana-password
```

**Quick Setup Script:**
```bash
# Generate secure random passwords
export JWT_SECRET=$(openssl rand -base64 32)
export POSTGRES_PASSWORD=$(openssl rand -base64 16)
export REDIS_PASSWORD=$(openssl rand -base64 16)
export RABBITMQ_DEFAULT_PASS=$(openssl rand -base64 16)
export ELASTICSEARCH_PASSWORD=$(openssl rand -base64 16)
export MINIO_ROOT_PASSWORD=$(openssl rand -base64 16)
export GRAFANA_ADMIN_PASSWORD=$(openssl rand -base64 16)

# Write to .env file
cat .env.example | envsubst > .env
```

---

## Quick Start

### Option 1: One-Command Deployment
```bash
# Start all services
docker-compose up -d

# Check service status
docker-compose ps

# View logs
docker-compose logs -f
```

### Option 2: Step-by-Step Deployment
```bash
# 1. Pull all required images
docker-compose pull

# 2. Build custom services
docker-compose build

# 3. Start infrastructure services first
docker-compose up -d postgres-auth postgres-incidents postgres-analytics redis rabbitmq

# 4. Wait for infrastructure to be ready (30 seconds)
sleep 30

# 5. Start application services
docker-compose up -d api-gateway auth-service incident-service user-service

# 6. Start remaining services
docker-compose up -d notification-service organization-service analytics-service file-storage-service workflow-service reporting-service

# 7. Start frontend
docker-compose up -d frontend

# 8. Start monitoring
docker-compose up -d prometheus grafana

# 9. Start reverse proxy
docker-compose up -d nginx
```

### Access the Application
Once all services are running:

- **Frontend Application**: http://localhost:3000
- **API Gateway**: http://localhost:4000
- **RabbitMQ Management**: http://localhost:15672 (guest/guest)
- **MinIO Console**: http://localhost:9001 (minioadmin/[password])
- **Grafana Dashboard**: http://localhost:3001 (admin/[password])
- **Prometheus**: http://localhost:9090

---

## Microservices Architecture

### Service Catalog

| Service | Port | Database | Purpose |
|---------|------|----------|---------|
| Frontend | 3000 | - | Next.js UI |
| API Gateway | 4000 | Redis | Request routing & auth |
| Auth Service | 5001 | auth_db | Authentication & authorization |
| Incident Service | 5002 | incident_db | Incident management |
| User Service | 5003 | auth_db | User profile management |
| Notification Service | 5004 | notifications_db | Email/SMS notifications |
| Organization Service | 5005 | auth_db | Organization settings |
| Analytics Service | 5006 | analytics_db | Reporting & analytics |
| File Storage Service | 5007 | files_db | File upload & storage |
| Workflow Service | 5008 | workflow_db | Approval workflows |
| Reporting Service | 5009 | reporting_db | Report generation |

### Infrastructure Services

| Service | Port | Purpose |
|---------|------|---------|
| PostgreSQL (7 instances) | 5432-5438 | Relational data storage |
| Redis | 6379 | Caching & session management |
| RabbitMQ | 5672, 15672 | Message broker |
| Elasticsearch | 9200, 9300 | Search engine |
| MinIO | 9000, 9001 | Object storage (S3-compatible) |
| ClamAV | 3310 | Virus scanning |
| Prometheus | 9090 | Metrics collection |
| Grafana | 3001 | Monitoring dashboards |
| NGINX | 80, 443 | Reverse proxy |

### Communication Patterns

**Synchronous (REST APIs):**
- Frontend → API Gateway
- API Gateway → Microservices
- Service-to-service for immediate responses

**Asynchronous (RabbitMQ):**
- Incident created → Notification service
- User registered → Organization setup
- File uploaded → Virus scanning
- Workflow approval → Status updates

---

## Docker Deployment

### Building Services

#### Build All Services
```bash
docker-compose build
```

#### Build Individual Service
```bash
docker-compose build auth-service
docker-compose build frontend
```

#### Build with No Cache
```bash
docker-compose build --no-cache
```

### Managing Services

#### Start Services
```bash
# Start all
docker-compose up -d

# Start specific service
docker-compose up -d auth-service

# Start without detached mode (see logs)
docker-compose up auth-service
```

#### Stop Services
```bash
# Stop all
docker-compose down

# Stop specific service
docker-compose stop auth-service

# Stop and remove volumes (WARNING: deletes all data)
docker-compose down -v
```

#### Restart Services
```bash
# Restart all
docker-compose restart

# Restart specific service
docker-compose restart auth-service
```

#### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f auth-service

# Last 100 lines
docker-compose logs --tail=100 auth-service
```

#### Check Service Status
```bash
docker-compose ps
```

#### Execute Commands in Container
```bash
# Open shell
docker-compose exec auth-service sh

# Run command
docker-compose exec postgres-auth psql -U ims_user -d auth_db
```

### Database Management

#### Access PostgreSQL
```bash
# Auth database
docker-compose exec postgres-auth psql -U ims_user -d auth_db

# Incidents database
docker-compose exec postgres-incidents psql -U ims_user -d incidents_db
```

#### Backup Database
```bash
# Backup auth database
docker-compose exec postgres-auth pg_dump -U ims_user auth_db > backup_auth.sql

# Backup all databases
for db in auth incidents analytics notifications files workflow reporting; do
  docker-compose exec postgres-${db} pg_dump -U ims_user ${db}_db > backup_${db}.sql
done
```

#### Restore Database
```bash
# Restore auth database
cat backup_auth.sql | docker-compose exec -T postgres-auth psql -U ims_user auth_db
```

### Health Checks

All services include health checks. View health status:
```bash
docker-compose ps
```

Healthy services show "(healthy)" status.

---

## Development Workflow

### Local Development Setup

#### 1. Run Infrastructure Only
```bash
# Start only databases and supporting services
docker-compose up -d postgres-auth postgres-incidents redis rabbitmq elasticsearch minio
```

#### 2. Run Services Locally
```bash
# Navigate to service directory
cd services/auth-service

# Install dependencies
npm install

# Run in development mode
npm run dev
```

#### 3. Run Frontend Locally
```bash
cd frontend
npm install
npm run dev
```

### Hot Reload in Docker

To enable hot reload for development:

1. **Update docker-compose.yml** with volume mounts:
```yaml
auth-service:
  volumes:
    - ./services/auth-service:/app
    - /app/node_modules
  command: npm run dev
```

2. **Restart service**:
```bash
docker-compose restart auth-service
```

### Running Tests

#### Unit Tests
```bash
# Run tests in container
docker-compose exec auth-service npm test

# Run tests locally
cd services/auth-service
npm test
```

#### Integration Tests
```bash
# Ensure services are running
docker-compose up -d

# Run integration tests
npm run test:integration
```

---

## Monitoring & Operations

### Prometheus Metrics

**Access Prometheus**: http://localhost:9090

**Useful Queries:**
```promql
# CPU usage by service
rate(container_cpu_usage_seconds_total[5m])

# Memory usage
container_memory_usage_bytes / container_spec_memory_limit_bytes * 100

# Request rate
rate(http_requests_total[5m])

# Error rate
rate(http_requests_total{status=~"5.."}[5m])
```

### Grafana Dashboards

**Access Grafana**: http://localhost:3001
**Default credentials**: admin / [password from .env]

**Pre-configured Dashboards:**
1. System Overview
2. Service Health
3. Database Performance
4. API Gateway Metrics
5. Error Tracking

### Log Aggregation

#### View All Service Logs
```bash
docker-compose logs -f --tail=100
```

#### View Specific Service
```bash
docker-compose logs -f auth-service incident-service
```

#### Export Logs
```bash
docker-compose logs --no-color > logs_$(date +%Y%m%d_%H%M%S).txt
```

### Resource Monitoring

#### Check Resource Usage
```bash
docker stats

# Or for specific services
docker stats incident-management-auth-service-1
```

#### Disk Usage
```bash
docker system df
```

#### Clean Up
```bash
# Remove unused images
docker image prune -a

# Remove unused volumes
docker volume prune

# Complete cleanup (WARNING: removes everything not running)
docker system prune -a
```

---

## Troubleshooting

### Common Issues

#### 1. Port Already in Use
**Error**: "Bind for 0.0.0.0:3000 failed: port is already allocated"

**Solution**:
```bash
# Find process using port
lsof -i :3000

# Kill process
kill -9 <PID>

# Or change port in docker-compose.yml
ports:
  - "3001:3000"  # Changed external port
```

#### 2. Service Won't Start
**Error**: "Container exited with code 1"

**Solution**:
```bash
# Check logs
docker-compose logs auth-service

# Rebuild service
docker-compose build auth-service
docker-compose up -d auth-service

# Check environment variables
docker-compose exec auth-service env
```

#### 3. Database Connection Failed
**Error**: "ECONNREFUSED ::1:5432"

**Solution**:
```bash
# Ensure database is running
docker-compose ps postgres-auth

# Check database logs
docker-compose logs postgres-auth

# Restart database
docker-compose restart postgres-auth

# Wait for database to be ready
docker-compose exec postgres-auth pg_isready -U ims_user
```

#### 4. Out of Memory
**Error**: "Cannot allocate memory"

**Solution**:
```bash
# Increase Docker memory limit (Docker Desktop)
# Settings → Resources → Memory → 8GB or more

# Or limit service memory in docker-compose.yml
services:
  auth-service:
    deploy:
      resources:
        limits:
          memory: 512M
```

#### 5. Volume Permission Issues
**Error**: "Permission denied"

**Solution**:
```bash
# Fix volume permissions
sudo chown -R $USER:$USER ./volumes

# Or use named volumes instead of bind mounts
```

### Debug Mode

Enable debug logging:
```bash
# Set environment variable
export LOG_LEVEL=debug

# Or in .env file
LOG_LEVEL=debug

# Restart services
docker-compose restart
```

### Service Health Checks

#### Manual Health Check
```bash
# Check API Gateway
curl http://localhost:4000/health

# Check Auth Service
curl http://localhost:5001/health

# Check all services
for port in 4000 5001 5002 5003 5004 5005 5006 5007 5008 5009; do
  echo "Port $port:"
  curl -s http://localhost:$port/health | jq
done
```

---

## Production Deployment

### Pre-Production Checklist

- [ ] All environment variables configured with secure values
- [ ] JWT secrets are cryptographically secure (32+ characters)
- [ ] Database passwords are complex and unique
- [ ] SSL/TLS certificates configured for NGINX
- [ ] Backup strategy implemented
- [ ] Monitoring alerts configured
- [ ] Log aggregation configured
- [ ] Resource limits set for all services
- [ ] Health checks verified
- [ ] Load testing completed

### Security Hardening

#### 1. Update docker-compose.yml for Production
```yaml
services:
  postgres-auth:
    environment:
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
    # Remove exposed ports in production
    # ports:
    #   - "5432:5432"
    networks:
      - ims-network-private  # Use private network
```

#### 2. Configure NGINX with SSL
```bash
# Generate SSL certificates (Let's Encrypt)
certbot certonly --standalone -d yourdomain.com

# Update nginx configuration with SSL
# See nginx.conf for SSL configuration
```

#### 3. Enable Firewall
```bash
# Ubuntu/Debian
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable

# Block direct access to services
sudo ufw deny 5001:5009/tcp
```

#### 4. Configure Secrets Management
Use Docker secrets instead of environment variables:
```yaml
services:
  auth-service:
    secrets:
      - jwt_secret
      - db_password

secrets:
  jwt_secret:
    file: ./secrets/jwt_secret.txt
  db_password:
    file: ./secrets/db_password.txt
```

### Backup Strategy

#### Automated Backup Script
```bash
#!/bin/bash
# backup.sh

BACKUP_DIR="/backups/$(date +%Y%m%d)"
mkdir -p $BACKUP_DIR

# Backup databases
for db in auth incidents analytics notifications files workflow reporting; do
  docker-compose exec postgres-${db} pg_dump -U ims_user ${db}_db | gzip > $BACKUP_DIR/${db}_backup.sql.gz
done

# Backup volumes
tar -czf $BACKUP_DIR/volumes_backup.tar.gz ./volumes

# Retention: keep last 30 days
find /backups -type d -mtime +30 -exec rm -rf {} +
```

#### Schedule with Cron
```bash
# Add to crontab
crontab -e

# Run daily at 2 AM
0 2 * * * /path/to/backup.sh
```

### High Availability Setup

#### 1. Database Replication
Configure PostgreSQL streaming replication:
```yaml
postgres-auth-replica:
  image: postgres:15-alpine
  environment:
    - POSTGRES_REPLICATION_MODE=slave
    - POSTGRES_MASTER_HOST=postgres-auth
```

#### 2. Load Balancing
Use multiple instances of services:
```yaml
auth-service:
  deploy:
    replicas: 3
```

#### 3. Health Monitoring
Configure Prometheus alerts:
```yaml
# alerts.yml
groups:
  - name: service_alerts
    rules:
      - alert: ServiceDown
        expr: up{job="services"} == 0
        for: 5m
        annotations:
          summary: "Service {{ $labels.instance }} is down"
```

### Performance Optimization

#### 1. Enable Caching
Redis configuration for production:
```yaml
redis:
  command: redis-server --maxmemory 2gb --maxmemory-policy allkeys-lru
```

#### 2. Database Optimization
```sql
-- Add indexes for common queries
CREATE INDEX idx_incidents_status ON incidents(status);
CREATE INDEX idx_incidents_created_at ON incidents(created_at DESC);
```

#### 3. Resource Allocation
```yaml
services:
  incident-service:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 1G
        reservations:
          cpus: '0.5'
          memory: 512M
```

---

## Additional Resources

- **Architecture Documentation**: See [MICROSERVICES_ARCHITECTURE.md](./MICROSERVICES_ARCHITECTURE.md)
- **Use Cases**: See [AppReq/](./AppReq/) folder
  - Mining Industry: [MINING_USE_CASES.md](./AppReq/MINING_USE_CASES.md)
  - Healthcare Industry: [HEALTHCARE_USE_CASES.md](./AppReq/HEALTHCARE_USE_CASES.md)
  - Retail Industry: [RETAIL_USE_CASES.md](./AppReq/RETAIL_USE_CASES.md)
- **Application Requirements**: See [AppReq/](./AppReq/) folder for detailed feature specifications

---

## Support & Contribution

For issues, questions, or contributions:
1. Check existing documentation
2. Search through issues
3. Create detailed issue reports
4. Follow contribution guidelines

---

**Last Updated**: 2025-11-09
**Version**: 1.0.0
