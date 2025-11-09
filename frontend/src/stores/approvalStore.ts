// ============================================
// APPROVAL STORE - Zustand State Management
// ============================================

import { create } from 'zustand';
import type { ApprovalRequest } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

interface ApprovalState {
  approvals: ApprovalRequest[];
  currentApproval: ApprovalRequest | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchApprovals: (status?: string) => Promise<void>;
  fetchApprovalById: (id: string) => Promise<void>;
  approveRequest: (id: string, comments?: string) => Promise<ApprovalRequest>;
  rejectRequest: (id: string, reason: string, comments?: string) => Promise<ApprovalRequest>;
  clearError: () => void;
}

export const useApprovalStore = create<ApprovalState>((set, get) => ({
  approvals: [],
  currentApproval: null,
  isLoading: false,
  error: null,

  fetchApprovals: async (status?: string) => {
    set({ isLoading: true, error: null });

    try {
      const url = new URL(`${API_URL}/approvals`);
      if (status) {
        url.searchParams.set('status', status);
      }

      const response = await fetch(url.toString(), {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch approvals');
      }

      const data = await response.json();
      set({ approvals: data.data, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  fetchApprovalById: async (id: string) => {
    set({ isLoading: true, error: null });

    try {
      const response = await fetch(`${API_URL}/approvals/${id}`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch approval');
      }

      const data = await response.json();
      set({ currentApproval: data.data, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  approveRequest: async (id: string, comments?: string) => {
    const response = await fetch(`${API_URL}/approvals/${id}/approve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ comments }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Failed to approve request');
    }

    const data = await response.json();

    // Update the approval in the list
    set((state) => ({
      approvals: state.approvals.map((a) =>
        a.id === id ? data.data : a
      ),
      currentApproval: state.currentApproval?.id === id ? data.data : state.currentApproval,
    }));

    return data.data;
  },

  rejectRequest: async (id: string, reason: string, comments?: string) => {
    const response = await fetch(`${API_URL}/approvals/${id}/reject`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ reason, comments }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Failed to reject request');
    }

    const data = await response.json();

    // Update the approval in the list
    set((state) => ({
      approvals: state.approvals.map((a) =>
        a.id === id ? data.data : a
      ),
      currentApproval: state.currentApproval?.id === id ? data.data : state.currentApproval,
    }));

    return data.data;
  },

  clearError: () => set({ error: null }),
}));
