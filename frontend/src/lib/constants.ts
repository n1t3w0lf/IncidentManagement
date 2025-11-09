// ============================================
// APPLICATION CONSTANTS
// ============================================

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
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'text/csv'
  ],
  ITEMS_PER_PAGE: 25,
  DEBOUNCE_MS: 300
} as const;

export const ROUTES = {
  HOME: '/',
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  DASHBOARD: '/dashboard',
  INCIDENTS: '/incidents',
  INCIDENT_DETAIL: '/incidents/[id]',
  REPORT_ANONYMOUS: '/report/anonymous',
  REPORT_GUEST: '/report/guest',
  REPORT_USER: '/report/user',
  TRACK: '/track',
  APPROVALS: '/approvals',
  ANALYTICS: '/analytics',
  SETTINGS: '/settings',
  USERS: '/admin/users',
  PROFILE: '/profile'
} as const;

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
} as const;

export const INCIDENT_SEVERITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
} as const;

export const USER_ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  MANAGER: 'manager',
  USER: 'user',
  REPORTER: 'reporter',
  REVIEWER: 'reviewer'
} as const;

export const ESCALATION_LEVELS = {
  LEVEL_1: 'level_1',
  LEVEL_2: 'level_2',
  LEVEL_3: 'level_3',
  LEVEL_4: 'level_4'
} as const;

// Status configuration with colors and labels
export const STATUS_CONFIG = {
  draft: {
    label: 'Draft',
    color: 'bg-gray-100 text-gray-800',
    badge: 'bg-gray-500'
  },
  submitted: {
    label: 'Submitted',
    color: 'bg-blue-100 text-blue-800',
    badge: 'bg-blue-500'
  },
  under_review: {
    label: 'Under Review',
    color: 'bg-yellow-100 text-yellow-800',
    badge: 'bg-yellow-500'
  },
  investigating: {
    label: 'Investigating',
    color: 'bg-orange-100 text-orange-800',
    badge: 'bg-orange-500'
  },
  pending_approval: {
    label: 'Pending Approval',
    color: 'bg-purple-100 text-purple-800',
    badge: 'bg-purple-500'
  },
  approved: {
    label: 'Approved',
    color: 'bg-indigo-100 text-indigo-800',
    badge: 'bg-indigo-500'
  },
  in_progress: {
    label: 'In Progress',
    color: 'bg-blue-100 text-blue-800',
    badge: 'bg-blue-600'
  },
  resolved: {
    label: 'Resolved',
    color: 'bg-green-100 text-green-800',
    badge: 'bg-green-500'
  },
  closed: {
    label: 'Closed',
    color: 'bg-gray-100 text-gray-800',
    badge: 'bg-gray-600'
  },
  rejected: {
    label: 'Rejected',
    color: 'bg-red-100 text-red-800',
    badge: 'bg-red-500'
  }
} as const;

// Severity configuration
export const SEVERITY_CONFIG = {
  low: {
    label: 'Low',
    color: 'bg-green-100 text-green-800',
    badge: 'bg-green-500',
    description: 'Minor incident with minimal impact'
  },
  medium: {
    label: 'Medium',
    color: 'bg-yellow-100 text-yellow-800',
    badge: 'bg-yellow-500',
    description: 'Moderate incident requiring attention'
  },
  high: {
    label: 'High',
    color: 'bg-orange-100 text-orange-800',
    badge: 'bg-orange-500',
    description: 'Serious incident requiring immediate attention'
  },
  critical: {
    label: 'Critical',
    color: 'bg-red-100 text-red-800',
    badge: 'bg-red-500',
    description: 'Critical incident requiring urgent response'
  }
} as const;

// Escalation level configuration
export const ESCALATION_CONFIG = {
  level_1: {
    label: 'Level 1 - Auto Approved',
    description: 'No approval required, auto-submitted',
    approvers: [],
    timeoutHours: null
  },
  level_2: {
    label: 'Level 2 - Manager Approval',
    description: 'Requires manager approval',
    approvers: ['manager'],
    timeoutHours: 24
  },
  level_3: {
    label: 'Level 3 - Senior Manager',
    description: 'Requires senior manager approval',
    approvers: ['manager', 'admin'],
    timeoutHours: 12
  },
  level_4: {
    label: 'Level 4 - Executive',
    description: 'Critical - requires executive approval',
    approvers: ['admin', 'super_admin'],
    timeoutHours: 4
  }
} as const;

// Role permissions
export const ROLE_PERMISSIONS = {
  super_admin: {
    label: 'Super Administrator',
    permissions: ['*'],
    description: 'Full system access'
  },
  admin: {
    label: 'Administrator',
    permissions: ['incidents:*', 'users:*', 'reports:*', 'settings:*'],
    description: 'Manage incidents, users, and settings'
  },
  manager: {
    label: 'Manager',
    permissions: ['incidents:read', 'incidents:update', 'incidents:approve', 'reports:read'],
    description: 'Review and approve incidents'
  },
  reviewer: {
    label: 'Reviewer/Investigator',
    permissions: ['incidents:read', 'incidents:update', 'incidents:comment'],
    description: 'Investigate and update incidents'
  },
  user: {
    label: 'Standard User',
    permissions: ['incidents:create', 'incidents:read_own', 'incidents:update_own'],
    description: 'Create and manage own incidents'
  },
  reporter: {
    label: 'Reporter',
    permissions: ['incidents:create'],
    description: 'Report incidents only'
  }
} as const;

// Industry types
export const INDUSTRY_TYPES = {
  MINING: {
    value: 'mining',
    label: 'Mining/Industrial',
    description: 'Mining and heavy industrial operations',
    icon: '⛏️',
    color: 'bg-amber-500'
  },
  HEALTHCARE: {
    value: 'healthcare',
    label: 'Healthcare',
    description: 'Hospitals, clinics, and medical facilities',
    icon: '🏥',
    color: 'bg-red-500'
  },
  RETAIL: {
    value: 'retail',
    label: 'Retail',
    description: 'Retail stores and customer-facing businesses',
    icon: '🏪',
    color: 'bg-blue-500'
  },
  CORPORATE: {
    value: 'corporate',
    label: 'Corporate/IT',
    description: 'General business and IT operations',
    icon: '🏢',
    color: 'bg-gray-500'
  }
} as const;

// Notification types
export const NOTIFICATION_TYPES = {
  INCIDENT_ASSIGNED: {
    type: 'incident_assigned',
    label: 'Incident Assigned',
    icon: '📋',
    color: 'bg-blue-500'
  },
  STATUS_CHANGED: {
    type: 'status_changed',
    label: 'Status Changed',
    icon: '🔄',
    color: 'bg-purple-500'
  },
  COMMENT_ADDED: {
    type: 'comment_added',
    label: 'New Comment',
    icon: '💬',
    color: 'bg-green-500'
  },
  APPROVAL_NEEDED: {
    type: 'approval_needed',
    label: 'Approval Needed',
    icon: '⚠️',
    color: 'bg-orange-500'
  },
  ESCALATED: {
    type: 'escalated',
    label: 'Escalated',
    icon: '🚨',
    color: 'bg-red-500'
  },
  DUE_SOON: {
    type: 'due_soon',
    label: 'Due Soon',
    icon: '⏰',
    color: 'bg-yellow-500'
  },
  OVERDUE: {
    type: 'overdue',
    label: 'Overdue',
    icon: '❗',
    color: 'bg-red-600'
  }
} as const;

// Local storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',
  THEME: 'theme',
  SIDEBAR_COLLAPSED: 'sidebar_collapsed'
} as const;

// Date formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  DISPLAY_WITH_TIME: 'MMM dd, yyyy h:mm a',
  ISO: "yyyy-MM-dd'T'HH:mm:ss.SSSxxx",
  INPUT: 'yyyy-MM-dd',
  TIME: 'h:mm a'
} as const;

// Chart colors
export const CHART_COLORS = {
  primary: '#3b82f6',
  success: '#22c55e',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#0ea5e9',
  purple: '#a855f7',
  pink: '#ec4899',
  indigo: '#6366f1'
} as const;

// Regex patterns
export const PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^\+?[\d\s\-()]+$/,
  TRACKING_ID: /^INC-\d{6}-[A-Z0-9]{4}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
} as const;
