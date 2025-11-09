// ============================================
// MOCK DATA STORAGE - In-memory database
// ============================================

import {
  User,
  Organization,
  Incident,
  ApprovalRequest,
  Notification,
  AuthTokens,
  IncidentAttachment,
  IncidentTimelineEntry
} from '@/types';
import { generateTrackingId } from '@/lib/utils';

// ============================================
// USERS
// ============================================

export const mockUsers: User[] = [
  {
    id: 'user-1',
    email: 'admin@example.com',
    firstName: 'Admin',
    lastName: 'User',
    role: 'super_admin',
    organizationId: 'org-1',
    isActive: true,
    createdAt: new Date('2024-01-01').toISOString(),
    lastLoginAt: new Date().toISOString(),
  },
  {
    id: 'user-2',
    email: 'manager@example.com',
    firstName: 'Sarah',
    lastName: 'Manager',
    role: 'manager',
    organizationId: 'org-1',
    isActive: true,
    createdAt: new Date('2024-01-05').toISOString(),
    lastLoginAt: new Date().toISOString(),
  },
  {
    id: 'user-3',
    email: 'reviewer@example.com',
    firstName: 'John',
    lastName: 'Reviewer',
    role: 'reviewer',
    organizationId: 'org-1',
    isActive: true,
    createdAt: new Date('2024-01-10').toISOString(),
    lastLoginAt: new Date().toISOString(),
  },
  {
    id: 'user-4',
    email: 'user@example.com',
    firstName: 'Jane',
    lastName: 'User',
    role: 'user',
    organizationId: 'org-1',
    isActive: true,
    createdAt: new Date('2024-01-15').toISOString(),
    lastLoginAt: new Date().toISOString(),
  },
];

// ============================================
// ORGANIZATIONS
// ============================================

export const mockOrganizations: Organization[] = [
  {
    id: 'org-1',
    name: 'Demo Mining Corporation',
    type: 'mining',
    settings: {
      allowAnonymousReporting: true,
      allowGuestReporting: true,
      requireApproval: true,
      autoEscalateAfterHours: 24,
      notificationEmail: 'incidents@mining.example.com',
    },
    createdAt: new Date('2024-01-01').toISOString(),
    isActive: true,
  },
  {
    id: 'org-2',
    name: 'Healthcare Medical Center',
    type: 'healthcare',
    settings: {
      allowAnonymousReporting: true,
      allowGuestReporting: true,
      requireApproval: true,
      autoEscalateAfterHours: 12,
      notificationEmail: 'safety@healthcare.example.com',
    },
    createdAt: new Date('2024-01-01').toISOString(),
    isActive: true,
  },
  {
    id: 'org-3',
    name: 'Retail Supermarket Chain',
    type: 'retail',
    settings: {
      allowAnonymousReporting: true,
      allowGuestReporting: true,
      requireApproval: true,
      autoEscalateAfterHours: 24,
      notificationEmail: 'safety@retail.example.com',
    },
    createdAt: new Date('2024-01-01').toISOString(),
    isActive: true,
  },
];

// ============================================
// INCIDENTS
// ============================================

export const mockIncidents: Incident[] = [
  {
    id: 'incident-1',
    trackingId: generateTrackingId(),
    title: 'Underground Equipment Fire - Level 5 West',
    description: 'Loader caught fire in west drift. All personnel evacuated safely. Fire suppression system activated.',
    severity: 'critical',
    category: {
      id: 'mining_equipment_fire',
      name: 'Underground Equipment Fire',
      type: 'mining',
      requiresApproval: true,
      defaultSeverity: 'critical',
      escalationLevel: 'level_4',
      requiredFields: ['equipment_id', 'underground_location'],
    },
    status: 'investigating',
    reporterType: 'user',
    reporterInfo: {
      reporterType: 'user',
      userId: 'user-4',
    },
    organizationId: 'org-1',
    location: {
      type: 'facility',
      facility: 'Main Mine Site',
      underground: true,
      level: 'Level 5',
      drift: 'West Drift',
    },
    attachments: [],
    timeline: [
      {
        id: 'timeline-1',
        action: 'created',
        description: 'Incident reported',
        performedBy: 'user-4',
        performedByName: 'Jane User',
        performedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'timeline-2',
        action: 'status_changed',
        description: 'Status changed from Submitted to Investigating',
        performedBy: 'user-2',
        performedByName: 'Sarah Manager',
        performedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      },
    ],
    assignedTo: ['user-2', 'user-3'],
    escalationLevel: 'level_4',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    tags: ['fire', 'equipment', 'evacuation'],
    customFields: {
      equipment_id: 'LOADER-523',
      underground_location: 'Level 5 West Drift',
      personnel_evacuated: '12',
      fire_suppression_method: 'Automatic System',
      msha_notified: true,
    },
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'incident-2',
    trackingId: generateTrackingId(),
    title: 'Medication Administration Error - Patient 12345',
    description: 'Wrong dosage administered. Patient monitored, no adverse effects observed.',
    severity: 'high',
    category: {
      id: 'healthcare_medication_error',
      name: 'Medication Administration Error',
      type: 'healthcare',
      requiresApproval: true,
      defaultSeverity: 'high',
      escalationLevel: 'level_3',
      requiredFields: ['medication_name', 'error_type'],
    },
    status: 'under_review',
    reporterType: 'user',
    reporterInfo: {
      reporterType: 'user',
      userId: 'user-4',
    },
    organizationId: 'org-2',
    location: {
      type: 'facility',
      facility: 'Medical Center East',
      clinicalArea: 'ICU',
      unit: 'Unit 3',
    },
    attachments: [],
    timeline: [
      {
        id: 'timeline-3',
        action: 'created',
        description: 'Incident reported',
        performedBy: 'user-4',
        performedByName: 'Jane User',
        performedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      },
    ],
    assignedTo: ['user-3'],
    escalationLevel: 'level_3',
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    tags: ['medication', 'patient-safety'],
    customFields: {
      medication_name: 'Metformin',
      error_type: 'Wrong Dose',
      patient_harm: 'Category B - Error occurred but did not reach patient',
      hipaa_reviewed: true,
    },
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'incident-3',
    trackingId: generateTrackingId(),
    title: 'Customer Slip and Fall - Aisle 7',
    description: 'Customer slipped on wet floor. First aid provided, customer refused ambulance.',
    severity: 'medium',
    category: {
      id: 'retail_customer_fall',
      name: 'Customer Slip/Trip/Fall',
      type: 'retail',
      requiresApproval: true,
      defaultSeverity: 'high',
      escalationLevel: 'level_3',
      requiredFields: ['injury_sustained', 'floor_condition'],
    },
    status: 'resolved',
    reporterType: 'user',
    reporterInfo: {
      reporterType: 'user',
      userId: 'user-4',
    },
    organizationId: 'org-3',
    location: {
      type: 'facility',
      facility: 'Store #423',
      store: 'Westfield Mall',
      aisle: 'Aisle 7',
    },
    attachments: [],
    timeline: [
      {
        id: 'timeline-4',
        action: 'created',
        description: 'Incident reported',
        performedBy: 'user-4',
        performedByName: 'Jane User',
        performedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'timeline-5',
        action: 'resolved',
        description: 'Incident resolved - Customer compensated, floor cleaned',
        performedBy: 'user-2',
        performedByName: 'Sarah Manager',
        performedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      },
    ],
    assignedTo: ['user-2'],
    escalationLevel: 'level_2',
    tags: ['customer', 'injury', 'floor-safety'],
    customFields: {
      injury_sustained: 'Bruising/Scrapes',
      floor_condition: 'Wet - Recently Mopped',
      wet_floor_sign: false,
      witness_present: true,
    },
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
  },
];

// ============================================
// APPROVAL REQUESTS
// ============================================

export const mockApprovalRequests: ApprovalRequest[] = [
  {
    id: 'approval-1',
    incidentId: 'incident-1',
    incident: mockIncidents[0],
    requestedBy: 'user-2',
    requestedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    level: 'level_4',
    status: 'pending',
  },
];

// ============================================
// NOTIFICATIONS
// ============================================

export const mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    userId: 'user-1',
    type: 'approval_needed',
    title: 'Approval Required: Underground Equipment Fire',
    message: 'Level 4 approval required for critical incident',
    incidentId: 'incident-1',
    read: false,
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    actionUrl: '/dashboard/approvals',
  },
  {
    id: 'notif-2',
    userId: 'user-2',
    type: 'incident_assigned',
    title: 'New Incident Assigned',
    message: 'You have been assigned to investigate incident INC-123456',
    incidentId: 'incident-1',
    read: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    actionUrl: '/dashboard/incidents/incident-1',
  },
];

// ============================================
// SESSION STORAGE
// ============================================

let currentUser: User | null = null;
let currentTokens: AuthTokens | null = null;

export const sessionStorage = {
  setUser: (user: User) => {
    currentUser = user;
  },
  getUser: () => currentUser,
  clearUser: () => {
    currentUser = null;
  },
  setTokens: (tokens: AuthTokens) => {
    currentTokens = tokens;
  },
  getTokens: () => currentTokens,
  clearTokens: () => {
    currentTokens = null;
  },
};

// ============================================
// HELPER FUNCTIONS
// ============================================

export const findUserByEmail = (email: string): User | undefined => {
  return mockUsers.find(u => u.email === email);
};

export const findUserById = (id: string): User | undefined => {
  return mockUsers.find(u => u.id === id);
};

export const findOrganizationById = (id: string): Organization | undefined => {
  return mockOrganizations.find(o => o.id === id);
};

export const findIncidentById = (id: string): Incident | undefined => {
  return mockIncidents.find(i => i.id === id);
};

export const addIncident = (incident: Incident): void => {
  mockIncidents.unshift(incident);
};

export const updateIncident = (id: string, updates: Partial<Incident>): Incident | undefined => {
  const index = mockIncidents.findIndex(i => i.id === id);
  if (index === -1) return undefined;

  mockIncidents[index] = { ...mockIncidents[index], ...updates, updatedAt: new Date().toISOString() };
  return mockIncidents[index];
};

export const addNotification = (notification: Notification): void => {
  mockNotifications.unshift(notification);
};

export const markNotificationAsRead = (id: string): void => {
  const notification = mockNotifications.find(n => n.id === id);
  if (notification) {
    notification.read = true;
  }
};

export const addApprovalRequest = (request: ApprovalRequest): void => {
  mockApprovalRequests.unshift(request);
};

export const updateApprovalRequest = (id: string, updates: Partial<ApprovalRequest>): ApprovalRequest | undefined => {
  const index = mockApprovalRequests.findIndex(a => a.id === id);
  if (index === -1) return undefined;

  mockApprovalRequests[index] = { ...mockApprovalRequests[index], ...updates };
  return mockApprovalRequests[index];
};
