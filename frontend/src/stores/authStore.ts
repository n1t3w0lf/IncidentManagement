// ============================================
// ZUSTAND STORE - Authentication
// ============================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Organization, AuthTokens, LoginCredentials, RegisterData } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

// ============================================
// TYPES
// ============================================

interface AuthState {
  // State
  user: User | null;
  organization: Organization | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  fetchCurrentUser: () => Promise<void>;
  refreshTokens: () => Promise<void>;
  clearError: () => void;
  updateUser: (updates: Partial<User>) => void;
}

// ============================================
// STORE
// ============================================

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      organization: null,
      tokens: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Login
      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null });

        try {
          const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error || 'Login failed');
          }

          set({
            user: data.data.user,
            organization: data.data.organization,
            tokens: data.data.tokens,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message,
          });
          throw error;
        }
      },

      // Register
      register: async (data: RegisterData) => {
        set({ isLoading: true, error: null });

        try {
          const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          });

          const result = await response.json();

          if (!response.ok) {
            throw new Error(result.error || 'Registration failed');
          }

          set({
            user: result.data.user,
            organization: result.data.organization,
            tokens: result.data.tokens,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message,
          });
          throw error;
        }
      },

      // Logout
      logout: async () => {
        set({ isLoading: true });

        try {
          await fetch(`${API_URL}/auth/logout`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${get().tokens?.accessToken}`,
            },
          });
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          set({
            user: null,
            organization: null,
            tokens: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      },

      // Fetch current user
      fetchCurrentUser: async () => {
        const { tokens } = get();

        if (!tokens) {
          set({ isAuthenticated: false });
          return;
        }

        set({ isLoading: true });

        try {
          const response = await fetch(`${API_URL}/auth/me`, {
            headers: {
              Authorization: `Bearer ${tokens.accessToken}`,
            },
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error('Failed to fetch user');
          }

          set({
            user: data.data.user,
            organization: data.data.organization,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({
            user: null,
            organization: null,
            tokens: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },

      // Refresh tokens
      refreshTokens: async () => {
        const { tokens } = get();

        if (!tokens) {
          return;
        }

        try {
          const response = await fetch(`${API_URL}/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken: tokens.refreshToken }),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error('Failed to refresh tokens');
          }

          set({ tokens: data.data.tokens });
        } catch (error) {
          // If refresh fails, logout
          get().logout();
        }
      },

      // Clear error
      clearError: () => set({ error: null }),

      // Update user (optimistic update)
      updateUser: (updates: Partial<User>) => {
        const { user } = get();
        if (user) {
          set({ user: { ...user, ...updates } });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        organization: state.organization,
        tokens: state.tokens,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// ============================================
// SELECTORS
// ============================================

export const selectUser = (state: AuthState) => state.user;
export const selectOrganization = (state: AuthState) => state.organization;
export const selectIsAuthenticated = (state: AuthState) => state.isAuthenticated;
export const selectIsLoading = (state: AuthState) => state.isLoading;
export const selectError = (state: AuthState) => state.error;
export const selectUserRole = (state: AuthState) => state.user?.role;
export const selectCanApprove = (state: AuthState) => {
  const role = state.user?.role;
  return role === 'manager' || role === 'admin' || role === 'super_admin';
};
export const selectCanManageUsers = (state: AuthState) => {
  const role = state.user?.role;
  return role === 'admin' || role === 'super_admin';
};
