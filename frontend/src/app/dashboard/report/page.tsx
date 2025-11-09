'use client';

// ============================================
// AUTHENTICATED INCIDENT REPORTING PAGE
// ============================================

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useIncidentStore } from '@/stores/incidentStore';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DynamicIncidentForm } from '@/components/forms/DynamicIncidentForm';
import { Alert, Card, CardHeader, CardTitle, CardContent } from '@/components/ui';
import type { Incident } from '@/types';

export default function AuthenticatedReportPage() {
  const router = useRouter();
  const { createIncident, isLoading } = useIncidentStore();
  const [error, setError] = useState('');

  const handleSubmit = async (data: Partial<Incident>) => {
    setError('');

    try {
      const incident = await createIncident(data);

      // Show success message and redirect to incident detail page
      router.push(`/dashboard/incidents/${incident.id}?success=true`);
    } catch (err: any) {
      setError(err.message || 'Failed to submit incident report');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Report New Incident</h1>
          <p className="mt-2 text-gray-600">
            Submit a detailed incident report. All required fields must be completed.
          </p>
        </div>

        {/* Info Alert */}
        <Alert variant="info">
          <p className="font-medium">Authenticated Reporting</p>
          <p className="mt-1 text-sm">
            Your report will be automatically associated with your account. You will receive notifications
            about status updates and can track the incident in your dashboard.
          </p>
        </Alert>

        {/* Form Card */}
        <Card>
          <CardHeader>
            <CardTitle>Incident Information</CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="danger" className="mb-6" onClose={() => setError('')}>
                {error}
              </Alert>
            )}

            <DynamicIncidentForm
              onSubmit={handleSubmit}
              isLoading={isLoading}
              showReporterInfo={false}
              reporterType="user"
            />
          </CardContent>
        </Card>

        {/* Help Section */}
        <Card>
          <CardContent className="pt-6">
            <div className="rounded-lg bg-blue-50 p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Need Help?</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Select the industry and category that best matches your incident</li>
                <li>• Provide as much detail as possible in the description</li>
                <li>• Complete all category-specific fields accurately</li>
                <li>• Choose the appropriate severity level</li>
                <li>• Include location information if applicable</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
