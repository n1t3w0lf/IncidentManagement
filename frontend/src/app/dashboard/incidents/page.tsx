'use client';

// ============================================
// INCIDENTS LIST PAGE
// ============================================

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useIncidentStore } from '@/stores/incidentStore';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent, Badge, Button, Input, Select, SkeletonIncidentCard, Pagination } from '@/components/ui';
import { STATUS_CONFIG, SEVERITY_CONFIG } from '@/lib/constants';
import { formatRelativeTime } from '@/lib/utils';
import type { SearchFilters, IncidentStatus, IncidentSeverity } from '@/types';

export default function IncidentsListPage() {
  const {
    incidents,
    fetchIncidents,
    isLoading,
    total,
    page,
    limit,
    totalPages,
    setFilters,
    filters,
    selectedIncidents,
    toggleSelectIncident,
    toggleSelectAll,
    clearSelection,
    bulkDeleteIncidents,
    bulkUpdateStatus,
  } = useIncidentStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [localFilters, setLocalFilters] = useState<SearchFilters>({});
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [bulkActionStatus, setBulkActionStatus] = useState<string>('');

  useEffect(() => {
    fetchIncidents({ page: 1, limit: 25, sortBy: 'createdAt', sortOrder: 'desc' });
  }, [fetchIncidents]);

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
  };

  const handleApplyFilters = () => {
    const appliedFilters: SearchFilters = {
      ...localFilters,
      search: searchTerm || undefined,
    };
    setFilters(appliedFilters);
    fetchIncidents({ page: 1, limit: 25, sortBy: 'createdAt', sortOrder: 'desc' }, appliedFilters);
  };

  const handleClearFilters = () => {
    setLocalFilters({});
    setSearchTerm('');
    setFilters({});
    fetchIncidents({ page: 1, limit: 25, sortBy: 'createdAt', sortOrder: 'desc' }, {});
  };

  const handlePageChange = (newPage: number) => {
    fetchIncidents({ page: newPage, limit: 25, sortBy: 'createdAt', sortOrder: 'desc' });
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedIncidents.length} incident(s)?`)) {
      return;
    }

    try {
      await bulkDeleteIncidents(selectedIncidents);
      // Refresh the list
      await fetchIncidents({ page, limit: 25, sortBy: 'createdAt', sortOrder: 'desc' });
    } catch (error) {
      // Error is already set in store
    }
  };

  const handleBulkStatusUpdate = async () => {
    if (!bulkActionStatus) {
      alert('Please select a status');
      return;
    }

    if (!confirm(`Are you sure you want to update ${selectedIncidents.length} incident(s) to ${bulkActionStatus}?`)) {
      return;
    }

    try {
      await bulkUpdateStatus(selectedIncidents, bulkActionStatus);
      setBulkActionStatus('');
      // Refresh the list
      await fetchIncidents({ page, limit: 25, sortBy: 'createdAt', sortOrder: 'desc' });
    } catch (error) {
      // Error is already set in store
    }
  };

  const isAllSelected = incidents.length > 0 && selectedIncidents.length === incidents.length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Incidents</h1>
            <p className="mt-2 text-gray-600">
              View and manage all your incident reports
            </p>
          </div>
          <Link href="/dashboard/report" className="btn-primary">
            Report New Incident
          </Link>
        </div>

        {/* Bulk Actions Toolbar */}
        {selectedIncidents.length > 0 && (
          <Card className="border-primary-500 bg-primary-50">
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="font-semibold text-gray-900">
                    {selectedIncidents.length} incident{selectedIncidents.length !== 1 ? 's' : ''} selected
                  </span>
                  <Button variant="secondary" size="sm" onClick={clearSelection}>
                    Clear Selection
                  </Button>
                </div>
                <div className="flex items-center space-x-3">
                  {!showBulkActions ? (
                    <>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setShowBulkActions(true)}
                      >
                        Update Status
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={handleBulkDelete}
                      >
                        Delete Selected
                      </Button>
                    </>
                  ) : (
                    <>
                      <Select
                        value={bulkActionStatus}
                        onChange={(e) => setBulkActionStatus(e.target.value)}
                        options={Object.entries(STATUS_CONFIG).map(([value, config]) => ({
                          value,
                          label: config.label,
                        }))}
                        className="w-48"
                      />
                      <Button
                        size="sm"
                        onClick={handleBulkStatusUpdate}
                        disabled={!bulkActionStatus}
                      >
                        Apply Status
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          setShowBulkActions(false);
                          setBulkActionStatus('');
                        }}
                      >
                        Cancel
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filter & Search</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Search */}
              <Input
                placeholder="Search by title, description, or tracking ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()}
              />

              {/* Filter Row */}
              <div className="grid gap-4 sm:grid-cols-3">
                <Select
                  label="Status"
                  value={localFilters.status?.[0] || ''}
                  onChange={(e) => handleFilterChange('status', e.target.value ? [e.target.value as IncidentStatus] : undefined)}
                  options={Object.entries(STATUS_CONFIG).map(([value, config]) => ({
                    value,
                    label: config.label,
                  }))}
                />

                <Select
                  label="Severity"
                  value={localFilters.severity?.[0] || ''}
                  onChange={(e) => handleFilterChange('severity', e.target.value ? [e.target.value as IncidentSeverity] : undefined)}
                  options={Object.entries(SEVERITY_CONFIG).map(([value, config]) => ({
                    value,
                    label: config.label,
                  }))}
                />

                <div className="flex items-end space-x-2">
                  <Button onClick={handleApplyFilters} className="flex-1">
                    Apply Filters
                  </Button>
                  <Button variant="secondary" onClick={handleClearFilters}>
                    Clear
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {incidents.length > 0 && (
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={toggleSelectAll}
                      className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Select All</span>
                  </label>
                )}
                <CardTitle>
                  {total} Incident{total !== 1 ? 's' : ''}
                </CardTitle>
              </div>
              <p className="text-sm text-gray-500">
                Page {page} of {totalPages}
              </p>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, index) => (
                  <SkeletonIncidentCard key={index} />
                ))}
              </div>
            ) : incidents.length === 0 ? (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No incidents found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {Object.keys(filters).length > 0 ? 'Try adjusting your filters' : 'Get started by creating a new incident.'}
                </p>
                {Object.keys(filters).length === 0 && (
                  <div className="mt-6">
                    <Link href="/dashboard/report" className="btn-primary">
                      Report New Incident
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {incidents.map((incident) => (
                  <div
                    key={incident.id}
                    className="flex items-start space-x-3 rounded-lg border p-4 hover:border-primary-300 hover:bg-primary-50 transition-colors"
                  >
                    {/* Checkbox */}
                    <div className="pt-1">
                      <input
                        type="checkbox"
                        checked={selectedIncidents.includes(incident.id)}
                        onChange={(e) => {
                          e.stopPropagation();
                          toggleSelectIncident(incident.id);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                    </div>

                    {/* Incident Content - Clickable */}
                    <Link
                      href={`/dashboard/incidents/${incident.id}`}
                      className="flex-1 min-w-0"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-3">
                            <h3 className="text-lg font-semibold text-gray-900 truncate">
                              {incident.title}
                            </h3>
                            {incident.trackingId && (
                              <span className="text-xs font-mono text-gray-500">
                                {incident.trackingId}
                              </span>
                            )}
                          </div>
                          <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                            {incident.description}
                          </p>
                          <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                            <span className="capitalize">{incident.category.type}</span>
                            <span>•</span>
                            <span>{incident.category.name}</span>
                            <span>•</span>
                            <span>{formatRelativeTime(incident.createdAt)}</span>
                          </div>
                        </div>
                        <div className="ml-4 flex flex-col items-end space-y-2">
                          <Badge
                            variant={
                              incident.severity === 'critical' ? 'danger' :
                              incident.severity === 'high' ? 'warning' :
                              incident.severity === 'medium' ? 'info' : 'success'
                            }
                          >
                            {SEVERITY_CONFIG[incident.severity].label}
                          </Badge>
                          <Badge
                            variant={
                              incident.status === 'closed' || incident.status === 'resolved' ? 'success' :
                              incident.status === 'rejected' ? 'danger' :
                              incident.status === 'pending_approval' ? 'warning' : 'primary'
                            }
                          >
                            {STATUS_CONFIG[incident.status].label}
                          </Badge>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            <div className="mt-6">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                isLoading={isLoading}
                sticky={true}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
