'use client';

// ============================================
// INCIDENT TRACKING PAGE
// ============================================

import { useState } from 'react';
import Link from 'next/link';
import { Input, Button, Alert, Card, CardHeader, CardTitle, CardContent, Badge } from '@/components/ui';
import { STATUS_CONFIG, SEVERITY_CONFIG } from '@/lib/constants';
import { formatDateTime, formatRelativeTime } from '@/lib/utils';
import type { Incident } from '@/types';

export default function TrackPage() {
  const [trackingId, setTrackingId] = useState('');
  const [email, setEmail] = useState('');
  const [incident, setIncident] = useState<Incident | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIncident(null);
    setIsLoading(true);

    try {
      // Validate tracking ID format
      if (!/^INC-\d{6}-[A-Z0-9]{4}$/.test(trackingId)) {
        throw new Error('Invalid tracking ID format. Expected format: INC-123456-ABCD');
      }

      // Call the public tracking endpoint (no authentication required)
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';
      const emailParam = email ? `?email=${encodeURIComponent(email)}` : '';
      const response = await fetch(`${API_URL}/incidents/track/${trackingId}${emailParam}`);
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Incident not found. Please check your tracking ID and try again.');
      }

      setIncident(data.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100">
      {/* Header */}
      <header className="border-b bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-600 text-white font-bold text-xl">
                I
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Incident Management System</h1>
                <p className="text-sm text-gray-500">Track Your Incident</p>
              </div>
            </Link>
            <Link href="/" className="text-sm font-medium text-primary-600 hover:text-primary-700">
              ← Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Track Your Incident</h2>
          <p className="mt-2 text-gray-600">
            Enter your tracking ID to check the status of your reported incident
          </p>
        </div>

        {/* Search Form */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Tracking ID"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value.toUpperCase())}
                placeholder="INC-123456-ABCD"
                required
                helperText="Format: INC-XXXXXX-XXXX"
              />

              <Input
                label="Email (Optional)"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                helperText="If you provided an email when reporting, enter it for verification"
              />

              {error && (
                <Alert variant="danger" onClose={() => setError('')}>
                  {error}
                </Alert>
              )}

              <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
                Track Incident
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Results */}
        {incident && (
          <div className="space-y-6">
            {/* Status Card */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>Incident Status</CardTitle>
                    <p className="text-sm text-gray-500 mt-1">
                      Tracking ID: <span className="font-mono font-medium">{incident.trackingId}</span>
                    </p>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <Badge
                      variant={
                        incident.severity === 'critical' ? 'danger' :
                        incident.severity === 'high' ? 'warning' :
                        incident.severity === 'medium' ? 'info' : 'default'
                      }
                      size="lg"
                    >
                      {SEVERITY_CONFIG[incident.severity].label}
                    </Badge>
                    <Badge variant="primary" size="lg">
                      {STATUS_CONFIG[incident.status].label}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{incident.title}</h3>
                    <p className="mt-2 text-gray-600">{incident.description}</p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Category</p>
                      <p className="mt-1 text-sm text-gray-900">{incident.category.name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Industry</p>
                      <p className="mt-1 text-sm text-gray-900 capitalize">{incident.category.type}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Reported</p>
                      <p className="mt-1 text-sm text-gray-900">
                        {formatDateTime(incident.createdAt)}
                      </p>
                      <p className="text-xs text-gray-500">
                        ({formatRelativeTime(incident.createdAt)})
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Last Updated</p>
                      <p className="mt-1 text-sm text-gray-900">
                        {formatDateTime(incident.updatedAt)}
                      </p>
                      <p className="text-xs text-gray-500">
                        ({formatRelativeTime(incident.updatedAt)})
                      </p>
                    </div>
                  </div>

                  {incident.location && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">Location</p>
                      <p className="mt-1 text-sm text-gray-900">
                        {incident.location.facility || incident.location.address || 'Not specified'}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Activity Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flow-root">
                  <ul className="-mb-8">
                    {incident.timeline.map((entry, idx) => (
                      <li key={entry.id}>
                        <div className="relative pb-8">
                          {idx < incident.timeline.length - 1 && (
                            <span
                              className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200"
                              aria-hidden="true"
                            />
                          )}
                          <div className="relative flex space-x-3">
                            <div>
                              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-600 text-white">
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                  <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </span>
                            </div>
                            <div className="flex min-w-0 flex-1 justify-between space-x-4">
                              <div>
                                <p className="text-sm text-gray-900">{entry.description}</p>
                                {entry.performedByName && (
                                  <p className="text-xs text-gray-500">by {entry.performedByName}</p>
                                )}
                              </div>
                              <div className="whitespace-nowrap text-right text-sm text-gray-500">
                                <time dateTime={entry.performedAt}>
                                  {formatRelativeTime(entry.performedAt)}
                                </time>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Status Explanation */}
            <Card>
              <CardHeader>
                <CardTitle>What's Next?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  {incident.status === 'submitted' && (
                    <p className="text-gray-600">
                      Your incident has been submitted and is awaiting review by our team. We will investigate this matter and provide updates as we progress.
                    </p>
                  )}
                  {incident.status === 'under_review' && (
                    <p className="text-gray-600">
                      Your incident is currently under review by our team. We are gathering information and assessing the situation.
                    </p>
                  )}
                  {incident.status === 'investigating' && (
                    <p className="text-gray-600">
                      We are actively investigating your incident. Our team is working to understand the root cause and determine appropriate actions.
                    </p>
                  )}
                  {incident.status === 'pending_approval' && (
                    <p className="text-gray-600">
                      The incident has been escalated and is awaiting approval from management before proceeding with resolution.
                    </p>
                  )}
                  {incident.status === 'approved' && (
                    <p className="text-gray-600">
                      Your incident has been approved and is ready for resolution actions to begin.
                    </p>
                  )}
                  {incident.status === 'in_progress' && (
                    <p className="text-gray-600">
                      We are actively working on resolving this incident. Corrective actions are being implemented.
                    </p>
                  )}
                  {incident.status === 'resolved' && (
                    <p className="text-gray-600">
                      This incident has been resolved. All necessary actions have been completed. The case will be closed soon.
                    </p>
                  )}
                  {incident.status === 'closed' && (
                    <p className="text-gray-600">
                      This incident has been closed. Thank you for reporting this issue. If you have any concerns, please contact us.
                    </p>
                  )}
                  {incident.status === 'rejected' && (
                    <p className="text-gray-600">
                      This incident report has been reviewed and rejected. This may be due to insufficient information or the issue not meeting incident criteria. Please contact us if you have questions.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Help */}
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900">Need Help?</h3>
                  <p className="mt-2 text-sm text-gray-600">
                    If you have questions about your incident or need to provide additional information,
                    please save your tracking ID and contact our support team.
                  </p>
                  <div className="mt-4 flex justify-center space-x-4">
                    <Button variant="outline">Contact Support</Button>
                    <Button onClick={() => window.print()}>Print Details</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
