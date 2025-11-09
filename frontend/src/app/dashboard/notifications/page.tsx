'use client';

// ============================================
// NOTIFICATIONS PAGE
// ============================================

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent, Badge, Alert } from '@/components/ui';

export default function NotificationsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="mt-2 text-gray-600">
            View and manage all your notifications in one place
          </p>
        </div>

        {/* Info Alert */}
        <Alert variant="info">
          <p className="font-medium">Feature Under Development</p>
          <p className="mt-1 text-sm">
            The notification center is currently being developed. This page will provide a centralized
            view of all your system notifications, alerts, and updates.
          </p>
        </Alert>

        {/* Planned Features */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Notification Types</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-primary-600 mr-3 mt-0.5">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                      <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Incident Updates</p>
                    <p className="text-sm text-gray-600">Status changes, assignments, and comments</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-warning-100 text-warning-600 mr-3 mt-0.5">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Approval Requests</p>
                    <p className="text-sm text-gray-600">Incidents requiring your approval</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-danger-100 text-danger-600 mr-3 mt-0.5">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Escalation Alerts</p>
                    <p className="text-sm text-gray-600">SLA breaches and timeout warnings</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success-100 text-success-600 mr-3 mt-0.5">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                      <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Mentions & Comments</p>
                    <p className="text-sm text-gray-600">When you're mentioned or comments added</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-info-100 text-info-600 mr-3 mt-0.5">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">System Announcements</p>
                    <p className="text-sm text-gray-600">Updates, maintenance, and new features</p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notification Features</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-success-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="font-medium text-gray-900">Real-time Updates</p>
                    <p className="text-sm text-gray-600">Instant notifications as events occur</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-success-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="font-medium text-gray-900">Mark as Read/Unread</p>
                    <p className="text-sm text-gray-600">Manage notification status individually or in bulk</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-success-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="font-medium text-gray-900">Filter by Type</p>
                    <p className="text-sm text-gray-600">View specific notification categories</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-success-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="font-medium text-gray-900">Email Digest</p>
                    <p className="text-sm text-gray-600">Daily or weekly notification summaries</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-success-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="font-medium text-gray-900">Custom Preferences</p>
                    <p className="text-sm text-gray-600">Choose which notifications you want to receive</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-success-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="font-medium text-gray-900">Direct Links</p>
                    <p className="text-sm text-gray-600">Click to jump directly to related incidents</p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Sample Notifications Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Notification Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="rounded-lg border border-primary-200 bg-primary-50 p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-600 text-white">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                        <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">
                        New incident assigned to you
                      </p>
                      <Badge variant="primary">Unread</Badge>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">
                      Underground Equipment Fire at North Mine - High severity
                    </p>
                    <p className="mt-1 text-xs text-gray-500">2 minutes ago</p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border p-4 opacity-60">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success-600 text-white">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">
                        Incident resolved successfully
                      </p>
                      <Badge variant="default">Read</Badge>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">
                      INC-123456-ABC has been marked as resolved
                    </p>
                    <p className="mt-1 text-xs text-gray-500">1 hour ago</p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border p-4 opacity-60">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-warning-600 text-white">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">
                        Approval request pending
                      </p>
                      <Badge variant="default">Read</Badge>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">
                      Patient Fall incident requires your approval - Due in 2 hours
                    </p>
                    <p className="mt-1 text-xs text-gray-500">3 hours ago</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Workaround */}
        <Alert variant="default">
          <p className="font-medium">Current Notification Access</p>
          <p className="mt-1 text-sm">
            In the meantime, you can view recent notifications by clicking the bell icon in the top navigation bar.
            The dropdown shows your most recent activity and updates.
          </p>
        </Alert>
      </div>
    </DashboardLayout>
  );
}
