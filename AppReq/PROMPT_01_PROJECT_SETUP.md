# PROMPT 1: PROJECT SETUP & FOUNDATION (LOCAL-ONLY ARCHITECTURE)

## Brief Description
This prompt sets up a complete **LOCAL-ONLY** incident management system with zero cloud dependencies. The system uses SQLite for data storage, runs entirely on localhost, and requires no paid services or external APIs. Perfect for junior developers with step-by-step instructions.

## Expert Review Summary
- **System Architect (David Park):** Verified for local-only deployment, zero-config database
- **Target User:** Junior developer on local development machine
- **Key Principle:** Everything must work offline with single command startup

## Prerequisites
- Node.js 18+ installed (verify with: `node --version`)
- npm or yarn package manager (verify with: `npm --version`)
- VS Code or any code editor
- Git installed (verify with: `git --version`)
- **NO cloud accounts needed**
- **NO paid services required**

---

## AI PROMPT

```
You are a senior full-stack developer helping a JUNIOR developer set up a local-only incident management system. This system will run entirely on localhost with NO cloud dependencies, NO paid services, and NO external APIs.

CRITICAL REQUIREMENTS FOR LOCAL-ONLY DEPLOYMENT:
1. Backend: Node.js + Express (runs on localhost:3001)
2. Frontend: Next.js + React (runs on localhost:3000)
3. Database: SQLite (file-based, zero configuration)
4. Authentication: JWT with local secrets (no Auth0, no Firebase)
5. File Storage: Local file system (no AWS S3, no cloud storage)
6. Everything starts with ONE command: npm run dev

---

## STEP 1: Create Project Structure

Run these commands EXACTLY as shown:

```bash
# Create project directory
mkdir incident-management
cd incident-management

# Initialize git repository
git init

# Create main directories
mkdir backend frontend

# Create .gitignore file
cat > .gitignore << 'EOF'
node_modules/
.env
.env.local
*.log
.next/
dist/
build/
database.sqlite
database.sqlite-journal
uploads/
*.db
.DS_Store
EOF
```

**What this does:** Creates the basic project structure with backend and frontend separated. The .gitignore prevents sensitive files and build artifacts from being committed to git.

---

## STEP 2: Backend Setup (Node.js + Express + SQLite)

### 2.1 Initialize Backend

```bash
cd backend

# Initialize npm project
npm init -y

# Install backend dependencies
npm install express cors dotenv jsonwebtoken bcryptjs
npm install sqlite3 better-sqlite3
npm install express-validator multer
npm install uuid date-fns

# Install development dependencies
npm install --save-dev nodemon @types/node @types/express typescript ts-node
```

**What each package does:**
- **express:** Web server framework
- **cors:** Allows frontend to talk to backend
- **dotenv:** Loads environment variables from .env file
- **jsonwebtoken:** Creates authentication tokens (local, no cloud)
- **bcryptjs:** Encrypts passwords securely
- **better-sqlite3:** Fast, synchronous SQLite database (zero configuration)
- **express-validator:** Validates user input
- **multer:** Handles file uploads to local disk
- **uuid, date-fns:** Utility libraries
- **nodemon, typescript:** Development tools for auto-reload and type safety

### 2.2 Create Backend File Structure

```bash
# Still in backend directory
mkdir -p src/config
mkdir -p src/routes
mkdir -p src/controllers
mkdir -p src/models
mkdir -p src/middleware
mkdir -p src/database
mkdir -p src/utils
mkdir -p uploads
```

**What each directory is for:**
- **config:** Configuration files (database setup, environment variables)
- **routes:** API endpoint definitions (like /api/incidents, /api/auth)
- **controllers:** Business logic for handling requests
- **models:** Database table schemas and data access
- **middleware:** Authentication checks, validation
- **database:** Database initialization and migration scripts
- **utils:** Helper functions
- **uploads:** Where uploaded files are stored (local disk)

### 2.3 Create Backend Configuration Files

Create `backend/tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

**What this does:** Configures TypeScript to compile our backend code with strict type checking.

Create `backend/.env.example`:
```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Database (local SQLite file)
DATABASE_PATH=./database.sqlite

# JWT Secret (change this to a random string)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d

# File Upload Configuration (local storage)
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760

# CORS (allow frontend to connect)
CORS_ORIGIN=http://localhost:3000
```

**Important:** Copy this to `backend/.env` and change JWT_SECRET to a random string.

```bash
cp .env.example .env
```

### 2.4 Create Database Initialization Script

Create `backend/src/database/init.ts`:
```typescript
import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DB_PATH = process.env.DATABASE_PATH || './database.sqlite';

// Create database directory if it doesn't exist
const dbDir = path.dirname(DB_PATH);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Initialize database
export const db = new Database(DB_PATH, {
  verbose: console.log // Shows SQL queries in console for debugging
});

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Create tables
export function initializeDatabase() {
  console.log('🗄️  Initializing database...');

  // Organizations table
  db.exec(`
    CREATE TABLE IF NOT EXISTS organizations (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      type TEXT NOT NULL CHECK(type IN ('corporate', 'healthcare', 'mining')),
      settings TEXT NOT NULL,
      created_at TEXT NOT NULL,
      is_active INTEGER NOT NULL DEFAULT 1
    )
  `);

  // Users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      role_id TEXT NOT NULL,
      organization_id TEXT NOT NULL,
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL,
      last_login_at TEXT,
      FOREIGN KEY (organization_id) REFERENCES organizations(id)
    )
  `);

  // Incidents table
  db.exec(`
    CREATE TABLE IF NOT EXISTS incidents (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      severity TEXT NOT NULL CHECK(severity IN ('low', 'medium', 'high', 'critical')),
      status TEXT NOT NULL CHECK(status IN ('draft', 'submitted', 'under_review', 'investigating', 'pending_approval', 'approved', 'in_progress', 'resolved', 'closed', 'rejected')),
      category_id TEXT NOT NULL,
      reporter_type TEXT NOT NULL CHECK(reporter_type IN ('anonymous', 'guest', 'user')),
      reporter_info TEXT NOT NULL,
      organization_id TEXT,
      location TEXT,
      tags TEXT,
      custom_fields TEXT,
      tracking_id TEXT UNIQUE NOT NULL,
      assigned_to TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      due_date TEXT,
      FOREIGN KEY (organization_id) REFERENCES organizations(id)
    )
  `);

  // Incident timeline table
  db.exec(`
    CREATE TABLE IF NOT EXISTS incident_timeline (
      id TEXT PRIMARY KEY,
      incident_id TEXT NOT NULL,
      action TEXT NOT NULL,
      description TEXT NOT NULL,
      performed_by TEXT NOT NULL,
      performed_at TEXT NOT NULL,
      metadata TEXT,
      FOREIGN KEY (incident_id) REFERENCES incidents(id) ON DELETE CASCADE
    )
  `);

  // Attachments table
  db.exec(`
    CREATE TABLE IF NOT EXISTS attachments (
      id TEXT PRIMARY KEY,
      incident_id TEXT NOT NULL,
      filename TEXT NOT NULL,
      original_name TEXT NOT NULL,
      file_type TEXT NOT NULL,
      file_size INTEGER NOT NULL,
      file_path TEXT NOT NULL,
      uploaded_at TEXT NOT NULL,
      uploaded_by TEXT NOT NULL,
      description TEXT,
      FOREIGN KEY (incident_id) REFERENCES incidents(id) ON DELETE CASCADE
    )
  `);

  // Refresh tokens table
  db.exec(`
    CREATE TABLE IF NOT EXISTS refresh_tokens (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      token TEXT UNIQUE NOT NULL,
      expires_at TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Create indexes for better query performance
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_incidents_tracking_id ON incidents(tracking_id);
    CREATE INDEX IF NOT EXISTS idx_incidents_organization_id ON incidents(organization_id);
    CREATE INDEX IF NOT EXISTS idx_incidents_status ON incidents(status);
    CREATE INDEX IF NOT EXISTS idx_incidents_severity ON incidents(severity);
    CREATE INDEX IF NOT EXISTS idx_incidents_created_at ON incidents(created_at);
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_users_organization_id ON users(organization_id);
    CREATE INDEX IF NOT EXISTS idx_timeline_incident_id ON incident_timeline(incident_id);
    CREATE INDEX IF NOT EXISTS idx_attachments_incident_id ON attachments(incident_id);
  `);

  console.log('✅ Database initialized successfully!');
}

// Run initialization
initializeDatabase();
```

**What this does:**
- Creates a SQLite database file on your local disk
- Sets up all tables needed for the application
- Creates indexes to make searches faster
- **No cloud, no configuration needed** - just works!

### 2.5 Update package.json Scripts

Edit `backend/package.json` and replace the `scripts` section:

```json
{
  "scripts": {
    "dev": "nodemon --exec ts-node src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "db:init": "ts-node src/database/init.ts",
    "db:reset": "rm -f database.sqlite && npm run db:init"
  }
}
```

**What each script does:**
- **dev:** Starts development server with auto-reload
- **build:** Compiles TypeScript to JavaScript
- **start:** Runs production server
- **db:init:** Creates database tables
- **db:reset:** Deletes database and recreates it (useful for development)

---

## STEP 3: Frontend Setup (Next.js + React)

```bash
# Go back to project root
cd ..

# Create Next.js frontend
npx create-next-app@latest frontend --typescript --tailwind --app --src-dir --import-alias "@/*"

cd frontend

# Install additional dependencies
npm install zustand
npm install react-hook-form @hookform/resolvers zod
npm install @tanstack/react-query
npm install axios
npm install date-fns uuid
npm install lucide-react
npm install react-hot-toast

# Install dev dependencies
npm install --save-dev @types/uuid
```

**What each package does:**
- **zustand:** Simple state management (replaces Redux)
- **react-hook-form + zod:** Form handling and validation
- **@tanstack/react-query:** Data fetching and caching
- **axios:** HTTP requests to backend
- **date-fns, uuid:** Utility libraries
- **lucide-react:** Icon library
- **react-hot-toast:** Toast notifications

### 3.1 Create Frontend File Structure

```bash
# Still in frontend directory
mkdir -p src/lib
mkdir -p src/components/ui
mkdir -p src/components/forms
mkdir -p src/components/layout
mkdir -p src/components/features
mkdir -p src/hooks
mkdir -p src/stores
mkdir -p src/types
mkdir -p src/utils
```

### 3.2 Create API Client Configuration

Create `frontend/src/lib/api-client.ts`:
```typescript
import axios from 'axios';

// API base URL - points to local backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests automatically
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token refresh on 401 errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken
          });

          const { accessToken } = response.data;
          localStorage.setItem('access_token', accessToken);

          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return apiClient(originalRequest);
        } catch (refreshError) {
          // Refresh failed, logout user
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/auth/login';
          return Promise.reject(refreshError);
        }
      }
    }

    return Promise.reject(error);
  }
);
```

**What this does:**
- Creates axios instance pointing to local backend (localhost:3001)
- Automatically adds auth tokens to requests
- Refreshes tokens when they expire
- **No cloud services** - talks directly to local backend

### 3.3 Create Environment Configuration

Create `frontend/.env.local`:
```env
# Backend API URL (local)
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# App Configuration
NEXT_PUBLIC_APP_NAME=Incident Management System
NEXT_PUBLIC_APP_VERSION=1.0.0

# File Upload Limits
NEXT_PUBLIC_MAX_FILE_SIZE=10485760
```

### 3.4 Update Tailwind Configuration

Edit `frontend/tailwind.config.js`:
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
          100: '#e0f2fe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        danger: {
          50: '#fef2f2',
          100: '#fee2e2',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
        },
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
        },
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

## STEP 4: Root Package.json (Single Command Startup)

Go back to project root and create `package.json`:

```bash
cd ..
```

Create `incident-management/package.json`:
```json
{
  "name": "incident-management",
  "version": "1.0.0",
  "description": "Local-only incident management system",
  "scripts": {
    "setup": "npm run setup:backend && npm run setup:frontend && npm run db:init",
    "setup:backend": "cd backend && npm install",
    "setup:frontend": "cd frontend && npm install",
    "db:init": "cd backend && npm run db:init",
    "db:reset": "cd backend && npm run db:reset",
    "dev": "npm-run-all --parallel dev:backend dev:frontend",
    "dev:backend": "cd backend && npm run dev",
    "dev:frontend": "cd frontend && npm run dev",
    "build": "npm run build:backend && npm run build:frontend",
    "build:backend": "cd backend && npm run build",
    "build:frontend": "cd frontend && npm run build",
    "start": "npm-run-all --parallel start:backend start:frontend",
    "start:backend": "cd backend && npm start",
    "start:frontend": "cd frontend && npm start"
  },
  "devDependencies": {
    "npm-run-all": "^4.1.5"
  }
}
```

Install root dependencies:
```bash
npm install
```

**What this does:**
- **npm run setup:** Installs all dependencies and creates database (run this ONCE)
- **npm run dev:** Starts both backend and frontend with ONE command
- **npm run db:reset:** Deletes and recreates database (useful during development)

---

## STEP 5: Create Setup Verification Script

Create `check-setup.js` in project root:
```javascript
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Checking system requirements...\n');

// Check Node.js version
try {
  const nodeVersion = execSync('node --version', { encoding: 'utf-8' }).trim();
  const majorVersion = parseInt(nodeVersion.match(/v(\d+)/)[1]);

  if (majorVersion >= 18) {
    console.log(`✅ Node.js ${nodeVersion} (required: v18+)`);
  } else {
    console.log(`❌ Node.js ${nodeVersion} - Please upgrade to v18 or higher`);
    process.exit(1);
  }
} catch (error) {
  console.log('❌ Node.js not installed');
  process.exit(1);
}

// Check npm
try {
  const npmVersion = execSync('npm --version', { encoding: 'utf-8' }).trim();
  console.log(`✅ npm ${npmVersion}`);
} catch (error) {
  console.log('❌ npm not installed');
  process.exit(1);
}

// Check git
try {
  const gitVersion = execSync('git --version', { encoding: 'utf-8' }).trim();
  console.log(`✅ ${gitVersion}`);
} catch (error) {
  console.log('⚠️  Git not installed (optional but recommended)');
}

// Check project structure
console.log('\n🗂️  Checking project structure...\n');

const requiredDirs = ['backend', 'frontend'];
const requiredFiles = [
  'backend/package.json',
  'frontend/package.json',
  'backend/.env',
];

requiredDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    console.log(`✅ ${dir}/ directory exists`);
  } else {
    console.log(`❌ ${dir}/ directory missing`);
  }
});

requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} exists`);
  } else {
    console.log(`⚠️  ${file} missing`);
  }
});

console.log('\n🎉 Setup check complete!\n');
console.log('To start development:');
console.log('  npm run dev\n');
```

Run the check:
```bash
node check-setup.js
```

---

## STEP 6: First Time Setup Instructions

### For a Junior Developer - Follow These Steps EXACTLY:

1. **Install Prerequisites:**
   ```bash
   # Check if Node.js is installed
   node --version
   # Should show v18 or higher

   # If not installed, download from: https://nodejs.org/
   ```

2. **Clone or Create Project:**
   ```bash
   # If starting fresh, create directory
   mkdir incident-management
   cd incident-management
   ```

3. **Run Setup (ONE TIME ONLY):**
   ```bash
   # Install all dependencies and create database
   npm run setup
   ```

   **This will:**
   - Install backend dependencies
   - Install frontend dependencies
   - Create SQLite database
   - Set up all tables

4. **Copy Environment Files:**
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env and change JWT_SECRET to a random string
   cd ..
   ```

5. **Start Development:**
   ```bash
   # From project root
   npm run dev
   ```

   **You should see:**
   ```
   Backend running on http://localhost:3001
   Frontend running on http://localhost:3000
   ```

6. **Open Browser:**
   - Go to: http://localhost:3000
   - Backend API: http://localhost:3001/api

---

## CRITICAL GOTCHAS FOR JUNIOR DEVELOPERS

### ❌ Common Mistakes:

1. **"Module not found" errors:**
   - **Fix:** Run `npm run setup` from project root
   - Make sure you're in the right directory

2. **"Port already in use":**
   - **Fix:** Kill the process:
     ```bash
     # On Mac/Linux
     lsof -ti:3000 | xargs kill -9
     lsof -ti:3001 | xargs kill -9

     # On Windows
     netstat -ano | findstr :3000
     taskkill /PID <PID> /F
     ```

3. **Database locked error:**
   - **Fix:** Close all database connections and restart
   - If persists: `npm run db:reset`

4. **CORS errors in browser:**
   - **Fix:** Make sure backend .env has `CORS_ORIGIN=http://localhost:3000`
   - Restart backend after changing .env

5. **TypeScript errors:**
   - **Fix:** Run `npm install` in both backend and frontend
   - Restart your editor/IDE

### ✅ Success Indicators:

You'll know setup worked when:
1. `npm run dev` starts without errors
2. Browser opens to http://localhost:3000
3. You see the landing page (even if it says "404" for some links - that's OK, we'll build those next)
4. Network tab shows API calls to localhost:3001
5. `database.sqlite` file exists in backend directory

---

## EXPECTED OUTCOME

After completing this prompt, you should have:

✅ Complete project structure (backend + frontend)
✅ Local SQLite database (no cloud, no configuration)
✅ Backend API running on localhost:3001
✅ Frontend app running on localhost:3000
✅ Single command startup (`npm run dev`)
✅ Zero external dependencies or paid services
✅ All code running on your local machine
✅ Database tables created and ready
✅ File upload directory created
✅ TypeScript configured for both frontend and backend
✅ Environment variables configured

---

## VERIFICATION CHECKLIST

Run these commands to verify everything works:

```bash
# 1. Check project structure
ls -la
# Should see: backend/ frontend/ package.json

# 2. Check database exists
ls backend/database.sqlite
# Should show the database file

# 3. Start development
npm run dev
# Should start both servers

# 4. Test backend API
curl http://localhost:3001/api/health
# Should return: {"status":"ok"}

# 5. Open frontend
# Go to http://localhost:3000 in browser
```

---

## TROUBLESHOOTING

**Q: "npm: command not found"**
A: Install Node.js from https://nodejs.org/ - it includes npm

**Q: "Permission denied" errors**
A: Don't use `sudo`. If on Mac/Linux, fix permissions:
```bash
sudo chown -R $USER ~/.npm
```

**Q: "Database is locked"**
A: Stop all servers (`Ctrl+C`) and restart with `npm run dev`

**Q: Can I use this without internet?**
A: After initial setup (which downloads packages), YES - everything runs offline

**Q: Where is my data stored?**
A:
- Database: `backend/database.sqlite`
- Files: `backend/uploads/`
- To backup: Copy these files

---

The foundation is now ready for authentication system implementation in PROMPT 2.
```
