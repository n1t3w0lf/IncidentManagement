# PROMPT 2: AUTHENTICATION SYSTEM WITH MOCK APIs

## Brief Description
This prompt creates a complete authentication system using Mock Service Worker (MSW) to simulate real API calls. You'll implement login, registration, and session management with refresh tokens, plus role-based access control foundation. This system handles anonymous users, guest users, and authenticated users with proper security measures.

## Prerequisites
- Completed PROMPT 1 successfully
- Development server should be running without errors
- Basic understanding of authentication concepts

---

## AI PROMPT

```
You are implementing the authentication system for the incident management platform. This system must handle anonymous users, guest users, and authenticated users with role-based access control using Mock Service Worker for realistic API simulation.

STEP 1: Core Types Definition
Create src/types/auth.ts:
```typescript
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  organizationId: string;
  isActive: boolean;
  createdAt: string;
  lastLoginAt?: string;
}

export interface Organization {
  id: string;
  name: string;
  type: 'corporate' | 'healthcare' | 'mining';
  settings: {
    allowAnonymousReporting: boolean;
    allowGuestReporting: boolean;
    requireApproval: boolean;
  };
  createdAt: string;
  isActive: boolean;
}

export interface UserRole {
  id: string;
  name: string;
  permissions: Permission[];
  isSystemRole: boolean;
}

export interface Permission {
  resource: string;
  actions: ('create' | 'read' | 'update' | 'delete')[];
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  organizationName: string;
  organizationType: Organization['type'];
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
  organization: Organization;
}

// System roles that are created by default
export const SYSTEM_ROLES: UserRole[] = [
  {
    id: 'super_admin',
    name: 'Super Administrator',
    permissions: [
      { resource: '*', actions: ['create', 'read', 'update', 'delete'] }
    ],
    isSystemRole: true
  },
  {
    id: 'admin',
    name: 'Administrator',
    permissions: [
      { resource: 'incidents', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'users', actions: ['create', 'read', 'update'] },
      { resource: 'reports', actions: ['read'] },
      { resource: 'settings', actions: ['read', 'update'] }
    ],
    isSystemRole: true
  },
  {
    id: 'manager',
    name: 'Manager',
    permissions: [
      { resource: 'incidents', actions: ['read', 'update'] },
      { resource: 'users', actions: ['read'] },
      { resource: 'reports', actions: ['read'] }
    ],
    isSystemRole: true
  },
  {
    id: 'user',
    name: 'Standard User',
    permissions: [
      { resource: 'incidents', actions: ['create', 'read'] },
      { resource: 'own_incidents', actions: ['read', 'update'] }
    ],
    isSystemRole: true
  },
  {
    id: 'reporter',
    name: 'Reporter',
    permissions: [
      { resource: 'incidents', actions: ['create'] }
    ],
    isSystemRole: true
  }
];
```

STEP 2: Mock Service Worker Setup
Create src/mocks/browser.ts:
```typescript
import { setupWorker } from 'msw/browser';
import { authHandlers } from './handlers/auth';
import { organizationHandlers } from './handlers/organization';

export const worker = setupWorker(...authHandlers, ...organizationHandlers);

// Initialize mock data if not exists
if (typeof window !== 'undefined') {
  const initializeMockData = () => {
    if (!localStorage.getItem('mock_organizations')) {
      localStorage.setItem('mock_organizations', JSON.stringify([]));
    }
    if (!localStorage.getItem('mock_users')) {
      localStorage.setItem('mock_users', JSON.stringify([]));
    }
  };
  
  initializeMockData();
}
```

Create src/mocks/handlers/auth.ts:
```typescript
import { http, HttpResponse } from 'msw';
import { User, AuthTokens, LoginCredentials, RegisterData, Organization, SYSTEM_ROLES } from '@/types/auth';

// Mock data storage keys
const USERS_KEY = 'mock_users';
const ORGANIZATIONS_KEY = 'mock_organizations';

// Get users from localStorage
const getUsers = (): User[] => {
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
};

// Save users to localStorage
const saveUsers = (users: User[]) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

// Get organizations from localStorage
const getOrganizations = (): Organization[] => {
  const orgs = localStorage.getItem(ORGANIZATIONS_KEY);
  return orgs ? JSON.parse(orgs) : [];
};

// Save organizations to localStorage
const saveOrganizations = (organizations: Organization[]) => {
  localStorage.setItem(ORGANIZATIONS_KEY, JSON.stringify(organizations));
};

// Generate mock JWT tokens
const generateTokens = (userId: string): AuthTokens => {
  const accessToken = btoa(JSON.stringify({ 
    userId, 
    exp: Date.now() + 15 * 60 * 1000 // 15 minutes
  }));
  const refreshToken = btoa(JSON.stringify({ 
    userId, 
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
  }));
  
  return {
    accessToken,
    refreshToken,
    expiresIn: 15 * 60 // 15 minutes
  };
};

// Validate email format
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Create default organization
const createOrganization = (name: string, type: Organization['type']): Organization => {
  return {
    id: `org_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name,
    type,
    settings: {
      allowAnonymousReporting: true,
      allowGuestReporting: true,
      requireApproval: type === 'healthcare' // Healthcare requires approval by default
    },
    createdAt: new Date().toISOString(),
    isActive: true
  };
};

export const authHandlers = [
  // Login endpoint
  http.post('/api/auth/login', async ({ request }) => {
    const { email, password } = await request.json() as LoginCredentials;
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Validation
    if (!email || !password) {
      return HttpResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return HttpResponse.json(
        { message: 'Invalid email format' },
        { status: 400 }
      );
    }
    
    const users = getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.isActive);
    
    if (!user) {
      return HttpResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    // Mock password validation (in real app, use bcrypt)
    // For demo purposes, accept 'password123' or 'demo123'
    if (password !== 'password123' && password !== 'demo123') {
      return HttpResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    const tokens = generateTokens(user.id);
    
    // Update last login
    user.lastLoginAt = new Date().toISOString();
    saveUsers(users);
    
    // Get organization
    const organizations = getOrganizations();
    const organization = organizations.find(org => org.id === user.organizationId);
    
    return HttpResponse.json({
      user,
      tokens,
      organization
    }, { status: 200 });
  }),

  // Register endpoint
  http.post('/api/auth/register', async ({ request }) => {
    const data = await request.json() as RegisterData;
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Validation
    const { email, password, confirmPassword, firstName, lastName, organizationName, organizationType } = data;
    
    if (!email || !password || !firstName || !lastName || !organizationName) {
      return HttpResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return HttpResponse.json(
        { message: 'Invalid email format' },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return HttpResponse.json(
        { message: 'Passwords do not match' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return HttpResponse.json(
        { message: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }
    
    const users = getUsers();
    
    // Check if user already exists
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      return HttpResponse.json(
        { message: 'User with this email already exists' },
        { status: 409 }
      );
    }
    
    // Create organization
    const organization = createOrganization(organizationName, organizationType);
    const organizations = getOrganizations();
    organizations.push(organization);
    saveOrganizations(organizations);
    
    // Create user (first user becomes admin)
    const isFirstUser = users.length === 0;
    const newUser: User = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      email: email.toLowerCase(),
      firstName,
      lastName,
      role: SYSTEM_ROLES.find(r => r.id === (isFirstUser ? 'admin' : 'user'))!,
      organizationId: organization.id,
      isActive: true,
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    saveUsers(users);
    
    const tokens = generateTokens(newUser.id);
    
    return HttpResponse.json({
      user: newUser,
      tokens,
      organization
    }, { status: 201 });
  }),

  // Refresh token endpoint
  http.post('/api/auth/refresh', async ({ request }) => {
    const { refreshToken } = await request.json() as { refreshToken: string };
    
    if (!refreshToken) {
      return HttpResponse.json(
        { message: 'Refresh token is required' },
        { status: 400 }
      );
    }
    
    try {
      const decoded = JSON.parse(atob(refreshToken));
      
      if (decoded.exp < Date.now()) {
        return HttpResponse.json(
          { message: 'Refresh token expired' },
          { status: 401 }
        );
      }
      
      // Verify user still exists
      const users = getUsers();
      const user = users.find(u => u.id === decoded.userId && u.isActive);
      
      if (!user) {
        return HttpResponse.json(
          { message: 'User not found' },
          { status: 404 }
        );
      }
      
      const tokens = generateTokens(decoded.userId);
      
      return HttpResponse.json({ tokens }, { status: 200 });
    } catch {
      return HttpResponse.json(
        { message: 'Invalid refresh token' },
        { status: 401 }
      );
    }
  }),

  // Get current user
  http.get('/api/auth/me', async ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader?.startsWith('Bearer ')) {
      return HttpResponse.json(
        { message: 'No token provided' },
        { status: 401 }
      );
    }
    
    try {
      const token = authHeader.replace('Bearer ', '');
      const decoded = JSON.parse(atob(token));
      
      if (decoded.exp < Date.now()) {
        return HttpResponse.json(
          { message: 'Token expired' },
          { status: 401 }
        );
      }
      
      const users = getUsers();
      const user = users.find(u => u.id === decoded.userId && u.isActive);
      
      if (!user) {
        return HttpResponse.json(
          { message: 'User not found' },
          { status: 404 }
        );
      }

      const organizations = getOrganizations();
      const organization = organizations.find(org => org.id === user.organizationId);
      
      return HttpResponse.json({ 
        user,
        organization 
      }, { status: 200 });
    } catch {
      return HttpResponse.json(
        { message: 'Invalid token' },
        { status: 401 }
      );
    }
  }),

  // Logout endpoint
  http.post('/api/auth/logout', async () => {
    // In a real app, you'd invalidate the token server-side
    await new Promise(resolve => setTimeout(resolve, 300));
    return HttpResponse.json(
      { message: 'Logged out successfully' },
      { status: 200 }
    );
  })
];
```

Create src/mocks/handlers/organization.ts:
```typescript
import { http, HttpResponse } from 'msw';
import { Organization } from '@/types/auth';

export const organizationHandlers = [
  // Get organization details
  http.get('/api/organizations/:id', async ({ params }) => {
    const { id } = params;
    const organizations = JSON.parse(localStorage.getItem('mock_organizations') || '[]');
    const organization = organizations.find((org: Organization) => org.id === id);
    
    if (!organization) {
      return HttpResponse.json(
        { message: 'Organization not found' },
        { status: 404 }
      );
    }
    
    return HttpResponse.json({ organization }, { status: 200 });
  })
];
```

STEP 3: Zustand Auth Store
Create src/stores/authStore.ts:
```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, AuthTokens, RegisterData, Organization } from '@/types/auth';

interface AuthState {
  user: User | null;
  organization: Organization | null;
  tokens: AuthTokens | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  refreshTokens: () => Promise<void>;
  getCurrentUser: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      organization: null,
      tokens: null,
      isLoading: false,
      isAuthenticated: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
          });
          
          const data = await response.json();
          
          if (!response.ok) {
            throw new Error(data.message || 'Login failed');
          }
          
          const { user, tokens, organization } = data;
          
          set({
            user,
            organization,
            tokens,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'Login failed' 
          });
          throw error;
        }
      },

      register: async (data: RegisterData) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
          });
          
          const responseData = await response.json();
          
          if (!response.ok) {
            throw new Error(responseData.message || 'Registration failed');
          }
          
          const { user, tokens, organization } = responseData;
          
          set({
            user,
            organization,
            tokens,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'Registration failed' 
          });
          throw error;
        }
      },

      logout: () => {
        // Call logout endpoint (optional since tokens are client-side only)
        fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
        
        set({
          user: null,
          organization: null,
          tokens: null,
          isAuthenticated: false,
          error: null
        });
      },

      refreshTokens: async () => {
        const { tokens } = get();
        
        if (!tokens?.refreshToken) {
          throw new Error('No refresh token available');
        }
        
        try {
          const response = await fetch('/api/auth/refresh', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken: tokens.refreshToken })
          });
          
          if (!response.ok) {
            // Refresh token is invalid, logout user
            get().logout();
            throw new Error('Session expired');
          }
          
          const { tokens: newTokens } = await response.json();
          
          set({ tokens: newTokens });
        } catch (error) {
          get().logout();
          throw error;
        }
      },

      getCurrentUser: async () => {
        const { tokens } = get();
        
        if (!tokens?.accessToken) {
          return;
        }
        
        try {
          const response = await fetch('/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${tokens.accessToken}`
            }
          });
          
          if (response.ok) {
            const { user, organization } = await response.json();
            set({ user, organization });
          } else if (response.status === 401) {
            // Token expired, try to refresh
            await get().refreshTokens();
          }
        } catch (error) {
          console.error('Failed to get current user:', error);
        }
      },

      setLoading: (loading: boolean) => set({ isLoading: loading }),
      
      clearError: () => set({ error: null })
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        organization: state.organization,
        tokens: state.tokens,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);
```

STEP 4: Authentication Pages
Create src/app/auth/login/page.tsx:
```typescript
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { ROUTES } from '@/utils/constants';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error, clearError } = useAuthStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    try {
      await login(email, password);
      router.push(ROUTES.DASHBOARD);
    } catch (error) {
      // Error is handled in the store
      console.error('Login error:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link href={ROUTES.REGISTER} className="font-medium text-blue-600 hover:text-blue-500">
              create a new account
            </Link>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="relative">
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                <span className="text-gray-400 text-sm">
                  {showPassword ? 'Hide' : 'Show'}
                </span>
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>

          <div className="text-center">
            <Link
              href={ROUTES.HOME}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              ← Back to home
            </Link>
          </div>
        </form>

        {/* Demo credentials */}
        <div className="mt-6 p-4 bg-blue-50 rounded-md">
          <h4 className="text-sm font-medium text-blue-800 mb-2">Demo Credentials</h4>
          <p className="text-xs text-blue-600">
            You can register a new account or use demo credentials:
            <br />
            <strong>Password:</strong> password123 or demo123
          </p>
        </div>
      </div>
    </div>
  );
}
```

Create src/app/auth/register/page.tsx:
```typescript
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { RegisterData, Organization } from '@/types/auth';
import { ROUTES } from '@/utils/constants';

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading, error, clearError } = useAuthStore();
  
  const [formData, setFormData] = useState<RegisterData>({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    organizationName: '',
    organizationType: 'corporate'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    try {
      await register(formData);
      router.push(ROUTES.DASHBOARD);
    } catch (error) {
      // Error is handled in the store
      console.error('Registration error:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link href={ROUTES.LOGIN} className="font-medium text-blue-600 hover:text-blue-500">
              Sign in
            </Link>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Personal Information */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            {/* Password Fields */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={formData.password}
                onChange={handleChange}
              />
              <p className="mt-1 text-xs text-gray-500">
                Must be at least 8 characters long
              </p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>

            {/* Organization Information */}
            <div className="border-t pt-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Organization Details</h3>
              
              <div>
                <label htmlFor="organizationName" className="block text-sm font-medium text-gray-700">
                  Organization Name
                </label>
                <input
                  id="organizationName"
                  name="organizationName"
                  type="text"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={formData.organizationName}
                  onChange={handleChange}
                />
              </div>

              <div className="mt-4">
                <label htmlFor="organizationType" className="block text-sm font-medium text-gray-700">
                  Organization Type
                </label>
                <select
                  id="organizationType"
                  name="organizationType"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={formData.organizationType}
                  onChange={handleChange}
                >
                  <option value="corporate">Corporate/IT</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="mining">Mining/Industrial</option>
                </select>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating account...' : 'Create account'}
            </button>
          </div>

          <div className="text-center">
            <Link
              href={ROUTES.HOME}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              ← Back to home
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
```

STEP 5: Initialize MSW in App Layout
Update src/app/layout.tsx:
```typescript
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Incident Management System',
  description: 'Professional incident management and reporting system',
}

// Initialize MSW for browser
if (typeof window !== 'undefined') {
  const initMSW = async () => {
    const { worker } = await import('@/mocks/browser');
    await worker.start({
      onUnhandledRequest: 'bypass',
      quiet: true
    });
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

STEP 6: Protected Route Component
Create src/components/auth/ProtectedRoute.tsx:
```typescript
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { ROUTES } from '@/utils/constants';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true,
  redirectTo = ROUTES.LOGIN
}) => {
  const router = useRouter();
  const { isAuthenticated, isLoading, getCurrentUser } = useAuthStore();

  useEffect(() => {
    // Try to get current user if we have tokens but no user
    getCurrentUser();
  }, [getCurrentUser]);

  useEffect(() => {
    if (!isLoading) {
      if (requireAuth && !isAuthenticated) {
        router.push(redirectTo);
      } else if (!requireAuth && isAuthenticated) {
        router.push(ROUTES.DASHBOARD);
      }
    }
  }, [isAuthenticated, isLoading, requireAuth, redirectTo, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (requireAuth && !isAuthenticated) {
    return null;
  }

  if (!requireAuth && isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};
```

CRITICAL GOTCHAS & THINGS TO WATCH OUT FOR:
1. MSW MUST be initialized before any API calls - it's in layout.tsx
2. LocalStorage is used for mock persistence - clear it if you get weird data
3. Mock JWT tokens are NOT secure - they're base64 encoded JSON for demo only
4. The refresh token logic runs automatically - don't call it manually unless needed
5. User registration creates both user and organization - this is intentional
6. Default passwords for demo are 'password123' or 'demo123' - document this for testing
7. The auth store persists to localStorage - clear it for fresh start
8. MSW handlers must return proper HTTP status codes for error handling
9. First registered user becomes admin automatically
10. Email addresses are stored in lowercase for consistency

EXPECTED OUTCOME:
After completing this prompt, you should have:
- Complete authentication system with login/register/logout
- Mock API endpoints that simulate real backend behavior
- Persistent authentication state using Zustand
- Proper token management with refresh token logic
- Role-based access control foundation with system roles
- Local storage-based user/organization data persistence
- Professional login and registration forms
- Protected route component for securing pages
- Error handling and loading states

TESTING THE IMPLEMENTATION:
1. Navigate to localhost:3000
2. Click "Login / Register" from home page
3. Register a new user - should create account and redirect to dashboard (will be 404 for now)
4. Open browser DevTools → Application → Local Storage
5. Verify 'auth-storage', 'mock_users', and 'mock_organizations' keys exist
6. Logout and login again with same credentials
7. Check Network tab to see MSW intercepting API calls
8. Try invalid credentials to test error handling

The authentication system should be complete and ready for the incident reporting implementation.
```

---

## Microservices Architecture & Production Deployment

This authentication system is designed for both **local development** (using MSW) and **production deployment** (using microservices).

### Production Architecture
In production, authentication is handled by a dedicated **Auth Service** microservice:
- **Auth Service** (Port 5001): JWT-based authentication and authorization
- **User Service** (Port 5003): User profile management
- **Organization Service** (Port 5005): Organization settings and configuration
- **API Gateway** (Port 4000): Routes all requests, validates tokens

### Database Architecture
- **auth_db**: PostgreSQL database for users, roles, and permissions
- **Redis**: Session management and token caching
- Separate database instances for service isolation

### Deployment
For production deployment with Docker:
```bash
# Start authentication services
docker-compose up -d postgres-auth redis api-gateway auth-service user-service organization-service

# Check service health
curl http://localhost:5001/health
curl http://localhost:4000/health
```

### Migration from MSW to Production
1. **Development**: Use MSW for local testing (this prompt)
2. **Staging**: Deploy microservices with Docker Compose
3. **Production**: Use same Docker setup with security hardening

### Security Enhancements for Production
- JWT secrets stored in Docker secrets
- HTTPS/TLS termination at NGINX
- Rate limiting at API Gateway
- Database connection pooling
- Token rotation and refresh
- Password complexity requirements
- Account lockout after failed attempts

### Documentation
- **Deployment Guide**: [DEPLOYMENT_GUIDE.md](../DEPLOYMENT_GUIDE.md)
- **Architecture Details**: [MICROSERVICES_ARCHITECTURE.md](../MICROSERVICES_ARCHITECTURE.md)
- **Security Configuration**: See deployment guide security section

The development setup (MSW) allows you to work on the frontend independently, while the production setup provides a scalable, secure authentication system with proper service isolation.
