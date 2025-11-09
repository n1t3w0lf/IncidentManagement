# INCIDENT MANAGEMENT SYSTEM - MICROSERVICES ARCHITECTURE

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Microservices Design](#microservices-design)
3. [Infrastructure Components](#infrastructure-components)
4. [Communication Patterns](#communication-patterns)
5. [Data Management](#data-management)
6. [Security Architecture](#security-architecture)
7. [Deployment Strategy](#deployment-strategy)
8. [Monitoring & Observability](#monitoring--observability)
9. [Scalability & High Availability](#scalability--high-availability)

---

## Architecture Overview

### Design Principles

This microservices architecture follows these core principles:

- **Domain-Driven Design (DDD):** Services organized around business capabilities
- **Database per Service:** Each service owns its data
- **API Gateway Pattern:** Single entry point for clients
- **Event-Driven Architecture:** Asynchronous communication via message broker
- **Zero Cloud Dependencies:** Fully self-hosted, runs entirely on Docker
- **Containerization:** All components run in Docker containers
- **Horizontal Scalability:** Services can scale independently

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                        NGINX (Reverse Proxy/LB)                      │
│                           Port: 80, 443                              │
└────────────────┬────────────────────────┬────────────────────────────┘
                 │                        │
        ┌────────▼────────┐      ┌───────▼────────┐
        │  Frontend SPA   │      │  API Gateway   │
        │   (Next.js)     │      │   (Node.js)    │
        │   Port: 3000    │      │   Port: 4000   │
        └─────────────────┘      └───────┬────────┘
                                         │
        ┌────────────────────────────────┼─────────────────────────────┐
        │                                │                             │
┌───────▼────────┐            ┌─────────▼─────────┐         ┌────────▼────────┐
│  Auth Service  │            │ Incident Service  │         │  User Service   │
│   Port: 5001   │            │    Port: 5002     │         │   Port: 5003    │
└───────┬────────┘            └─────────┬─────────┘         └────────┬────────┘
        │                               │                             │
┌───────▼─────────┐          ┌─────────▼──────────┐        ┌────────▼────────┐
│Notification Svc │          │Organization Service│        │ Analytics Svc   │
│   Port: 5004    │          │    Port: 5005      │        │   Port: 5006    │
└───────┬─────────┘          └─────────┬──────────┘        └────────┬────────┘
        │                               │                             │
┌───────▼──────────┐         ┌─────────▼──────────┐        ┌────────▼────────┐
│File Storage Svc  │         │  Workflow Service  │        │ Reporting Svc   │
│   Port: 5007     │         │    Port: 5008      │        │   Port: 5009    │
└──────────────────┘         └────────────────────┘        └─────────────────┘
        │                               │                             │
        └───────────────────────────────┼─────────────────────────────┘
                                        │
        ┌───────────────────────────────┼──────────────────────────────┐
        │                               │                              │
┌───────▼────────┐           ┌─────────▼─────────┐         ┌────────▼────────┐
│  PostgreSQL    │           │      Redis        │         │   RabbitMQ      │
│  (Multiple)    │           │     (Cache)       │         │ (Message Bus)   │
│ Port: 5432+    │           │   Port: 6379      │         │  Port: 5672     │
└────────────────┘           └───────────────────┘         └─────────────────┘

┌────────────────┐           ┌───────────────────┐         ┌─────────────────┐
│     MinIO      │           │  Elasticsearch    │         │   Prometheus    │
│ (S3-compat)    │           │  (Search/Logs)    │         │   (Metrics)     │
│  Port: 9000    │           │   Port: 9200      │         │   Port: 9090    │
└────────────────┘           └───────────────────┘         └─────────────────┘
```

---

## Microservices Design

### Service Catalog

| Service Name | Port | Technology | Database | Purpose |
|-------------|------|------------|----------|---------|
| API Gateway | 4000 | Node.js/Express | Redis (cache) | Request routing, auth validation |
| Auth Service | 5001 | Node.js/NestJS | PostgreSQL (auth_db) | Authentication & authorization |
| Incident Service | 5002 | Node.js/NestJS | PostgreSQL (incident_db) | Incident CRUD & management |
| User Service | 5003 | Node.js/Express | PostgreSQL (auth_db) | User profile management |
| Notification Service | 5004 | Node.js | PostgreSQL (notification_db) | Multi-channel notifications |
| Organization Service | 5005 | Node.js | PostgreSQL (auth_db) | Organization management |
| Analytics Service | 5006 | Node.js/Python | PostgreSQL+TimescaleDB | Metrics & reporting |
| File Storage Service | 5007 | Node.js | PostgreSQL (file_db) + MinIO | File upload/download |
| Workflow Service | 5008 | Node.js | PostgreSQL (workflow_db) | Status workflows & approvals |
| Reporting Service | 5009 | Node.js | PostgreSQL (reporting_db) | Regulatory reports |

---

### 1. API Gateway Service

**Responsibilities:**
- Single entry point for all client requests
- Request routing to appropriate microservices
- JWT authentication verification
- Rate limiting and throttling
- Request/response transformation
- CORS handling
- Circuit breaker implementation

**Key Features:**
- Stateless design (horizontally scalable)
- Redis-backed rate limiting
- Health check aggregation
- Request logging

**Technology Stack:**
- Runtime: Node.js 20
- Framework: Express.js or Fastify
- Authentication: JWT verification (jose library)
- Rate Limiting: express-rate-limit + Redis
- Circuit Breaker: opossum

**API Routes:**
```
POST   /api/v1/auth/*           → Auth Service
GET    /api/v1/incidents/*      → Incident Service
POST   /api/v1/incidents/*      → Incident Service
GET    /api/v1/users/*          → User Service
GET    /api/v1/organizations/*  → Organization Service
POST   /api/v1/notifications/*  → Notification Service
GET    /api/v1/analytics/*      → Analytics Service
POST   /api/v1/files/*          → File Storage Service
GET    /api/v1/workflows/*      → Workflow Service
GET    /api/v1/reports/*        → Reporting Service
```

---

### 2. Authentication & Authorization Service

**Responsibilities:**
- User authentication (login, logout, registration)
- JWT token generation and validation
- Refresh token management
- Password hashing and verification
- Role-Based Access Control (RBAC)
- Multi-factor authentication (MFA)
- Session management
- Account security policies

**Database Schema:**
```sql
-- Tables: users, roles, permissions, role_permissions,
--         user_roles, sessions, refresh_tokens,
--         password_reset_tokens, audit_logs
```

**Key Endpoints:**
```
POST   /api/auth/register              - User registration
POST   /api/auth/login                 - User login
POST   /api/auth/logout                - User logout
POST   /api/auth/refresh               - Refresh access token
POST   /api/auth/verify-token          - Verify JWT token
GET    /api/auth/me                    - Get current user
POST   /api/auth/forgot-password       - Request password reset
POST   /api/auth/reset-password        - Reset password
GET    /api/auth/permissions/:userId   - Get user permissions
```

**Security Features:**
- Bcrypt password hashing (12 rounds)
- JWT with 15-minute expiration
- Refresh tokens with 7-day expiration
- Rate limiting (5 login attempts per 15 minutes)
- Account lockout after failed attempts
- Comprehensive audit logging

**Events Published:**
- `user.registered` → Notification Service
- `user.login.failed` → Security monitoring
- `password.reset.requested` → Notification Service

---

### 3. Incident Management Service

**Responsibilities:**
- Create, read, update, delete incidents
- Industry-specific categorization (Healthcare, Mining, Retail)
- Dynamic field validation per category
- Incident status workflow management
- Tracking ID generation
- Timeline and activity tracking
- Tag management
- Search and filtering
- Bulk operations

**Database Schema:**
```sql
-- Tables: incidents, incident_categories, incident_timeline,
--         incident_attachments, incident_tags,
--         incident_custom_fields, incident_assignments,
--         incident_comments, incident_status_history
```

**Key Endpoints:**
```
POST   /api/incidents                     - Create incident
GET    /api/incidents                     - List incidents (with filters)
GET    /api/incidents/:id                 - Get incident by ID
PUT    /api/incidents/:id                 - Update incident
PATCH  /api/incidents/:id/status          - Update incident status
DELETE /api/incidents/:id                 - Soft delete incident
GET    /api/incidents/track/:trackingId   - Track by tracking ID
POST   /api/incidents/:id/assign          - Assign incident
POST   /api/incidents/:id/comments        - Add comment
GET    /api/incidents/:id/timeline        - Get timeline
POST   /api/incidents/:id/attachments     - Upload attachment
GET    /api/incidents/categories          - Get categories
POST   /api/incidents/bulk                - Bulk create
GET    /api/incidents/export              - Export (CSV/Excel)
GET    /api/incidents/stats               - Statistics
```

**Industry-Specific Categories:**
- **Healthcare:** 20+ categories (Medication errors, Patient falls, etc.)
- **Mining:** 22+ categories (Equipment fires, Ground falls, etc.)
- **Retail:** 20+ categories (Customer injuries, Shoplifting, etc.)

**Events Published:**
- `incident.created` → Notification, Analytics
- `incident.updated` → Notification, Analytics
- `incident.status.changed` → Workflow, Notification
- `incident.assigned` → Notification
- `incident.comment.added` → Notification

**Scaling Strategy:**
- Horizontal scaling (2-5 instances)
- Elasticsearch for search offloading
- Redis caching for frequent queries
- Database read replicas
- Async job processing (export, bulk updates)

---

### 4. User Management Service

**Responsibilities:**
- User profile CRUD operations
- User role assignment
- User permissions management
- User search and filtering
- User activity tracking
- User preferences management
- User invitation and onboarding

**Key Endpoints:**
```
GET    /api/users                    - List users
GET    /api/users/:id                - Get user by ID
PUT    /api/users/:id                - Update user profile
DELETE /api/users/:id                - Deactivate user
POST   /api/users/:id/roles          - Assign role
DELETE /api/users/:id/roles/:roleId  - Remove role
GET    /api/users/:id/permissions    - Get permissions
POST   /api/users/invite             - Invite new user
GET    /api/users/:id/activity       - Get activity log
PUT    /api/users/:id/preferences    - Update preferences
```

**Events Published:**
- `user.updated` → Auth Service, Analytics
- `user.role.changed` → Auth Service
- `user.invited` → Notification Service
- `user.deactivated` → Auth Service

---

### 5. Notification Service

**Responsibilities:**
- Email notifications (SMTP)
- SMS notifications (Twilio-compatible)
- In-app notifications
- Push notifications
- Template management
- Notification scheduling
- User notification preferences
- Delivery tracking and retry logic

**Notification Channels:**
- **Email:** Nodemailer + self-hosted SMTP
- **SMS:** Twilio SDK or open-source alternative
- **In-App:** WebSocket for real-time delivery
- **Push:** Firebase Cloud Messaging (optional)

**Key Endpoints:**
```
POST   /api/notifications/email           - Send email
POST   /api/notifications/sms             - Send SMS
POST   /api/notifications/in-app          - Create in-app notification
GET    /api/notifications/user/:userId    - Get user notifications
PUT    /api/notifications/:id/read        - Mark as read
POST   /api/notifications/templates       - Create template
GET    /api/notifications/preferences/:userId - Get preferences
PUT    /api/notifications/preferences/:userId - Update preferences
```

**Events Consumed:**
- `user.registered` → Send welcome email
- `incident.created` → Notify relevant users
- `incident.assigned` → Notify assignee
- `incident.status.changed` → Notify stakeholders
- `password.reset.requested` → Send reset link

**Template Variables:**
```handlebars
{{user.firstName}} {{user.lastName}}
{{incident.title}}
{{incident.trackingId}}
{{incident.severity}}
{{organization.name}}
```

---

### 6. Organization Service

**Responsibilities:**
- Organization CRUD operations
- Multi-tenancy support
- Organization settings management
- Industry type configuration
- Organization membership
- Branding and customization
- Subscription/limits management

**Key Endpoints:**
```
POST   /api/organizations                - Create organization
GET    /api/organizations/:id            - Get organization
PUT    /api/organizations/:id            - Update organization
DELETE /api/organizations/:id            - Delete organization
GET    /api/organizations/:id/members    - List members
POST   /api/organizations/:id/members    - Add member
DELETE /api/organizations/:id/members/:userId - Remove member
GET    /api/organizations/:id/settings   - Get settings
PUT    /api/organizations/:id/settings   - Update settings
```

**Organization Settings:**
```json
{
  "industryType": "healthcare|mining|retail",
  "allowAnonymousReporting": true,
  "allowGuestReporting": true,
  "requireApproval": true,
  "branding": {
    "logo": "url",
    "primaryColor": "#3b82f6",
    "companyName": "ACME Corporation"
  },
  "notifications": {
    "emailEnabled": true,
    "smsEnabled": false
  },
  "compliance": {
    "retentionDays": 2555,
    "regulatoryFramework": ["MSHA", "OSHA"]
  }
}
```

---

### 7. Analytics & Reporting Service

**Responsibilities:**
- Real-time dashboard metrics
- Trend analysis and visualization
- KPI calculation
- Report generation (PDF, Excel, CSV)
- Compliance reporting
- Predictive analytics (optional)
- Time-series data aggregation

**Database:**
- PostgreSQL with TimescaleDB extension for time-series optimization

**Key Endpoints:**
```
GET    /api/analytics/dashboard           - Dashboard metrics
GET    /api/analytics/incidents/stats     - Incident statistics
GET    /api/analytics/incidents/trends    - Trends over time
GET    /api/analytics/severity-breakdown  - Severity distribution
GET    /api/analytics/status-breakdown    - Status distribution
GET    /api/analytics/category-stats      - Category statistics
POST   /api/analytics/reports/generate    - Generate custom report
GET    /api/analytics/reports/:id         - Download report
POST   /api/analytics/reports/schedule    - Schedule recurring report
GET    /api/analytics/regulatory/:type    - Regulatory report
```

**Metrics Tracked:**
- Total incidents (by time period)
- Open vs. closed incidents
- Average resolution time
- Incidents by severity
- Incidents by category
- Incidents by department/location
- Compliance metrics (MSHA, OSHA, Joint Commission)

**Events Consumed:**
- `incident.created` → Update metrics
- `incident.updated` → Update metrics
- `incident.closed` → Calculate resolution time

---

### 8. File Storage Service

**Responsibilities:**
- File upload handling
- File storage management (MinIO)
- File retrieval and download
- Image resizing and optimization
- File type validation
- Virus scanning (ClamAV)
- File metadata management
- Storage quota management

**Storage Backend:**
- **MinIO:** S3-compatible object storage
- **Buckets:** incident-attachments, user-avatars, reports

**Key Endpoints:**
```
POST   /api/files/upload                 - Upload file
GET    /api/files/:id                    - Get file
DELETE /api/files/:id                    - Delete file
GET    /api/files/:id/metadata           - Get metadata
POST   /api/files/:id/versions           - Upload new version
GET    /api/files/:id/download           - Download file
POST   /api/files/bulk-upload            - Bulk upload
GET    /api/files/scan-status/:id        - Virus scan status
```

**Security Features:**
- File type whitelisting (images, PDFs, Office docs)
- Size limits (10MB default, configurable)
- Virus scanning before storage (ClamAV)
- Signed URLs for secure access
- Access control via JWT

**Supported File Types:**
```
Images: .jpg, .jpeg, .png, .gif
Documents: .pdf, .doc, .docx, .xls, .xlsx
Text: .txt, .csv
Max Size: 10MB per file
```

---

### 9. Workflow & Approval Service

**Responsibilities:**
- Incident status workflow management
- Approval chain configuration
- Status transition validation
- Workflow rules engine
- Escalation management
- SLA tracking and enforcement
- Automated actions based on status

**Workflow States:**
```
draft → submitted → under_review → investigating →
pending_approval → approved → in_progress → resolved → closed
```

**Key Endpoints:**
```
GET    /api/workflows                       - List workflows
POST   /api/workflows                       - Create workflow
GET    /api/workflows/:id                   - Get workflow
PUT    /api/workflows/:id                   - Update workflow
POST   /api/workflows/validate-transition   - Validate transition
POST   /api/workflows/incidents/:id/transition - Transition incident
GET    /api/workflows/approvals/pending     - Pending approvals
POST   /api/workflows/approvals/:id/approve - Approve
POST   /api/workflows/approvals/:id/reject  - Reject
GET    /api/workflows/sla/:incidentId       - SLA status
```

**Events Published:**
- `workflow.transitioned` → Incident Service
- `approval.required` → Notification Service
- `sla.breached` → Notification Service

---

### 10. Reporting Service (Regulatory Compliance)

**Responsibilities:**
- Regulatory report generation
  - **Mining:** MSHA, OSHA reports
  - **Healthcare:** Joint Commission, FDA reports
  - **Retail:** OSHA, local authority reports
- Compliance form generation
- Export formats (PDF, Excel, XML)
- Scheduled report generation
- Document retention management

**Key Endpoints:**
```
GET    /api/reports/templates                - List templates
POST   /api/reports/generate                 - Generate report
GET    /api/reports/:id                      - Get generated report
POST   /api/reports/schedule                 - Schedule recurring
GET    /api/reports/regulatory/:type         - Generate regulatory
POST   /api/reports/submit                   - Submit to authority
GET    /api/reports/retention                - Retention policy
```

**Report Templates:**
- MSHA Form 7000-1 (Mining accidents)
- OSHA 300 Log (Work-related injuries)
- Joint Commission RCA (Root cause analysis)
- FDA MedWatch (Medical device events)
- Custom templates per organization

---

## Infrastructure Components

### Database Architecture

**Database per Service Pattern:**

| Database | Port | Service(s) | Purpose |
|----------|------|-----------|---------|
| postgres-auth | 5432 | Auth, User, Organization | User & org data |
| postgres-incidents | 5433 | Incident | Incident data |
| postgres-analytics | 5434 | Analytics | Time-series metrics (TimescaleDB) |
| postgres-notifications | 5435 | Notification | Notification logs |
| postgres-files | 5436 | File Storage | File metadata |
| postgres-workflow | 5437 | Workflow | Workflow definitions |
| postgres-reporting | 5438 | Reporting | Report templates & logs |

**Why Multiple Databases?**
- Service independence
- Independent scaling
- Isolated failure domains
- Technology flexibility

---

### Redis (Cache & Queue)

**Purpose:**
- Application caching (user sessions, frequently accessed data)
- Job queues (Bull for async processing)
- Rate limiting counters
- Pub/Sub for real-time features

**Cache Strategy:**
- **User Data:** TTL 15 minutes
- **Organization Data:** TTL 1 hour
- **Incident Categories:** TTL 24 hours
- **Dashboard Metrics:** TTL 5 minutes

---

### RabbitMQ (Message Broker)

**Purpose:**
- Asynchronous event-driven communication
- Decoupling microservices
- Guaranteed message delivery
- Dead letter queues for failed messages

**Exchanges and Queues:**

| Exchange | Type | Queues | Consumers |
|----------|------|--------|-----------|
| incident.events | topic | incident.created, incident.updated | Notification, Analytics |
| user.events | topic | user.registered, user.updated | Notification, Analytics |
| notification.events | topic | email.send, sms.send | Notification workers |
| workflow.events | topic | workflow.transitioned | Incident, Notification |

**Message Format:**
```json
{
  "eventType": "incident.created",
  "timestamp": "2025-01-10T12:00:00Z",
  "data": {
    "incidentId": "incident_123",
    "organizationId": "org_456",
    "severity": "high",
    "category": "healthcare_medication_error"
  },
  "metadata": {
    "userId": "user_789",
    "correlationId": "uuid"
  }
}
```

---

### MinIO (Object Storage)

**Purpose:**
- S3-compatible object storage
- File storage for incident attachments
- User avatars
- Generated reports

**Buckets:**
- `incident-attachments` - Incident photos, documents
- `user-avatars` - User profile pictures
- `generated-reports` - PDF/Excel reports
- `regulatory-documents` - Compliance documentation

**Features:**
- Versioning enabled
- Lifecycle policies (auto-delete old versions)
- Encryption at rest
- Access policies per bucket

---

### Elasticsearch (Search & Logging)

**Purpose:**
- Full-text search for incidents
- Log aggregation (ELK stack)
- Analytics queries

**Indices:**
- `incidents` - Full-text search index
- `logs-*` - Application logs
- `metrics-*` - Performance metrics

**Search Capabilities:**
- Full-text search across incident titles, descriptions
- Faceted search (filter by category, severity, status)
- Autocomplete suggestions
- Fuzzy matching

---

### Monitoring Stack

**Prometheus (Metrics):**
- Collects metrics from all services
- Time-series database
- Alerting based on thresholds

**Grafana (Visualization):**
- Dashboard visualization
- Alerts and notifications
- Custom dashboards per service

**Metrics Exposed:**
- HTTP request duration, count, status codes
- Database query performance
- Queue processing metrics
- Business metrics (incidents created, resolution time)

---

## Communication Patterns

### Synchronous Communication (REST/HTTP)

**When to Use:**
- Client-to-API Gateway (always)
- API Gateway to services (read operations)
- Service-to-service for immediate responses

**Example Flow:**
```
Client → API Gateway → Auth Service (verify token) → Response
Client → API Gateway → Incident Service (get incident) → Response
```

---

### Asynchronous Communication (Events via RabbitMQ)

**When to Use:**
- Fire-and-forget operations
- Notifications
- Data synchronization
- Long-running processes

**Example Flow:**
```
Incident Service → (publishes) → incident.created event
                              → Notification Service (consumes) → Send email
                              → Analytics Service (consumes) → Update metrics
```

**Event Naming Convention:**
```
<entity>.<action>
Examples: incident.created, user.registered, workflow.transitioned
```

---

### Request-Response vs. Event-Driven

| Pattern | Use Case | Example |
|---------|----------|---------|
| Request-Response | Get user details | API Gateway → User Service |
| Request-Response | Create incident | Client → API Gateway → Incident Service |
| Event-Driven | Send notification | Incident Service → (event) → Notification Service |
| Event-Driven | Update analytics | Incident Service → (event) → Analytics Service |

---

## Data Management

### Data Consistency Strategies

**1. Strong Consistency (ACID Transactions):**
- Used within a single service
- Database transactions for critical operations
- Example: User registration (create user + assign role)

**2. Eventual Consistency:**
- Used across services
- Events propagated asynchronously
- Acceptable delay: <5 seconds
- Example: Analytics updated after incident created

**3. Saga Pattern:**
- For multi-service transactions
- Compensating transactions on failure
- Example: User registration → Create user → Send email (if email fails, mark user as unverified)

---

### Database Migration Strategy

**Tools:**
- **Prisma Migrate:** Schema migrations for PostgreSQL
- **Flyway:** Alternative migration tool

**Migration Process:**
1. Write migration scripts
2. Test in development
3. Apply to production with rollback plan
4. Backward-compatible changes first

**Example Migration:**
```sql
-- migrations/001_create_incidents_table.sql
CREATE TABLE incidents (
  id VARCHAR(255) PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  description TEXT NOT NULL,
  severity VARCHAR(50) NOT NULL,
  status VARCHAR(50) NOT NULL,
  organization_id VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_incidents_org ON incidents(organization_id);
CREATE INDEX idx_incidents_status ON incidents(status);
CREATE INDEX idx_incidents_created_at ON incidents(created_at);
```

---

### Data Retention and Archiving

**Retention Policies:**

| Industry | Retention Period | Regulatory Requirement |
|----------|------------------|------------------------|
| Healthcare | 7-10 years | HIPAA, Joint Commission |
| Mining | 30+ years | MSHA recordkeeping |
| Retail | 5-7 years | OSHA, local laws |

**Archiving Strategy:**
1. Identify old incidents (based on retention policy)
2. Export to long-term storage (MinIO cold storage)
3. Soft delete from active database
4. Maintain index for retrieval if needed

---

## Security Architecture

### Authentication Flow

```
1. User submits credentials
   ↓
2. Frontend → API Gateway → Auth Service
   ↓
3. Auth Service validates credentials
   ↓
4. Generate JWT (access token: 15min, refresh token: 7 days)
   ↓
5. Return tokens to client
   ↓
6. Client stores tokens (localStorage or httpOnly cookie)
   ↓
7. Subsequent requests include JWT in Authorization header
   ↓
8. API Gateway validates JWT before routing
```

### Authorization (RBAC)

**Roles:**
- **Super Admin:** Full system access
- **Admin:** Organization-level admin
- **Manager:** View and manage incidents
- **User:** Create and view own incidents
- **Reporter:** Create incidents only

**Permissions Matrix:**

| Resource | Super Admin | Admin | Manager | User | Reporter |
|----------|-------------|-------|---------|------|----------|
| Users | CRUD | CRUD (org) | R | R (self) | - |
| Incidents | CRUD | CRUD (org) | RU (org) | CR (own) | C |
| Organizations | CRUD | RU (own) | R (own) | R (own) | - |
| Analytics | R | R (org) | R (org) | R (limited) | - |
| Settings | CRUD | RU (org) | - | - | - |

**Permission Check:**
```javascript
// Example: Check if user can update incident
if (user.role === 'admin' ||
    (user.role === 'manager' && incident.organizationId === user.organizationId) ||
    (user.role === 'user' && incident.reporterInfo.userId === user.id)) {
  // Allow update
} else {
  // Deny
}
```

---

### Data Encryption

**At Rest:**
- PostgreSQL: Transparent Data Encryption (TDE) or encrypted volumes
- MinIO: Server-side encryption (SSE)
- Backups: Encrypted with GPG

**In Transit:**
- HTTPS/TLS for all external connections
- Internal service-to-service can use HTTP (within Docker network)

**Secrets Management:**
- Environment variables via `.env` file
- Docker secrets for production
- Rotate secrets regularly

---

### API Security Best Practices

1. **Rate Limiting:** 100 requests per minute per IP
2. **Input Validation:** Validate all inputs (Joi/Zod schemas)
3. **SQL Injection Prevention:** Use ORM parameterized queries
4. **XSS Prevention:** Sanitize outputs, use Content-Security-Policy
5. **CSRF Protection:** CSRF tokens for state-changing operations
6. **CORS:** Whitelist allowed origins
7. **Security Headers:** helmet.js middleware

---

## Deployment Strategy

### Prerequisites

**System Requirements:**
- **CPU:** 16+ cores
- **RAM:** 64GB+
- **Storage:** 1TB SSD
- **OS:** Linux (Ubuntu 22.04 LTS recommended)
- **Docker:** 24.0+
- **Docker Compose:** 2.20+

---

### Environment Variables

**Create `.env` file:**
```bash
# PostgreSQL
POSTGRES_PASSWORD=your_secure_password_here

# Redis
REDIS_PASSWORD=your_redis_password

# RabbitMQ
RABBITMQ_USER=admin
RABBITMQ_PASS=your_rabbitmq_password

# JWT Secrets
JWT_SECRET=your_jwt_secret_min_32_chars
JWT_REFRESH_SECRET=your_jwt_refresh_secret

# MinIO
MINIO_ROOT_USER=admin
MINIO_ROOT_PASSWORD=your_minio_password

# SMTP (for email notifications)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=notifications@example.com
SMTP_PASS=your_smtp_password

# SMS Provider (optional)
SMS_API_KEY=your_sms_api_key

# Grafana
GRAFANA_PASSWORD=your_grafana_password
```

---

### Deployment Steps

**1. Clone Repository:**
```bash
git clone https://github.com/your-org/incident-management-system.git
cd incident-management-system
```

**2. Configure Environment:**
```bash
cp .env.example .env
nano .env  # Edit with your values
```

**3. Build and Start Services:**
```bash
# Build all services
docker-compose build

# Start infrastructure first
docker-compose up -d postgres-auth postgres-incidents postgres-analytics \
  redis rabbitmq elasticsearch minio

# Wait for databases to be ready
sleep 30

# Run database migrations
docker-compose run --rm auth-service npm run migrate
docker-compose run --rm incident-service npm run migrate
docker-compose run --rm analytics-service npm run migrate

# Start all services
docker-compose up -d
```

**4. Verify Deployment:**
```bash
# Check all services are running
docker-compose ps

# Check logs
docker-compose logs -f api-gateway

# Health checks
curl http://localhost:4000/health
```

**5. Access Application:**
- **Frontend:** http://localhost
- **API Gateway:** http://localhost:4000
- **RabbitMQ Management:** http://localhost:15672 (admin/password)
- **MinIO Console:** http://localhost:9001 (admin/password)
- **Grafana:** http://localhost:3002 (admin/password)

---

### Zero-Downtime Updates

**Rolling Update Strategy:**
```bash
# Update a single service
docker-compose up -d --no-deps --build incident-service

# Docker will:
# 1. Build new image
# 2. Create new container
# 3. Wait for health check to pass
# 4. Stop old container
# 5. Remove old container
```

---

### Backup and Restore

**Automated Backup Script:**
```bash
#!/bin/bash
# /scripts/backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR=/backups/$DATE
mkdir -p $BACKUP_DIR

# Backup PostgreSQL databases
for DB in auth_db incident_db analytics_db notification_db file_db workflow_db reporting_db; do
  docker exec ims-postgres-${DB%-*} pg_dump -U ims_user $DB | gzip > $BACKUP_DIR/$DB.sql.gz
done

# Backup MinIO
docker exec ims-minio mc mirror /data $BACKUP_DIR/minio

# Backup Redis
docker exec ims-redis redis-cli --rdb /data/dump.rdb
docker cp ims-redis:/data/dump.rdb $BACKUP_DIR/

# Cleanup old backups (keep last 30 days)
find /backups -type d -mtime +30 -exec rm -rf {} \;
```

**Schedule Backups (crontab):**
```bash
0 2 * * * /scripts/backup.sh
```

**Restore from Backup:**
```bash
#!/bin/bash
# /scripts/restore.sh

BACKUP_DATE=$1  # e.g., 20250110_020000

# Restore PostgreSQL
for DB in auth_db incident_db analytics_db; do
  gunzip < /backups/$BACKUP_DATE/${DB}.sql.gz | \
  docker exec -i ims-postgres-${DB%-*} psql -U ims_user $DB
done

# Restore MinIO
docker exec ims-minio mc mirror /backups/$BACKUP_DATE/minio /data

# Restore Redis
docker cp /backups/$BACKUP_DATE/dump.rdb ims-redis:/data/
docker restart ims-redis
```

---

## Monitoring & Observability

### Metrics Collection (Prometheus)

**Service Metrics Endpoint:**
Each service exposes `/metrics` endpoint:

```javascript
// Example: incident-service metrics
const promClient = require('prom-client');
const register = new promClient.Registry();

// Metrics
const httpRequestDuration = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register]
});

const incidentsCreated = new promClient.Counter({
  name: 'incidents_created_total',
  help: 'Total number of incidents created',
  labelNames: ['severity', 'category'],
  registers: [register]
});

// Expose metrics
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});
```

**Prometheus Configuration:**
```yaml
# prometheus/prometheus.yml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'api-gateway'
    static_configs:
      - targets: ['api-gateway:4000']

  - job_name: 'auth-service'
    static_configs:
      - targets: ['auth-service:5001']

  - job_name: 'incident-service'
    static_configs:
      - targets: ['incident-service:5002']

  # ... other services
```

---

### Logging (Elasticsearch + Kibana)

**Centralized Logging:**
All services log to stdout/stderr, collected by Docker logging driver.

**Log Format (JSON):**
```json
{
  "timestamp": "2025-01-10T12:00:00Z",
  "level": "INFO",
  "service": "incident-service",
  "message": "Incident created",
  "context": {
    "incidentId": "incident_123",
    "userId": "user_456",
    "organizationId": "org_789"
  },
  "correlationId": "uuid"
}
```

**Filebeat Configuration:**
```yaml
# filebeat/filebeat.yml
filebeat.inputs:
  - type: container
    paths:
      - '/var/lib/docker/containers/*/*.log'

output.elasticsearch:
  hosts: ["elasticsearch:9200"]
  index: "logs-%{+yyyy.MM.dd}"
```

---

### Alerting

**Prometheus Alert Rules:**
```yaml
# prometheus/alerts.yml
groups:
  - name: incident_service_alerts
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status_code=~"5.."}[5m]) > 0.05
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "High error rate on {{ $labels.service }}"

      - alert: DatabaseConnectionPoolExhausted
        expr: db_connections_active / db_connections_max > 0.9
        for: 2m
        labels:
          severity: warning
        annotations:
          summary: "Database connection pool nearly exhausted"
```

---

## Scalability & High Availability

### Horizontal Scaling

**Stateless Services (Easy to Scale):**
- API Gateway (2-3 instances)
- Incident Service (2-5 instances)
- Notification Service (2-3 instances)
- Analytics Service (1-2 instances)

**Docker Compose Scaling:**
```bash
docker-compose up -d --scale incident-service=3
```

**With Deploy Configuration:**
```yaml
services:
  incident-service:
    deploy:
      replicas: 3
      update_config:
        parallelism: 1
        delay: 10s
      restart_policy:
        condition: on-failure
```

---

### Database Scaling

**Read Replicas:**
```yaml
postgres-incidents-replica:
  image: postgres:15-alpine
  environment:
    - POSTGRES_USER=ims_user
    - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
    - PGDATA=/var/lib/postgresql/data/pgdata
  command: |
    postgres -c 'hot_standby=on' -c 'wal_level=replica'
```

**Connection Pooling:**
Use PgBouncer for connection pooling:
```yaml
pgbouncer:
  image: pgbouncer/pgbouncer
  environment:
    - DATABASES=incident_db=host=postgres-incidents port=5432 dbname=incident_db
    - POOL_MODE=transaction
    - MAX_CLIENT_CONN=1000
    - DEFAULT_POOL_SIZE=25
```

---

### Load Balancing (NGINX)

```nginx
upstream api_gateway {
    least_conn;  # Load balancing algorithm
    server api-gateway-1:4000 max_fails=3 fail_timeout=30s;
    server api-gateway-2:4000 max_fails=3 fail_timeout=30s;
    server api-gateway-3:4000 max_fails=3 fail_timeout=30s;
}

server {
    listen 80;

    location /api/ {
        proxy_pass http://api_gateway/;
        proxy_http_version 1.1;
        proxy_set_header Connection "";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

        # Health check
        proxy_next_upstream error timeout http_500 http_502 http_503;
    }
}
```

---

### High Availability Strategies

**1. Service Redundancy:**
- Run multiple instances of each service
- Load balancer distributes traffic
- Automatic failover

**2. Database HA:**
- PostgreSQL streaming replication
- Automatic failover with Patroni or Stolon
- Regular backups

**3. Message Queue HA:**
- RabbitMQ clustering (3 nodes)
- Mirrored queues
- Automatic leader election

**4. Redis HA:**
- Redis Sentinel for automatic failover
- Redis Cluster for sharding (if needed)

**5. MinIO HA:**
- Distributed mode (4+ nodes)
- Erasure coding for data protection

---

## Migration from Monolith

### Strangler Fig Pattern

**Phase 1: API Gateway Setup**
- Deploy API Gateway
- Route all traffic through gateway
- Monolith remains backend

**Phase 2: Extract Services One-by-One**
1. Auth Service → Migrate authentication
2. Incident Service → Migrate incident management
3. User Service → Migrate user management
4. Continue with other services

**Phase 3: Data Migration**
- Dual-write to both old and new databases
- Background sync of historical data
- Switch reads to new database
- Stop writes to old database

**Phase 4: Decommission Monolith**
- Verify all functionality migrated
- Monitor for any issues
- Shut down monolithic application

---

## Disaster Recovery

### RTO (Recovery Time Objective): < 1 hour
### RPO (Recovery Point Objective): < 15 minutes

**DR Plan:**

1. **Infrastructure Failure:**
   - Spin up Docker Compose on backup server
   - Restore latest backups
   - Update DNS

2. **Database Corruption:**
   - Stop affected service
   - Restore from backup
   - Replay WAL logs (PITR)
   - Verify data integrity

3. **Service Failure:**
   - Docker auto-restart
   - If persistent, rollback to previous version

---

## Conclusion

This microservices architecture provides:
- **Scalability:** Independent scaling of services
- **Resilience:** Fault isolation, automatic recovery
- **Flexibility:** Technology diversity, easy updates
- **Maintainability:** Clear service boundaries
- **Zero Cloud Dependencies:** Fully self-hosted solution

**Next Steps:**
1. Review architecture documentation
2. Set up development environment
3. Implement services incrementally
4. Deploy to production with monitoring

---

**Document Version:** 1.0
**Last Updated:** 2025-01-10
**Prepared By:** Senior Application Architect
**Review Cycle:** Quarterly
