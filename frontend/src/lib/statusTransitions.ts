// ============================================
// STATUS TRANSITION VALIDATION
// ============================================

import type { IncidentStatus, UserRole } from '@/types';

/**
 * Defines valid status transitions for incident workflow
 * Format: {currentStatus: [allowedNextStatuses]}
 */
export const VALID_STATUS_TRANSITIONS: Record<IncidentStatus, IncidentStatus[]> = {
  // Draft can only be submitted
  draft: ['submitted'],

  // Submitted incidents must go through review
  submitted: ['under_review', 'rejected'],

  // Under review can proceed to investigation or be rejected
  under_review: ['investigating', 'pending_approval', 'rejected'],

  // Investigating can be resolved or require approval
  investigating: ['resolved', 'pending_approval', 'submitted'], // can go back if more info needed

  // Pending approval must be approved or rejected
  pending_approval: ['approved', 'rejected', 'under_review'], // can go back for more review

  // Approved incidents move to in progress
  approved: ['in_progress', 'investigating'], // can be reopened for more investigation

  // In progress can be resolved
  in_progress: ['resolved', 'investigating'], // can be reopened if issues found

  // Resolved incidents can be closed or reopened
  resolved: ['closed', 'investigating'], // can reopen if issue persists

  // Closed incidents can be reopened if necessary
  closed: ['investigating'], // rarely happens but possible

  // Rejected incidents can be resubmitted after fixes
  rejected: ['submitted', 'draft'], // allow resubmission
};

/**
 * Checks if a status transition is valid
 */
export function isValidStatusTransition(
  currentStatus: IncidentStatus,
  newStatus: IncidentStatus
): boolean {
  // Same status is always allowed (no-op)
  if (currentStatus === newStatus) {
    return true;
  }

  const allowedTransitions = VALID_STATUS_TRANSITIONS[currentStatus];
  return allowedTransitions.includes(newStatus);
}

/**
 * Gets all valid next statuses from current status
 */
export function getValidNextStatuses(currentStatus: IncidentStatus): IncidentStatus[] {
  return VALID_STATUS_TRANSITIONS[currentStatus] || [];
}

/**
 * Checks if user has permission to change status based on role
 */
export function canUserChangeStatus(
  userRole: UserRole,
  currentStatus: IncidentStatus,
  newStatus: IncidentStatus
): { allowed: boolean; reason?: string } {
  // Super admin can do anything
  if (userRole === 'super_admin') {
    return { allowed: true };
  }

  // Check if transition is valid first
  if (!isValidStatusTransition(currentStatus, newStatus)) {
    return {
      allowed: false,
      reason: `Cannot transition from "${currentStatus}" to "${newStatus}". Invalid workflow step.`,
    };
  }

  // Role-based restrictions
  switch (newStatus) {
    case 'approved':
      // Only managers and above can approve
      if (!['manager', 'admin', 'super_admin'].includes(userRole)) {
        return {
          allowed: false,
          reason: 'Only managers and administrators can approve incidents.',
        };
      }
      break;

    case 'rejected':
      // Only managers and above can reject
      if (!['manager', 'admin', 'super_admin'].includes(userRole)) {
        return {
          allowed: false,
          reason: 'Only managers and administrators can reject incidents.',
        };
      }
      break;

    case 'closed':
      // Only managers and above can close
      if (!['manager', 'admin', 'super_admin'].includes(userRole)) {
        return {
          allowed: false,
          reason: 'Only managers and administrators can close incidents.',
        };
      }
      break;

    case 'resolved':
      // Managers and above, or assigned users
      if (!['manager', 'admin', 'super_admin', 'user'].includes(userRole)) {
        return {
          allowed: false,
          reason: 'Only assigned users, managers, and administrators can mark incidents as resolved.',
        };
      }
      break;
  }

  return { allowed: true };
}

/**
 * Gets user-friendly status transition error message
 */
export function getStatusTransitionError(
  currentStatus: IncidentStatus,
  attemptedStatus: IncidentStatus
): string {
  const validNextStatuses = getValidNextStatuses(currentStatus);

  if (validNextStatuses.length === 0) {
    return `Incidents with status "${currentStatus}" cannot be changed.`;
  }

  const statusLabels = validNextStatuses.map(s => `"${s}"`).join(', ');
  return `From "${currentStatus}", you can only move to: ${statusLabels}`;
}

/**
 * Validates complete status change with role and escalation level
 */
export interface StatusChangeValidation {
  allowed: boolean;
  reason?: string;
  requiresApproval?: boolean;
}

export function validateStatusChange(
  currentStatus: IncidentStatus,
  newStatus: IncidentStatus,
  userRole: UserRole,
  escalationLevel?: 'level_1' | 'level_2' | 'level_3' | 'level_4',
  requiresApproval?: boolean
): StatusChangeValidation {
  // Check basic transition validity
  if (!isValidStatusTransition(currentStatus, newStatus)) {
    return {
      allowed: false,
      reason: getStatusTransitionError(currentStatus, newStatus),
    };
  }

  // Check role permissions
  const roleCheck = canUserChangeStatus(userRole, currentStatus, newStatus);
  if (!roleCheck.allowed) {
    return roleCheck;
  }

  // Check if approval is required but being bypassed
  if (requiresApproval && newStatus === 'resolved' && currentStatus !== 'approved') {
    return {
      allowed: false,
      reason: 'This incident requires approval before it can be resolved.',
      requiresApproval: true,
    };
  }

  // Check escalation level permissions for approval
  if (newStatus === 'approved' && escalationLevel) {
    switch (escalationLevel) {
      case 'level_4':
        // Level 4 requires super_admin
        if (userRole !== 'super_admin') {
          return {
            allowed: false,
            reason: 'Level 4 incidents require Super Administrator approval.',
          };
        }
        break;

      case 'level_3':
        // Level 3 requires admin or super_admin
        if (!['admin', 'super_admin'].includes(userRole)) {
          return {
            allowed: false,
            reason: 'Level 3 incidents require Administrator approval.',
          };
        }
        break;

      case 'level_2':
        // Level 2 requires manager or above
        if (!['manager', 'admin', 'super_admin'].includes(userRole)) {
          return {
            allowed: false,
            reason: 'Level 2 incidents require Manager approval.',
          };
        }
        break;

      // Level 1 auto-approves, no restriction
    }
  }

  return { allowed: true };
}
