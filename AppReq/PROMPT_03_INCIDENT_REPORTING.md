# PROMPT 3: INCIDENT REPORTING SYSTEM

## Brief Description
This prompt creates the core incident reporting system with forms for anonymous, guest, and authenticated users. You'll implement file uploads, severity classification, industry-specific categories, location tracking, and local storage persistence. The system supports multi-industry usage with flexible form validation and comprehensive incident data capture.

## Prerequisites
- Completed PROMPT 1 and PROMPT 2 successfully
- Authentication system working properly
- Basic understanding of form handling and validation

---

## AI PROMPT

```
You are implementing the core incident reporting system that supports three types of reporters: anonymous users, guest users (with basic info), and authenticated users. The system must handle file uploads, incident classification, industry-specific categories, and store everything locally using Mock Service Worker.

STEP 1: Incident Types and Data Models
Create src/types/incident.ts:
```typescript
export interface Incident {
  id: string;
  title: string;
  description: string;
  severity: IncidentSeverity;
  category: IncidentCategory;
  status: IncidentStatus;
  reporterType: 'anonymous' | 'guest' | 'user';
  reporterInfo: ReporterInfo;
  organizationId?: string;
  location?: IncidentLocation;
  attachments: IncidentAttachment[];
  timeline: IncidentTimelineEntry[];
  assignedTo?: string[];
  tags: string[];
  customFields: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
}

export interface ReporterInfo {
  reporterType: 'anonymous' | 'guest' | 'user';
  
  // For guest reporters
  name?: string;
  email?: string;
  phone?: string;
  relationship?: string; // "Employee", "Visitor", "Contractor", etc.
  
  // For authenticated users
  userId?: string;
  
  // Tracking reference for anonymous/guest
  trackingId?: string;
}

export interface IncidentLocation {
  type: 'gps' | 'manual' | 'facility';
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  address?: string;
  facility?: string;
  department?: string;
  room?: string;
  equipment?: string;
  details?: string;
}

export interface IncidentAttachment {
  id: string;
  filename: string;
  originalName: string;
  fileType: string;
  fileSize: number;
  url: string; // blob URL for mock implementation
  uploadedAt: string;
  uploadedBy: string;
  description?: string;
}

export interface IncidentTimelineEntry {
  id: string;
  action: IncidentTimelineAction;
  description: string;
  performedBy: string;
  performedAt: string;
  metadata?: Record<string, any>;
}

export type IncidentTimelineAction = 
  | 'created'
  | 'updated' 
  | 'status_changed'
  | 'assigned'
  | 'comment_added'
  | 'attachment_added'
  | 'resolved'
  | 'closed';

export type IncidentSeverity = 'low' | 'medium' | 'high' | 'critical';

export type IncidentStatus = 
  | 'draft'
  | 'submitted'
  | 'under_review'
  | 'investigating'
  | 'pending_approval'
  | 'approved'
  | 'in_progress'
  | 'resolved'
  | 'closed'
  | 'rejected';

export interface IncidentCategory {
  id: string;
  name: string;
  description?: string;
  type: 'corporate' | 'healthcare' | 'mining' | 'general';
  requiresApproval: boolean;
  defaultSeverity: IncidentSeverity;
  requiredFields: string[];
  customFields?: CustomField[];
}

export interface CustomField {
  id: string;
  name: string;
  type: 'text' | 'textarea' | 'select' | 'multiselect' | 'date' | 'number' | 'boolean';
  required: boolean;
  options?: string[]; // For select/multiselect
  placeholder?: string;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}

// Pre-defined categories for each industry
export const INCIDENT_CATEGORIES: IncidentCategory[] = [
  // General categories (available to all)
  {
    id: 'general_safety',
    name: 'General Safety Incident',
    description: 'Any safety-related incident or concern',
    type: 'general',
    requiresApproval: true,
    defaultSeverity: 'medium',
    requiredFields: ['location', 'description'],
    customFields: []
  },
  {
    id: 'general_security',
    name: 'Security Incident',
    description: 'Security breaches or concerns',
    type: 'general',
    requiresApproval: true,
    defaultSeverity: 'high',
    requiredFields: ['description'],
    customFields: []
  },
  
  // Corporate IT categories
  {
    id: 'it_security_breach',
    name: 'IT Security Breach',
    description: 'Unauthorized access to systems or data',
    type: 'corporate',
    requiresApproval: true,
    defaultSeverity: 'critical',
    requiredFields: ['affected_systems', 'description'],
    customFields: [
      {
        id: 'affected_systems',
        name: 'Affected Systems',
        type: 'textarea',
        required: true,
        placeholder: 'List all affected systems and services'
      },
      {
        id: 'data_compromised',
        name: 'Data Compromised?',
        type: 'boolean',
        required: true
      }
    ]
  },
  {
    id: 'it_system_outage',
    name: 'System Outage',
    description: 'Service disruptions or system downtime',
    type: 'corporate',
    requiresApproval: false,
    defaultSeverity: 'high',
    requiredFields: ['affected_systems', 'impact'],
    customFields: [
      {
        id: 'affected_systems',
        name: 'Affected Systems',
        type: 'textarea',
        required: true,
        placeholder: 'Systems experiencing outage'
      },
      {
        id: 'impact',
        name: 'Business Impact',
        type: 'select',
        required: true,
        options: ['Low', 'Medium', 'High', 'Critical']
      }
    ]
  },
  {
    id: 'it_data_loss',
    name: 'Data Loss',
    description: 'Accidental or intentional data deletion/corruption',
    type: 'corporate',
    requiresApproval: true,
    defaultSeverity: 'critical',
    requiredFields: ['data_affected', 'cause'],
    customFields: [
      {
        id: 'data_affected',
        name: 'Data Affected',
        type: 'textarea',
        required: true,
        placeholder: 'Describe the data that was lost'
      },
      {
        id: 'cause',
        name: 'Cause',
        type: 'select',
        required: true,
        options: ['Human Error', 'System Failure', 'Malicious Activity', 'Unknown']
      }
    ]
  },
  
  // Healthcare categories
  {
    id: 'patient_safety_event',
    name: 'Patient Safety Event',
    description: 'Any event affecting patient safety or care quality',
    type: 'healthcare',
    requiresApproval: true,
    defaultSeverity: 'high',
    requiredFields: ['patient_impact', 'clinical_area'],
    customFields: [
      {
        id: 'patient_impact',
        name: 'Patient Impact',
        type: 'select',
        required: true,
        options: ['No Harm', 'Minor Harm', 'Moderate Harm', 'Severe Harm', 'Death']
      },
      {
        id: 'clinical_area',
        name: 'Clinical Area',
        type: 'select',
        required: true,
        options: ['Emergency', 'Surgery', 'ICU', 'Medical Ward', 'Pharmacy', 'Laboratory', 'Radiology', 'Other']
      }
    ]
  },
  {
    id: 'medication_error',
    name: 'Medication Error',
    description: 'Errors in prescribing, dispensing, or administering medications',
    type: 'healthcare',
    requiresApproval: true,
    defaultSeverity: 'high',
    requiredFields: ['medication_name', 'error_type'],
    customFields: [
      {
        id: 'medication_name',
        name: 'Medication Name',
        type: 'text',
        required: true,
        placeholder: 'Name of medication involved'
      },
      {
        id: 'error_type',
        name: 'Error Type',
        type: 'select',
        required: true,
        options: ['Wrong Patient', 'Wrong Medication', 'Wrong Dose', 'Wrong Route', 'Wrong Time', 'Omitted Dose']
      }
    ]
  },
  {
    id: 'device_malfunction',
    name: 'Medical Device Malfunction',
    description: 'Medical equipment failures or malfunctions',
    type: 'healthcare',
    requiresApproval: true,
    defaultSeverity: 'medium',
    requiredFields: ['device_info', 'patient_impact'],
    customFields: [
      {
        id: 'device_info',
        name: 'Device Information',
        type: 'textarea',
        required: true,
        placeholder: 'Device name, model, serial number'
      },
      {
        id: 'patient_impact',
        name: 'Patient Impact',
        type: 'select',
        required: true,
        options: ['No Impact', 'Delayed Treatment', 'Injury', 'Serious Injury']
      }
    ]
  },
  
  // Mining/Industrial categories
  {
    id: 'mining_workplace_injury',
    name: 'Workplace Injury',
    description: 'Any injury occurring in the workplace',
    type: 'mining',
    requiresApproval: true,
    defaultSeverity: 'critical',
    requiredFields: ['injury_type', 'body_part', 'equipment_involved'],
    customFields: [
      {
        id: 'injury_type',
        name: 'Injury Type',
        type: 'select',
        required: true,
        options: ['Laceration', 'Fracture', 'Burn', 'Crush', 'Chemical Exposure', 'Fall', 'Strain/Sprain', 'Other']
      },
      {
        id: 'body_part',
        name: 'Body Part Affected',
        type: 'select',
        required: true,
        options: ['Head', 'Eyes', 'Back', 'Arms/Hands', 'Legs/Feet', 'Chest', 'Multiple', 'Other']
      },
      {
        id: 'equipment_involved',
        name: 'Equipment Involved',
        type: 'text',
        required: true,
        placeholder: 'Equipment or machinery involved'
      }
    ]
  },
  {
    id: 'mining_near_miss',
    name: 'Near Miss',
    description: 'Incidents that could have resulted in injury or damage',
    type: 'mining',
    requiresApproval: false,
    defaultSeverity: 'medium',
    requiredFields: ['potential_outcome', 'root_cause'],
    customFields: [
      {
        id: 'potential_outcome',
        name: 'Potential Outcome',
        type: 'textarea',
        required: true,
        placeholder: 'What could have happened?'
      },
      {
        id: 'root_cause',
        name: 'Root Cause',
        type: 'select',
        required: true,
        options: ['Equipment Failure', 'Human Error', 'Unsafe Conditions', 'Inadequate Training', 'Poor Communication']
      }
    ]
  },
  {
    id: 'mining_environmental',
    name: 'Environmental Incident',
    description: 'Environmental impact or regulatory violation',
    type: 'mining',
    requiresApproval: true,
    defaultSeverity: 'high',
    requiredFields: ['environmental_impact', 'substances_involved'],
    customFields: [
      {
        id: 'environmental_impact',
        name: 'Environmental Impact',
        type: 'select',
        required: true,
        options: ['Spill', 'Air Emission', 'Water Contamination', 'Soil Contamination', 'Noise', 'Other']
      },
      {
        id: 'substances_involved',
        name: 'Substances Involved',
        type: 'textarea',
        required: true,
        placeholder: 'List chemicals or materials involved'
      }
    ]
  }
];

export const SEVERITY_CONFIG = {
  low: {
    label: 'Low',
    color: 'bg-green-100 text-green-800',
    description: 'Minor incident with minimal impact'
  },
  medium: {
    label: 'Medium',
    color: 'bg-yellow-100 text-yellow-800',
    description: 'Moderate incident requiring attention'
  },
  high: {
    label: 'High',
    color: 'bg-orange-100 text-orange-800',
    description: 'Serious incident requiring immediate attention'
  },
  critical: {
    label: 'Critical',
    color: 'bg-red-100 text-red-800',
    description: 'Critical incident requiring urgent response'
  }
} as const;

export const STATUS_CONFIG = {
  draft: { label: 'Draft', color: 'bg-gray-100 text-gray-800' },
  submitted: { label: 'Submitted', color: 'bg-blue-100 text-blue-800' },
  under_review: { label: 'Under Review', color: 'bg-yellow-100 text-yellow-800' },
  investigating: { label: 'Investigating', color: 'bg-orange-100 text-orange-800' },
  pending_approval: { label: 'Pending Approval', color: 'bg-purple-100 text-purple-800' },
  approved: { label: 'Approved', color: 'bg-indigo-100 text-indigo-800' },
  in_progress: { label: 'In Progress', color: 'bg-blue-100 text-blue-800' },
  resolved: { label: 'Resolved', color: 'bg-green-100 text-green-800' },
  closed: { label: 'Closed', color: 'bg-gray-100 text-gray-800' },
  rejected: { label: 'Rejected', color: 'bg-red-100 text-red-800' }
} as const;
```

STEP 2: Mock API Handlers for Incidents
Create src/mocks/handlers/incidents.ts:
```typescript
import { http, HttpResponse } from 'msw';
import { Incident, IncidentAttachment } from '@/types/incident';

const INCIDENTS_KEY = 'mock_incidents';

const getIncidents = (): Incident[] => {
  const incidents = localStorage.getItem(INCIDENTS_KEY);
  return incidents ? JSON.parse(incidents) : [];
};

const saveIncidents = (incidents: Incident[]) => {
  localStorage.setItem(INCIDENTS_KEY, JSON.stringify(incidents));
};

const generateTrackingId = (): string => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substr(2, 4).toUpperCase();
  return `INC-${timestamp}-${random}`;
};

const generateId = (prefix: string): string => {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const incidentHandlers = [
  // Create incident (anonymous/guest/user)
  http.post('/api/incidents', async ({ request }) => {
    const incidentData = await request.json() as Partial<Incident>;
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500));
    
    const incidents = getIncidents();
    
    const newIncident: Incident = {
      id: generateId('incident'),
      title: incidentData.title || '',
      description: incidentData.description || '',
      severity: incidentData.severity || 'medium',
      category: incidentData.category!,
      status: incidentData.category?.requiresApproval ? 'pending_approval' : 'submitted',
      reporterType: incidentData.reporterType!,
      reporterInfo: {
        ...incidentData.reporterInfo!,
        trackingId: generateTrackingId()
      },
      organizationId: incidentData.organizationId,
      location: incidentData.location,
      attachments: incidentData.attachments || [],
      tags: incidentData.tags || [],
      customFields: incidentData.customFields || {},
      timeline: [{
        id: generateId('timeline'),
        action: 'created',
        description: `Incident reported by ${incidentData.reporterType}`,
        performedBy: incidentData.reporterType === 'user' ? 
          incidentData.reporterInfo?.userId || 'system' : 'anonymous',
        performedAt: new Date().toISOString(),
        metadata: {
          reporterType: incidentData.reporterType
        }
      }],
      assignedTo: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    incidents.push(newIncident);
    saveIncidents(incidents);
    
    return HttpResponse.json({
      incident: newIncident,
      trackingId: newIncident.reporterInfo.trackingId,
      message: 'Incident reported successfully'
    }, { status: 201 });
  }),

  // Get incident by tracking ID (for anonymous/guest follow-up)
  http.get('/api/incidents/track/:trackingId', async ({ params }) => {
    const { trackingId } = params;
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const incidents = getIncidents();
    const incident = incidents.find(i => i.reporterInfo.trackingId === trackingId);
    
    if (!incident) {
      return HttpResponse.json(
        { message: 'Incident not found. Please check your tracking ID and try again.' },
        { status: 404 }
      );
    }
    
    return HttpResponse.json({ incident }, { status: 200 });
  }),

  // Get incidents for authenticated users
  http.get('/api/incidents', async ({ request }) => {
    const url = new URL(request.url);
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader?.startsWith('Bearer ')) {
      return HttpResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      );
    }
    
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const incidents = getIncidents();
    
    // Apply filters if provided
    const status = url.searchParams.get('status');
    const severity = url.searchParams.get('severity');
    const category = url.searchParams.get('category');
    
    let filteredIncidents = incidents;
    
    if (status) {
      filteredIncidents = filteredIncidents.filter(i => i.status === status);
    }
    
    if (severity) {
      filteredIncidents = filteredIncidents.filter(i => i.severity === severity);
    }
    
    if (category) {
      filteredIncidents = filteredIncidents.filter(i => i.category.id === category);
    }
    
    // Sort by creation date (newest first)
    filteredIncidents.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    return HttpResponse.json({
      incidents: filteredIncidents,
      total: filteredIncidents.length
    }, { status: 200 });
  }),

  // Get single incident by ID
  http.get('/api/incidents/:id', async ({ params, request }) => {
    const { id } = params;
    const authHeader = request.headers.get('Authorization');
    
    // Allow anonymous access for tracking
    if (authHeader && !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json(
        { message: 'Invalid authorization header' },
        { status: 401 }
      );
    }
    
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const incidents = getIncidents();
    const incident = incidents.find(i => i.id === id);
    
    if (!incident) {
      return HttpResponse.json(
        { message: 'Incident not found' },
        { status: 404 }
      );
    }
    
    return HttpResponse.json({ incident }, { status: 200 });
  }),

  // Upload file endpoint
  http.post('/api/incidents/:id/attachments', async ({ params }) => {
    const { id } = params;
    
    // Mock file upload - in real app would handle FormData
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    const incidents = getIncidents();
    const incident = incidents.find(i => i.id === id);
    
    if (!incident) {
      return HttpResponse.json(
        { message: 'Incident not found' },
        { status: 404 }
      );
    }
    
    // Create mock attachment
    const mockAttachment: IncidentAttachment = {
      id: generateId('attachment'),
      filename: `file_${Date.now()}.jpg`,
      originalName: `uploaded_file.jpg`,
      fileType: 'image/jpeg',
      fileSize: Math.floor(Math.random() * 1024 * 1024 * 5), // Random size up to 5MB
      url: `blob:mock-${Date.now()}`,
      uploadedAt: new Date().toISOString(),
      uploadedBy: 'current_user',
      description: 'Uploaded file'
    };
    
    // Add attachment to incident
    incident.attachments.push(mockAttachment);
    
    // Add timeline entry
    incident.timeline.push({
      id: generateId('timeline'),
      action: 'attachment_added',
      description: `File uploaded: ${mockAttachment.originalName}`,
      performedBy: 'current_user',
      performedAt: new Date().toISOString(),
      metadata: {
        attachmentId: mockAttachment.id,
        filename: mockAttachment.originalName
      }
    });
    
    incident.updatedAt = new Date().toISOString();
    saveIncidents(incidents);
    
    return HttpResponse.json({ 
      attachment: mockAttachment,
      message: 'File uploaded successfully' 
    }, { status: 201 });
  }),

  // Update incident status (for testing)
  http.patch('/api/incidents/:id', async ({ params, request }) => {
    const { id } = params;
    const updates = await request.json() as Partial<Incident>;
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const incidents = getIncidents();
    const incidentIndex = incidents.findIndex(i => i.id === id);
    
    if (incidentIndex === -1) {
      return HttpResponse.json(
        { message: 'Incident not found' },
        { status: 404 }
      );
    }
    
    const incident = incidents[incidentIndex];
    
    // Update incident
    Object.assign(incident, {
      ...updates,
      updatedAt: new Date().toISOString()
    });
    
    // Add timeline entry for status change
    if (updates.status && updates.status !== incident.status) {
      incident.timeline.push({
        id: generateId('timeline'),
        action: 'status_changed',
        description: `Status changed to ${updates.status}`,
        performedBy: 'system',
        performedAt: new Date().toISOString(),
        metadata: {
          oldStatus: incident.status,
          newStatus: updates.status
        }
      });
    }
    
    incidents[incidentIndex] = incident;
    saveIncidents(incidents);
    
    return HttpResponse.json({ 
      incident,
      message: 'Incident updated successfully' 
    }, { status: 200 });
  })
];
```

STEP 3: Update MSW Browser Configuration
Update src/mocks/browser.ts to include incident handlers:
```typescript
import { setupWorker } from 'msw/browser';
import { authHandlers } from './handlers/auth';
import { organizationHandlers } from './handlers/organization';
import { incidentHandlers } from './handlers/incidents';

export const worker = setupWorker(
  ...authHandlers, 
  ...organizationHandlers, 
  ...incidentHandlers
);

// Initialize mock data if not exists
if (typeof window !== 'undefined') {
  const initializeMockData = () => {
    if (!localStorage.getItem('mock_organizations')) {
      localStorage.setItem('mock_organizations', JSON.stringify([]));
    }
    if (!localStorage.getItem('mock_users')) {
      localStorage.setItem('mock_users', JSON.stringify([]));
    }
    if (!localStorage.getItem('mock_incidents')) {
      localStorage.setItem('mock_incidents', JSON.stringify([]));
    }
  };
  
  initializeMockData();
}
```

STEP 4: Incident Store
Create src/stores/incidentStore.ts:
```typescript
import { create } from 'zustand';
import { Incident, IncidentCategory, INCIDENT_CATEGORIES, IncidentAttachment } from '@/types/incident';

interface IncidentState {
  incidents: Incident[];
  categories: IncidentCategory[];
  isLoading: boolean;
  error: string | null;
  currentIncident: Incident | null;
  
  // Actions
  createIncident: (incidentData: Partial<Incident>) => Promise<{ incident: Incident; trackingId: string }>;
  getIncidentByTracking: (trackingId: string) => Promise<Incident>;
  getIncidentById: (id: string) => Promise<Incident>;
  fetchIncidents: (filters?: { status?: string; severity?: string; category?: string }) => Promise<void>;
  updateIncident: (id: string, updates: Partial<Incident>) => Promise<Incident>;
  setCurrentIncident: (incident: Incident | null) => void;
  uploadAttachment: (incidentId: string, file: File) => Promise<IncidentAttachment>;
  getCategoriesByType: (type: 'corporate' | 'healthcare' | 'mining' | 'all') => IncidentCategory[];
  clearError: () => void;
}

export const useIncidentStore = create<IncidentState>((set, get) => ({
  incidents: [],
  categories: INCIDENT_CATEGORIES,
  isLoading: false,
  error: null,
  currentIncident: null,

  createIncident: async (incidentData) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await fetch('/api/incidents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(incidentData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create incident');
      }
      
      // Add to local state
      const incidents = get().incidents;
      set({ 
        incidents: [data.incident, ...incidents],
        isLoading: false 
      });
      
      return {
        incident: data.incident,
        trackingId: data.trackingId
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create incident';
      set({ isLoading: false, error: errorMessage });
      throw error;
    }
  },

  getIncidentByTracking: async (trackingId: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await fetch(`/api/incidents/track/${trackingId}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Incident not found');
      }
      
      set({ isLoading: false });
      return data.incident;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch incident';
      set({ isLoading: false, error: errorMessage });
      throw error;
    }
  },

  getIncidentById: async (id: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await fetch(`/api/incidents/${id}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Incident not found');
      }
      
      set({ isLoading: false });
      return data.incident;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch incident';
      set({ isLoading: false, error: errorMessage });
      throw error;
    }
  },

  fetchIncidents: async (filters = {}) => {
    set({ isLoading: true, error: null });
    
    try {
      // Get auth token from auth store
      const authStorage = localStorage.getItem('auth-storage');
      const authData = authStorage ? JSON.parse(authStorage) : null;
      const token = authData?.state?.tokens?.accessToken;
      
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });
      
      const response = await fetch(`/api/incidents?${queryParams.toString()}`, {
        headers: token ? {
          'Authorization': `Bearer ${token}`
        } : {}
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch incidents');
      }
      
      set({ 
        incidents: data.incidents,
        isLoading: false 
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch incidents';
      set({ isLoading: false, error: errorMessage });
      throw error;
    }
  },

  updateIncident: async (id: string, updates: Partial<Incident>) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await fetch(`/api/incidents/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update incident');
      }
      
      // Update in local state
      const incidents = get().incidents;
      const updatedIncidents = incidents.map(incident => 
        incident.id === id ? data.incident : incident
      );
      
      set({ 
        incidents: updatedIncidents,
        isLoading: false 
      });
      
      return data.incident;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update incident';
      set({ isLoading: false, error: errorMessage });
      throw error;
    }
  },

  setCurrentIncident: (incident) => {
    set({ currentIncident: incident });
  },

  uploadAttachment: async (incidentId: string, file: File) => {
    // Create FormData for file upload
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`/api/incidents/${incidentId}/attachments`, {
      method: 'POST',
      body: formData
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to upload file');
    }
    
    return data.attachment;
  },

  getCategoriesByType: (type) => {
    const categories = get().categories;
    if (type === 'all') {
      return categories;
    }
    return categories.filter(cat => cat.type === type || cat.type === 'general');
  },

  clearError: () => set({ error: null })
}));
```

STEP 5: Incident Report Form Component
Create src/components/forms/IncidentReportForm.tsx:
```typescript
'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useIncidentStore } from '@/stores/incidentStore';
import { useAuthStore } from '@/stores/authStore';
import { IncidentSeverity, ReporterInfo, IncidentCategory, SEVERITY_CONFIG, CustomField } from '@/types/incident';
import { Organization } from '@/types/auth';

// Dynamic form schema based on selected category
const createIncidentSchema = (category?: IncidentCategory) => {
  let schema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    severity: z.enum(['low', 'medium', 'high', 'critical']),
    categoryId: z.string().min(1, 'Please select a category'),
    
    // Location (optional by default)
    location: z.object({
      address: z.string().optional(),
      facility: z.string().optional(),
      department: z.string().optional(),
      room: z.string().optional(),
      equipment: z.string().optional(),
      details: z.string().optional()
    }).optional(),
    
    // For guest reporters
    reporterName: z.string().optional(),
    reporterEmail: z.string().email().optional(),
    reporterPhone: z.string().optional(),
    reporterRelationship: z.string().optional(),
    
    // Tags
    tags: z.string().optional(),
    
    // Custom fields - will be validated dynamically
    customFields: z.record(z.any()).optional()
  });

  // Add validation for custom fields if category is selected
  if (category?.customFields) {
    const customFieldsSchema: Record<string, z.ZodType> = {};
    
    category.customFields.forEach((field: CustomField) => {
      let fieldSchema: z.ZodType = z.any();
      
      switch (field.type) {
        case 'text':
          fieldSchema = field.required ? z.string().min(1, `${field.name} is required`) : z.string().optional();
          break;
        case 'textarea':
          fieldSchema = field.required ? z.string().min(1, `${field.name} is required`) : z.string().optional();
          break;
        case 'select':
          fieldSchema = field.required ? z.string().min(1, `${field.name} is required`) : z.string().optional();
          break;
        case 'boolean':
          fieldSchema = field.required ? z.boolean() : z.boolean().optional();
          break;
        case 'number':
          fieldSchema = field.required ? z.number() : z.number().optional();
          break;
        case 'date':
          fieldSchema = field.required ? z.string().min(1, `${field.name} is required`) : z.string().optional();
          break;
      }
      
      customFieldsSchema[field.id] = fieldSchema;
    });
    
    schema = schema.extend({
      customFields: z.object(customFieldsSchema).optional()
    });
  }

  return schema;
};

type IncidentFormData = z.infer<ReturnType<typeof createIncidentSchema>>;

interface Props {
  reporterType: 'anonymous' | 'guest' | 'user';
  organizationType?: Organization['type'];
  onSuccess?: (result: { incident: any; trackingId: string }) => void;
  onError?: (error: Error) => void;
}

export const IncidentReportForm: React.FC<Props> = ({
  reporterType,
  organizationType = 'corporate',
  onSuccess,
  onError
}) => {
  const { user } = useAuthStore();
  const { createIncident, getCategoriesByType, isLoading, error, clearError } = useIncidentStore();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<IncidentCategory | null>(null);
  
  const categories = getCategoriesByType(organizationType);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
    setValue
  } = useForm<IncidentFormData>({
    resolver: zodResolver(createIncidentSchema(selectedCategory || undefined)),
    defaultValues: {
      severity: selectedCategory?.defaultSeverity || 'medium',
      customFields: {}
    }
  });

  const selectedCategoryId = watch('categoryId');

  // Update selected category when category changes
  React.useEffect(() => {
    const category = categories.find(cat => cat.id === selectedCategoryId);
    setSelectedCategory(category || null);
    
    if (category) {
      setValue('severity', category.defaultSeverity);
    }
  }, [selectedCategoryId, categories, setValue]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const validFiles = files.filter(file => file.size <= 10 * 1024 * 1024); // 10MB limit
      setSelectedFiles(validFiles);
      
      if (files.length > validFiles.length) {
        alert('Some files were too large (max 10MB) and were not selected.');
      }
    }
  };

  const onSubmit = async (data: IncidentFormData) => {
    clearError();
    
    try {
      let reporterInfo: ReporterInfo = { reporterType };

      if (reporterType === 'guest') {
        reporterInfo = {
          reporterType: 'guest',
          name: data.reporterName,
          email: data.reporterEmail,
          phone: data.reporterPhone,
          relationship: data.reporterRelationship
        };
      } else if (reporterType === 'user' && user) {
        reporterInfo = {
          reporterType: 'user',
          userId: user.id
        };
      }

      const incidentData = {
        title: data.title,
        description: data.description,
        severity: data.severity,
        category: selectedCategory!,
        reporterType,
        reporterInfo,
        organizationId: user?.organizationId,
        location: data.location,
        tags: data.tags ? data.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0) : [],
        customFields: data.customFields || {},
        attachments: [] // Will be added after incident creation
      };

      const result = await createIncident(incidentData);
      
      // Handle file uploads if any
      if (selectedFiles.length > 0) {
        try {
          // In real implementation, upload files here
          console.log('Files to upload:', selectedFiles);
          // await Promise.all(selectedFiles.map(file => uploadAttachment(result.incident.id, file)));
        } catch (uploadError) {
          console.warn('File upload failed:', uploadError);
          // Don't fail the entire submission for file upload errors
        }
      }
      
      reset();
      setSelectedFiles([]);
      setSelectedCategory(null);
      onSuccess?.(result);
      
    } catch (error) {
      console.error('Failed to create incident:', error);
      onError?.(error as Error);
    }
  };

  const renderCustomField = (field: CustomField) => {
    const fieldKey = `customFields.${field.id}`;
    
    switch (field.type) {
      case 'text':
        return (
          <input
            type="text"
            {...register(fieldKey as any)}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={field.placeholder}
          />
        );
        
      case 'textarea':
        return (
          <textarea
            {...register(fieldKey as any)}
            rows={3}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={field.placeholder}
          />
        );
        
      case 'select':
        return (
          <select
            {...register(fieldKey as any)}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select...</option>
            {field.options?.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );
        
      case 'boolean':
        return (
          <div className="mt-1">
            <label className="flex items-center">
              <input
                type="checkbox"
                {...register(fieldKey as any)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-600">Yes</span>
            </label>
          </div>
        );
        
      case 'date':
        return (
          <input
            type="date"
            {...register(fieldKey as any)}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        );
        
      case 'number':
        return (
          <input
            type="number"
            {...register(fieldKey as any)}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            min={field.validation?.min}
            max={field.validation?.max}
          />
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Report Incident 
            {reporterType === 'anonymous' && <span className="text-blue-600"> (Anonymous)</span>}
            {reporterType === 'guest' && <span className="text-green-600"> (Guest)</span>}
          </h2>

          {/* Guest Reporter Info */}
          {reporterType === 'guest' && (
            <div className="bg-blue-50 p-4 rounded-md mb-6">
              <h3 className="text-sm font-medium text-blue-800 mb-3">Contact Information (Optional)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    {...register('reporterName')}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    {...register('reporterEmail')}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.reporterEmail && (
                    <p className="text-red-600 text-sm mt-1">{errors.reporterEmail.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone (Optional)</label>
                  <input
                    type="tel"
                    {...register('reporterPhone')}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Relationship</label>
                  <select 
                    {...register('reporterRelationship')} 
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select...</option>
                    <option value="employee">Employee</option>
                    <option value="contractor">Contractor</option>
                    <option value="visitor">Visitor</option>
                    <option value="patient">Patient</option>
                    <option value="customer">Customer</option>
                    <option value="vendor">Vendor</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6">
              {error}
            </div>
          )}

          {/* Incident Details */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title *</label>
              <input
                type="text"
                {...register('title')}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Brief description of the incident"
              />
              {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Category *</label>
                <select 
                  {...register('categoryId')} 
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select category...</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.categoryId && <p className="text-red-600 text-sm mt-1">{errors.categoryId.message}</p>}
                {selectedCategory && (
                  <p className="text-xs text-gray-500 mt-1">
                    {selectedCategory.description}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Severity *</label>
                <select 
                  {...register('severity')} 
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {Object.entries(SEVERITY_CONFIG).map(([key, config]) => (
                    <option key={key} value={key}>{config.label}</option>
                  ))}
                </select>
                {watch('severity') && (
                  <div className="mt-2">
                    <span className={`inline-block px-2 py-1 text-xs rounded ${SEVERITY_CONFIG[watch('severity') as IncidentSeverity].color}`}>
                      {SEVERITY_CONFIG[watch('severity') as IncidentSeverity].label}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      {SEVERITY_CONFIG[watch('severity') as IncidentSeverity].description}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description *</label>
              <textarea
                {...register('description')}
                rows={4}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Detailed description of what happened, when it occurred, and any relevant circumstances..."
              />
              {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description.message}</p>}
            </div>

            {/* Custom Fields */}
            {selectedCategory?.customFields && selectedCategory.customFields.length > 0 && (
              <div className="bg-gray-50 p-4 rounded-md">
                <h4 className="text-sm font-medium text-gray-900 mb-4">Additional Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedCategory.customFields.map(field => (
                    <div key={field.id}>
                      <label className="block text-sm font-medium text-gray-700">
                        {field.name} {field.required && '*'}
                      </label>
                      {renderCustomField(field)}
                      {/* Error handling for custom fields would go here */}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Location */}
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Location Information (Optional)</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Address/Area</label>
                  <input
                    type="text"
                    {...register('location.address')}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Street address or general area"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Facility/Building</label>
                  <input
                    type="text"
                    {...register('location.facility')}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Building or facility name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Department/Unit</label>
                  <input
                    type="text"
                    {...register('location.department')}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Department or unit"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Room/Area</label>
                  <input
                    type="text"
                    {...register('location.room')}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Room number or specific area"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Equipment</label>
                  <input
                    type="text"
                    {...register('location.equipment')}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Equipment or asset involved"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Additional Details</label>
                  <input
                    type="text"
                    {...register('location.details')}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Additional location details"
                  />
                </div>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Tags (Optional)</label>
              <input
                type="text"
                {...register('tags')}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Add tags separated by commas (e.g., urgent, equipment, safety)"
              />
              <p className="text-xs text-gray-500 mt-1">
                Tags help categorize and search incidents
              </p>
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Attachments (Optional)</label>
              <div className="border-2 border-dashed border-gray-300 rounded-md p-6 hover:border-gray-400 transition-colors">
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                  accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,.txt"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Accepted formats: Images, PDF, Word documents. Max 10MB per file.
                </p>
                {selectedFiles.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 font-medium">Selected files:</p>
                    <ul className="text-xs text-gray-500 space-y-1 mt-2">
                      {selectedFiles.map((file, index) => (
                        <li key={index} className="flex items-center justify-between">
                          <span>{file.name}</span>
                          <span>({(file.size / 1024 / 1024).toFixed(2)}MB)</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-6">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
            >
              {isLoading ? 'Submitting Incident...' : 'Submit Incident Report'}
            </button>
          </div>

          {/* Category Info */}
          {selectedCategory && (
            <div className="mt-4 p-3 bg-gray-50 rounded-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">
                    <strong>Category:</strong> {selectedCategory.name}
                  </p>
                  {selectedCategory.description && (
                    <p className="text-xs text-gray-500 mt-1">
                      {selectedCategory.description}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  {selectedCategory.requiresApproval && (
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                      Requires Approval
                    </span>
                  )}
                  <span className={`text-xs px-2 py-1 rounded ${SEVERITY_CONFIG[selectedCategory.defaultSeverity].color}`}>
                    Default: {SEVERITY_CONFIG[selectedCategory.defaultSeverity].label}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};
```

CRITICAL GOTCHAS & THINGS TO WATCH OUT FOR:
1. MSW browser.ts MUST import and include incidentHandlers
2. File uploads are mocked - selectedFiles are stored in component but not actually uploaded
3. Tracking IDs are generated client-side using timestamp + random string
4. Categories are filtered by organization type - test with different types
5. Form validation uses Zod with dynamic schema based on selected category
6. Custom fields rendering must handle all field types correctly
7. LocalStorage key is 'mock_incidents' - clear if data gets corrupted
8. Anonymous reports don't require authentication but guest reports collect contact info
9. Severity affects visual styling and default selection
10. Custom fields validation is basic - enhance for production use

EXPECTED OUTCOME:
After completing this prompt, you should have:
- Complete incident reporting system supporting anonymous/guest/user reporting
- Industry-specific categories with custom fields
- Dynamic form validation based on selected category
- File upload interface (mocked for frontend development)
- Comprehensive location tracking options
- Tags system for better categorization
- Local storage persistence of all incident data
- Tracking ID system for follow-up on anonymous/guest reports
- Professional, responsive form interface
- Proper severity classification with visual indicators

TESTING THE IMPLEMENTATION:
1. Visit the home page and test all reporting options
2. Create an incident as anonymous user - should generate tracking ID
3. Create an incident as guest - should collect contact information
4. Create an incident as authenticated user (login first)
5. Try different categories and verify custom fields appear
6. Test file selection (files won't actually upload but should show in UI)
7. Verify incidents are stored in localStorage under 'mock_incidents'
8. Check that severity colors and category info display correctly
9. Test form validation by submitting incomplete forms
10. Verify tracking ID generation and format

The core incident reporting functionality should be complete with industry-specific categories and comprehensive data collection capabilities.
```

---

## Microservices Architecture & Production Deployment

This incident reporting system is designed for both **local development** (using MSW) and **production deployment** (using microservices).

### Production Architecture
In production, incident management is distributed across multiple microservices:

#### Core Incident Services
- **Incident Service** (Port 5002): CRUD operations, incident lifecycle management
- **File Storage Service** (Port 5007): File uploads, virus scanning via ClamAV, MinIO storage
- **Workflow Service** (Port 5008): Approval workflows, status transitions, escalations
- **Notification Service** (Port 5004): Email/SMS notifications on incident events
- **Analytics Service** (Port 5006): Incident analytics, reporting, dashboards

#### Infrastructure
- **incidents_db**: PostgreSQL database for incident data
- **files_db**: PostgreSQL database for file metadata
- **workflow_db**: PostgreSQL database for workflow rules
- **MinIO**: S3-compatible object storage for attachments
- **Elasticsearch**: Full-text search across incidents
- **RabbitMQ**: Async event processing (incident.created, incident.updated, etc.)

### Industry-Specific Deployment
The system supports **three industry verticals** with specialized use cases:

#### Mining Industry
- 22 specialized use cases (equipment fires, injuries, near-misses, environmental incidents)
- MSHA and OSHA compliance reporting
- Underground location tracking
- Equipment-specific incident categories
- See: [MINING_USE_CASES.md](./MINING_USE_CASES.md)

#### Healthcare Industry
- 20 specialized use cases (medication errors, patient falls, device malfunctions)
- HIPAA-compliant data handling
- Joint Commission and FDA reporting
- Patient de-identification
- NCC MERP harm classification
- See: [HEALTHCARE_USE_CASES.md](./HEALTHCARE_USE_CASES.md)

#### Retail Industry
- 20 specialized use cases (customer injuries, theft, equipment malfunctions)
- OSHA workplace injury reporting
- Customer PII protection
- Store and location-specific tracking
- See: [RETAIL_USE_CASES.md](./RETAIL_USE_CASES.md)

### Deployment
For production deployment with Docker:
```bash
# Start incident management services
docker-compose up -d \
  postgres-incidents postgres-files postgres-workflow \
  incident-service file-storage-service workflow-service \
  notification-service analytics-service \
  minio clamav elasticsearch

# Check service health
curl http://localhost:5002/health  # Incident Service
curl http://localhost:5007/health  # File Storage Service
curl http://localhost:5008/health  # Workflow Service
```

### Event-Driven Architecture
Incidents trigger asynchronous events via RabbitMQ:

**Event Flow Example:**
```
1. User submits incident → Incident Service
2. Incident Service publishes "incident.created" event → RabbitMQ
3. Notification Service consumes event → sends email notifications
4. Analytics Service consumes event → updates metrics
5. Workflow Service consumes event → starts approval process (if required)
```

### File Upload Architecture
```
1. User uploads file → API Gateway → File Storage Service
2. File Storage Service uploads to MinIO (S3-compatible)
3. File metadata stored in files_db (PostgreSQL)
4. ClamAV scans file for viruses
5. Event published: "file.uploaded" or "file.quarantined"
```

### Multi-Tenancy & Data Isolation
- Each organization's data is isolated by organizationId
- Row-level security in PostgreSQL
- Separate MinIO buckets per organization
- Elasticsearch index per organization

### Documentation
- **Full Deployment Guide**: [DEPLOYMENT_GUIDE.md](../DEPLOYMENT_GUIDE.md)
- **Architecture Details**: [MICROSERVICES_ARCHITECTURE.md](../MICROSERVICES_ARCHITECTURE.md)
- **Industry Use Cases**:
  - Mining: [MINING_USE_CASES.md](./MINING_USE_CASES.md)
  - Healthcare: [HEALTHCARE_USE_CASES.md](./HEALTHCARE_USE_CASES.md)
  - Retail: [RETAIL_USE_CASES.md](./RETAIL_USE_CASES.md)

The development setup (MSW) provides rapid prototyping and frontend development, while the production microservices architecture provides scalability, reliability, and industry-specific compliance features.
