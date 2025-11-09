'use client';

// ============================================
// USER PROFILE PAGE
// ============================================

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent, Badge, Alert, Button } from '@/components/ui';
import { useAuthStore } from '@/stores/authStore';

export default function ProfilePage() {
  const { user, organization } = useAuthStore();

  if (!user) {
    return (
      <DashboardLayout>
        <Alert variant="danger">
          <p className="font-medium">Not Authenticated</p>
          <p className="mt-1 text-sm">Please log in to view your profile.</p>
        </Alert>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="mt-2 text-gray-600">
            View and manage your personal account information
          </p>
        </div>

        {/* Info Alert */}
        <Alert variant="info">
          <p className="font-medium">Feature Under Development</p>
          <p className="mt-1 text-sm">
            The profile editing interface is currently being developed. This page will allow you to
            update your personal information, change your password, and manage notification preferences.
          </p>
        </Alert>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Profile Info - Main Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Avatar Section */}
                  <div className="flex items-center space-x-4">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-600 text-3xl font-bold text-white">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                      <Button variant="secondary" className="mt-2" disabled>
                        Change Avatar (Coming Soon)
                      </Button>
                    </div>
                  </div>

                  {/* Profile Fields */}
                  <dl className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Full Name</dt>
                      <dd className="mt-1 text-sm text-gray-900">{user.name}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Email Address</dt>
                      <dd className="mt-1 text-sm text-gray-900">{user.email}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">User ID</dt>
                      <dd className="mt-1 text-sm font-mono text-gray-900">{user.id.slice(0, 8)}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Account Status</dt>
                      <dd className="mt-1">
                        <Badge variant="success">Active</Badge>
                      </dd>
                    </div>
                  </dl>

                  <div className="pt-4 border-t">
                    <Button variant="primary" disabled>
                      Edit Profile (Coming Soon)
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-lg border p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Password</h4>
                        <p className="text-sm text-gray-600">Last changed: Never</p>
                      </div>
                      <Button variant="secondary" disabled>
                        Change Password
                      </Button>
                    </div>
                  </div>

                  <div className="rounded-lg border p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h4>
                        <p className="text-sm text-gray-600">Add an extra layer of security</p>
                      </div>
                      <Badge variant="default">Coming Soon</Badge>
                    </div>
                  </div>

                  <div className="rounded-lg border p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Active Sessions</h4>
                        <p className="text-sm text-gray-600">Manage your active sessions</p>
                      </div>
                      <Badge variant="default">Coming Soon</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notification Preferences */}
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Control how and when you receive notifications about incidents and system updates.
                  </p>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between rounded-lg border p-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Email Notifications</p>
                        <p className="text-xs text-gray-500">Receive updates via email</p>
                      </div>
                      <Badge variant="default">Coming Soon</Badge>
                    </div>

                    <div className="flex items-center justify-between rounded-lg border p-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">In-App Notifications</p>
                        <p className="text-xs text-gray-500">Get notified within the application</p>
                      </div>
                      <Badge variant="default">Coming Soon</Badge>
                    </div>

                    <div className="flex items-center justify-between rounded-lg border p-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Critical Alerts</p>
                        <p className="text-xs text-gray-500">Immediate notifications for critical incidents</p>
                      </div>
                      <Badge variant="default">Coming Soon</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Role & Permissions */}
            <Card>
              <CardHeader>
                <CardTitle>Role & Access</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Current Role</dt>
                    <dd className="mt-1">
                      <Badge
                        variant={
                          user.role === 'super_admin' || user.role === 'admin' ? 'danger' :
                          user.role === 'manager' ? 'warning' : 'primary'
                        }
                      >
                        {user.role.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </dd>
                  </div>

                  {organization && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Organization</dt>
                      <dd className="mt-1 text-sm text-gray-900">{organization.name}</dd>
                    </div>
                  )}

                  <div>
                    <dt className="text-sm font-medium text-gray-500 mb-2">Permissions</dt>
                    <dd className="space-y-2">
                      {user.role === 'super_admin' && (
                        <div className="flex items-center text-sm text-gray-700">
                          <svg className="h-4 w-4 text-success-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Full System Access
                        </div>
                      )}
                      {(user.role === 'admin' || user.role === 'super_admin') && (
                        <>
                          <div className="flex items-center text-sm text-gray-700">
                            <svg className="h-4 w-4 text-success-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Manage Users
                          </div>
                          <div className="flex items-center text-sm text-gray-700">
                            <svg className="h-4 w-4 text-success-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            View All Incidents
                          </div>
                        </>
                      )}
                      {(user.role === 'manager' || user.role === 'admin' || user.role === 'super_admin') && (
                        <div className="flex items-center text-sm text-gray-700">
                          <svg className="h-4 w-4 text-success-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Approve Incidents
                        </div>
                      )}
                      <div className="flex items-center text-sm text-gray-700">
                        <svg className="h-4 w-4 text-success-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Submit Incidents
                      </div>
                    </dd>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Activity Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Activity Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-lg bg-primary-50 p-4">
                    <p className="text-2xl font-bold text-primary-600">--</p>
                    <p className="text-sm text-gray-600">Incidents Submitted</p>
                  </div>
                  <div className="rounded-lg bg-success-50 p-4">
                    <p className="text-2xl font-bold text-success-600">--</p>
                    <p className="text-sm text-gray-600">Incidents Resolved</p>
                  </div>
                  {(user.role === 'manager' || user.role === 'admin' || user.role === 'super_admin') && (
                    <div className="rounded-lg bg-warning-50 p-4">
                      <p className="text-2xl font-bold text-warning-600">--</p>
                      <p className="text-sm text-gray-600">Approvals Processed</p>
                    </div>
                  )}
                </div>
                <p className="mt-4 text-xs text-gray-500">
                  Statistics will be available once the analytics feature is implemented.
                </p>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full" disabled>
                    Download My Data
                  </Button>
                  <Button variant="outline" className="w-full" disabled>
                    Export Activity Report
                  </Button>
                  <Button variant="danger" className="w-full" disabled>
                    Delete Account
                  </Button>
                </div>
                <p className="mt-3 text-xs text-gray-500">
                  These features will be available in a future update.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
