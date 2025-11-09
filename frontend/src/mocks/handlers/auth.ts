// ============================================
// MSW HANDLERS - Authentication
// ============================================

import { http, HttpResponse } from 'msw';
import {
  mockUsers,
  mockOrganizations,
  sessionStorage,
  findUserByEmail,
  addNotification,
} from '../data';
import type { LoginCredentials, RegisterData, AuthTokens, User, Organization } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

// ============================================
// HELPER FUNCTIONS
// ============================================

const generateTokens = (user: User): AuthTokens => {
  return {
    accessToken: `mock_access_token_${user.id}_${Date.now()}`,
    refreshToken: `mock_refresh_token_${user.id}_${Date.now()}`,
    expiresIn: 3600, // 1 hour
  };
};

const generateUserId = (): string => {
  return `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

const generateOrgId = (): string => {
  return `org-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// ============================================
// AUTH HANDLERS
// ============================================

export const authHandlers = [
  // POST /auth/register
  http.post(`${API_URL}/auth/register`, async ({ request }) => {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay

    const body = await request.json() as RegisterData;

    // Validate required fields
    if (!body.email || !body.password || !body.firstName || !body.lastName) {
      return HttpResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = findUserByEmail(body.email);
    if (existingUser) {
      return HttpResponse.json(
        { success: false, error: 'Email already registered' },
        { status: 409 }
      );
    }

    // Validate password strength
    if (body.password.length < 8) {
      return HttpResponse.json(
        { success: false, error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    if (body.password !== body.confirmPassword) {
      return HttpResponse.json(
        { success: false, error: 'Passwords do not match' },
        { status: 400 }
      );
    }

    // Create new organization
    const newOrg: Organization = {
      id: generateOrgId(),
      name: body.organizationName,
      type: body.organizationType,
      settings: {
        allowAnonymousReporting: true,
        allowGuestReporting: true,
        requireApproval: true,
        autoEscalateAfterHours: 24,
      },
      createdAt: new Date().toISOString(),
      isActive: true,
    };
    mockOrganizations.push(newOrg);

    // Create new user as super_admin of their organization
    const newUser: User = {
      id: generateUserId(),
      email: body.email,
      firstName: body.firstName,
      lastName: body.lastName,
      role: 'super_admin',
      organizationId: newOrg.id,
      isActive: true,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };
    mockUsers.push(newUser);

    // Generate tokens
    const tokens = generateTokens(newUser);

    // Set session
    sessionStorage.setUser(newUser);
    sessionStorage.setTokens(tokens);

    return HttpResponse.json({
      success: true,
      data: {
        user: newUser,
        organization: newOrg,
        tokens,
      },
      message: 'Registration successful',
    });
  }),

  // POST /auth/login
  http.post(`${API_URL}/auth/login`, async ({ request }) => {
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay

    const body = await request.json() as LoginCredentials;

    // Validate required fields
    if (!body.email || !body.password) {
      return HttpResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user
    const user = findUserByEmail(body.email);
    if (!user) {
      return HttpResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check if user is active
    if (!user.isActive) {
      return HttpResponse.json(
        { success: false, error: 'Account is deactivated. Please contact support.' },
        { status: 403 }
      );
    }

    // In a real app, we'd verify the password hash
    // For demo, we accept any password for existing users
    // But for realism, let's check if it's not empty
    if (body.password.length < 3) {
      return HttpResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Update last login
    user.lastLoginAt = new Date().toISOString();

    // Generate tokens
    const tokens = generateTokens(user);

    // Set session
    sessionStorage.setUser(user);
    sessionStorage.setTokens(tokens);

    // Find organization
    const organization = mockOrganizations.find(o => o.id === user.organizationId);

    // Create welcome notification
    addNotification({
      id: `notif-${Date.now()}`,
      userId: user.id,
      type: 'incident_assigned',
      title: 'Welcome back!',
      message: `Welcome back, ${user.firstName}! You have new updates.`,
      read: false,
      createdAt: new Date().toISOString(),
    });

    return HttpResponse.json({
      success: true,
      data: {
        user,
        organization,
        tokens,
      },
      message: 'Login successful',
    });
  }),

  // POST /auth/logout
  http.post(`${API_URL}/auth/logout`, async () => {
    await new Promise(resolve => setTimeout(resolve, 300));

    sessionStorage.clearUser();
    sessionStorage.clearTokens();

    return HttpResponse.json({
      success: true,
      message: 'Logout successful',
    });
  }),

  // GET /auth/me
  http.get(`${API_URL}/auth/me`, async () => {
    await new Promise(resolve => setTimeout(resolve, 500));

    const user = sessionStorage.getUser();
    if (!user) {
      return HttpResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const organization = mockOrganizations.find(o => o.id === user.organizationId);

    return HttpResponse.json({
      success: true,
      data: {
        user,
        organization,
      },
    });
  }),

  // POST /auth/refresh
  http.post(`${API_URL}/auth/refresh`, async ({ request }) => {
    await new Promise(resolve => setTimeout(resolve, 400));

    const body = await request.json() as { refreshToken: string };

    const user = sessionStorage.getUser();
    if (!user) {
      return HttpResponse.json(
        { success: false, error: 'Invalid refresh token' },
        { status: 401 }
      );
    }

    // Generate new tokens
    const tokens = generateTokens(user);
    sessionStorage.setTokens(tokens);

    return HttpResponse.json({
      success: true,
      data: { tokens },
    });
  }),

  // POST /auth/forgot-password
  http.post(`${API_URL}/auth/forgot-password`, async ({ request }) => {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const body = await request.json() as { email: string };

    const user = findUserByEmail(body.email);
    // Always return success for security (don't reveal if email exists)

    if (user) {
      console.log(`[MSW] Password reset email sent to: ${body.email}`);
    }

    return HttpResponse.json({
      success: true,
      message: 'If the email exists, a password reset link has been sent.',
    });
  }),

  // POST /auth/reset-password
  http.post(`${API_URL}/auth/reset-password`, async ({ request }) => {
    await new Promise(resolve => setTimeout(resolve, 800));

    const body = await request.json() as { token: string; password: string; confirmPassword: string };

    if (body.password !== body.confirmPassword) {
      return HttpResponse.json(
        { success: false, error: 'Passwords do not match' },
        { status: 400 }
      );
    }

    if (body.password.length < 8) {
      return HttpResponse.json(
        { success: false, error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    // In real app, verify token and update password
    console.log('[MSW] Password reset successful');

    return HttpResponse.json({
      success: true,
      message: 'Password reset successful. You can now login with your new password.',
    });
  }),
];
