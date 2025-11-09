'use client';

// ============================================
// GUEST REPORTING PAGE
// ============================================

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useIncidentStore } from '@/stores/incidentStore';
import { DynamicIncidentForm } from '@/components/forms/DynamicIncidentForm';
import { Alert, Card, CardContent } from '@/components/ui';
import type { Incident } from '@/types';

export default function GuestReportPage() {
  const router = useRouter();
  const { createIncident, isLoading } = useIncidentStore();
  const [trackingId, setTrackingId] = useState<string | null>(null);
  const [reporterEmail, setReporterEmail] = useState<string>('');
  const [error, setError] = useState('');

  const handleSubmit = async (data: Partial<Incident>) => {
    setError('');

    try {
      const incident = await createIncident(data);

      // Save email and tracking ID
      if (incident.trackingId) {
        setTrackingId(incident.trackingId);
        setReporterEmail(data.reporterInfo?.email || '');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to submit incident report');
    }
  };

  if (trackingId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100">
        {/* Header */}
        <header className="border-b bg-white shadow-sm">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
            <Link href="/" className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-600 text-white font-bold text-xl">
                I
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Incident Management System</h1>
                <p className="text-sm text-gray-500">Report Submitted Successfully</p>
              </div>
            </Link>
          </div>
        </header>

        {/* Success Message */}
        <main className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                {/* Success Icon */}
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success-100">
                  <svg className="h-10 w-10 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>

                <h2 className="mt-6 text-2xl font-bold text-gray-900">
                  Report Submitted Successfully!
                </h2>
                <p className="mt-2 text-gray-600">
                  Thank you for reporting this incident. We will review it and may contact you for additional information.
                </p>

                {/* Tracking ID */}
                <div className="mt-8 rounded-lg bg-primary-50 border-2 border-primary-200 p-6">
                  <p className="text-sm font-medium text-gray-700 mb-2">Your Tracking ID:</p>
                  <p className="text-3xl font-mono font-bold text-primary-600">
                    {trackingId}
                  </p>
                  <p className="mt-4 text-sm text-gray-600">
                    An email confirmation has been sent to: <strong>{reporterEmail}</strong>
                  </p>
                </div>

                {/* Info Alert */}
                <Alert variant="success" className="mt-6 text-left">
                  <p className="font-medium">What happens next?</p>
                  <ul className="mt-2 list-disc list-inside text-sm space-y-1">
                    <li>You will receive email updates about your incident</li>
                    <li>You can track status anytime using your tracking ID</li>
                    <li>We may contact you if we need more information</li>
                    <li>Expected response time: 24-48 hours</li>
                  </ul>
                </Alert>

                {/* Actions */}
                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => {
                      const text = `Incident Tracking ID: ${trackingId}\nEmail: ${reporterEmail}\n\nTrack your incident at: ${window.location.origin}/track`;
                      navigator.clipboard.writeText(text);
                      alert('Tracking information copied to clipboard!');
                    }}
                    className="btn-primary"
                  >
                    Copy Tracking Info
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="btn-secondary"
                  >
                    Print Confirmation
                  </button>
                  <Link
                    href="/track"
                    className="btn-secondary text-center"
                  >
                    Track Incident
                  </Link>
                </div>

                <div className="mt-8 pt-6 border-t">
                  <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">
                    ← Back to Home
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

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
                <p className="text-sm text-gray-500">Guest Reporting</p>
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
        {/* Info Banner */}
        <Alert variant="info" className="mb-6">
          <p className="font-medium">Guest Reporting</p>
          <p className="mt-1 text-sm">
            Provide your contact information to receive email updates and allow us to follow up if needed.
            You will also receive a tracking ID to check your incident status anytime.
          </p>
        </Alert>

        {/* Form Card */}
        <Card>
          <CardContent className="pt-6">
            {error && (
              <Alert variant="danger" className="mb-6" onClose={() => setError('')}>
                {error}
              </Alert>
            )}

            <DynamicIncidentForm
              onSubmit={handleSubmit}
              isLoading={isLoading}
              showReporterInfo={true}
              reporterType="guest"
            />
          </CardContent>
        </Card>

        {/* Privacy Notice */}
        <div className="mt-6 rounded-lg bg-gray-50 p-4 text-sm text-gray-600">
          <h3 className="font-semibold text-gray-900 mb-2">Privacy & Data Protection</h3>
          <ul className="space-y-1">
            <li>• Your contact information will only be used for this incident</li>
            <li>• We will not share your information with third parties</li>
            <li>• You will receive email updates about your incident status</li>
            <li>• You can unsubscribe from updates at any time</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
