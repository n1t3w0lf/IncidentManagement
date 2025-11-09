// ============================================
// MSW HANDLERS - Approvals
// ============================================

import { http, HttpResponse } from 'msw';
import {
  mockApprovalRequests,
  sessionStorage,
  addApprovalRequest,
  updateApprovalRequest,
  updateIncident,
  findIncidentById,
  addNotification,
} from '../data';
import type { ApprovalRequest, IncidentTimelineEntry } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

// ============================================
// HELPER FUNCTIONS
// ============================================

const generateApprovalId = (): string => {
  return `approval-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

const generateTimelineId = (): string => {
  return `timeline-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// ============================================
// APPROVAL HANDLERS
// ============================================

export const approvalHandlers = [
  // GET /approvals - List approval requests
  http.get(`${API_URL}/approvals`, async ({ request }) => {
    await new Promise(resolve => setTimeout(resolve, 500));

    const user = sessionStorage.getUser();
    if (!user) {
      return HttpResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const url = new URL(request.url);
    const status = url.searchParams.get('status');

    let approvals = [...mockApprovalRequests];

    // Filter by user role
    if (user.role === 'manager') {
      // Managers see level_2 and level_3 approvals for their org
      approvals = approvals.filter(
        a =>
          (a.level === 'level_2' || a.level === 'level_3') &&
          a.incident.organizationId === user.organizationId
      );
    } else if (user.role === 'admin') {
      // Admins see level_3 and level_4 approvals for their org
      approvals = approvals.filter(
        a =>
          (a.level === 'level_3' || a.level === 'level_4') &&
          a.incident.organizationId === user.organizationId
      );
    } else if (user.role !== 'super_admin') {
      // Other roles don't see approval queues
      approvals = [];
    }

    // Filter by status
    if (status) {
      approvals = approvals.filter(a => a.status === status);
    }

    // Sort by requested date (newest first)
    approvals.sort((a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime());

    return HttpResponse.json({
      success: true,
      data: approvals,
    });
  }),

  // GET /approvals/:id - Get single approval request
  http.get(`${API_URL}/approvals/:id`, async ({ params }) => {
    await new Promise(resolve => setTimeout(resolve, 300));

    const user = sessionStorage.getUser();
    if (!user) {
      return HttpResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const approval = mockApprovalRequests.find(a => a.id === params.id);
    if (!approval) {
      return HttpResponse.json(
        { success: false, error: 'Approval request not found' },
        { status: 404 }
      );
    }

    return HttpResponse.json({
      success: true,
      data: approval,
    });
  }),

  // POST /approvals - Create approval request
  http.post(`${API_URL}/approvals`, async ({ request }) => {
    await new Promise(resolve => setTimeout(resolve, 600));

    const user = sessionStorage.getUser();
    if (!user) {
      return HttpResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const body = await request.json() as { incidentId: string; level: string };

    const incident = findIncidentById(body.incidentId);
    if (!incident) {
      return HttpResponse.json(
        { success: false, error: 'Incident not found' },
        { status: 404 }
      );
    }

    // Create approval request
    const approvalRequest: ApprovalRequest = {
      id: generateApprovalId(),
      incidentId: incident.id,
      incident,
      requestedBy: user.id,
      requestedAt: new Date().toISOString(),
      level: body.level as any,
      status: 'pending',
    };

    addApprovalRequest(approvalRequest);

    // Update incident status
    updateIncident(incident.id, { status: 'pending_approval' });

    // Add timeline entry
    const timelineEntry: IncidentTimelineEntry = {
      id: generateTimelineId(),
      action: 'escalated',
      description: `Escalated to ${body.level} for approval`,
      performedBy: user.id,
      performedByName: `${user.firstName} ${user.lastName}`,
      performedAt: new Date().toISOString(),
    };
    updateIncident(incident.id, {
      timeline: [...incident.timeline, timelineEntry],
    });

    // Create notification for approvers
    addNotification({
      id: `notif-${Date.now()}`,
      userId: 'user-1', // In real app, find approvers based on level
      type: 'approval_needed',
      title: 'Approval Required',
      message: `${incident.title} requires ${body.level} approval`,
      incidentId: incident.id,
      read: false,
      createdAt: new Date().toISOString(),
      actionUrl: `/dashboard/approvals/${approvalRequest.id}`,
    });

    return HttpResponse.json({
      success: true,
      data: approvalRequest,
      message: 'Approval request created',
    });
  }),

  // POST /approvals/:id/approve - Approve request
  http.post(`${API_URL}/approvals/:id/approve`, async ({ params, request }) => {
    await new Promise(resolve => setTimeout(resolve, 700));

    const user = sessionStorage.getUser();
    if (!user) {
      return HttpResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const approval = mockApprovalRequests.find(a => a.id === params.id);
    if (!approval) {
      return HttpResponse.json(
        { success: false, error: 'Approval request not found' },
        { status: 404 }
      );
    }

    // Check if user has permission to approve
    const canApprove =
      (approval.level === 'level_2' && (user.role === 'manager' || user.role === 'admin' || user.role === 'super_admin')) ||
      (approval.level === 'level_3' && (user.role === 'admin' || user.role === 'super_admin')) ||
      (approval.level === 'level_4' && user.role === 'super_admin');

    if (!canApprove) {
      return HttpResponse.json(
        { success: false, error: 'Insufficient permissions to approve this request' },
        { status: 403 }
      );
    }

    const body = await request.json() as { comments?: string };

    // Update approval request
    const updated = updateApprovalRequest(params.id as string, {
      status: 'approved',
      approvedBy: user.id,
      approvedAt: new Date().toISOString(),
      comments: body.comments,
    });

    // Update incident status
    const incident = findIncidentById(approval.incidentId);
    if (incident) {
      updateIncident(incident.id, {
        status: 'approved',
      });

      // Add timeline entry
      const timelineEntry: IncidentTimelineEntry = {
        id: generateTimelineId(),
        action: 'approved',
        description: `Approved at ${approval.level} by ${user.firstName} ${user.lastName}`,
        performedBy: user.id,
        performedByName: `${user.firstName} ${user.lastName}`,
        performedAt: new Date().toISOString(),
        metadata: { comments: body.comments },
      };
      updateIncident(incident.id, {
        timeline: [...incident.timeline, timelineEntry],
      });

      // Notify requester
      addNotification({
        id: `notif-${Date.now()}`,
        userId: approval.requestedBy,
        type: 'status_changed',
        title: 'Incident Approved',
        message: `Your incident "${incident.title}" has been approved`,
        incidentId: incident.id,
        read: false,
        createdAt: new Date().toISOString(),
        actionUrl: `/dashboard/incidents/${incident.id}`,
      });
    }

    return HttpResponse.json({
      success: true,
      data: updated,
      message: 'Approval request approved',
    });
  }),

  // POST /approvals/:id/reject - Reject request
  http.post(`${API_URL}/approvals/:id/reject`, async ({ params, request }) => {
    await new Promise(resolve => setTimeout(resolve, 700));

    const user = sessionStorage.getUser();
    if (!user) {
      return HttpResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const approval = mockApprovalRequests.find(a => a.id === params.id);
    if (!approval) {
      return HttpResponse.json(
        { success: false, error: 'Approval request not found' },
        { status: 404 }
      );
    }

    // Check if user has permission to reject
    const canReject =
      (approval.level === 'level_2' && (user.role === 'manager' || user.role === 'admin' || user.role === 'super_admin')) ||
      (approval.level === 'level_3' && (user.role === 'admin' || user.role === 'super_admin')) ||
      (approval.level === 'level_4' && user.role === 'super_admin');

    if (!canReject) {
      return HttpResponse.json(
        { success: false, error: 'Insufficient permissions to reject this request' },
        { status: 403 }
      );
    }

    const body = await request.json() as { reason: string; comments?: string };

    if (!body.reason) {
      return HttpResponse.json(
        { success: false, error: 'Rejection reason is required' },
        { status: 400 }
      );
    }

    // Update approval request
    const updated = updateApprovalRequest(params.id as string, {
      status: 'rejected',
      approvedBy: user.id,
      approvedAt: new Date().toISOString(),
      rejectionReason: body.reason,
      comments: body.comments,
    });

    // Update incident status
    const incident = findIncidentById(approval.incidentId);
    if (incident) {
      updateIncident(incident.id, {
        status: 'rejected',
      });

      // Add timeline entry
      const timelineEntry: IncidentTimelineEntry = {
        id: generateTimelineId(),
        action: 'rejected',
        description: `Rejected at ${approval.level} by ${user.firstName} ${user.lastName}: ${body.reason}`,
        performedBy: user.id,
        performedByName: `${user.firstName} ${user.lastName}`,
        performedAt: new Date().toISOString(),
        metadata: { reason: body.reason, comments: body.comments },
      };
      updateIncident(incident.id, {
        timeline: [...incident.timeline, timelineEntry],
      });

      // Notify requester
      addNotification({
        id: `notif-${Date.now()}`,
        userId: approval.requestedBy,
        type: 'status_changed',
        title: 'Incident Rejected',
        message: `Your incident "${incident.title}" has been rejected: ${body.reason}`,
        incidentId: incident.id,
        read: false,
        createdAt: new Date().toISOString(),
        actionUrl: `/dashboard/incidents/${incident.id}`,
      });
    }

    return HttpResponse.json({
      success: true,
      data: updated,
      message: 'Approval request rejected',
    });
  }),
];
