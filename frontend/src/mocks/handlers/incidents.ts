// ============================================
// MSW HANDLERS - Incidents
// ============================================

import { http, HttpResponse } from 'msw';
import {
  mockIncidents,
  sessionStorage,
  addIncident,
  updateIncident,
  findIncidentById,
  findUserById,
  addNotification,
} from '../data';
import { generateTrackingId } from '@/lib/utils';
import { ALL_INCIDENT_CATEGORIES } from '@/lib/categories';
import type {
  Incident,
  IncidentAttachment,
  IncidentTimelineEntry,
  SearchFilters,
  PaginationParams,
  IncidentStatus,
} from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

// ============================================
// HELPER FUNCTIONS
// ============================================

const generateIncidentId = (): string => {
  return `incident-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

const generateTimelineId = (): string => {
  return `timeline-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

const filterIncidents = (incidents: Incident[], filters: SearchFilters): Incident[] => {
  let filtered = [...incidents];

  if (filters.status && filters.status.length > 0) {
    filtered = filtered.filter(i => filters.status!.includes(i.status));
  }

  if (filters.severity && filters.severity.length > 0) {
    filtered = filtered.filter(i => filters.severity!.includes(i.severity));
  }

  if (filters.category && filters.category.length > 0) {
    filtered = filtered.filter(i => filters.category!.includes(i.category.id));
  }

  if (filters.assignedTo && filters.assignedTo.length > 0) {
    filtered = filtered.filter(i =>
      i.assignedTo?.some(userId => filters.assignedTo!.includes(userId))
    );
  }

  if (filters.dateFrom) {
    filtered = filtered.filter(i => new Date(i.createdAt) >= new Date(filters.dateFrom!));
  }

  if (filters.dateTo) {
    filtered = filtered.filter(i => new Date(i.createdAt) <= new Date(filters.dateTo!));
  }

  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(
      i =>
        i.title.toLowerCase().includes(searchLower) ||
        i.description.toLowerCase().includes(searchLower) ||
        i.trackingId?.toLowerCase().includes(searchLower)
    );
  }

  return filtered;
};

const paginateResults = <T>(data: T[], params: PaginationParams): { data: T[]; total: number; page: number; limit: number; totalPages: number } => {
  const total = data.length;
  const totalPages = Math.ceil(total / params.limit);
  const start = (params.page - 1) * params.limit;
  const end = start + params.limit;
  const paginatedData = data.slice(start, end);

  return {
    data: paginatedData,
    total,
    page: params.page,
    limit: params.limit,
    totalPages,
  };
};

// ============================================
// INCIDENT HANDLERS
// ============================================

export const incidentHandlers = [
  // GET /incidents - List incidents with filtering and pagination
  http.get(`${API_URL}/incidents`, async ({ request }) => {
    await new Promise(resolve => setTimeout(resolve, 600));

    const user = sessionStorage.getUser();
    if (!user) {
      return HttpResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const url = new URL(request.url);
    const filters: SearchFilters = {
      status: url.searchParams.get('status')?.split(',') as IncidentStatus[] | undefined,
      severity: url.searchParams.get('severity')?.split(',') as any,
      category: url.searchParams.get('category')?.split(','),
      assignedTo: url.searchParams.get('assignedTo')?.split(','),
      dateFrom: url.searchParams.get('dateFrom') || undefined,
      dateTo: url.searchParams.get('dateTo') || undefined,
      search: url.searchParams.get('search') || undefined,
    };

    const pagination: PaginationParams = {
      page: parseInt(url.searchParams.get('page') || '1'),
      limit: parseInt(url.searchParams.get('limit') || '25'),
      sortBy: url.searchParams.get('sortBy') || 'createdAt',
      sortOrder: (url.searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc',
    };

    // Filter incidents based on user role
    let userIncidents = [...mockIncidents];
    if (user.role === 'user' || user.role === 'reporter') {
      // Regular users only see their own incidents or those assigned to them
      userIncidents = userIncidents.filter(
        i =>
          i.reporterInfo.userId === user.id ||
          i.assignedTo?.includes(user.id) ||
          i.organizationId === user.organizationId
      );
    } else if (user.role !== 'super_admin') {
      // Managers, admins, reviewers see org incidents
      userIncidents = userIncidents.filter(i => i.organizationId === user.organizationId);
    }

    // Apply filters
    const filtered = filterIncidents(userIncidents, filters);

    // Apply sorting
    filtered.sort((a, b) => {
      const aVal = a[pagination.sortBy as keyof Incident] as any;
      const bVal = b[pagination.sortBy as keyof Incident] as any;
      if (pagination.sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    // Apply pagination
    const result = paginateResults(filtered, pagination);

    return HttpResponse.json({
      success: true,
      data: result,
    });
  }),

  // GET /incidents/:id - Get single incident
  http.get(`${API_URL}/incidents/:id`, async ({ params }) => {
    await new Promise(resolve => setTimeout(resolve, 400));

    const user = sessionStorage.getUser();
    if (!user) {
      return HttpResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const incident = findIncidentById(params.id as string);
    if (!incident) {
      return HttpResponse.json(
        { success: false, error: 'Incident not found' },
        { status: 404 }
      );
    }

    // Check permissions
    if (
      user.role !== 'super_admin' &&
      user.role !== 'admin' &&
      incident.organizationId !== user.organizationId &&
      incident.reporterInfo.userId !== user.id &&
      !incident.assignedTo?.includes(user.id)
    ) {
      return HttpResponse.json(
        { success: false, error: 'Access denied' },
        { status: 403 }
      );
    }

    return HttpResponse.json({
      success: true,
      data: incident,
    });
  }),

  // POST /incidents - Create new incident
  http.post(`${API_URL}/incidents`, async ({ request }) => {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const user = sessionStorage.getUser();
    const body = await request.json() as Partial<Incident>;

    // Validate required fields
    if (!body.title || !body.description || !body.severity || !body.category) {
      return HttpResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Find full category details
    const category = ALL_INCIDENT_CATEGORIES.find(c => c.id === (body.category as any).id || c.id === body.category);
    if (!category) {
      return HttpResponse.json(
        { success: false, error: 'Invalid category' },
        { status: 400 }
      );
    }

    // Determine reporter info
    let reporterType = body.reporterType || 'user';
    let reporterInfo = body.reporterInfo || {};

    if (user) {
      reporterType = 'user';
      reporterInfo = {
        reporterType: 'user',
        userId: user.id,
      };
    } else if (reporterInfo.email) {
      reporterType = 'guest';
      reporterInfo = {
        reporterType: 'guest',
        ...reporterInfo,
        trackingId: generateTrackingId(),
      };
    } else {
      reporterType = 'anonymous';
      reporterInfo = {
        reporterType: 'anonymous',
        trackingId: generateTrackingId(),
      };
    }

    // Create new incident
    const newIncident: Incident = {
      id: generateIncidentId(),
      trackingId: reporterType !== 'user' ? reporterInfo.trackingId : undefined,
      title: body.title,
      description: body.description,
      severity: body.severity,
      category,
      status: category.requiresApproval ? 'submitted' : 'in_progress',
      reporterType: reporterType as any,
      reporterInfo: reporterInfo as any,
      organizationId: user?.organizationId,
      location: body.location,
      attachments: [],
      timeline: [
        {
          id: generateTimelineId(),
          action: 'created',
          description: 'Incident reported',
          performedBy: user?.id || 'anonymous',
          performedByName: user ? `${user.firstName} ${user.lastName}` : 'Anonymous',
          performedAt: new Date().toISOString(),
        },
      ],
      assignedTo: body.assignedTo || [],
      escalationLevel: category.escalationLevel,
      dueDate: body.dueDate,
      tags: body.tags || [],
      customFields: body.customFields || {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addIncident(newIncident);

    // Create notifications for assigned users
    if (newIncident.assignedTo && newIncident.assignedTo.length > 0) {
      newIncident.assignedTo.forEach(userId => {
        addNotification({
          id: `notif-${Date.now()}-${userId}`,
          userId,
          type: 'incident_assigned',
          title: 'New Incident Assigned',
          message: `You have been assigned to: ${newIncident.title}`,
          incidentId: newIncident.id,
          read: false,
          createdAt: new Date().toISOString(),
          actionUrl: `/dashboard/incidents/${newIncident.id}`,
        });
      });
    }

    return HttpResponse.json({
      success: true,
      data: newIncident,
      message: 'Incident created successfully',
    });
  }),

  // PATCH /incidents/:id - Update incident
  http.patch(`${API_URL}/incidents/:id`, async ({ params, request }) => {
    await new Promise(resolve => setTimeout(resolve, 800));

    const user = sessionStorage.getUser();
    if (!user) {
      return HttpResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const incident = findIncidentById(params.id as string);
    if (!incident) {
      return HttpResponse.json(
        { success: false, error: 'Incident not found' },
        { status: 404 }
      );
    }

    const body = await request.json() as Partial<Incident>;

    // Create timeline entry for the update
    const timelineEntry: IncidentTimelineEntry = {
      id: generateTimelineId(),
      action: 'updated',
      description: 'Incident updated',
      performedBy: user.id,
      performedByName: `${user.firstName} ${user.lastName}`,
      performedAt: new Date().toISOString(),
    };

    // Check for status change
    if (body.status && body.status !== incident.status) {
      timelineEntry.action = 'status_changed';
      timelineEntry.description = `Status changed from ${incident.status} to ${body.status}`;
    }

    // Check for assignment change
    if (body.assignedTo && JSON.stringify(body.assignedTo) !== JSON.stringify(incident.assignedTo)) {
      timelineEntry.action = 'assigned';
      timelineEntry.description = 'Incident reassigned';

      // Notify newly assigned users
      const newAssignees = body.assignedTo.filter(id => !incident.assignedTo?.includes(id));
      newAssignees.forEach(userId => {
        addNotification({
          id: `notif-${Date.now()}-${userId}`,
          userId,
          type: 'incident_assigned',
          title: 'Incident Assigned',
          message: `You have been assigned to: ${incident.title}`,
          incidentId: incident.id,
          read: false,
          createdAt: new Date().toISOString(),
          actionUrl: `/dashboard/incidents/${incident.id}`,
        });
      });
    }

    // Update timeline
    const updatedTimeline = [...incident.timeline, timelineEntry];

    // Update incident
    const updated = updateIncident(params.id as string, {
      ...body,
      timeline: updatedTimeline,
    });

    return HttpResponse.json({
      success: true,
      data: updated,
      message: 'Incident updated successfully',
    });
  }),

  // DELETE /incidents/:id - Delete incident (soft delete)
  http.delete(`${API_URL}/incidents/:id`, async ({ params }) => {
    await new Promise(resolve => setTimeout(resolve, 500));

    const user = sessionStorage.getUser();
    if (!user) {
      return HttpResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Only admins and super_admins can delete
    if (user.role !== 'admin' && user.role !== 'super_admin') {
      return HttpResponse.json(
        { success: false, error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    const incident = findIncidentById(params.id as string);
    if (!incident) {
      return HttpResponse.json(
        { success: false, error: 'Incident not found' },
        { status: 404 }
      );
    }

    // In real app, we'd soft delete by adding a deletedAt field
    // For demo, we'll just return success
    console.log(`[MSW] Incident ${params.id} deleted by ${user.email}`);

    return HttpResponse.json({
      success: true,
      message: 'Incident deleted successfully',
    });
  }),

  // GET /incidents/:id/timeline - Get incident timeline
  http.get(`${API_URL}/incidents/:id/timeline`, async ({ params }) => {
    await new Promise(resolve => setTimeout(resolve, 300));

    const incident = findIncidentById(params.id as string);
    if (!incident) {
      return HttpResponse.json(
        { success: false, error: 'Incident not found' },
        { status: 404 }
      );
    }

    return HttpResponse.json({
      success: true,
      data: incident.timeline,
    });
  }),

  // POST /incidents/:id/comments - Add comment (timeline entry)
  http.post(`${API_URL}/incidents/:id/comments`, async ({ params, request }) => {
    await new Promise(resolve => setTimeout(resolve, 500));

    const user = sessionStorage.getUser();
    if (!user) {
      return HttpResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const incident = findIncidentById(params.id as string);
    if (!incident) {
      return HttpResponse.json(
        { success: false, error: 'Incident not found' },
        { status: 404 }
      );
    }

    const body = await request.json() as { comment: string };

    const timelineEntry: IncidentTimelineEntry = {
      id: generateTimelineId(),
      action: 'comment_added',
      description: body.comment,
      performedBy: user.id,
      performedByName: `${user.firstName} ${user.lastName}`,
      performedAt: new Date().toISOString(),
    };

    const updatedTimeline = [...incident.timeline, timelineEntry];
    const updated = updateIncident(params.id as string, { timeline: updatedTimeline });

    // Notify assigned users about the comment
    incident.assignedTo?.forEach(userId => {
      if (userId !== user.id) {
        addNotification({
          id: `notif-${Date.now()}-${userId}`,
          userId,
          type: 'comment_added',
          title: 'New Comment Added',
          message: `${user.firstName} ${user.lastName} added a comment to: ${incident.title}`,
          incidentId: incident.id,
          read: false,
          createdAt: new Date().toISOString(),
          actionUrl: `/dashboard/incidents/${incident.id}`,
        });
      }
    });

    return HttpResponse.json({
      success: true,
      data: timelineEntry,
      message: 'Comment added successfully',
    });
  }),

  // GET /categories - Get all categories
  http.get(`${API_URL}/categories`, async ({ request }) => {
    await new Promise(resolve => setTimeout(resolve, 300));

    const url = new URL(request.url);
    const type = url.searchParams.get('type');

    let categories = ALL_INCIDENT_CATEGORIES;
    if (type) {
      categories = categories.filter(c => c.type === type);
    }

    return HttpResponse.json({
      success: true,
      data: categories,
    });
  }),

  // GET /categories/:id - Get single category
  http.get(`${API_URL}/categories/:id`, async ({ params }) => {
    await new Promise(resolve => setTimeout(resolve, 200));

    const category = ALL_INCIDENT_CATEGORIES.find(c => c.id === params.id);
    if (!category) {
      return HttpResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }

    return HttpResponse.json({
      success: true,
      data: category,
    });
  }),
];
