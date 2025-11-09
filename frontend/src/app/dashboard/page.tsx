'use client';

// ============================================
// DASHBOARD HOME PAGE
// ============================================

import { useEffect } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/stores/authStore';
import { useIncidentStore } from '@/stores/incidentStore';
import { useNotificationStore } from '@/stores/notificationStore';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent, Badge, SkeletonDashboardStats, SkeletonIncidentCard } from '@/components/ui';
import { STATUS_CONFIG, SEVERITY_CONFIG } from '@/lib/constants';
import { formatRelativeTime } from '@/lib/utils';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { incidents, fetchIncidents, isLoading } = useIncidentStore();
  const { notifications, fetchNotifications, unreadCount } = useNotificationStore();

  useEffect(() => {
    // Fetch recent incidents
    fetchIncidents({ page: 1, limit: 5, sortBy: 'createdAt', sortOrder: 'desc' });
    // Fetch recent notifications
    fetchNotifications(false, 5);
  }, [fetchIncidents, fetchNotifications]);

  // Calculate stats
  const stats = {
    total: incidents.length,
    open: incidents.filter(i => !['resolved', 'closed', 'rejected'].includes(i.status)).length,
    critical: incidents.filter(i => i.severity === 'critical').length,
    needsApproval: incidents.filter(i => i.status === 'pending_approval').length,
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.firstName}!
          </h1>
          <p className="mt-2 text-gray-600">
            Here's what's happening with your incidents today.
          </p>
        </div>

        {/* Stats Grid */}
        {isLoading ? (
          <SkeletonDashboardStats />
        ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Incidents</p>
                  <p className="mt-2 text-3xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <div className="rounded-full bg-primary-100 p-3">
                  <svg className="h-6 w-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Open Cases</p>
                  <p className="mt-2 text-3xl font-bold text-warning-600">{stats.open}</p>
                </div>
                <div className="rounded-full bg-warning-100 p-3">
                  <svg className="h-6 w-6 text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Critical</p>
                  <p className="mt-2 text-3xl font-bold text-danger-600">{stats.critical}</p>
                </div>
                <div className="rounded-full bg-danger-100 p-3">
                  <svg className="h-6 w-6 text-danger-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Awaiting Approval</p>
                  <p className="mt-2 text-3xl font-bold text-primary-600">{stats.needsApproval}</p>
                </div>
                <div className="rounded-full bg-primary-100 p-3">
                  <svg className="h-6 w-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        )}

        {/* Two Column Layout */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Incidents */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Incidents</CardTitle>
                <Link href="/dashboard/incidents" className="text-sm font-medium text-primary-600 hover:text-primary-700">
                  View all →
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <SkeletonIncidentCard key={index} />
                  ))}
                </div>
              ) : incidents.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No incidents yet</p>
              ) : (
                <div className="space-y-4">
                  {incidents.slice(0, 5).map((incident) => (
                    <Link
                      key={incident.id}
                      href={`/dashboard/incidents/${incident.id}`}
                      className="block rounded-lg border p-4 hover:border-primary-300 hover:bg-primary-50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {incident.title}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatRelativeTime(incident.createdAt)}
                          </p>
                        </div>
                        <div className="ml-4 flex flex-col items-end space-y-2">
                          <Badge
                            variant={
                              incident.severity === 'critical' ? 'danger' :
                              incident.severity === 'high' ? 'warning' :
                              incident.severity === 'medium' ? 'info' : 'default'
                            }
                          >
                            {SEVERITY_CONFIG[incident.severity].label}
                          </Badge>
                          <Badge variant="default">
                            {STATUS_CONFIG[incident.status].label}
                          </Badge>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Notifications */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Notifications</CardTitle>
                <Link href="/dashboard/notifications" className="text-sm font-medium text-primary-600 hover:text-primary-700">
                  View all →
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {notifications.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No notifications</p>
              ) : (
                <div className="space-y-4">
                  {notifications.slice(0, 5).map((notification) => (
                    <div
                      key={notification.id}
                      className={`rounded-lg border p-4 ${!notification.read ? 'bg-primary-50 border-primary-200' : ''}`}
                    >
                      <div className="flex items-start">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {notification.title}
                          </p>
                          <p className="text-xs text-gray-600 mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-2">
                            {formatRelativeTime(notification.createdAt)}
                          </p>
                        </div>
                        {!notification.read && (
                          <div className="ml-2 h-2 w-2 rounded-full bg-primary-600" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3">
              <Link
                href="/dashboard/report"
                className="flex items-center space-x-3 rounded-lg border border-primary-200 bg-primary-50 p-4 hover:bg-primary-100 transition-colors"
              >
                <div className="rounded-full bg-primary-600 p-2">
                  <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Report Incident</p>
                  <p className="text-xs text-gray-600">Create a new incident</p>
                </div>
              </Link>

              <Link
                href="/dashboard/incidents"
                className="flex items-center space-x-3 rounded-lg border p-4 hover:border-primary-300 hover:bg-gray-50 transition-colors"
              >
                <div className="rounded-full bg-gray-100 p-2">
                  <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900">View All Incidents</p>
                  <p className="text-xs text-gray-600">Browse incident history</p>
                </div>
              </Link>

              <Link
                href="/track"
                className="flex items-center space-x-3 rounded-lg border p-4 hover:border-primary-300 hover:bg-gray-50 transition-colors"
              >
                <div className="rounded-full bg-gray-100 p-2">
                  <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Track Incident</p>
                  <p className="text-xs text-gray-600">Search by tracking ID</p>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
