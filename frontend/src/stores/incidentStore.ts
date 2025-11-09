// ============================================
// ZUSTAND STORE - Incidents
// ============================================

import { create } from 'zustand';
import type {
  Incident,
  PaginatedResponse,
  SearchFilters,
  PaginationParams,
  IncidentCategory,
} from '@/types';
import { useAuthStore } from './authStore';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

// ============================================
// TYPES
// ============================================

interface IncidentState {
  // State
  incidents: Incident[];
  currentIncident: Incident | null;
  categories: IncidentCategory[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  isLoading: boolean;
  error: string | null;
  filters: SearchFilters;
  selectedIncidents: string[];

  // Actions
  fetchIncidents: (params?: PaginationParams, filters?: SearchFilters) => Promise<void>;
  fetchIncidentById: (id: string) => Promise<void>;
  createIncident: (incident: Partial<Incident>) => Promise<Incident>;
  updateIncident: (id: string, updates: Partial<Incident>) => Promise<void>;
  deleteIncident: (id: string) => Promise<void>;
  addComment: (incidentId: string, comment: string) => Promise<void>;
  fetchCategories: (type?: string) => Promise<void>;
  setFilters: (filters: SearchFilters) => void;
  clearFilters: () => void;
  clearError: () => void;
  clearCurrentIncident: () => void;

  // Bulk actions
  toggleSelectIncident: (id: string) => void;
  toggleSelectAll: () => void;
  clearSelection: () => void;
  bulkDeleteIncidents: (ids: string[]) => Promise<void>;
  bulkUpdateStatus: (ids: string[], status: string) => Promise<void>;
}

// ============================================
// STORE
// ============================================

export const useIncidentStore = create<IncidentState>((set, get) => ({
  // Initial state
  incidents: [],
  currentIncident: null,
  categories: [],
  total: 0,
  page: 1,
  limit: 25,
  totalPages: 0,
  isLoading: false,
  error: null,
  filters: {},
  selectedIncidents: [],

  // Fetch incidents
  fetchIncidents: async (params, filters) => {
    set({ isLoading: true, error: null });

    const tokens = useAuthStore.getState().tokens;

    try {
      // Build query string
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);

      const activeFilters = filters || get().filters;
      if (activeFilters.status) queryParams.append('status', activeFilters.status.join(','));
      if (activeFilters.severity) queryParams.append('severity', activeFilters.severity.join(','));
      if (activeFilters.category) queryParams.append('category', activeFilters.category.join(','));
      if (activeFilters.assignedTo) queryParams.append('assignedTo', activeFilters.assignedTo.join(','));
      if (activeFilters.dateFrom) queryParams.append('dateFrom', activeFilters.dateFrom);
      if (activeFilters.dateTo) queryParams.append('dateTo', activeFilters.dateTo);
      if (activeFilters.search) queryParams.append('search', activeFilters.search);

      const response = await fetch(`${API_URL}/incidents?${queryParams.toString()}`, {
        headers: {
          Authorization: `Bearer ${tokens?.accessToken}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch incidents');
      }

      const data = result.data as PaginatedResponse<Incident>;

      set({
        incidents: data.data,
        total: data.total,
        page: data.page,
        limit: data.limit,
        totalPages: data.totalPages,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message,
      });
    }
  },

  // Fetch single incident
  fetchIncidentById: async (id: string) => {
    set({ isLoading: true, error: null });

    const tokens = useAuthStore.getState().tokens;

    try {
      const response = await fetch(`${API_URL}/incidents/${id}`, {
        headers: {
          Authorization: `Bearer ${tokens?.accessToken}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch incident');
      }

      set({
        currentIncident: data.data,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message,
      });
    }
  },

  // Create incident
  createIncident: async (incident: Partial<Incident>) => {
    set({ isLoading: true, error: null });

    const tokens = useAuthStore.getState().tokens;

    try {
      const response = await fetch(`${API_URL}/incidents`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(tokens && { Authorization: `Bearer ${tokens.accessToken}` }),
        },
        body: JSON.stringify(incident),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create incident');
      }

      // Add to incidents list
      set((state) => ({
        incidents: [data.data, ...state.incidents],
        currentIncident: data.data,
        isLoading: false,
      }));

      return data.data;
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message,
      });
      throw error;
    }
  },

  // Update incident
  updateIncident: async (id: string, updates: Partial<Incident>) => {
    set({ isLoading: true, error: null });

    const tokens = useAuthStore.getState().tokens;

    try {
      const response = await fetch(`${API_URL}/incidents/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokens?.accessToken}`,
        },
        body: JSON.stringify(updates),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update incident');
      }

      // Update in incidents list
      set((state) => ({
        incidents: state.incidents.map((inc) => (inc.id === id ? data.data : inc)),
        currentIncident: state.currentIncident?.id === id ? data.data : state.currentIncident,
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message,
      });
      throw error;
    }
  },

  // Delete incident
  deleteIncident: async (id: string) => {
    set({ isLoading: true, error: null });

    const tokens = useAuthStore.getState().tokens;

    try {
      const response = await fetch(`${API_URL}/incidents/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${tokens?.accessToken}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete incident');
      }

      // Remove from incidents list
      set((state) => ({
        incidents: state.incidents.filter((inc) => inc.id !== id),
        currentIncident: state.currentIncident?.id === id ? null : state.currentIncident,
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message,
      });
      throw error;
    }
  },

  // Add comment
  addComment: async (incidentId: string, comment: string) => {
    const tokens = useAuthStore.getState().tokens;

    try {
      const response = await fetch(`${API_URL}/incidents/${incidentId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokens?.accessToken}`,
        },
        body: JSON.stringify({ comment }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add comment');
      }

      // Refresh current incident to get updated timeline
      if (get().currentIncident?.id === incidentId) {
        get().fetchIncidentById(incidentId);
      }
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },

  // Fetch categories
  fetchCategories: async (type?: string) => {
    set({ isLoading: true, error: null });

    try {
      const queryParams = type ? `?type=${type}` : '';
      const response = await fetch(`${API_URL}/categories${queryParams}`);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch categories');
      }

      set({
        categories: data.data,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message,
      });
    }
  },

  // Set filters
  setFilters: (filters: SearchFilters) => {
    set({ filters });
  },

  // Clear filters
  clearFilters: () => {
    set({ filters: {} });
  },

  // Clear error
  clearError: () => set({ error: null }),

  // Clear current incident
  clearCurrentIncident: () => set({ currentIncident: null }),

  // Toggle select incident
  toggleSelectIncident: (id: string) => {
    set((state) => ({
      selectedIncidents: state.selectedIncidents.includes(id)
        ? state.selectedIncidents.filter((incId) => incId !== id)
        : [...state.selectedIncidents, id],
    }));
  },

  // Toggle select all
  toggleSelectAll: () => {
    set((state) => {
      const allSelected = state.selectedIncidents.length === state.incidents.length;
      return {
        selectedIncidents: allSelected ? [] : state.incidents.map((inc) => inc.id),
      };
    });
  },

  // Clear selection
  clearSelection: () => {
    set({ selectedIncidents: [] });
  },

  // Bulk delete incidents
  bulkDeleteIncidents: async (ids: string[]) => {
    set({ isLoading: true, error: null });

    const tokens = useAuthStore.getState().tokens;

    try {
      // Delete all incidents in parallel
      const deletePromises = ids.map((id) =>
        fetch(`${API_URL}/incidents/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${tokens?.accessToken}`,
          },
        })
      );

      const responses = await Promise.all(deletePromises);
      const failures: string[] = [];

      // Check for failures
      responses.forEach((response, index) => {
        if (!response.ok) {
          failures.push(ids[index]);
        }
      });

      if (failures.length > 0) {
        throw new Error(`Failed to delete ${failures.length} incident(s)`);
      }

      // Remove from incidents list
      set((state) => ({
        incidents: state.incidents.filter((inc) => !ids.includes(inc.id)),
        selectedIncidents: [],
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message,
      });
      throw error;
    }
  },

  // Bulk update status
  bulkUpdateStatus: async (ids: string[], status: string) => {
    set({ isLoading: true, error: null });

    const tokens = useAuthStore.getState().tokens;

    try {
      // Update all incidents in parallel
      const updatePromises = ids.map((id) =>
        fetch(`${API_URL}/incidents/${id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${tokens?.accessToken}`,
          },
          body: JSON.stringify({ status }),
        })
      );

      const responses = await Promise.all(updatePromises);
      const updatedData: Incident[] = [];
      const failures: string[] = [];

      // Collect results
      for (let i = 0; i < responses.length; i++) {
        const response = responses[i];
        if (response.ok) {
          const data = await response.json();
          updatedData.push(data.data);
        } else {
          failures.push(ids[i]);
        }
      }

      if (failures.length > 0) {
        throw new Error(`Failed to update ${failures.length} incident(s)`);
      }

      // Update in incidents list
      set((state) => ({
        incidents: state.incidents.map((inc) => {
          const updated = updatedData.find((u) => u.id === inc.id);
          return updated || inc;
        }),
        selectedIncidents: [],
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message,
      });
      throw error;
    }
  },
}));

// ============================================
// SELECTORS
// ============================================

export const selectIncidents = (state: IncidentState) => state.incidents;
export const selectCurrentIncident = (state: IncidentState) => state.currentIncident;
export const selectCategories = (state: IncidentState) => state.categories;
export const selectPagination = (state: IncidentState) => ({
  total: state.total,
  page: state.page,
  limit: state.limit,
  totalPages: state.totalPages,
});
export const selectFilters = (state: IncidentState) => state.filters;
export const selectIsLoading = (state: IncidentState) => state.isLoading;
export const selectError = (state: IncidentState) => state.error;
