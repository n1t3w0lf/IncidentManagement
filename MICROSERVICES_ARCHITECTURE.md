# 🏗️ MICROSERVICES ARCHITECTURE (MSW Pattern)

## Overview

This incident management system uses a **frontend-first microservices architecture** powered by **Mock Service Worker (MSW)** for rapid prototyping. All "backend" logic runs in the browser through service workers, with data persisting in localStorage.

---

## 🎯 Architecture Principles

1. **Frontend-First Development** - Build UI and APIs simultaneously
2. **MSW Microservices** - Each domain has its own MSW handler (simulates real microservice)
3. **localStorage Persistence** - All test data survives page refreshes
4. **Zero Backend Required** - No server setup, no database configuration
5. **Rapid Prototyping** - Change API behavior instantly by editing handlers
6. **Easy Migration Path** - Replace MSW handlers with real APIs later

---

## 📐 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     BROWSER (localhost:3000)                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │            FRONTEND (Next.js + React)                 │ │
│  │                                                       │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐           │ │
│  │  │ Pages    │  │Components│  │  Stores  │           │ │
│  │  └────┬─────┘  └────┬─────┘  └────┬─────┘           │ │
│  │       │             │              │                  │ │
│  │       └─────────────┴──────────────┘                  │ │
│  │                     │                                  │ │
│  │                     ▼                                  │ │
│  │  ┌──────────────────────────────────────────────────┐ │ │
│  │  │           SERVICE LAYER                          │ │ │
│  │  │  ┌─────────────┐  ┌──────────────┐              │ │ │
│  │  │  │auth.service │  │incident.     │  ...          │ │ │
│  │  │  │             │  │service       │              │ │ │
│  │  │  └──────┬──────┘  └──────┬───────┘              │ │ │
│  │  └─────────┼─────────────────┼───────────────────────┘ │ │
│  └────────────┼─────────────────┼────────────────────────┘ │
│               │                 │                          │
│               │  HTTP Requests  │                          │
│               ▼                 ▼                          │
│  ┌───────────────────────────────────────────────────────┐ │
│  │        MSW (Mock Service Worker)                      │ │
│  │        Intercepts fetch/axios requests to /api/*      │ │
│  └───────────────────────────┬───────────────────────────┘ │
│                               │                            │
│         ┌─────────────────────┴──────────────────┐        │
│         │                                        │        │
│         ▼                                        ▼        │
│  ┌────────────────┐  ┌────────────────┐  ┌──────────────┐│
│  │  MICROSERVICE  │  │  MICROSERVICE  │  │ MICROSERVICE ││
│  │  HANDLERS      │  │  HANDLERS      │  │  HANDLERS    ││
│  ├────────────────┤  ├────────────────┤  ├──────────────┤│
│  │ Auth           │  │ Incidents      │  │ Users        ││
│  │ /api/auth/*    │  │ /api/incidents*│  │ /api/users/* ││
│  │                │  │                │  │              ││
│  │ - Login        │  │ - CRUD ops     │  │ - List users ││
│  │ - Register     │  │ - Tracking     │  │ - Create     ││
│  │ - Refresh      │  │ - Status update│  │ - Update     ││
│  └────────┬───────┘  └────────┬───────┘  └───────┬──────┘│
│           │                   │                   │        │
│           │                   ▼                   │        │
│  ┌────────────────┐  ┌────────────────┐  ┌───────────────┐│
│  │ Categories     │  │ Workflows      │  │ Audit         ││
│  │ /api/          │  │ /api/workflows*│  │ /api/audit/*  ││
│  │ categories/*   │  │                │  │               ││
│  └────────┬───────┘  └────────┬───────┘  └───────┬───────┘│
│           │                   │                   │        │
│           └───────────────────┴───────────────────┘        │
│                               │                            │
│                               ▼                            │
│  ┌───────────────────────────────────────────────────────┐ │
│  │        DATA PERSISTENCE LAYER                         │ │
│  │        localStorage (mimics database)                 │ │
│  ├───────────────────────────────────────────────────────┤ │
│  │  msw_auth_users:           [...users]                 │ │
│  │  msw_auth_organizations:   [...orgs]                  │ │
│  │  msw_incidents:            [...incidents]             │ │
│  │  msw_incident_timeline:    [...timeline_entries]      │ │
│  │  msw_custom_categories:    [...categories]            │ │
│  │  msw_workflows:            [...workflows]             │ │
│  │  msw_audit_logs:           [...audit_logs]            │ │
│  │  msw_audit_notes:          [...audit_notes]           │ │
│  │  msw_sla_tracking:         [...sla_records]           │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔧 Microservices Breakdown

### 1. **Auth Microservice** (`auth.handlers.ts`)

**Endpoints:** `/api/auth/*`

**Responsibilities:**
- User authentication (login/logout)
- User registration
- Token management (access + refresh tokens)
- Session management
- Role assignment

**localStorage Keys:**
- `msw_auth_users` - User accounts
- `msw_auth_organizations` - Organizations
- `msw_auth_refresh_tokens` - Active refresh tokens

**Key Features:**
- JWT token simulation
- Password hashing (bcrypt simulation)
- Role-based access control (7 roles)
- Multi-organization support

---

### 2. **Incident Microservice** (`incident.handlers.ts`)

**Endpoints:** `/api/incidents/*`

**Responsibilities:**
- CRUD operations for incidents
- Anonymous reporting
- Guest reporting
- Authenticated user reporting
- Incident tracking by tracking ID
- Status updates
- Assignment to users

**localStorage Keys:**
- `msw_incidents` - All incidents
- `msw_incident_timeline` - Timeline entries
- `msw_incident_attachments` - File attachments

**Key Features:**
- Tracking ID generation
- Anonymous reporter protection
- Status workflow validation
- Assignment notifications
- Timeline tracking

---

### 3. **User Microservice** (`user.handlers.ts`)

**Endpoints:** `/api/users/*`

**Responsibilities:**
- User CRUD operations
- List users (with role filtering)
- Update user profiles
- Role assignment
- User activation/deactivation

**localStorage Keys:**
- `msw_auth_users` (shared with Auth service)

**Key Features:**
- Role-based user listing
- Team management
- User search/filtering

---

### 4. **Category Microservice** (`category.handlers.ts`)

**Endpoints:** `/api/categories/*`

**Responsibilities:**
- Custom category management
- Category creation per organization
- Industry-specific templates
- Category configuration (required fields, workflows, etc.)

**localStorage Keys:**
- `msw_custom_categories` - Custom categories

**Key Features:**
- Healthcare category templates
- Mining category templates
- Corporate category templates
- Custom field configuration

---

### 5. **Workflow Microservice** (`workflow.handlers.ts`)

**Endpoints:** `/api/workflows/*`

**Responsibilities:**
- Workflow definition
- Status transition validation
- Escalation rules
- Assignment rules
- SLA configuration

**localStorage Keys:**
- `msw_workflows` - Workflow definitions

**Key Features:**
- Industry-specific workflows
- Custom status transitions
- Role-based workflow steps

---

### 6. **Audit Microservice** (`audit.handlers.ts`)

**Endpoints:** `/api/audit/*`

**Responsibilities:**
- Audit log creation
- Audit note management
- Compliance flagging
- Export audit trails

**localStorage Keys:**
- `msw_audit_logs` - Complete audit trail
- `msw_audit_notes` - Auditor notes

**Key Features:**
- Read-only audit trail
- Compliance notes
- Incident flagging
- Export functionality

---

## 📦 Data Persistence Layer

### Storage Architecture

Each microservice has its own namespace in localStorage:

```typescript
STORAGE_KEYS = {
  AUTH: {
    USERS: 'msw_auth_users',
    ORGANIZATIONS: 'msw_auth_organizations',
    REFRESH_TOKENS: 'msw_auth_refresh_tokens',
  },
  INCIDENTS: {
    INCIDENTS: 'msw_incidents',
    TIMELINE: 'msw_incident_timeline',
    ATTACHMENTS: 'msw_incident_attachments',
  },
  CATEGORIES: {
    CUSTOM_CATEGORIES: 'msw_custom_categories',
    WORKFLOWS: 'msw_workflows',
  },
  AUDIT: {
    LOGS: 'msw_audit_logs',
    NOTES: 'msw_audit_notes',
  },
  SLA: {
    TRACKING: 'msw_sla_tracking',
  }
}
```

### Storage Operations

The `storage` helper provides:
- `get<T>(key)` - Retrieve all items
- `set<T>(key, data)` - Save all items
- `add<T>(key, item)` - Add single item
- `update<T>(key, id, updates)` - Update by ID
- `delete<T>(key, id)` - Delete by ID
- `findById<T>(key, id)` - Find single item
- `exportAll()` - Export all MSW data
- `importAll(data)` - Import MSW data
- `resetAll()` - Clear all data

---

## 🔄 Request Flow Example

### Example: Creating an Incident

1. **User Action:** Fills out incident form, clicks "Submit"

2. **Frontend Service:**
   ```typescript
   // services/incident.service.ts
   export const createIncident = async (data: CreateIncidentDto) => {
     const response = await fetch('/api/incidents', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify(data)
     });
     return response.json();
   };
   ```

3. **MSW Intercepts:**
   ```typescript
   // mocks/handlers/incident.handlers.ts
   http.post('/api/incidents', async ({ request }) => {
     const body = await request.json();

     // Generate tracking ID
     const trackingId = generateTrackingId();

     // Create incident
     const incident = {
       id: uuid(),
       ...body,
       trackingId,
       createdAt: new Date().toISOString()
     };

     // Persist to localStorage
     storage.add(STORAGE_KEYS.INCIDENTS.INCIDENTS, incident);

     // Return response
     return HttpResponse.json(incident, { status: 201 });
   })
   ```

4. **localStorage:** Data is saved automatically

5. **Response:** Returns to frontend with tracking ID

6. **Page Refresh:** Data persists - incident still exists!

---

## 🚀 Advantages of MSW Microservices

### ✅ Rapid Prototyping
- Change API behavior instantly
- No backend deployment
- Test different scenarios easily

### ✅ Frontend-First Development
- Build UI before backend exists
- Parallel frontend/backend development
- Design API contracts collaboratively

### ✅ Data Persistence
- All test data survives refreshes
- Share test scenarios (export/import)
- Reproducible testing

### ✅ Zero Setup
- No database installation
- No server configuration
- Works on any machine

### ✅ Easy Migration
- API contracts already defined
- Replace handlers with real endpoints
- Same service layer code

---

## 🔧 Development Workflow

### Creating a New Microservice

1. **Define API contract** in `utils/constants.ts`:
   ```typescript
   export const API_ENDPOINTS = {
     NEW_SERVICE: {
       LIST: '/api/new-service',
       CREATE: '/api/new-service',
       GET: (id: string) => `/api/new-service/${id}`,
     }
   }
   ```

2. **Add localStorage keys** in `mocks/data/storage.ts`:
   ```typescript
   export const STORAGE_KEYS = {
     NEW_SERVICE: {
       ITEMS: 'msw_new_service_items',
     }
   }
   ```

3. **Create handler file** `mocks/handlers/new-service.handlers.ts`:
   ```typescript
   import { http, HttpResponse } from 'msw';
   import { storage, STORAGE_KEYS } from '../data/storage';

   export const newServiceHandlers = [
     http.get('/api/new-service', () => {
       const items = storage.get(STORAGE_KEYS.NEW_SERVICE.ITEMS);
       return HttpResponse.json(items);
     }),

     http.post('/api/new-service', async ({ request }) => {
       const body = await request.json();
       const item = storage.add(STORAGE_KEYS.NEW_SERVICE.ITEMS, {
         id: uuid(),
         ...body,
         createdAt: new Date().toISOString()
       });
       return HttpResponse.json(item, { status: 201 });
     }),
   ];
   ```

4. **Register handlers** in `mocks/browser.ts`:
   ```typescript
   import { newServiceHandlers } from './handlers/new-service.handlers';

   export const worker = setupWorker(
     ...authHandlers,
     ...incidentHandlers,
     ...newServiceHandlers, // Add here
     // ...
   );
   ```

5. **Create service client** `services/new-service.service.ts`:
   ```typescript
   import { API_ENDPOINTS } from '@/utils/constants';

   export const newService = {
     list: async () => {
       const res = await fetch(API_ENDPOINTS.NEW_SERVICE.LIST);
       return res.json();
     },
     create: async (data) => {
       const res = await fetch(API_ENDPOINTS.NEW_SERVICE.CREATE, {
         method: 'POST',
         body: JSON.stringify(data)
       });
       return res.json();
     }
   };
   ```

---

## 🐛 Debugging MSW

### Browser Console Tools

```javascript
// Export all test data
window.mswDebug.exportData()

// Import test data
const testData = { /* exported data */ };
window.mswDebug.importData(testData)

// Reset all data
window.mswDebug.resetAll()

// Check specific storage key
localStorage.getItem('msw_incidents')
```

### MSW Logs

MSW logs all intercepted requests to console:
```
[MSW] POST /api/incidents (200 OK)
[MSW] GET /api/users (200 OK)
```

To hide logs:
```typescript
// mocks/browser.ts
worker.start({ quiet: true })
```

---

## 📊 Role-Based Access Control in MSW

Each handler validates user roles:

```typescript
// Example: Only Admins and Managers can delete incidents
http.delete('/api/incidents/:id', async ({ request, params }) => {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');
  const user = verifyToken(token); // Parse JWT

  if (!['admin', 'super_admin', 'manager'].includes(user.role.id)) {
    return HttpResponse.json(
      { error: 'Forbidden' },
      { status: 403 }
    );
  }

  // Proceed with deletion...
  storage.delete(STORAGE_KEYS.INCIDENTS.INCIDENTS, params.id);
  return HttpResponse.json({ success: true });
})
```

---

## 🔄 Migration to Real Backend

When ready to use real backend:

1. **Keep service layer unchanged**
2. **Disable MSW**:
   ```typescript
   // app/layout.tsx
   // Comment out MSW initialization
   // if (typeof window !== 'undefined') {
   //   initMSW();
   // }
   ```

3. **Point to real API**:
   ```typescript
   // utils/constants.ts
   export const APP_CONFIG = {
     API_BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'https://api.yourapp.com'
   }
   ```

4. **Real backend implements same endpoints**:
   - `/api/auth/*`
   - `/api/incidents/*`
   - `/api/users/*`
   - etc.

---

## 📝 Best Practices

### ✅ DO:
- Keep handlers focused (one domain per file)
- Use TypeScript interfaces for type safety
- Persist important test data
- Log errors clearly
- Simulate realistic delays (`await delay(100)`)

### ❌ DON'T:
- Put business logic in frontend (keep in handlers)
- Store sensitive data in localStorage (use secure HttpOnly cookies for real auth)
- Skip error cases in handlers
- Forget to export/save test scenarios

---

## 🎯 Summary

This MSW microservices architecture provides:

✅ **Rapid prototyping** - Build features fast
✅ **Zero backend setup** - Start coding immediately
✅ **Data persistence** - Test data survives refreshes
✅ **Clear separation** - Each domain has its own handler
✅ **Easy testing** - Control all API responses
✅ **Smooth migration** - Replace MSW with real APIs later

Perfect for:
- Rapid prototyping
- Frontend-first development
- API contract design
- Demo/POC development
- Learning full-stack development

---

**The microservices pattern makes it easy to add new features, test scenarios, and eventually migrate to a real backend when ready!**
