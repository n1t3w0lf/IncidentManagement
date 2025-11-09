'use client';

// ============================================
// ANONYMOUS REPORTING PAGE
// ============================================

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useIncidentStore } from '@/stores/incidentStore';
import { DynamicIncidentForm } from '@/components/forms/DynamicIncidentForm';
import { Alert, Card, CardContent } from '@/components/ui';
import type { Incident } from '@/types';

export default function AnonymousReportPage() {
  const router = useRouter();
  const { createIncident, isLoading } = useIncidentStore();
  const [trackingId, setTrackingId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const handleSubmit = async (data: Partial<Incident>) => {
    setError('');

    try {
      const incident = await createIncident(data);

      // Show tracking ID
      if (incident.trackingId) {
        setTrackingId(incident.trackingId);
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
                  Your incident has been reported anonymously. Save your tracking ID to check the status later.
                </p>

                {/* Tracking ID */}
                <div className="mt-8 rounded-lg bg-primary-50 border-2 border-primary-200 p-6">
                  <p className="text-sm font-medium text-gray-700 mb-2">Your Tracking ID:</p>
                  <p className="text-3xl font-mono font-bold text-primary-600">
                    {trackingId}
                  </p>
                  <p className="mt-4 text-sm text-gray-600">
                    Save this ID to track your incident status. You will not be able to retrieve it later.
                  </p>
                </div>

                {/* Important Notice */}
                <Alert variant="warning" className="mt-6 text-left">
                  <p className="font-medium">Important:</p>
                  <ul className="mt-2 list-disc list-inside text-sm space-y-1">
                    <li>Write down or screenshot this tracking ID</li>
                    <li>This is the only way to check your incident status</li>
                    <li>We cannot recover this ID if you lose it</li>
                  </ul>
                </Alert>

                {/* Actions */}
                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => {
                      const text = `Incident Tracking ID: ${trackingId}\n\nKeep this ID to track your incident status at: ${window.location.origin}/track`;
                      navigator.clipboard.writeText(text);
                      alert('Tracking ID copied to clipboard!');
                    }}
                    className="btn-primary"
                  >
                    Copy Tracking ID
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="btn-secondary"
                  >
                    Print This Page
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
                <p className="text-sm text-gray-500">Anonymous Reporting</p>
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
          <p className="font-medium">Anonymous Reporting</p>
          <p className="mt-1 text-sm">
            Your report will be completely anonymous. You will receive a tracking ID to check the status of your report,
            but we will not collect any personal information.
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
              showReporterInfo={false}
              reporterType="anonymous"
            />
          </CardContent>
        </Card>

        {/* Privacy Notice */}
        <div className="mt-6 rounded-lg bg-gray-50 p-4 text-sm text-gray-600">
          <h3 className="font-semibold text-gray-900 mb-2">Privacy & Confidentiality</h3>
          <ul className="space-y-1">
            <li>• Your identity will not be tracked or recorded</li>
            <li>• No IP addresses or personal data will be stored</li>
            <li>• Save your tracking ID to check status updates</li>
            <li>• We cannot respond to you directly without contact information</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
