# Incident Management System

A comprehensive, feature-rich incident management system designed for **Mining**, **Healthcare**, and **Retail** industries with complete Docker containerization and zero cloud dependencies.

## 🚀 Quick Start

```bash
# 1. Clone repository
git clone <repository-url>
cd IncidentManagement

# 2. Configure environment
cp .env.example .env
# Edit .env with secure passwords

# 3. Start all services
docker-compose up -d

# 4. Access application
# Frontend: http://localhost:3000
# API Gateway: http://localhost:4000
# Grafana Monitoring: http://localhost:3001
```

## 📋 Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Industry-Specific Support](#industry-specific-support)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Documentation](#documentation)
- [Development](#development)
- [Deployment](#deployment)
- [Monitoring](#monitoring)
- [Contributing](#contributing)

## ✨ Features

### Core Capabilities
- ✅ **Anonymous, Guest, and User Reporting** - Multiple reporting modes for flexibility
- ✅ **Multi-Industry Support** - Specialized for Mining, Healthcare, and Retail
- ✅ **Role-Based Access Control** - Granular permissions system
- ✅ **File Attachments** - Virus scanning with ClamAV
- ✅ **Full-Text Search** - Elasticsearch-powered search
- ✅ **Workflow Management** - Approval processes and escalations
- ✅ **Real-Time Notifications** - Email and SMS notifications
- ✅ **Analytics & Reporting** - Comprehensive dashboards and reports
- ✅ **Tracking System** - Track anonymous/guest reports with tracking IDs
- ✅ **Audit Trail** - Complete incident timeline and history

### Technical Features
- 🐳 **Complete Docker Containerization**
- 🔒 **Zero Cloud Dependencies**
- 🏗️ **Microservices Architecture**
- 📊 **Built-in Monitoring** (Prometheus + Grafana)
- 🔍 **Full-Text Search** (Elasticsearch)
- 💾 **Multi-Database Architecture** (7 PostgreSQL instances)
- 🔄 **Event-Driven** (RabbitMQ message broker)
- 📦 **S3-Compatible Storage** (MinIO)
- 🛡️ **Virus Scanning** (ClamAV)

## 🏗️ Architecture

### System Overview
```
┌─────────────────────────────────────────────────────────────────┐
│                         NGINX Reverse Proxy                      │
│                         (Port 80/443)                           │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend (Next.js)                       │
│                         Port 3000                               │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API Gateway (Port 4000)                     │
│                   Authentication & Routing                      │
└─────────────────────────────────────────────────────────────────┘
                                │
                ┌───────────────┴───────────────┐
                ▼                               ▼
┌───────────────────────────┐    ┌───────────────────────────┐
│   Auth Service (5001)     │    │  Incident Service (5002)  │
│   User Service (5003)     │    │  File Storage (5007)      │
│   Org Service (5005)      │    │  Workflow Service (5008)  │
└───────────────────────────┘    └───────────────────────────┘
                │                               │
                ▼                               ▼
┌───────────────────────────┐    ┌───────────────────────────┐
│  Notification Service     │    │  Analytics Service (5006) │
│       (5004)              │    │  Reporting Service (5009) │
└───────────────────────────┘    └───────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Infrastructure Layer                        │
├─────────────────────────────────────────────────────────────────┤
│  PostgreSQL (×7)  │  Redis  │  RabbitMQ  │  Elasticsearch      │
│  MinIO  │  ClamAV  │  Prometheus  │  Grafana                    │
└─────────────────────────────────────────────────────────────────┘
```

### Microservices

| Service | Port | Responsibility |
|---------|------|----------------|
| **Frontend** | 3000 | Next.js UI with TypeScript + Tailwind CSS |
| **API Gateway** | 4000 | Request routing, auth validation, rate limiting |
| **Auth Service** | 5001 | JWT authentication, user sessions |
| **Incident Service** | 5002 | Incident CRUD, lifecycle management |
| **User Service** | 5003 | User profiles, preferences |
| **Notification Service** | 5004 | Email/SMS notifications |
| **Organization Service** | 5005 | Multi-tenancy, org settings |
| **Analytics Service** | 5006 | Metrics, dashboards, KPIs |
| **File Storage Service** | 5007 | File uploads, virus scanning |
| **Workflow Service** | 5008 | Approval workflows, escalations |
| **Reporting Service** | 5009 | Report generation, exports |

### Infrastructure Components

| Component | Purpose |
|-----------|---------|
| **PostgreSQL (7 instances)** | Isolated databases per service domain |
| **Redis** | Session management, caching, job queues |
| **RabbitMQ** | Async messaging between services |
| **Elasticsearch** | Full-text search across incidents |
| **MinIO** | S3-compatible object storage |
| **ClamAV** | Antivirus scanning for uploads |
| **Prometheus** | Metrics collection and alerting |
| **Grafana** | Monitoring dashboards |
| **NGINX** | Reverse proxy, SSL/TLS termination |

## 🏭 Industry-Specific Support

### Mining Industry
**22 Specialized Use Cases:**
- Underground Equipment Fire
- Haul Truck Collision
- Slip/Trip/Fall with Injury
- Chemical Spill
- Confined Space Emergency
- Electrical Shock Incident
- Near Miss - Falling Object
- Environmental Violation
- Equipment Malfunction
- And 13 more specialized categories

**Compliance:**
- MSHA 30 CFR Part 50 reporting
- OSHA recordkeeping
- State mining authority notifications
- Underground location tracking

📖 [Full Mining Use Cases](./AppReq/MINING_USE_CASES.md)

### Healthcare Industry
**20 Specialized Use Cases:**
- Medication Administration Error
- Patient Fall
- Wrong Site Surgery/Procedure
- Healthcare-Associated Infection
- Medical Device Malfunction
- Patient Identification Error
- Pressure Injury Development
- Patient Elopement
- Laboratory Error
- And 11 more specialized categories

**Compliance:**
- HIPAA data protection
- Joint Commission reporting
- FDA MedWatch for device malfunctions
- CMS requirements
- NCC MERP harm classification

📖 [Full Healthcare Use Cases](./AppReq/HEALTHCARE_USE_CASES.md)

### Retail Industry
**20 Specialized Use Cases:**
- Customer Slip/Trip/Fall
- Shoplifting Incident
- Cash Register Discrepancy
- Equipment Malfunction
- Food Safety Incident
- Workplace Violence
- Fire/Evacuation
- Product Recall
- Parking Lot Incident
- And 11 more specialized categories

**Compliance:**
- OSHA workplace injury reporting
- Customer PII protection
- Store-specific incident tracking
- Vendor/contractor incident management

📖 [Full Retail Use Cases](./AppReq/RETAIL_USE_CASES.md)

## 📦 Prerequisites

### Required Software
- **Docker**: 24.0+ ([Install Docker](https://docs.docker.com/get-docker/))
- **Docker Compose**: 2.20+ (included with Docker Desktop)
- **Git**: For source control

### System Requirements
- **RAM**: 8GB minimum (16GB recommended)
- **Disk Space**: 20GB free
- **CPU**: 4 cores recommended
- **OS**: Linux, macOS, or Windows with WSL2

## 🔧 Installation

### 1. Clone Repository
```bash
git clone <repository-url>
cd IncidentManagement
```

### 2. Environment Setup
```bash
# Copy example environment file
cp .env.example .env

# Generate secure passwords (Linux/macOS)
./scripts/generate-secrets.sh

# Or manually edit .env with secure values
nano .env
```

**Required Environment Variables:**
```bash
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
POSTGRES_PASSWORD=secure-postgres-password
REDIS_PASSWORD=secure-redis-password
RABBITMQ_DEFAULT_PASS=secure-rabbitmq-password
ELASTICSEARCH_PASSWORD=secure-elastic-password
MINIO_ROOT_PASSWORD=secure-minio-password
GRAFANA_ADMIN_PASSWORD=secure-grafana-password
```

### 3. Build and Start Services
```bash
# Pull and build all services
docker-compose build

# Start all services
docker-compose up -d

# Check service status
docker-compose ps

# View logs
docker-compose logs -f
```

### 4. Initialize Databases
```bash
# Run database migrations (if applicable)
docker-compose exec incident-service npm run migrate
```

### 5. Access Application
- **Frontend**: http://localhost:3000
- **API Documentation**: http://localhost:4000/api/docs
- **RabbitMQ Management**: http://localhost:15672 (guest/guest)
- **MinIO Console**: http://localhost:9001 (minioadmin/password)
- **Grafana**: http://localhost:3001 (admin/password)
- **Prometheus**: http://localhost:9090

## 📚 Documentation

### Architecture & Design
- [Microservices Architecture](./MICROSERVICES_ARCHITECTURE.md) - Complete system design
- [Deployment Guide](./DEPLOYMENT_GUIDE.md) - Production deployment instructions
- [API Documentation](./docs/API.md) - REST API reference (if available)

### Requirements & Features
- [Project Setup](./AppReq/PROMPT_01_PROJECT_SETUP.md) - Initial setup instructions
- [Authentication System](./AppReq/PROMPT_02_AUTHENTICATION_SYSTEM.md) - Auth implementation
- [Incident Reporting](./AppReq/PROMPT_03_INCIDENT_REPORTING.md) - Core features
- [Dashboard Management](./AppReq/PROMPT_04_DASHBOARD_MANAGEMENT.md) - UI components

### Industry-Specific
- [Mining Use Cases](./AppReq/MINING_USE_CASES.md) - 22 mining-specific scenarios
- [Healthcare Use Cases](./AppReq/HEALTHCARE_USE_CASES.md) - 20 healthcare scenarios
- [Retail Use Cases](./AppReq/RETAIL_USE_CASES.md) - 20 retail scenarios

## 💻 Development

### Local Development Setup

#### Option 1: Full Docker Stack
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f frontend auth-service incident-service
```

#### Option 2: Hybrid (Infrastructure in Docker, Services Local)
```bash
# Start only infrastructure
docker-compose up -d postgres-auth postgres-incidents redis rabbitmq elasticsearch minio

# Run services locally
cd services/auth-service
npm install
npm run dev

cd ../incident-service
npm install
npm run dev
```

### Running Tests
```bash
# Unit tests
docker-compose exec auth-service npm test

# Integration tests
docker-compose exec auth-service npm run test:integration

# E2E tests
npm run test:e2e
```

### Database Access
```bash
# Access auth database
docker-compose exec postgres-auth psql -U ims_user -d auth_db

# Access incidents database
docker-compose exec postgres-incidents psql -U ims_user -d incidents_db
```

### Rebuilding Services
```bash
# Rebuild specific service
docker-compose build auth-service

# Rebuild all services
docker-compose build

# Rebuild without cache
docker-compose build --no-cache
```

## 🚀 Deployment

### Production Checklist
- [ ] Configure secure environment variables
- [ ] Generate strong JWT secrets
- [ ] Set up SSL/TLS certificates
- [ ] Configure firewall rules
- [ ] Set up automated backups
- [ ] Configure log aggregation
- [ ] Set up monitoring alerts
- [ ] Perform load testing
- [ ] Review security hardening

### Deployment Commands
```bash
# Production build
docker-compose -f docker-compose.prod.yml build

# Start in production mode
docker-compose -f docker-compose.prod.yml up -d

# Check health
docker-compose ps
```

### Backup & Restore
```bash
# Backup databases
./scripts/backup-databases.sh

# Restore from backup
./scripts/restore-databases.sh backup_20251109.tar.gz
```

## 📊 Monitoring

### Grafana Dashboards
Access at http://localhost:3001

**Available Dashboards:**
1. System Overview - All services health
2. Service Performance - Response times, throughput
3. Database Metrics - Query performance, connections
4. Infrastructure - CPU, memory, disk usage
5. Error Tracking - Error rates, exceptions

### Prometheus Metrics
Access at http://localhost:9090

**Key Metrics:**
- `http_requests_total` - Total HTTP requests
- `http_request_duration_seconds` - Request latency
- `incident_reports_total` - Total incidents reported
- `incident_reports_by_severity` - Incidents by severity
- `database_connections` - DB connection pool status

### Health Checks
```bash
# Check all services
curl http://localhost:4000/health

# Check specific service
curl http://localhost:5001/health  # Auth Service
curl http://localhost:5002/health  # Incident Service
```

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🆘 Support

- **Documentation**: See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
- **Issues**: Report bugs via GitHub Issues
- **Questions**: See FAQ in deployment guide

## 🎯 Roadmap

### Phase 1 (Current)
- ✅ Core incident reporting
- ✅ Multi-industry support
- ✅ Docker containerization
- ✅ Authentication system

### Phase 2 (Planned)
- [ ] Mobile application (React Native)
- [ ] Advanced analytics with ML
- [ ] Integration APIs for external systems
- [ ] Multi-language support

### Phase 3 (Future)
- [ ] IoT sensor integration
- [ ] Predictive incident prevention
- [ ] Advanced workflow automation
- [ ] Custom reporting builder

## 🙏 Acknowledgments

Built with:
- [Next.js](https://nextjs.org/) - React framework
- [NestJS](https://nestjs.com/) - Node.js framework
- [PostgreSQL](https://www.postgresql.org/) - Database
- [Docker](https://www.docker.com/) - Containerization
- [Elasticsearch](https://www.elastic.co/) - Search engine
- [RabbitMQ](https://www.rabbitmq.com/) - Message broker
- [MinIO](https://min.io/) - Object storage
- [Grafana](https://grafana.com/) - Monitoring

---

**Version**: 1.0.0
**Last Updated**: 2025-11-09
**Status**: Production Ready
