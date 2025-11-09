// ============================================
// ZUSTAND STORE - Notifications
// ============================================

import { create } from 'zustand';
import type { Notification } from '@/types';
import { useAuthStore } from './authStore';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

// ============================================
// TYPES
// ============================================

interface NotificationState {
  // State
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchNotifications: (unreadOnly?: boolean, limit?: number) => Promise<void>;
  fetchUnreadCount: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  clearError: () => void;
}

// ============================================
// STORE
// ============================================

export const useNotificationStore = create<NotificationState>((set, get) => ({
  // Initial state
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,

  // Fetch notifications
  fetchNotifications: async (unreadOnly = false, limit = 50) => {
    set({ isLoading: true, error: null });

    const tokens = useAuthStore.getState().tokens;

    try {
      const queryParams = new URLSearchParams();
      if (unreadOnly) queryParams.append('unreadOnly', 'true');
      queryParams.append('limit', limit.toString());

      const response = await fetch(`${API_URL}/notifications?${queryParams.toString()}`, {
        headers: {
          Authorization: `Bearer ${tokens?.accessToken}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch notifications');
      }

      set({
        notifications: data.data,
        isLoading: false,
      });

      // Also update unread count
      get().fetchUnreadCount();
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message,
      });
    }
  },

  // Fetch unread count
  fetchUnreadCount: async () => {
    const tokens = useAuthStore.getState().tokens;

    try {
      const response = await fetch(`${API_URL}/notifications/unread-count`, {
        headers: {
          Authorization: `Bearer ${tokens?.accessToken}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch unread count');
      }

      set({ unreadCount: data.data.count });
    } catch (error: any) {
      console.error('Failed to fetch unread count:', error);
    }
  },

  // Mark as read
  markAsRead: async (id: string) => {
    const tokens = useAuthStore.getState().tokens;

    try {
      const response = await fetch(`${API_URL}/notifications/${id}/read`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${tokens?.accessToken}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to mark notification as read');
      }

      // Update local state
      set((state) => ({
        notifications: state.notifications.map((notif) =>
          notif.id === id ? { ...notif, read: true } : notif
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      }));
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  // Mark all as read
  markAllAsRead: async () => {
    const tokens = useAuthStore.getState().tokens;

    try {
      const response = await fetch(`${API_URL}/notifications/mark-all-read`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${tokens?.accessToken}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to mark all notifications as read');
      }

      // Update local state
      set((state) => ({
        notifications: state.notifications.map((notif) => ({ ...notif, read: true })),
        unreadCount: 0,
      }));
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  // Delete notification
  deleteNotification: async (id: string) => {
    const tokens = useAuthStore.getState().tokens;

    try {
      const response = await fetch(`${API_URL}/notifications/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${tokens?.accessToken}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete notification');
      }

      // Update local state
      set((state) => {
        const notification = state.notifications.find((n) => n.id === id);
        return {
          notifications: state.notifications.filter((notif) => notif.id !== id),
          unreadCount: notification && !notification.read ? state.unreadCount - 1 : state.unreadCount,
        };
      });
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  // Clear error
  clearError: () => set({ error: null }),
}));

// ============================================
// SELECTORS
// ============================================

export const selectNotifications = (state: NotificationState) => state.notifications;
export const selectUnreadNotifications = (state: NotificationState) =>
  state.notifications.filter((n) => !n.read);
export const selectUnreadCount = (state: NotificationState) => state.unreadCount;
export const selectIsLoading = (state: NotificationState) => state.isLoading;
export const selectError = (state: NotificationState) => state.error;
