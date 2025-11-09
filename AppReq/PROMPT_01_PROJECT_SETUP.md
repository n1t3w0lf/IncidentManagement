# PROMPT 1: PROJECT SETUP & FOUNDATION

## Brief Description
This prompt sets up the complete development environment for the incident management system with all necessary tools, dependencies, and initial project structure. You will create a modern React-based application using Next.js, TypeScript, and Tailwind CSS with proper toolchain configuration.

## Prerequisites
- Basic knowledge of React and JavaScript
- Node.js 18+ installed on your machine
- VS Code or similar code editor
- Basic understanding of terminal/command line

---

## AI PROMPT

```
You are a senior full-stack developer helping a junior developer set up a modern React-based incident management system. Follow these exact steps:

STEP 1: Environment Setup
- Install Node.js 18+ and verify with: node --version && npm --version
- Install VS Code extensions: ES7+ React/Redux/React-Native snippets, Prettier, ESLint, Tailwind CSS IntelliSense
- Create project: npx create-next-app@latest incident-management --typescript --tailwind --app --src-dir --import-alias "@/*"
- Navigate to project: cd incident-management

STEP 2: Dependencies Installation
Install these exact packages:
```bash
# Core dependencies
npm install zustand react-hook-form @hookform/resolvers zod react-query @tanstack/react-query-devtools
npm install lucide-react @headlessui/react @heroicons/react clsx class-variance-authority
npm install date-fns uuid @types/uuid react-hot-toast

# Development dependencies  
npm install --save-dev @types/node @typescript-eslint/eslint-plugin @typescript-eslint/parser
npm install --save-dev msw @mswjs/data faker @types/faker
npm install --save-dev @testing-library/react @testing-library/jest-dom vitest @vitejs/plugin-react jsdom
```

STEP 3: Project Structure
Create this exact folder structure:
```
src/
├── components/
│   ├── ui/ (reusable components)
│   ├── forms/ (form components)
│   ├── layout/ (layout components)
│   └── features/ (feature-specific components)
├── pages/ (Next.js pages)
├── services/ (API services and MSW)
├── stores/ (Zustand stores)
├── types/ (TypeScript definitions)
├── utils/ (utility functions)
├── hooks/ (custom React hooks)
├── mocks/ (MSW mock data)
└── styles/ (global styles)
```

Run these commands to create the folders:
```bash
mkdir -p src/components/ui src/components/forms src/components/layout src/components/features
mkdir -p src/services src/stores src/types src/utils src/hooks src/mocks
```

STEP 4: Configuration Files
Create tailwind.config.js with custom colors for incident management:
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
        primary: {
          50: '#f0f9ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8'
        },
        danger: {
          50: '#fef2f2',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c'
        },
        warning: {
          50: '#fffbeb',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309'
        },
        success: {
          50: '#f0fdf4',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d'
        }
      }
    },
  },
  plugins: [],
}
```

STEP 5: TypeScript Configuration
Update tsconfig.json to include these path mappings:
```json
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/services/*": ["./src/services/*"],
      "@/types/*": ["./src/types/*"],
      "@/utils/*": ["./src/utils/*"],
      "@/stores/*": ["./src/stores/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

STEP 6: Package.json Scripts
Update your package.json scripts section:
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    "test": "vitest",
    "test:ui": "vitest --ui"
  }
}
```

STEP 7: Initial Layout Setup
Create src/app/layout.tsx:
```typescript
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Incident Management System',
  description: 'Professional incident management and reporting system',
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

Create src/app/page.tsx:
```typescript
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Incident Management System
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Professional incident reporting and management for all industries
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {/* Anonymous Reporting */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h2 className="text-xl font-semibold mb-3 text-gray-900">
                Anonymous Reporting
              </h2>
              <p className="text-gray-600 mb-4">
                Report incidents anonymously with complete privacy protection
              </p>
              <Link 
                href="/report/anonymous" 
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 inline-block"
              >
                Report Anonymously
              </Link>
            </div>

            {/* Guest Reporting */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h2 className="text-xl font-semibold mb-3 text-gray-900">
                Guest Reporting
              </h2>
              <p className="text-gray-600 mb-4">
                Report as a guest with optional contact information
              </p>
              <Link 
                href="/report/guest" 
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 inline-block"
              >
                Report as Guest
              </Link>
            </div>

            {/* User Login */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h2 className="text-xl font-semibold mb-3 text-gray-900">
                User Portal
              </h2>
              <p className="text-gray-600 mb-4">
                Login to manage incidents and access full features
              </p>
              <Link 
                href="/auth/login" 
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 inline-block"
              >
                Login / Register
              </Link>
            </div>
          </div>

          {/* Track Incident */}
          <div className="mt-12 bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
            <h3 className="text-lg font-semibold mb-3 text-gray-900">
              Track Your Incident
            </h3>
            <p className="text-gray-600 mb-4">
              Use your tracking ID to check incident status
            </p>
            <Link 
              href="/track" 
              className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 inline-block"
            >
              Track Incident
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
```

STEP 8: Basic Utility Setup
Create src/utils/constants.ts:
```typescript
export const APP_CONFIG = {
  APP_NAME: 'Incident Management System',
  VERSION: '1.0.0',
  API_BASE_URL: process.env.NEXT_PUBLIC_API_URL || '/api',
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_FILE_TYPES: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
} as const

export const ROUTES = {
  HOME: '/',
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  DASHBOARD: '/dashboard',
  REPORT_ANONYMOUS: '/report/anonymous',
  REPORT_GUEST: '/report/guest',
  REPORT_USER: '/report/user',
  TRACK: '/track'
} as const

export const INCIDENT_STATUSES = {
  DRAFT: 'draft',
  SUBMITTED: 'submitted',
  UNDER_REVIEW: 'under_review',
  INVESTIGATING: 'investigating',
  PENDING_APPROVAL: 'pending_approval',
  APPROVED: 'approved',
  IN_PROGRESS: 'in_progress',
  RESOLVED: 'resolved',
  CLOSED: 'closed',
  REJECTED: 'rejected'
} as const

export const INCIDENT_SEVERITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
} as const
```

Create src/utils/formatters.ts:
```typescript
export const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export const formatDateTime = (date: string | Date): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

export const capitalizeFirst = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
```

CRITICAL GOTCHAS & THINGS TO WATCH OUT FOR:
1. ALWAYS use exact versions specified - mixing versions causes conflicts
2. The project MUST use the app directory structure (not pages directory)
3. Import aliases MUST match the tsconfig.json paths exactly
4. Node.js version MUST be 18+ for React 18 features
5. If any installation fails, delete node_modules and package-lock.json, then retry
6. VS Code extensions are REQUIRED - they provide critical IntelliSense
7. Folder structure MUST be exact - the build system depends on it
8. The tailwind.config.js colors are used throughout the app - don't change them
9. Make sure to run commands from the correct directory (inside incident-management folder)
10. If you get TypeScript errors, make sure all imports use the @ alias correctly

EXPECTED OUTCOME:
After completing this prompt, you should have:
- A fully configured Next.js 13+ project with TypeScript
- All dependencies installed without conflicts
- Proper folder structure matching the specification  
- Tailwind CSS configured with incident management color scheme
- Development server running on localhost:3000
- No compilation errors when running: npm run dev
- A professional landing page with navigation links
- Basic utility functions and constants set up

VERIFICATION COMMANDS:
```bash
npm run dev    # Should start without errors on localhost:3000
npm run build  # Should compile successfully
npm run type-check # Should pass TypeScript checking
npm run lint   # Should pass linting
```

WHAT YOU SHOULD SEE:
The application should display a professional landing page with:
- Clean, modern design with blue gradient background
- Three main action cards (Anonymous, Guest, User reporting)
- Track incident section at the bottom
- Responsive design that works on mobile
- No console errors in browser DevTools
- All navigation links should be clickable (they'll show 404 for now - that's expected)

The foundation is now ready for the authentication system implementation in the next prompt.
```

---

## Microservices Architecture & Docker Deployment

This application is designed to run as a **microservices architecture** with complete Docker containerization. After completing the initial setup, you can deploy the full production-ready system using Docker Compose.

### Architecture Overview
The system consists of:
- **Frontend**: Next.js application (this setup)
- **10 Microservices**: Auth, Incident, User, Notification, Organization, Analytics, File Storage, Workflow, Reporting, and API Gateway
- **Infrastructure**: PostgreSQL (7 databases), Redis, RabbitMQ, Elasticsearch, MinIO, ClamAV, Prometheus, Grafana
- **Zero Cloud Dependencies**: Everything runs in Docker containers

### Quick Docker Deployment
```bash
# 1. Configure environment
cp .env.example .env
# Edit .env with your secure passwords

# 2. Start all services
docker-compose up -d

# 3. Access application
# Frontend: http://localhost:3000
# API Gateway: http://localhost:4000
```

### Documentation
- **Full Deployment Guide**: See [DEPLOYMENT_GUIDE.md](../DEPLOYMENT_GUIDE.md) for complete Docker deployment instructions
- **Architecture Details**: See [MICROSERVICES_ARCHITECTURE.md](../MICROSERVICES_ARCHITECTURE.md) for system design
- **Industry Use Cases**:
  - Mining: [MINING_USE_CASES.md](./MINING_USE_CASES.md)
  - Healthcare: [HEALTHCARE_USE_CASES.md](./HEALTHCARE_USE_CASES.md)
  - Retail: [RETAIL_USE_CASES.md](./RETAIL_USE_CASES.md)

### Development vs Production
- **Development**: Follow this prompt to set up local development environment with MSW
- **Production**: Use Docker Compose with microservices architecture (see deployment guide)
- **Hybrid**: Run infrastructure in Docker, develop services locally

The deployment guide includes:
- Step-by-step Docker setup
- Environment configuration
- Service management
- Monitoring and logging
- Backup and recovery
- Production security hardening
- Troubleshooting guide
