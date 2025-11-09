// ============================================
// CORE TYPES - Incident Management System
// All Industries: Mining, Healthcare, Retail
// ============================================

export type IndustryType = 'mining' | 'healthcare' | 'retail' | 'corporate';

export type UserRole = 'super_admin' | 'admin' | 'manager' | 'user' | 'reporter' | 'reviewer';

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

export type ReporterType = 'anonymous' | 'guest' | 'user';

export type EscalationLevel = 'level_1' | 'level_2' | 'level_3' | 'level_4';

// ============================================
// USER & AUTHENTICATION
// ============================================

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
  avatar?: string;
}

export interface Organization {
  id: string;
  name: string;
  type: IndustryType;
  settings: OrganizationSettings;
  createdAt: string;
  isActive: boolean;
}

export interface OrganizationSettings {
  allowAnonymousReporting: boolean;
  allowGuestReporting: boolean;
  requireApproval: boolean;
  autoEscalateAfterHours?: number;
  notificationEmail?: string;
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
  organizationType: IndustryType;
}

// ============================================
// INCIDENT CORE
// ============================================

export interface Incident {
  id: string;
  trackingId?: string;
  title: string;
  description: string;
  severity: IncidentSeverity;
  category: IncidentCategory;
  status: IncidentStatus;
  reporterType: ReporterType;
  reporterInfo: ReporterInfo;
  organizationId?: string;
  location?: IncidentLocation;
  attachments: IncidentAttachment[];
  timeline: IncidentTimelineEntry[];
  assignedTo?: string[];
  escalationLevel: EscalationLevel;
  dueDate?: string;
  tags: string[];
  customFields: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  closedAt?: string;
}

export interface ReporterInfo {
  reporterType: ReporterType;
  // For guest reporters
  name?: string;
  email?: string;
  phone?: string;
  relationship?: string;
  // For authenticated users
  userId?: string;
  // Tracking reference
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
  // Mining specific
  underground?: boolean;
  level?: string;
  drift?: string;
  stope?: string;
  // Healthcare specific
  clinicalArea?: string;
  unit?: string;
  // Retail specific
  store?: string;
  aisle?: string;
  details?: string;
}

export interface IncidentAttachment {
  id: string;
  filename: string;
  originalName: string;
  fileType: string;
  fileSize: number;
  url: string;
  uploadedAt: string;
  uploadedBy: string;
  description?: string;
  scanStatus?: 'pending' | 'clean' | 'infected' | 'error';
}

export interface IncidentTimelineEntry {
  id: string;
  action: IncidentTimelineAction;
  description: string;
  performedBy: string;
  performedByName?: string;
  performedAt: string;
  metadata?: Record<string, any>;
}

export type IncidentTimelineAction =
  | 'created'
  | 'updated'
  | 'status_changed'
  | 'assigned'
  | 'reassigned'
  | 'comment_added'
  | 'attachment_added'
  | 'attachment_removed'
  | 'escalated'
  | 'resolved'
  | 'closed'
  | 'reopened'
  | 'approved'
  | 'rejected';

// ============================================
// INCIDENT CATEGORIES
// ============================================

export interface IncidentCategory {
  id: string;
  name: string;
  description?: string;
  type: IndustryType;
  requiresApproval: boolean;
  defaultSeverity: IncidentSeverity;
  escalationLevel: EscalationLevel;
  requiredFields: string[];
  customFields?: CustomField[];
}

export interface CustomField {
  id: string;
  name: string;
  type: 'text' | 'textarea' | 'select' | 'multiselect' | 'date' | 'number' | 'boolean' | 'email' | 'phone';
  required: boolean;
  options?: string[];
  placeholder?: string;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
  helpText?: string;
}

// ============================================
// WORKFLOW & APPROVALS
// ============================================

export interface ApprovalRequest {
  id: string;
  incidentId: string;
  incident: Incident;
  requestedBy: string;
  requestedAt: string;
  level: EscalationLevel;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
  comments?: string;
}

export interface WorkflowRule {
  id: string;
  name: string;
  industryType: IndustryType;
  categoryId?: string;
  severityThreshold?: IncidentSeverity;
  escalationLevel: EscalationLevel;
  autoAssignTo?: UserRole[];
  requiresApproval: boolean;
  escalateAfterHours?: number;
  notifyRoles?: UserRole[];
  isActive: boolean;
}

// ============================================
// NOTIFICATIONS
// ============================================

export interface Notification {
  id: string;
  userId: string;
  type: 'incident_assigned' | 'status_changed' | 'comment_added' | 'approval_needed' | 'escalated' | 'due_soon' | 'overdue';
  title: string;
  message: string;
  incidentId?: string;
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}

// ============================================
// ANALYTICS & REPORTING
// ============================================

export interface IncidentStats {
  total: number;
  byStatus: Record<IncidentStatus, number>;
  bySeverity: Record<IncidentSeverity, number>;
  byCategory: Record<string, number>;
  byIndustry?: Record<IndustryType, number>;
  averageResolutionTime: number;
  openIncidents: number;
  closedIncidents: number;
  overdueIncidents: number;
}

export interface TrendData {
  date: string;
  total: number;
  bySeverity: Record<IncidentSeverity, number>;
}

// ============================================
// FORMS & UI
// ============================================

export interface FormOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SearchFilters {
  status?: IncidentStatus[];
  severity?: IncidentSeverity[];
  category?: string[];
  assignedTo?: string[];
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ============================================
// API RESPONSES
// ============================================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface ApiError {
  message: string;
  code?: string;
  field?: string;
}
