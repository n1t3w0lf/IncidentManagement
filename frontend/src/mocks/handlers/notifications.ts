// ============================================
// MSW HANDLERS - Notifications
// ============================================

import { http, HttpResponse } from 'msw';
import { mockNotifications, sessionStorage, markNotificationAsRead } from '../data';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

// ============================================
// NOTIFICATION HANDLERS
// ============================================

export const notificationHandlers = [
  // GET /notifications - List user notifications
  http.get(`${API_URL}/notifications`, async ({ request }) => {
    await new Promise(resolve => setTimeout(resolve, 400));

    const user = sessionStorage.getUser();
    if (!user) {
      return HttpResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const url = new URL(request.url);
    const unreadOnly = url.searchParams.get('unreadOnly') === 'true';
    const limit = parseInt(url.searchParams.get('limit') || '50');

    // Get user's notifications
    let notifications = mockNotifications.filter(n => n.userId === user.id);

    // Filter unread only
    if (unreadOnly) {
      notifications = notifications.filter(n => !n.read);
    }

    // Sort by created date (newest first)
    notifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Apply limit
    notifications = notifications.slice(0, limit);

    return HttpResponse.json({
      success: true,
      data: notifications,
    });
  }),

  // GET /notifications/unread-count - Get unread notification count
  http.get(`${API_URL}/notifications/unread-count`, async () => {
    await new Promise(resolve => setTimeout(resolve, 200));

    const user = sessionStorage.getUser();
    if (!user) {
      return HttpResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const unreadCount = mockNotifications.filter(n => n.userId === user.id && !n.read).length;

    return HttpResponse.json({
      success: true,
      data: { count: unreadCount },
    });
  }),

  // PATCH /notifications/:id/read - Mark notification as read
  http.patch(`${API_URL}/notifications/:id/read`, async ({ params }) => {
    await new Promise(resolve => setTimeout(resolve, 300));

    const user = sessionStorage.getUser();
    if (!user) {
      return HttpResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const notification = mockNotifications.find(n => n.id === params.id);
    if (!notification) {
      return HttpResponse.json(
        { success: false, error: 'Notification not found' },
        { status: 404 }
      );
    }

    if (notification.userId !== user.id) {
      return HttpResponse.json(
        { success: false, error: 'Access denied' },
        { status: 403 }
      );
    }

    markNotificationAsRead(params.id as string);

    return HttpResponse.json({
      success: true,
      message: 'Notification marked as read',
    });
  }),

  // POST /notifications/mark-all-read - Mark all notifications as read
  http.post(`${API_URL}/notifications/mark-all-read`, async () => {
    await new Promise(resolve => setTimeout(resolve, 400));

    const user = sessionStorage.getUser();
    if (!user) {
      return HttpResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Mark all user's notifications as read
    mockNotifications
      .filter(n => n.userId === user.id && !n.read)
      .forEach(n => markNotificationAsRead(n.id));

    return HttpResponse.json({
      success: true,
      message: 'All notifications marked as read',
    });
  }),

  // DELETE /notifications/:id - Delete notification
  http.delete(`${API_URL}/notifications/:id`, async ({ params }) => {
    await new Promise(resolve => setTimeout(resolve, 300));

    const user = sessionStorage.getUser();
    if (!user) {
      return HttpResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const notification = mockNotifications.find(n => n.id === params.id);
    if (!notification) {
      return HttpResponse.json(
        { success: false, error: 'Notification not found' },
        { status: 404 }
      );
    }

    if (notification.userId !== user.id) {
      return HttpResponse.json(
        { success: false, error: 'Access denied' },
        { status: 403 }
      );
    }

    // In real app, we'd remove from array
    // For demo, just log it
    console.log(`[MSW] Notification ${params.id} deleted`);

    return HttpResponse.json({
      success: true,
      message: 'Notification deleted',
    });
  }),
];
