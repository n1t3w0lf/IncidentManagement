'use client';

// ============================================
// APPROVALS PAGE
// ============================================

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useApprovalStore } from '@/stores/approvalStore';
import { useAuthStore } from '@/stores/authStore';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent, Badge, Button, Textarea, Alert, ConfirmDialog, Skeleton } from '@/components/ui';
import { showToast } from '@/components/ui/Toast';
import { STATUS_CONFIG, SEVERITY_CONFIG, ESCALATION_CONFIG } from '@/lib/constants';
import { formatDateTime, formatRelativeTime } from '@/lib/utils';
import type { ApprovalRequest } from '@/types';

type ApprovalDialogType = 'approve' | 'reject' | null;

export default function ApprovalsPage() {
  const { user } = useAuthStore();
  const { approvals, isLoading, fetchApprovals, approveRequest, rejectRequest } = useApprovalStore();
  const [selectedFilter, setSelectedFilter] = useState<string>('pending');
  const [dialogType, setDialogType] = useState<ApprovalDialogType>(null);
  const [selectedApproval, setSelectedApproval] = useState<ApprovalRequest | null>(null);
  const [comments, setComments] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchApprovals(selectedFilter);
  }, [fetchApprovals, selectedFilter]);

  const handleApprove = (approval: ApprovalRequest) => {
    setSelectedApproval(approval);
    setDialogType('approve');
    setComments('');
  };

  const handleReject = (approval: ApprovalRequest) => {
    setSelectedApproval(approval);
    setDialogType('reject');
    setComments('');
    setRejectionReason('');
  };

  const confirmApprove = async () => {
    if (!selectedApproval) return;

    setIsProcessing(true);
    try {
      await approveRequest(selectedApproval.id, comments);
      showToast.success('Incident approved successfully');
      setDialogType(null);
      setSelectedApproval(null);
      fetchApprovals(selectedFilter);
    } catch (error) {
      showToast.error((error as Error).message || 'Failed to approve incident');
    } finally {
      setIsProcessing(false);
    }
  };

  const confirmReject = async () => {
    if (!selectedApproval || !rejectionReason.trim()) {
      showToast.error('Rejection reason is required');
      return;
    }

    setIsProcessing(true);
    try {
      await rejectRequest(selectedApproval.id, rejectionReason, comments);
      showToast.success('Incident rejected successfully');
      setDialogType(null);
      setSelectedApproval(null);
      fetchApprovals(selectedFilter);
    } catch (error) {
      showToast.error((error as Error).message || 'Failed to reject incident');
    } finally {
      setIsProcessing(false);
    }
  };

  const canUserApprove = (approval: ApprovalRequest): boolean => {
    if (!user) return false;
    if (user.role === 'super_admin') return true;
    if (user.role === 'admin' && (approval.level === 'level_3' || approval.level === 'level_4')) return true;
    if (user.role === 'manager' && (approval.level === 'level_2' || approval.level === 'level_3')) return true;
    return false;
  };

  const pendingCount = approvals.filter(a => a.status === 'pending').length;
  const approvedCount = approvals.filter(a => a.status === 'approved').length;
  const rejectedCount = approvals.filter(a => a.status === 'rejected').length;

  return (
    <DashboardLayout requiredRoles={['manager', 'admin', 'super_admin']}>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Approvals Queue</h1>
            <p className="mt-2 text-gray-600">
              Review and approve pending incident reports
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className={selectedFilter === 'pending' ? 'ring-2 ring-warning-500' : ''}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="mt-2 text-3xl font-bold text-gray-900">{pendingCount}</p>
                </div>
                <div className="rounded-full bg-warning-100 p-3">
                  <svg className="h-6 w-6 text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <button
                onClick={() => setSelectedFilter('pending')}
                className="mt-3 text-sm text-warning-600 hover:text-warning-700 font-medium"
              >
                View Pending →
              </button>
            </CardContent>
          </Card>

          <Card className={selectedFilter === 'approved' ? 'ring-2 ring-success-500' : ''}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Approved</p>
                  <p className="mt-2 text-3xl font-bold text-gray-900">{approvedCount}</p>
                </div>
                <div className="rounded-full bg-success-100 p-3">
                  <svg className="h-6 w-6 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <button
                onClick={() => setSelectedFilter('approved')}
                className="mt-3 text-sm text-success-600 hover:text-success-700 font-medium"
              >
                View Approved →
              </button>
            </CardContent>
          </Card>

          <Card className={selectedFilter === 'rejected' ? 'ring-2 ring-danger-500' : ''}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Rejected</p>
                  <p className="mt-2 text-3xl font-bold text-gray-900">{rejectedCount}</p>
                </div>
                <div className="rounded-full bg-danger-100 p-3">
                  <svg className="h-6 w-6 text-danger-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              </div>
              <button
                onClick={() => setSelectedFilter('rejected')}
                className="mt-3 text-sm text-danger-600 hover:text-danger-700 font-medium"
              >
                View Rejected →
              </button>
            </CardContent>
          </Card>
        </div>

        {/* Approvals List */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="pt-6">
                  <Skeleton height={120} />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : approvals.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No approvals found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {selectedFilter === 'pending' ? 'No incidents are currently pending approval.' :
                   selectedFilter === 'approved' ? 'No incidents have been approved yet.' :
                   'No incidents have been rejected yet.'}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {approvals.map((approval) => (
              <Card key={approval.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center flex-wrap gap-2">
                        <Link
                          href={`/dashboard/incidents/${approval.incident.id}`}
                          className="text-lg font-semibold text-gray-900 hover:text-primary-600"
                        >
                          {approval.incident.title}
                        </Link>
                        <Badge
                          variant={
                            approval.incident.severity === 'critical' ? 'danger' :
                            approval.incident.severity === 'high' ? 'warning' :
                            approval.incident.severity === 'medium' ? 'info' : 'default'
                          }
                        >
                          {SEVERITY_CONFIG[approval.incident.severity].label}
                        </Badge>
                        <Badge variant="primary">
                          {ESCALATION_CONFIG[approval.level].label}
                        </Badge>
                        <Badge
                          variant={
                            approval.status === 'approved' ? 'success' :
                            approval.status === 'rejected' ? 'danger' : 'warning'
                          }
                        >
                          {approval.status.charAt(0).toUpperCase() + approval.status.slice(1)}
                        </Badge>
                      </div>

                      <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                        {approval.incident.description}
                      </p>

                      <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-500">
                        <div className="flex items-center">
                          <svg className="h-5 w-5 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                          </svg>
                          <span className="capitalize">{approval.incident.category.type}</span>
                        </div>
                        <div className="flex items-center">
                          <svg className="h-5 w-5 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>Requested {formatRelativeTime(approval.requestedAt)}</span>
                        </div>
                        {approval.incident.trackingId && (
                          <div className="flex items-center font-mono text-xs">
                            <svg className="h-5 w-5 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            <span>{approval.incident.trackingId}</span>
                          </div>
                        )}
                      </div>

                      {(approval.comments || approval.rejectionReason) && (
                        <div className="mt-4 rounded-md bg-gray-50 p-3">
                          {approval.rejectionReason && (
                            <p className="text-sm text-danger-700">
                              <strong>Rejection Reason:</strong> {approval.rejectionReason}
                            </p>
                          )}
                          {approval.comments && (
                            <p className="text-sm text-gray-700 mt-1">
                              <strong>Comments:</strong> {approval.comments}
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    {approval.status === 'pending' && canUserApprove(approval) && (
                      <div className="ml-6 flex flex-col space-y-2">
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => handleApprove(approval)}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleReject(approval)}
                        >
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Approve Dialog */}
        <ConfirmDialog
          isOpen={dialogType === 'approve'}
          onClose={() => setDialogType(null)}
          onConfirm={confirmApprove}
          title="Approve Incident"
          message={`Are you sure you want to approve "${selectedApproval?.incident.title}"?`}
          confirmText="Approve"
          confirmVariant="success"
          isLoading={isProcessing}
        >
          <div className="mt-4">
            <label htmlFor="approve-comments" className="block text-sm font-medium text-gray-700 mb-1">
              Comments (Optional)
            </label>
            <Textarea
              id="approve-comments"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Add any comments about this approval..."
              rows={3}
            />
          </div>
        </ConfirmDialog>

        {/* Reject Dialog */}
        <ConfirmDialog
          isOpen={dialogType === 'reject'}
          onClose={() => setDialogType(null)}
          onConfirm={confirmReject}
          title="Reject Incident"
          message={`Are you sure you want to reject "${selectedApproval?.incident.title}"?`}
          confirmText="Reject"
          confirmVariant="danger"
          isLoading={isProcessing}
        >
          <div className="mt-4 space-y-4">
            <div>
              <label htmlFor="rejection-reason" className="block text-sm font-medium text-gray-700 mb-1">
                Rejection Reason <span className="text-danger-600">*</span>
              </label>
              <Textarea
                id="rejection-reason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Explain why this incident is being rejected..."
                rows={2}
                required
              />
            </div>
            <div>
              <label htmlFor="reject-comments" className="block text-sm font-medium text-gray-700 mb-1">
                Additional Comments (Optional)
              </label>
              <Textarea
                id="reject-comments"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Add any additional comments..."
                rows={2}
              />
            </div>
          </div>
        </ConfirmDialog>
      </div>
    </DashboardLayout>
  );
}
