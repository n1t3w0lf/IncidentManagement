# PROMPT 1: PROJECT SETUP & FOUNDATION (MSW Microservices)

## Brief Description
This prompt sets up a complete **frontend-first** incident management system using **Mock Service Worker (MSW)** to simulate microservices architecture for rapid prototyping. All data persists in localStorage for testing. Perfect for junior developers with step-by-step instructions.

## Expert Review Summary
- **System Architect (David Park):** Verified MSW microservices pattern for rapid prototyping
- **Target User:** Junior developer on local development machine
- **Key Principle:** Frontend-first with MSW, all test data persists in localStorage
- **Architecture:** Microservices pattern with separate MSW handlers per domain

## Prerequisites
- Node.js 18+ installed (verify with: `node --version`)
- npm or yarn package manager (verify with: `npm --version`)
- VS Code or similar code editor
- Basic understanding of terminal/command line
- **NO backend server needed** - MSW handles all API calls
- **NO cloud services** - everything runs in browser

---

## AI PROMPT

```
You are a senior full-stack developer helping a JUNIOR developer set up a modern incident management system using MSW (Mock Service Worker) microservices pattern for rapid prototyping. This system runs entirely in the browser with NO backend server required.

CRITICAL ARCHITECTURE PRINCIPLES:
1. Frontend: Next.js + React (runs on localhost:3000)
2. API Mocking: MSW (Mock Service Worker) - intercepts API calls in browser
3. Data Storage: localStorage - all test data persists automatically
4. Microservices Pattern: Separate MSW handlers for each domain (Auth, Incidents, Users, etc.)
5. Rapid Prototyping: Changes to MSW handlers = instant API changes
6. Zero Backend: No server setup, no database, no backend code

---

## STEP 1: Environment Setup

```bash
# Verify Node.js 18+
node --version
# Should show v18.0.0 or higher

npm --version
# Should show 8.0.0 or higher
```

**What this checks:** Node.js is required to run the development server and npm manages packages.

**If not installed:** Download from https://nodejs.org/

---

## STEP 2: Create Next.js Project

```bash
# Create project with TypeScript and Tailwind
npx create-next-app@latest incident-management --typescript --tailwind --app --src-dir --import-alias "@/*"

# Navigate into project
cd incident-management
```

**What this does:**
- `create-next-app@latest` - Creates a Next.js 14+ project
- `--typescript` - Enables TypeScript (type safety)
- `--tailwind` - Includes Tailwind CSS (styling)
- `--app` - Uses new App Router (modern Next.js)
- `--src-dir` - Puts code in `src/` folder (cleaner structure)
- `--import-alias "@/*"` - Allows imports like `@/components/Button`

**Expected output:**
```
Creating a new Next.js app in /path/to/incident-management
Installing dependencies...
Success! Created incident-management
```

---

## STEP 3: Install Dependencies

```bash
# Core dependencies for state management and forms
npm install zustand react-hook-form @hookform/resolvers zod

# UI components and icons
npm install lucide-react @headlessui/react @heroicons/react clsx class-variance-authority

# Utilities
npm install date-fns uuid @types/uuid react-hot-toast

# MSW for API mocking (THE KEY DEPENDENCY!)
npm install --save-dev msw

# Development tools
npm install --save-dev @types/node @typescript-eslint/eslint-plugin @typescript-eslint/parser
npm install --save-dev @testing-library/react @testing-library/jest-dom vitest @vitejs/plugin-react jsdom
```

**What each package does:**

**State Management & Forms:**
- `zustand` - Simple state management (like Redux but easier)
- `react-hook-form` - Form handling with validation
- `@hookform/resolvers` + `zod` - Schema validation for forms

**UI Components:**
- `lucide-react` - Modern icon library
- `@headlessui/react` - Accessible UI components
- `@heroicons/react` - Hero icons
- `clsx` + `class-variance-authority` - CSS class utilities

**Utilities:**
- `date-fns` - Date formatting
- `uuid` - Generate unique IDs
- `react-hot-toast` - Toast notifications

**MSW (Mock Service Worker):** ⭐ **MOST IMPORTANT**
- Intercepts HTTP requests in browser
- Returns mock responses
- Simulates real backend APIs
- NO actual server needed

---

## STEP 4: Project Structure (Microservices Pattern)

Create this EXACT folder structure:

```bash
# Create all directories at once
mkdir -p src/components/ui
mkdir -p src/components/forms
mkdir -p src/components/layout
mkdir -p src/components/features
mkdir -p src/services
mkdir -p src/stores
mkdir -p src/types
mkdir -p src/utils
mkdir -p src/hooks
mkdir -p src/mocks/handlers
mkdir -p src/mocks/data
```

**Final Structure:**
```
src/
├── app/                    # Next.js App Router pages
├── components/
│   ├── ui/                # Reusable UI components (Button, Input, etc.)
│   ├── forms/             # Form components (LoginForm, IncidentForm, etc.)
│   ├── layout/            # Layout components (Header, Sidebar, etc.)
│   └── features/          # Feature-specific components (Dashboard, etc.)
├── services/              # API service clients (call MSW endpoints)
│   ├── auth.service.ts    # Auth microservice client
│   ├── incident.service.ts # Incident microservice client
│   └── user.service.ts    # User microservice client
├── mocks/                 # ⭐ MSW Microservices Handlers
│   ├── browser.ts         # MSW setup and initialization
│   ├── handlers/          # Microservice handlers (one per domain)
│   │   ├── auth.handlers.ts       # Auth microservice mock
│   │   ├── incident.handlers.ts   # Incident microservice mock
│   │   ├── user.handlers.ts       # User microservice mock
│   │   ├── category.handlers.ts   # Category microservice mock
│   │   ├── workflow.handlers.ts   # Workflow microservice mock
│   │   └── audit.handlers.ts      # Audit microservice mock
│   └── data/              # Data persistence layer (localStorage)
│       ├── auth.store.ts          # Auth data store
│       ├── incident.store.ts      # Incident data store
│       ├── user.store.ts          # User data store
│       └── category.store.ts      # Category data store
├── stores/                # Frontend state management (Zustand)
│   ├── authStore.ts       # Auth state
│   ├── incidentStore.ts   # Incident state
│   └── uiStore.ts         # UI state
├── types/                 # TypeScript type definitions
│   ├── auth.ts
│   ├── incident.ts
│   └── user.ts
├── utils/                 # Utility functions
│   ├── constants.ts
│   └── formatters.ts
└── hooks/                 # Custom React hooks
    └── useAuth.ts
```

**Why This Structure?**

1. **`mocks/handlers/`** - Each file = one microservice
   - `auth.handlers.ts` handles `/api/auth/*` endpoints
   - `incident.handlers.ts` handles `/api/incidents/*` endpoints
   - Easy to find and modify specific service logic

2. **`mocks/data/`** - Persistent data stores using localStorage
   - All test data survives page refreshes
   - Easy to reset/export test data
   - Simulates real database

3. **`services/`** - Frontend calls these, which call MSW
   - Clean separation between UI and API
   - Easy to replace MSW with real backend later

---

## STEP 5: Initialize MSW (Mock Service Worker)

### 5.1 Initialize MSW

```bash
# Initialize MSW in your project
npx msw init public/ --save
```

**What this does:**
- Creates `public/mockServiceWorker.js` - Service worker file
- Adds entry to package.json
- **IMPORTANT:** This file intercepts browser network requests

**Expected output:**
```
✔ Created public/mockServiceWorker.js
✔ Updated package.json
```

### 5.2 Create Data Persistence Layer

Create `src/mocks/data/storage.ts`:
```typescript
/**
 * PERSISTENT DATA STORAGE using localStorage
 *
 * All MSW data persists across page refreshes.
 * Each microservice has its own storage namespace.
 */

// Storage keys for each microservice
export const STORAGE_KEYS = {
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
} as const;

/**
 * Generic storage helper
 * Works with any data type and automatically handles JSON serialization
 */
export const storage = {
  /**
   * Get data from localStorage
   * Returns empty array if key doesn't exist
   */
  get: <T>(key: string): T[] => {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error(`Error reading from localStorage key "${key}":`, error);
      return [];
    }
  },

  /**
   * Save data to localStorage
   * Automatically converts to JSON
   */
  set: <T>(key: string, data: T[]): void => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Error writing to localStorage key "${key}":`, error);
    }
  },

  /**
   * Add single item to array in localStorage
   */
  add: <T extends { id: string }>(key: string, item: T): T => {
    const all = storage.get<T>(key);
    all.push(item);
    storage.set(key, all);
    return item;
  },

  /**
   * Update item by ID
   */
  update: <T extends { id: string }>(key: string, id: string, updates: Partial<T>): T | null => {
    const all = storage.get<T>(key);
    const index = all.findIndex(item => item.id === id);

    if (index === -1) return null;

    all[index] = { ...all[index], ...updates };
    storage.set(key, all);
    return all[index];
  },

  /**
   * Delete item by ID
   */
  delete: <T extends { id: string }>(key: string, id: string): boolean => {
    const all = storage.get<T>(key);
    const filtered = all.filter(item => item.id !== id);

    if (filtered.length === all.length) return false;

    storage.set(key, filtered);
    return true;
  },

  /**
   * Find item by ID
   */
  findById: <T extends { id: string }>(key: string, id: string): T | null => {
    const all = storage.get<T>(key);
    return all.find(item => item.id === id) || null;
  },

  /**
   * Clear all data for a key
   */
  clear: (key: string): void => {
    localStorage.removeItem(key);
  },

  /**
   * Export all MSW data (for backup/sharing test scenarios)
   */
  exportAll: (): Record<string, any> => {
    const allData: Record<string, any> = {};

    Object.values(STORAGE_KEYS).forEach(serviceKeys => {
      Object.values(serviceKeys).forEach(key => {
        allData[key] = storage.get(key);
      });
    });

    return allData;
  },

  /**
   * Import MSW data (restore from backup)
   */
  importAll: (data: Record<string, any>): void => {
    Object.entries(data).forEach(([key, value]) => {
      storage.set(key, value);
    });
  },

  /**
   * Reset all MSW data
   */
  resetAll: (): void => {
    Object.values(STORAGE_KEYS).forEach(serviceKeys => {
      Object.values(serviceKeys).forEach(key => {
        storage.clear(key);
      });
    });
  }
};

/**
 * Initialize storage with default data if empty
 * Call this when MSW starts
 */
export const initializeStorage = () => {
  // Only initialize if completely empty
  if (localStorage.length === 0 || !localStorage.getItem(STORAGE_KEYS.AUTH.USERS)) {
    console.log('🗄️  Initializing MSW storage with default data...');

    // Initialize with empty arrays
    storage.set(STORAGE_KEYS.AUTH.USERS, []);
    storage.set(STORAGE_KEYS.AUTH.ORGANIZATIONS, []);
    storage.set(STORAGE_KEYS.INCIDENTS.INCIDENTS, []);
    storage.set(STORAGE_KEYS.CATEGORIES.CUSTOM_CATEGORIES, []);

    console.log('✅ MSW storage initialized');
  }
};
```

**What this does:**
- **All test data persists** in localStorage automatically
- **Each microservice** has its own storage namespace
- **Export/Import** test data for sharing scenarios
- **Reset** all data with one command
- **Survives page refreshes** - your test data won't disappear!

### 5.3 Create MSW Browser Setup

Create `src/mocks/browser.ts`:
```typescript
import { setupWorker } from 'msw/browser';
import { authHandlers } from './handlers/auth.handlers';
import { incidentHandlers } from './handlers/incident.handlers';
import { userHandlers } from './handlers/user.handlers';
import { categoryHandlers } from './handlers/category.handlers';
import { workflowHandlers } from './handlers/workflow.handlers';
import { auditHandlers } from './handlers/audit.handlers';
import { initializeStorage } from './data/storage';

/**
 * MSW MICROSERVICES SETUP
 *
 * Each handler file represents one microservice:
 * - authHandlers = Auth Service (/api/auth/*)
 * - incidentHandlers = Incident Service (/api/incidents/*)
 * - userHandlers = User Service (/api/users/*)
 * - categoryHandlers = Category Service (/api/categories/*)
 * - workflowHandlers = Workflow Service (/api/workflows/*)
 * - auditHandlers = Audit Service (/api/audit/*)
 */

export const worker = setupWorker(
  ...authHandlers,
  ...incidentHandlers,
  ...userHandlers,
  ...categoryHandlers,
  ...workflowHandlers,
  ...auditHandlers
);

// Initialize persistent storage
if (typeof window !== 'undefined') {
  initializeStorage();
}

// Export utility functions for debugging
export const debugMSW = {
  exportData: () => {
    const { storage } = require('./data/storage');
    const data = storage.exportAll();
    console.log('📦 MSW Data Export:', data);
    return data;
  },

  importData: (data: Record<string, any>) => {
    const { storage } = require('./data/storage');
    storage.importAll(data);
    console.log('✅ MSW Data Imported');
  },

  resetAll: () => {
    const { storage } = require('./data/storage');
    storage.resetAll();
    console.log('🗑️  All MSW data cleared');
  }
};

// Make debug functions available in browser console
if (typeof window !== 'undefined') {
  (window as any).mswDebug = debugMSW;
}
```

**What this does:**
- **Combines all microservice handlers** into one worker
- **Initializes persistent storage** automatically
- **Exposes debug tools** in browser console:
  - `window.mswDebug.exportData()` - Export all test data
  - `window.mswDebug.importData(data)` - Import test data
  - `window.mswDebug.resetAll()` - Clear all data

---

## STEP 6: Configure Tailwind CSS

Update `tailwind.config.js` with incident management color scheme:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary blues
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        // Danger/Critical
        danger: {
          50: '#fef2f2',
          100: '#fee2e2',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
        },
        // Warning/High
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
        },
        // Success/Low
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
        },
      },
    },
  },
  plugins: [],
}
```

---

## STEP 7: Initialize MSW in App

Update `src/app/layout.tsx` to start MSW:

```typescript
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Incident Management System',
  description: 'Professional incident management and reporting system',
}

// Initialize MSW in browser
if (typeof window !== 'undefined') {
  const initMSW = async () => {
    const { worker } = await import('@/mocks/browser');
    await worker.start({
      onUnhandledRequest: 'bypass',
      quiet: false, // Set to true to hide MSW logs
    });
    console.log('🚀 MSW Microservices started');
    console.log('💾 All API calls will be mocked and data persisted to localStorage');
    console.log('🔧 Debug tools: window.mswDebug');
  };
  initMSW();
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div id="root">
          {children}
        </div>
      </body>
    </html>
  )
}
```

**What this does:**
- **Starts MSW** automatically when app loads
- **Logs to console** so you know it's working
- **Intercepts all API calls** to `/api/*`
- **All data persists** in localStorage

---

## STEP 8: Basic Utility Setup

Create `src/utils/constants.ts`:
```typescript
export const APP_CONFIG = {
  APP_NAME: 'Incident Management System',
  VERSION: '1.0.0',
  API_BASE_URL: '/api', // MSW intercepts this
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_FILE_TYPES: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
  ]
} as const;

export const ROUTES = {
  HOME: '/',
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  DASHBOARD: '/dashboard',
  REPORT_ANONYMOUS: '/report/anonymous',
  REPORT_GUEST: '/report/guest',
  REPORT_USER: '/report/user',
  TRACK: '/track'
} as const;

// Microservice API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    REFRESH: '/api/auth/refresh',
    ME: '/api/auth/me',
  },
  INCIDENTS: {
    LIST: '/api/incidents',
    CREATE: '/api/incidents',
    GET: (id: string) => `/api/incidents/${id}`,
    UPDATE: (id: string) => `/api/incidents/${id}`,
    DELETE: (id: string) => `/api/incidents/${id}`,
    TRACK: (trackingId: string) => `/api/incidents/track/${trackingId}`,
  },
  USERS: {
    LIST: '/api/users',
    CREATE: '/api/users',
    GET: (id: string) => `/api/users/${id}`,
    UPDATE: (id: string) => `/api/users/${id}`,
  },
  CATEGORIES: {
    LIST: '/api/categories',
    CREATE: '/api/categories',
    GET: (id: string) => `/api/categories/${id}`,
  },
  WORKFLOWS: {
    LIST: '/api/workflows',
    CREATE: '/api/workflows',
  },
  AUDIT: {
    LOGS: '/api/audit/logs',
    NOTES: '/api/audit/notes',
  }
} as const;
```

---

## CRITICAL GOTCHAS FOR JUNIOR DEVELOPERS

### ❌ Common Mistakes:

1. **"MSW not intercepting requests"**
   - **Fix:** Make sure `npx msw init public/` was run
   - Check browser console for "🚀 MSW Microservices started"
   - Clear browser cache and reload

2. **"Module not found" errors**
   - **Fix:** Run `npm install` from project root
   - Make sure you're in the right directory

3. **"Data disappeared after refresh"**
   - **Fix:** Check if localStorage is working:
     ```javascript
     // In browser console
     window.mswDebug.exportData()
     ```
   - Private/Incognito mode may block localStorage

4. **"Can't find handlers files"**
   - **Fix:** They'll be created in PROMPT 2, 3, 4
   - For now, create empty placeholder files:
     ```bash
     touch src/mocks/handlers/auth.handlers.ts
     echo "export const authHandlers = [];" > src/mocks/handlers/auth.handlers.ts
     ```

5. **TypeScript errors about MSW**
   - **Fix:** Make sure `msw` is installed as devDependency
   - Restart your editor/IDE

---

## EXPECTED OUTCOME

After completing this prompt, you should have:

✅ Next.js 14+ project with TypeScript
✅ All dependencies installed (including MSW)
✅ Microservices folder structure created
✅ MSW initialized with service worker
✅ Persistent data storage layer (localStorage)
✅ Tailwind CSS configured
✅ MSW starting automatically in browser
✅ Debug tools available in console

**Run the development server:**
```bash
npm run dev
```

**Open browser to:** http://localhost:3000

**Check browser console - you should see:**
```
🚀 MSW Microservices started
💾 All API calls will be mocked and data persisted to localStorage
🔧 Debug tools: window.mswDebug
```

---

## VERIFICATION CHECKLIST

```bash
# 1. Start development server
npm run dev
# Should start without errors

# 2. Open browser console
# Type: window.mswDebug.exportData()
# Should see: { msw_auth_users: [], msw_incidents: [], ... }

# 3. Check MSW service worker
# Open: http://localhost:3000
# DevTools → Application → Service Workers
# Should see: mockServiceWorker.js (activated)
```

---

## MICROSERVICES ARCHITECTURE SUMMARY

Your app now has this architecture:

```
┌─────────────────────────────────────────┐
│         BROWSER (localhost:3000)        │
├─────────────────────────────────────────┤
│                                         │
│  ┌──────────────────────────────────┐  │
│  │      Next.js Frontend            │  │
│  │  (React Components & Pages)      │  │
│  └──────────────┬───────────────────┘  │
│                 │                       │
│                 │ API Calls             │
│                 ▼                       │
│  ┌──────────────────────────────────┐  │
│  │  MSW (Mock Service Worker)       │  │
│  │  Intercepts /api/* requests      │  │
│  └──────────────┬───────────────────┘  │
│                 │                       │
│        ┌────────┴────────┐             │
│        │                 │             │
│   ┌────▼─────┐    ┌─────▼──────┐      │
│   │ Auth     │    │ Incident   │      │
│   │ Handler  │    │ Handler    │ ...  │
│   └────┬─────┘    └─────┬──────┘      │
│        │                │             │
│        └────────┬────────┘             │
│                 ▼                       │
│  ┌──────────────────────────────────┐  │
│  │  localStorage (Data Persistence) │  │
│  │  - msw_auth_users                │  │
│  │  - msw_incidents                 │  │
│  │  - msw_categories ...            │  │
│  └──────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

**Key Points:**
- ✅ NO backend server needed
- ✅ MSW intercepts API calls
- ✅ Each handler = one microservice
- ✅ Data persists in localStorage
- ✅ Perfect for rapid prototyping

---

The foundation is now ready for authentication system implementation in PROMPT 2.
```
