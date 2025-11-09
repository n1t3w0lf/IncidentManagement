'use client';

// ============================================
// INCIDENT EDIT PAGE
// ============================================

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useIncidentStore } from '@/stores/incidentStore';
import { useAuthStore } from '@/stores/authStore';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent, Input, Textarea, Select, Button, Alert } from '@/components/ui';
import { showToast } from '@/components/ui/Toast';
import { SkeletonIncidentDetail } from '@/components/ui/Skeleton';
import type { Incident, IncidentSeverity } from '@/types';

export default function IncidentEditPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const { currentIncident, fetchIncidentById, updateIncident, isLoading } = useIncidentStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    severity: '' as IncidentSeverity | '',
    location: {
      facility: '',
      department: '',
      room: '',
      details: '',
    },
  });

  useEffect(() => {
    if (params.id) {
      fetchIncidentById(params.id as string);
    }
  }, [params.id, fetchIncidentById]);

  useEffect(() => {
    if (currentIncident) {
      setFormData({
        title: currentIncident.title,
        description: currentIncident.description,
        severity: currentIncident.severity,
        location: {
          facility: currentIncident.location?.facility || '',
          department: currentIncident.location?.department || '',
          room: currentIncident.location?.room || '',
          details: currentIncident.location?.details || '',
        },
      });
    }
  }, [currentIncident]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (!formData.severity) {
      newErrors.severity = 'Severity is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate() || !currentIncident) return;

    setIsSubmitting(true);
    try {
      await updateIncident(currentIncident.id, {
        title: formData.title,
        description: formData.description,
        severity: formData.severity as IncidentSeverity,
        location: formData.location,
      });

      showToast.success('Incident updated successfully');
      router.push(`/dashboard/incidents/${currentIncident.id}`);
    } catch (error) {
      showToast.error('Failed to update incident. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleLocationChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        [field]: value,
      },
    }));
  };

  if (isLoading || !currentIncident) {
    return (
      <DashboardLayout>
        <SkeletonIncidentDetail />
      </DashboardLayout>
    );
  }

  // Check permissions
  const canEdit =
    user?.role === 'admin' ||
    user?.role === 'super_admin' ||
    currentIncident.reporterInfo.userId === user?.id;

  if (!canEdit) {
    return (
      <DashboardLayout>
        <Alert variant="danger">
          <p className="font-medium">Access Denied</p>
          <p className="mt-1 text-sm">
            You do not have permission to edit this incident.
          </p>
        </Alert>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Link href="/dashboard/incidents" className="hover:text-gray-900">
            Incidents
          </Link>
          <span>/</span>
          <Link
            href={`/dashboard/incidents/${currentIncident.id}`}
            className="hover:text-gray-900"
          >
            {currentIncident.trackingId || `#${currentIncident.id.slice(0, 8)}`}
          </Link>
          <span>/</span>
          <span className="text-gray-900">Edit</span>
        </div>

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Incident</h1>
          <p className="mt-2 text-gray-600">
            Update the incident details below. Some fields cannot be changed after creation.
          </p>
        </div>

        {/* Info Alert */}
        <Alert variant="info">
          <p className="text-sm">
            <strong>Note:</strong> Category, industry type, and custom fields cannot be changed after
            incident creation. If you need to change these, please create a new incident.
          </p>
        </Alert>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Incident Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Fields */}
              <div className="space-y-4">
                <Input
                  label="Incident Title"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  error={errors.title}
                  placeholder="Brief summary of the incident"
                  required
                />

                <Textarea
                  label="Description"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  error={errors.description}
                  placeholder="Provide detailed information about what happened..."
                  rows={6}
                  required
                  helperText="Be as specific as possible. Include what happened, when it happened, and any immediate actions taken."
                />

                <Select
                  label="Severity"
                  value={formData.severity}
                  onChange={(e) => handleChange('severity', e.target.value)}
                  options={[
                    { value: 'low', label: 'Low - Minor issue with minimal impact' },
                    { value: 'medium', label: 'Medium - Moderate issue requiring attention' },
                    { value: 'high', label: 'High - Serious issue requiring urgent attention' },
                    { value: 'critical', label: 'Critical - Emergency requiring immediate action' },
                  ]}
                  error={errors.severity}
                  required
                />
              </div>

              {/* Read-only Fields */}
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <h3 className="text-sm font-medium text-gray-900 mb-3">
                  Read-Only Information
                </h3>
                <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Category</dt>
                    <dd className="mt-1 text-sm text-gray-900">{currentIncident.category.name}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Industry</dt>
                    <dd className="mt-1 text-sm text-gray-900 capitalize">
                      {currentIncident.category.type}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Status</dt>
                    <dd className="mt-1 text-sm text-gray-900">{currentIncident.status}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Escalation Level</dt>
                    <dd className="mt-1 text-sm text-gray-900">{currentIncident.escalationLevel}</dd>
                  </div>
                </dl>
              </div>

              {/* Location Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Location (Optional)</h3>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    label="Facility/Building"
                    value={formData.location.facility}
                    onChange={(e) => handleLocationChange('facility', e.target.value)}
                    placeholder="Main Building, Warehouse, etc."
                  />

                  <Input
                    label="Department/Area"
                    value={formData.location.department}
                    onChange={(e) => handleLocationChange('department', e.target.value)}
                    placeholder="Production, Office, etc."
                  />

                  <Input
                    label="Room/Zone"
                    value={formData.location.room}
                    onChange={(e) => handleLocationChange('room', e.target.value)}
                    placeholder="Room 101, Zone A, etc."
                  />

                  <Textarea
                    label="Additional Details"
                    value={formData.location.details}
                    onChange={(e) => handleLocationChange('details', e.target.value)}
                    placeholder="Any additional location information..."
                    rows={2}
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-between pt-4 border-t">
                <Link
                  href={`/dashboard/incidents/${currentIncident.id}`}
                  className="btn-secondary"
                >
                  Cancel
                </Link>
                <Button type="submit" size="lg" isLoading={isSubmitting}>
                  Save Changes
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
