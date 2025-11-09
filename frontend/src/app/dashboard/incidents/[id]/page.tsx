'use client';

// ============================================
// INCIDENT DETAIL PAGE
// ============================================

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useIncidentStore } from '@/stores/incidentStore';
import { useAuthStore } from '@/stores/authStore';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent, Badge, Button, Textarea, Alert, ConfirmDialog, SkeletonIncidentDetail } from '@/components/ui';
import { showToast } from '@/components/ui/Toast';
import { STATUS_CONFIG, SEVERITY_CONFIG, ESCALATION_CONFIG } from '@/lib/constants';
import { formatDateTime, formatRelativeTime } from '@/lib/utils';
import { validateStatusChange } from '@/lib/statusTransitions';
import type { IncidentStatus } from '@/types/incident';

type ConfirmDialogState = {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText: string;
  confirmVariant: 'primary' | 'danger' | 'success';
  action: (() => void) | null;
};

export default function IncidentDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { user } = useAuthStore();
  const { currentIncident, fetchIncidentById, updateIncident, addComment, deleteIncident, isLoading } = useIncidentStore();
  const [comment, setComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [showSuccess, setShowSuccess] = useState(searchParams.get('success') === 'true');
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>({
    isOpen: false,
    title: '',
    message: '',
    confirmText: '',
    confirmVariant: 'primary',
    action: null,
  });
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isDeletingIncident, setIsDeletingIncident] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchIncidentById(params.id as string);
    }
  }, [params.id, fetchIncidentById]);

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => setShowSuccess(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  const handleAddComment = async () => {
    if (!comment.trim() || !currentIncident) return;

    setIsSubmittingComment(true);
    try {
      await addComment(currentIncident.id, comment);
      setComment('');
      showToast.success('Comment added successfully');
    } catch (error) {
      showToast.error('Failed to add comment. Please try again.');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!currentIncident) return;

    setIsUpdatingStatus(true);
    try {
      await updateIncident(currentIncident.id, { status: newStatus as any });
      showToast.success(`Status updated to ${STATUS_CONFIG[newStatus as keyof typeof STATUS_CONFIG].label}`);
      setConfirmDialog({ ...confirmDialog, isOpen: false });
    } catch (error) {
      showToast.error('Failed to update status. Please try again.');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const confirmStatusChange = (newStatus: string, dialogTitle: string, dialogMessage: string, variant: 'primary' | 'danger' | 'success' = 'primary') => {
    if (!currentIncident || !user) return;

    // Validate the status transition
    const validation = validateStatusChange(
      currentIncident.status,
      newStatus as IncidentStatus,
      user.role,
      currentIncident.escalationLevel,
      currentIncident.category.requiresApproval
    );

    if (!validation.allowed) {
      showToast.error(validation.reason || 'Invalid status transition');
      return;
    }

    setConfirmDialog({
      isOpen: true,
      title: dialogTitle,
      message: dialogMessage,
      confirmText: 'Confirm',
      confirmVariant: variant,
      action: () => handleStatusChange(newStatus),
    });
  };

  const handleDeleteIncident = async () => {
    if (!currentIncident) return;

    setIsDeletingIncident(true);
    try {
      await deleteIncident(currentIncident.id);
      showToast.success('Incident deleted successfully');
      setConfirmDialog({ ...confirmDialog, isOpen: false });
      // Redirect to incidents list
      window.location.href = '/dashboard/incidents';
    } catch (error) {
      showToast.error('Failed to delete incident. Please try again.');
      setIsDeletingIncident(false);
    }
  };

  const confirmDeleteIncident = () => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Incident',
      message: 'Are you sure you want to delete this incident? This action cannot be undone and all associated data will be permanently removed.',
      confirmText: 'Delete Incident',
      confirmVariant: 'danger',
      action: handleDeleteIncident,
    });
  };

  if (isLoading || !currentIncident) {
    return (
      <DashboardLayout>
        <SkeletonIncidentDetail />
      </DashboardLayout>
    );
  }

  const canEdit = user?.role === 'admin' || user?.role === 'super_admin' || currentIncident.reporterInfo.userId === user?.id;
  const canChangeStatus = user?.role === 'manager' || user?.role === 'admin' || user?.role === 'super_admin';

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Success Alert */}
        {showSuccess && (
          <Alert variant="success" onClose={() => setShowSuccess(false)}>
            Incident reported successfully! Your report has been submitted and is being reviewed.
          </Alert>
        )}

        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Link href="/dashboard/incidents" className="hover:text-gray-900">
            Incidents
          </Link>
          <span>/</span>
          <span className="text-gray-900">
            {currentIncident.trackingId || `Incident #${currentIncident.id.slice(0, 8)}`}
          </span>
        </div>

        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{currentIncident.title}</h1>
                <p className="mt-2 text-gray-600">
                  {currentIncident.trackingId && (
                    <span className="font-mono font-medium">Tracking ID: {currentIncident.trackingId}</span>
                  )}
                </p>
              </div>
              {canEdit && (
                <Link
                  href={`/dashboard/incidents/${currentIncident.id}/edit`}
                  className="btn-secondary ml-4"
                >
                  <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </Link>
              )}
            </div>
          </div>
          <div className="flex flex-col items-end space-y-2 ml-4">
            <Badge
              variant={
                currentIncident.severity === 'critical' ? 'danger' :
                currentIncident.severity === 'high' ? 'warning' :
                currentIncident.severity === 'medium' ? 'info' : 'success'
              }
              size="lg"
            >
              {SEVERITY_CONFIG[currentIncident.severity].label}
            </Badge>
            <Badge
              variant={
                currentIncident.status === 'closed' || currentIncident.status === 'resolved' ? 'success' :
                currentIncident.status === 'rejected' ? 'danger' :
                currentIncident.status === 'pending_approval' ? 'warning' : 'primary'
              }
              size="lg"
            >
              {STATUS_CONFIG[currentIncident.status].label}
            </Badge>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-wrap">{currentIncident.description}</p>
              </CardContent>
            </Card>

            {/* Custom Fields */}
            {Object.keys(currentIncident.customFields).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Additional Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {Object.entries(currentIncident.customFields).map(([key, value]) => (
                      <div key={key}>
                        <dt className="text-sm font-medium text-gray-500 capitalize">
                          {key.replace(/_/g, ' ')}
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value || 'N/A'}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </CardContent>
              </Card>
            )}

            {/* Location */}
            {currentIncident.location && Object.keys(currentIncident.location).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Location</CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {currentIncident.location.facility && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Facility</dt>
                        <dd className="mt-1 text-sm text-gray-900">{currentIncident.location.facility}</dd>
                      </div>
                    )}
                    {currentIncident.location.department && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Department</dt>
                        <dd className="mt-1 text-sm text-gray-900">{currentIncident.location.department}</dd>
                      </div>
                    )}
                    {currentIncident.location.room && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Room/Zone</dt>
                        <dd className="mt-1 text-sm text-gray-900">{currentIncident.location.room}</dd>
                      </div>
                    )}
                    {currentIncident.location.details && (
                      <div className="sm:col-span-2">
                        <dt className="text-sm font-medium text-gray-500">Additional Details</dt>
                        <dd className="mt-1 text-sm text-gray-900">{currentIncident.location.details}</dd>
                      </div>
                    )}
                  </dl>
                </CardContent>
              </Card>
            )}

            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Activity Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flow-root">
                  <ul className="-mb-8">
                    {currentIncident.timeline.map((entry, idx) => (
                      <li key={entry.id}>
                        <div className="relative pb-8">
                          {idx < currentIncident.timeline.length - 1 && (
                            <span
                              className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200"
                              aria-hidden="true"
                            />
                          )}
                          <div className="relative flex space-x-3">
                            <div>
                              <span className={`flex h-8 w-8 items-center justify-center rounded-full ${
                                entry.action === 'created' ? 'bg-primary-600' :
                                entry.action === 'approved' ? 'bg-success-600' :
                                entry.action === 'rejected' ? 'bg-danger-600' :
                                entry.action === 'resolved' ? 'bg-success-600' :
                                'bg-gray-400'
                              } text-white`}>
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

            {/* Add Comment */}
            <Card>
              <CardHeader>
                <CardTitle>Add Comment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Add a comment to this incident..."
                    rows={4}
                  />
                  <div className="flex justify-end">
                    <Button
                      onClick={handleAddComment}
                      disabled={!comment.trim()}
                      isLoading={isSubmittingComment}
                    >
                      Add Comment
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Details */}
            <Card>
              <CardHeader>
                <CardTitle>Details</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Category</dt>
                    <dd className="mt-1 text-sm text-gray-900">{currentIncident.category.name}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Industry</dt>
                    <dd className="mt-1 text-sm text-gray-900 capitalize">{currentIncident.category.type}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Escalation Level</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {ESCALATION_CONFIG[currentIncident.escalationLevel].label}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Created</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {formatDateTime(currentIncident.createdAt)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {formatDateTime(currentIncident.updatedAt)}
                    </dd>
                  </div>
                  {currentIncident.dueDate && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Due Date</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {formatDateTime(currentIncident.dueDate)}
                      </dd>
                    </div>
                  )}
                </dl>
              </CardContent>
            </Card>

            {/* Actions */}
            {canChangeStatus && (
              <Card>
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {currentIncident.status === 'submitted' && (
                      <Button
                        variant="primary"
                        className="w-full"
                        onClick={() => confirmStatusChange(
                          'under_review',
                          'Start Review?',
                          'Are you sure you want to start reviewing this incident?',
                          'primary'
                        )}
                      >
                        Start Review
                      </Button>
                    )}
                    {currentIncident.status === 'under_review' && (
                      <Button
                        variant="primary"
                        className="w-full"
                        onClick={() => confirmStatusChange(
                          'investigating',
                          'Begin Investigation?',
                          'Are you sure you want to begin investigating this incident?',
                          'primary'
                        )}
                      >
                        Begin Investigation
                      </Button>
                    )}
                    {(currentIncident.status === 'investigating' || currentIncident.status === 'approved') && (
                      <Button
                        variant="success"
                        className="w-full"
                        onClick={() => confirmStatusChange(
                          'resolved',
                          'Mark as Resolved?',
                          'Are you sure this incident has been resolved? You can still reopen it later if needed.',
                          'success'
                        )}
                      >
                        Mark as Resolved
                      </Button>
                    )}
                    {currentIncident.status === 'resolved' && (
                      <Button
                        variant="success"
                        className="w-full"
                        onClick={() => confirmStatusChange(
                          'closed',
                          'Close Incident?',
                          'Are you sure you want to close this incident? This action will mark the incident as complete.',
                          'success'
                        )}
                      >
                        Close Incident
                      </Button>
                    )}
                    {['submitted', 'under_review'].includes(currentIncident.status) && (
                      <Button
                        variant="danger"
                        className="w-full"
                        onClick={() => confirmStatusChange(
                          'rejected',
                          'Reject Incident?',
                          'Are you sure you want to reject this incident? This action cannot be undone easily.',
                          'danger'
                        )}
                      >
                        Reject
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Tags */}
            {currentIncident.tags && currentIncident.tags.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Tags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {currentIncident.tags.map((tag) => (
                      <Badge key={tag} variant="default">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Danger Zone */}
            {(user?.role === 'admin' || user?.role === 'super_admin') && (
              <Card className="border-danger-200">
                <CardHeader>
                  <CardTitle className="text-danger-700">Danger Zone</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md bg-danger-50 p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-danger-800">Delete this incident</h4>
                        <p className="mt-1 text-sm text-danger-700">
                          Once you delete an incident, there is no going back. All data will be permanently removed.
                        </p>
                      </div>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={confirmDeleteIncident}
                        className="ml-4"
                      >
                        <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Confirmation Dialog */}
        <ConfirmDialog
          isOpen={confirmDialog.isOpen}
          onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
          onConfirm={() => confirmDialog.action?.()}
          title={confirmDialog.title}
          message={confirmDialog.message}
          confirmText={confirmDialog.confirmText}
          confirmVariant={confirmDialog.confirmVariant}
          isLoading={isUpdatingStatus || isDeletingIncident}
        />
      </div>
    </DashboardLayout>
  );
}
