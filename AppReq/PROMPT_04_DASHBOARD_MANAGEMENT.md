# PROMPT 4: DASHBOARD & INCIDENT MANAGEMENT

## Brief Description
This prompt creates the complete incident management dashboard with tracking capabilities, status updates, assignment features, workflow management, and analytics. You'll build anonymous tracking (by tracking ID), authenticated user dashboards, administrative management features, and real-time status monitoring with professional UI components.

## Prerequisites
- Completed PROMPT 1, 2, and 3 successfully
- Incident reporting system working properly
- Authentication system functioning
- Understanding of dashboard and data visualization concepts

---

## AI PROMPT

```
You are building the comprehensive incident management dashboard that allows users to track, update, and manage incidents. This includes anonymous tracking (by tracking ID), authenticated user dashboards with statistics, administrative management features, and workflow management for different user roles.

STEP 1: Dashboard Layout and Navigation
Create src/components/layout/DashboardLayout.tsx:
```typescript
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { 
  HomeIcon, 
  DocumentTextIcon, 
  UserGroupIcon, 
  CogIcon,
  BellIcon,
  SearchIcon,
  PlusIcon,
  ChartBarIcon,
  ClipboardDocumentListIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface Props {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<Props> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, organization } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navigation = [
    { 
      name: 'Dashboard', 
      href: '/dashboard', 
      icon: HomeIcon,
      description: 'Overview and statistics'
    },
    { 
      name: 'My Incidents', 
      href: '/dashboard/my-incidents', 
      icon: ClipboardDocumentListIcon,
      description: 'Incidents you reported'
    },
    { 
      name: 'All Incidents', 
      href: '/dashboard/incidents', 
      icon: DocumentTextIcon,
      description: 'All organization incidents'
    },
    { 
      name: 'Analytics', 
      href: '/dashboard/analytics', 
      icon: ChartBarIcon,
      description: 'Reports and insights'
    },
    { 
      name: 'Users', 
      href: '/dashboard/users', 
      icon: UserGroupIcon,
      description: 'User management'
    },
    { 
      name: 'Settings', 
      href: '/dashboard/settings', 
      icon: CogIcon,
      description: 'System configuration'
    },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/dashboard/incidents?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 flex z-40 md:hidden ${sidebarOpen ? '' : 'pointer-events-none'}`}>
        <div className={`fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity ease-linear duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setSidebarOpen(false)} />
        
        <div className={`relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-white transform transition ease-in-out duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <XMarkIcon className="h-6 w-6 text-white" />
            </button>
          </div>
          
          {/* Mobile navigation */}
          <div className="flex-shrink-0 flex items-center px-4">
            <h1 className="text-xl font-bold text-gray-900">Incident Manager</h1>
          </div>
          <div className="mt-5 flex-1 h-0 overflow-y-auto">
            <nav className="px-2 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                    pathname === item.href
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="mr-4 h-6 w-6" />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex flex-col flex-grow pt-5 bg-white overflow-y-auto border-r border-gray-200">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0 px-4">
            <h1 className="text-xl font-bold text-gray-900">Incident Manager</h1>
          </div>

          {/* Organization Info */}
          {organization && (
            <div className="px-4 mt-4 pb-4 border-b border-gray-200">
              <div className="bg-blue-50 rounded-md p-3">
                <p className="text-sm font-medium text-blue-900">{organization.name}</p>
                <p className="text-xs text-blue-600 capitalize">{organization.type}</p>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="mt-5 flex-1 px-2 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                  pathname === item.href
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
                title={item.description}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Quick Actions */}
          <div className="px-2 pb-4">
            <div className="bg-gray-50 rounded-md p-3">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Quick Actions</h3>
              <div className="mt-2 space-y-1">
                <Link
                  href="/report/user"
                  className="flex items-center px-2 py-1 text-sm text-gray-600 rounded hover:bg-white hover:text-gray-900"
                >
                  <PlusIcon className="mr-2 h-4 w-4" />
                  New Incident
                </Link>
                <Link
                  href="/track"
                  className="flex items-center px-2 py-1 text-sm text-gray-600 rounded hover:bg-white hover:text-gray-900"
                >
                  <SearchIcon className="mr-2 h-4 w-4" />
                  Track Incident
                </Link>
              </div>
            </div>
          </div>

          {/* User Profile */}
          <div className="flex-shrink-0 border-t border-gray-200 p-4">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                <span className="text-sm font-medium text-white">
                  {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                </span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-500 truncate">{user?.role.name}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="mt-2 w-full text-left text-sm text-gray-500 hover:text-gray-700 px-2 py-1 rounded hover:bg-gray-50"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="md:pl-64 flex flex-col flex-1">
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-white shadow-sm border-b border-gray-200">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <button
                  className="md:hidden -ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Bars3Icon className="h-6 w-6" />
                </button>
                
                <h2 className="ml-4 md:ml-0 text-lg font-semibold text-gray-900">
                  {navigation.find(item => item.href === pathname)?.name || 'Dashboard'}
                </h2>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Search */}
                <form onSubmit={handleSearch} className="hidden sm:block">
                  <div className="relative">
                    <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search incidents..."
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
                    />
                  </div>
                </form>
                
                {/* Notifications */}
                <button className="relative p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full">
                  <BellIcon className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                    3
                  </span>
                </button>

                {/* User menu - mobile */}
                <div className="md:hidden flex items-center">
                  <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                    <span className="text-sm font-medium text-white">
                      {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
```

STEP 2: Anonymous Incident Tracker
Create src/components/features/AnonymousTracker.tsx:
```typescript
'use client';

import React, { useState } from 'react';
import { useIncidentStore } from '@/stores/incidentStore';
import { Incident, STATUS_CONFIG, SEVERITY_CONFIG } from '@/types/incident';
import { formatDateTime } from '@/utils/formatters';
import { MagnifyingGlassIcon, ClockIcon, TagIcon, MapPinIcon } from '@heroicons/react/24/outline';

export const AnonymousTracker: React.FC = () => {
  const [trackingId, setTrackingId] = useState('');
  const [incident, setIncident] = useState<Incident | null>(null);
  const { getIncidentByTracking, isLoading, error, clearError } = useIncidentStore();

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    if (!trackingId.trim()) {
      return;
    }

    try {
      const foundIncident = await getIncidentByTracking(trackingId.trim());
      setIncident(foundIncident);
    } catch (err) {
      setIncident(null);
      // Error is handled in the store
    }
  };

  const clearResults = () => {
    setIncident(null);
    setTrackingId('');
    clearError();
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="bg-white shadow-sm rounded-lg">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Track Your Incident</h2>
          <p className="text-sm text-gray-600 mt-1">
            Enter your tracking ID to check the status of your incident report
          </p>
        </div>
        
        <div className="p-6">
          {/* Search Form */}
          <form onSubmit={handleTrack} className="mb-6">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value.toUpperCase())}
                  placeholder="Enter tracking ID (e.g., INC-123456-ABCD)"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-mono"
                  maxLength={16}
                />
              </div>
              <button
                type="submit"
                disabled={isLoading || !trackingId.trim()}
                className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium min-w-[100px]"
              >
                {isLoading ? 'Tracking...' : 'Track'}
              </button>
            </div>

            {/* Example tracking ID */}
            <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
              <span>Format: INC-XXXXXX-XXXX</span>
              {incident && (
                <button
                  type="button"
                  onClick={clearResults}
                  className="text-blue-600 hover:text-blue-700"
                >
                  Clear Results
                </button>
              )}
            </div>
          </form>

          {/* Error Display */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Incident Details */}
          {incident && (
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              {/* Incident Header */}
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{incident.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Tracking ID: <span className="font-mono font-medium">{incident.reporterInfo.trackingId}</span>
                    </p>
                  </div>
                  <div className="mt-3 sm:mt-0 flex flex-col sm:flex-row gap-2">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${STATUS_CONFIG[incident.status].color}`}>
                      {STATUS_CONFIG[incident.status].label}
                    </span>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${SEVERITY_CONFIG[incident.severity].color}`}>
                      {SEVERITY_CONFIG[incident.severity].label}
                    </span>
                  </div>
                </div>
              </div>

              {/* Incident Content */}
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Main Information */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Description</h4>
                      <p className="text-sm text-gray-600 leading-relaxed">{incident.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-1">Category</h4>
                        <p className="text-sm text-gray-600">{incident.category.name}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-1">Reported</h4>
                        <div className="flex items-center text-sm text-gray-600">
                          <ClockIcon className="h-4 w-4 mr-1" />
                          {formatDateTime(incident.createdAt)}
                        </div>
                      </div>
                    </div>

                    {/* Tags */}
                    {incident.tags && incident.tags.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Tags</h4>
                        <div className="flex flex-wrap gap-2">
                          {incident.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800"
                            >
                              <TagIcon className="h-3 w-3 mr-1" />
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Location */}
                    {incident.location && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                          <MapPinIcon className="h-4 w-4 mr-1" />
                          Location
                        </h4>
                        <div className="text-sm text-gray-600 space-y-1">
                          {incident.location.address && <p><strong>Address:</strong> {incident.location.address}</p>}
                          {incident.location.facility && <p><strong>Facility:</strong> {incident.location.facility}</p>}
                          {incident.location.department && <p><strong>Department:</strong> {incident.location.department}</p>}
                          {incident.location.room && <p><strong>Room:</strong> {incident.location.room}</p>}
                          {incident.location.equipment && <p><strong>Equipment:</strong> {incident.location.equipment}</p>}
                          {incident.location.details && <p><strong>Details:</strong> {incident.location.details}</p>}
                          {!incident.location.address && !incident.location.facility && !incident.location.department && 
                           !incident.location.room && !incident.location.equipment && !incident.location.details && (
                            <p className="text-gray-500">No specific location provided</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Timeline */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-4">Activity Timeline</h4>
                    <div className="flow-root">
                      <ul className="space-y-6">
                        {incident.timeline.map((entry, index) => (
                          <li key={entry.id} className="relative flex gap-x-4">
                            <div className={`absolute left-0 top-0 flex w-6 h-6 items-center justify-center rounded-full ${
                              index === 0 ? 'bg-blue-600' : 'bg-gray-400'
                            } ring-8 ring-white`}>
                              <div className={`h-2 w-2 rounded-full ${index === 0 ? 'bg-white' : 'bg-gray-100'}`} />
                            </div>
                            <div className="flex-auto">
                              <div className="flex items-center gap-x-4">
                                <p className="text-sm font-medium text-gray-900">{entry.description}</p>
                                <time className="flex-none text-xs text-gray-500">
                                  {formatDateTime(entry.performedAt)}
                                </time>
                              </div>
                              {entry.metadata && Object.keys(entry.metadata).length > 0 && (
                                <div className="mt-1">
                                  <p className="text-xs text-gray-500">
                                    {Object.entries(entry.metadata).map(([key, value]) => (
                                      <span key={key} className="mr-3">
                                        <strong>{key}:</strong> {String(value)}
                                      </span>
                                    ))}
                                  </p>
                                </div>
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Attachments */}
                {incident.attachments && incident.attachments.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Attachments</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {incident.attachments.map((attachment) => (
                        <div key={attachment.id} className="flex items-center p-3 border border-gray-200 rounded-md">
                          <div className="flex-shrink-0">
                            <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <div className="ml-3 flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{attachment.originalName || attachment.filename}</p>
                            <p className="text-xs text-gray-500">
                              {(attachment.fileSize / 1024).toFixed(1)} KB • {attachment.fileType}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Custom Fields */}
                {incident.customFields && Object.keys(incident.customFields).length > 0 && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Additional Information</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {Object.entries(incident.customFields).map(([key, value]) => (
                        <div key={key}>
                          <dt className="text-sm font-medium text-gray-900 capitalize">{key.replace(/_/g, ' ')}</dt>
                          <dd className="text-sm text-gray-600 mt-1">{String(value)}</dd>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
                <p className="text-xs text-gray-500 text-center">
                  Last updated: {formatDateTime(incident.updatedAt)}
                </p>
              </div>
            </div>
          )}

          {/* Help Section */}
          {!incident && !error && (
            <div className="mt-8 bg-blue-50 rounded-lg p-6">
              <h3 className="text-sm font-medium text-blue-900 mb-2">Need Help?</h3>
              <div className="text-sm text-blue-700 space-y-2">
                <p>• Your tracking ID was provided when you submitted your incident report</p>
                <p>• Check your email for the tracking ID if you provided contact information</p>
                <p>• Tracking IDs follow the format: INC-123456-ABCD</p>
                <p>• Contact support if you're unable to locate your tracking ID</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
```

STEP 3: Dashboard Overview Component
Create src/components/features/DashboardOverview.tsx:
```typescript
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useIncidentStore } from '@/stores/incidentStore';
import { useAuthStore } from '@/stores/authStore';
import { Incident, STATUS_CONFIG, SEVERITY_CONFIG } from '@/types/incident';
import { formatDateTime } from '@/utils/formatters';
import {
  ChartBarIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  CheckCircleIcon,
  PlusIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

interface DashboardStats {
  totalIncidents: number;
  openIncidents: number;
  criticalIncidents: number;
  myIncidents: number;
  recentIncidents: Incident[];
  statusBreakdown: Record<string, number>;
  severityBreakdown: Record<string, number>;
}

export const DashboardOverview: React.FC = () => {
  const { incidents, fetchIncidents, isLoading } = useIncidentStore();
  const { user, organization } = useAuthStore();
  const [stats, setStats] = useState<DashboardStats>({
    totalIncidents: 0,
    openIncidents: 0,
    criticalIncidents: 0,
    myIncidents: 0,
    recentIncidents: [],
    statusBreakdown: {},
    severityBreakdown: {}
  });

  useEffect(() => {
    fetchIncidents();
  }, [fetchIncidents]);

  useEffect(() => {
    const openStatuses = ['submitted', 'under_review', 'investigating', 'pending_approval', 'in_progress'];
    
    // Calculate status breakdown
    const statusBreakdown: Record<string, number> = {};
    const severityBreakdown: Record<string, number> = {};
    
    incidents.forEach(incident => {
      statusBreakdown[incident.status] = (statusBreakdown[incident.status] || 0) + 1;
      severityBreakdown[incident.severity] = (severityBreakdown[incident.severity] || 0) + 1;
    });
    
    const newStats: DashboardStats = {
      totalIncidents: incidents.length,
      openIncidents: incidents.filter(i => openStatuses.includes(i.status)).length,
      criticalIncidents: incidents.filter(i => i.severity === 'critical').length,
      myIncidents: incidents.filter(i => 
        i.reporterType === 'user' && i.reporterInfo.userId === user?.id
      ).length,
      recentIncidents: incidents
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5),
      statusBreakdown,
      severityBreakdown
    };

    setStats(newStats);
  }, [incidents, user]);

  const StatCard: React.FC<{ 
    title: string; 
    value: number; 
    icon: React.ComponentType<any>; 
    color: string; 
    description: string;
    trend?: { value: number; isPositive: boolean };
  }> = ({ title, value, icon: Icon, color, description, trend }) => (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <div className="flex items-center">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <div className="flex items-baseline mt-1">
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            {trend && (
              <span className={`ml-2 text-sm font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        </div>
        <div className={`p-3 rounded-full ${color.replace('text-', 'bg-').replace('-600', '-100')}`}>
          <Icon className={`h-6 w-6 ${color}`} />
        </div>
      </div>
    </div>
  );

  if (isLoading && incidents.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-500 mt-4">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg shadow-sm p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              Welcome back, {user?.firstName}!
            </h1>
            <p className="text-blue-100 mt-1">
              Here's what's happening with incidents in {organization?.name || 'your organization'} today.
            </p>
          </div>
          <div className="hidden sm:block">
            <Link
              href="/report/user"
              className="bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-blue-50 transition-colors font-medium text-sm flex items-center"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Report Incident
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Incidents"
          value={stats.totalIncidents}
          icon={ChartBarIcon}
          color="text-blue-600"
          description="All incidents in the system"
        />
        <StatCard
          title="Open Incidents"
          value={stats.openIncidents}
          icon={ClockIcon}
          color="text-orange-600"
          description="Incidents requiring attention"
        />
        <StatCard
          title="Critical Incidents"
          value={stats.criticalIncidents}
          icon={ExclamationTriangleIcon}
          color="text-red-600"
          description="High priority incidents"
        />
        <StatCard
          title="My Incidents"
          value={stats.myIncidents}
          icon={CheckCircleIcon}
          color="text-green-600"
          description="Incidents you reported"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Incidents */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">Recent Incidents</h2>
              <Link
                href="/dashboard/incidents"
                className="text-sm text-blue-600 hover:text-blue-700 flex items-center"
              >
                View all
                <EyeIcon className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {stats.recentIncidents.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <ChartBarIcon className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <p className="font-medium">No incidents to display</p>
                <p className="text-sm mt-1">Incidents will appear here once they are reported</p>
              </div>
            ) : (
              stats.recentIncidents.map((incident) => (
                <div key={incident.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{incident.title}</p>
                      <div className="flex items-center mt-1 space-x-4 text-xs text-gray-500">
                        <span>{incident.category.name}</span>
                        <span>•</span>
                        <span>{formatDateTime(incident.createdAt)}</span>
                        {incident.reporterInfo.trackingId && (
                          <>
                            <span>•</span>
                            <span className="font-mono">{incident.reporterInfo.trackingId}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="ml-4 flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${SEVERITY_CONFIG[incident.severity].color}`}>
                        {SEVERITY_CONFIG[incident.severity].label}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_CONFIG[incident.status].color}`}>
                        {STATUS_CONFIG[incident.status].label}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="space-y-6">
          {/* Status Breakdown */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Status Breakdown</h3>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {Object.entries(stats.statusBreakdown).map(([status, count]) => (
                  <div key={status} className="flex items-center justify-between">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_CONFIG[status]?.color || 'bg-gray-100 text-gray-800'}`}>
                      {STATUS_CONFIG[status]?.label || status}
                    </span>
                    <span className="text-sm font-medium text-gray-900">{count}</span>
                  </div>
                ))}
                {Object.keys(stats.statusBreakdown).length === 0 && (
                  <p className="text-sm text-gray-500 text-center">No data available</p>
                )}
              </div>
            </div>
          </div>

          {/* Severity Breakdown */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Severity Breakdown</h3>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {Object.entries(stats.severityBreakdown).map(([severity, count]) => (
                  <div key={severity} className="flex items-center justify-between">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${SEVERITY_CONFIG[severity]?.color || 'bg-gray-100 text-gray-800'}`}>
                      {SEVERITY_CONFIG[severity]?.label || severity}
                    </span>
                    <span className="text-sm font-medium text-gray-900">{count}</span>
                  </div>
                ))}
                {Object.keys(stats.severityBreakdown).length === 0 && (
                  <p className="text-sm text-gray-500 text-center">No data available</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/report/user"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <PlusIcon className="h-8 w-8 text-blue-600 group-hover:text-blue-700" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Report Incident</p>
                <p className="text-xs text-gray-500">Create a new incident report</p>
              </div>
            </Link>

            <Link
              href="/track"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <EyeIcon className="h-8 w-8 text-green-600 group-hover:text-green-700" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Track Incident</p>
                <p className="text-xs text-gray-500">Track by tracking ID</p>
              </div>
            </Link>

            <Link
              href="/dashboard/incidents"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <ChartBarIcon className="h-8 w-8 text-purple-600 group-hover:text-purple-700" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">All Incidents</p>
                <p className="text-xs text-gray-500">View and manage incidents</p>
              </div>
            </Link>

            <Link
              href="/dashboard/analytics"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <ChartBarIcon className="h-8 w-8 text-orange-600 group-hover:text-orange-700" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Analytics</p>
                <p className="text-xs text-gray-500">View reports and insights</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
```

STEP 4: Incident List Component with Filters
Create src/components/features/IncidentList.tsx:
```typescript
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useIncidentStore } from '@/stores/incidentStore';
import { Incident, STATUS_CONFIG, SEVERITY_CONFIG, INCIDENT_CATEGORIES } from '@/types/incident';
import { formatDateTime, truncateText } from '@/utils/formatters';
import {
  FunnelIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  PencilIcon,
  TagIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';

interface Props {
  showAll?: boolean; // If true, show all incidents; if false, show user's incidents only
  userId?: string; // For filtering user-specific incidents
}

export const IncidentList: React.FC<Props> = ({ showAll = true, userId }) => {
  const searchParams = useSearchParams();
  const { incidents, fetchIncidents, isLoading, error } = useIncidentStore();
  const [filteredIncidents, setFilteredIncidents] = useState<Incident[]>([]);
  const [filters, setFilters] = useState({
    status: searchParams?.get('status') || 'all',
    severity: searchParams?.get('severity') || 'all',
    category: searchParams?.get('category') || 'all',
    search: searchParams?.get('search') || ''
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchIncidents();
  }, [fetchIncidents]);

  useEffect(() => {
    let filtered = incidents;

    // Filter by user if not showing all
    if (!showAll && userId) {
      filtered = filtered.filter(incident => 
        incident.reporterType === 'user' && incident.reporterInfo.userId === userId
      );
    }

    // Apply filters
    if (filters.status !== 'all') {
      filtered = filtered.filter(incident => incident.status === filters.status);
    }

    if (filters.severity !== 'all') {
      filtered = filtered.filter(incident => incident.severity === filters.severity);
    }

    if (filters.category !== 'all') {
      filtered = filtered.filter(incident => incident.category.id === filters.category);
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(incident =>
        incident.title.toLowerCase().includes(searchLower) ||
        incident.description.toLowerCase().includes(searchLower) ||
        incident.reporterInfo.trackingId?.toLowerCase().includes(searchLower) ||
        incident.category.name.toLowerCase().includes(searchLower) ||
        incident.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Sort by creation date (newest first)
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    setFilteredIncidents(filtered);
  }, [incidents, filters, showAll, userId]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      status: 'all',
      severity: 'all',
      category: 'all',
      search: ''
    });
  };

  const getReporterDisplay = (incident: Incident) => {
    switch (incident.reporterType) {
      case 'anonymous':
        return 'Anonymous';
      case 'guest':
        return incident.reporterInfo.name || 'Guest User';
      case 'user':
        return `User ID: ${incident.reporterInfo.userId}`;
      default:
        return 'Unknown';
    }
  };

  const hasActiveFilters = Object.values(filters).some(filter => filter !== 'all' && filter !== '');

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
        <p>Error loading incidents: {error}</p>
        <button
          onClick={() => fetchIncidents()}
          className="mt-2 text-sm underline hover:no-underline"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {showAll ? 'All Incidents' : 'My Incidents'}
          </h1>
          <p className="text-gray-600 mt-1">
            {showAll 
              ? 'View and manage all incidents in your organization' 
              : 'Incidents you have reported'
            }
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            href="/report/user"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Report New Incident
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-4 py-3 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                <FunnelIcon className="h-4 w-4 mr-2" />
                Filters
                {hasActiveFilters && (
                  <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    Active
                  </span>
                )}
              </button>
              
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Clear filters
                </button>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {filteredIncidents.length} of {incidents.length} incidents
              </span>
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        {showFilters && (
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    placeholder="Search incidents..."
                    className="pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Statuses</option>
                  {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                    <option key={key} value={key}>{config.label}</option>
                  ))}
                </select>
              </div>

              {/* Severity Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
                <select
                  value={filters.severity}
                  onChange={(e) => handleFilterChange('severity', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Severities</option>
                  {Object.entries(SEVERITY_CONFIG).map(([key, config]) => (
                    <option key={key} value={key}>{config.label}</option>
                  ))}
                </select>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Categories</option>
                  {INCIDENT_CATEGORIES.map((category) => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Loading State */}
      {isLoading && incidents.length === 0 && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-500 mt-4">Loading incidents...</p>
          </div>
        </div>
      )}

      {/* Incident List */}
      <div className="space-y-4">
        {filteredIncidents.length === 0 && !isLoading ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <MagnifyingGlassIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No incidents found</h3>
            <p className="text-gray-500">
              {hasActiveFilters 
                ? 'Try adjusting your filters or search terms'
                : 'No incidents have been reported yet'
              }
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="mt-4 text-sm text-blue-600 hover:text-blue-700"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          filteredIncidents.map((incident) => (
            <div key={incident.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    {/* Title and Badges */}
                    <div className="flex items-start gap-3 mb-3">
                      <h3 className="text-lg font-medium text-gray-900 flex-1">
                        {incident.title}
                      </h3>
                      <div className="flex gap-2 flex-shrink-0">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${SEVERITY_CONFIG[incident.severity].color}`}>
                          {SEVERITY_CONFIG[incident.severity].label}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_CONFIG[incident.status].color}`}>
                          {STATUS_CONFIG[incident.status].label}
                        </span>
                      </div>
                    </div>
                    
                    {/* Description */}
                    <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                      {truncateText(incident.description, 200)}
                    </p>
                    
                    {/* Metadata */}
                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 mb-4">
                      <span><strong>Category:</strong> {incident.category.name}</span>
                      <span><strong>Reporter:</strong> {getReporterDisplay(incident)}</span>
                      <span><strong>Created:</strong> {formatDateTime(incident.createdAt)}</span>
                      {incident.reporterInfo.trackingId && (
                        <span><strong>ID:</strong> <code className="font-mono bg-gray-100 px-1 py-0.5 rounded">{incident.reporterInfo.trackingId}</code></span>
                      )}
                    </div>

                    {/* Tags */}
                    {incident.tags && incident.tags.length > 0 && (
                      <div className="flex items-center gap-2 mb-4">
                        <TagIcon className="h-4 w-4 text-gray-400" />
                        <div className="flex flex-wrap gap-1">
                          {incident.tags.slice(0, 3).map((tag, index) => (
                            <span key={index} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                              {tag}
                            </span>
                          ))}
                          {incident.tags.length > 3 && (
                            <span className="text-xs text-gray-500">+{incident.tags.length - 3} more</span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Location */}
                    {incident.location && (
                      <div className="flex items-center text-xs text-gray-500">
                        <MapPinIcon className="h-4 w-4 mr-1" />
                        <span>
                          {[
                            incident.location.facility,
                            incident.location.department,
                            incident.location.room
                          ].filter(Boolean).join(' • ') || 'Location specified'}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="ml-6 flex flex-col gap-2">
                    <Link
                      href={`/dashboard/incidents/${incident.id}`}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <EyeIcon className="h-4 w-4 mr-2" />
                      View
                    </Link>
                    <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <PencilIcon className="h-4 w-4 mr-2" />
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Load More (if needed) */}
      {filteredIncidents.length > 0 && (
        <div className="text-center py-4">
          <p className="text-sm text-gray-500">
            Showing {filteredIncidents.length} of {incidents.length} incidents
          </p>
        </div>
      )}
    </div>
  );
};
```

STEP 5: Create Dashboard Pages
Create src/app/dashboard/page.tsx:
```typescript
'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DashboardOverview } from '@/components/features/DashboardOverview';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <DashboardOverview />
      </DashboardLayout>
    </ProtectedRoute>
  );
}
```

Create src/app/dashboard/incidents/page.tsx:
```typescript
'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { IncidentList } from '@/components/features/IncidentList';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function AllIncidentsPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <IncidentList showAll={true} />
      </DashboardLayout>
    </ProtectedRoute>
  );
}
```

Create src/app/dashboard/my-incidents/page.tsx:
```typescript
'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { IncidentList } from '@/components/features/IncidentList';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuthStore } from '@/stores/authStore';

export default function MyIncidentsPage() {
  const { user } = useAuthStore();

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <IncidentList showAll={false} userId={user?.id} />
      </DashboardLayout>
    </ProtectedRoute>
  );
}
```

Create src/app/track/page.tsx:
```typescript
import { AnonymousTracker } from '@/components/features/AnonymousTracker';

export default function TrackPage() {
  return <AnonymousTracker />;
}
```

STEP 6: Create Report Pages
Create src/app/report/anonymous/page.tsx:
```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { IncidentReportForm } from '@/components/forms/IncidentReportForm';
import Link from 'next/link';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

export default function AnonymousReportPage() {
  const router = useRouter();
  const [submissionResult, setSubmissionResult] = useState<{ incident: any; trackingId: string } | null>(null);

  const handleSuccess = (result: { incident: any; trackingId: string }) => {
    setSubmissionResult(result);
  };

  const handleError = (error: Error) => {
    console.error('Submission error:', error);
    // Error is displayed in the form component
  };

  if (submissionResult) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Incident Reported Successfully
            </h2>
            <p className="text-gray-600 mb-6">
              Your incident has been submitted and is being reviewed. Please save your tracking ID for future reference.
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm font-medium text-blue-900 mb-2">Your Tracking ID</p>
              <p className="text-2xl font-mono font-bold text-blue-600">
                {submissionResult.trackingId}
              </p>
              <p className="text-xs text-blue-700 mt-2">
                Keep this ID safe - you'll need it to track your incident status
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={`/track?id=${submissionResult.trackingId}`}
                className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors font-medium"
              >
                Track This Incident
              </Link>
              <Link
                href="/"
                className="bg-gray-100 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-200 transition-colors font-medium"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            ← Back to Home
          </Link>
        </div>
        
        <IncidentReportForm
          reporterType="anonymous"
          organizationType="corporate"
          onSuccess={handleSuccess}
          onError={handleError}
        />
      </div>
    </div>
  );
}
```

Create src/app/report/guest/page.tsx:
```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { IncidentReportForm } from '@/components/forms/IncidentReportForm';
import Link from 'next/link';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

export default function GuestReportPage() {
  const router = useRouter();
  const [submissionResult, setSubmissionResult] = useState<{ incident: any; trackingId: string } | null>(null);

  const handleSuccess = (result: { incident: any; trackingId: string }) => {
    setSubmissionResult(result);
  };

  const handleError = (error: Error) => {
    console.error('Submission error:', error);
    // Error is displayed in the form component
  };

  if (submissionResult) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Thank You for Your Report
            </h2>
            <p className="text-gray-600 mb-6">
              Your incident has been submitted successfully. We'll contact you if we need additional information.
            </p>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-sm font-medium text-green-900 mb-2">Your Tracking ID</p>
              <p className="text-2xl font-mono font-bold text-green-600">
                {submissionResult.trackingId}
              </p>
              <p className="text-xs text-green-700 mt-2">
                Use this ID to check the status of your incident at any time
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={`/track?id=${submissionResult.trackingId}`}
                className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors font-medium"
              >
                Track This Incident
              </Link>
              <Link
                href="/"
                className="bg-gray-100 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-200 transition-colors font-medium"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            ← Back to Home
          </Link>
        </div>
        
        <IncidentReportForm
          reporterType="guest"
          organizationType="corporate"
          onSuccess={handleSuccess}
          onError={handleError}
        />
      </div>
    </div>
  );
}
```

Create src/app/report/user/page.tsx:
```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { IncidentReportForm } from '@/components/forms/IncidentReportForm';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuthStore } from '@/stores/authStore';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function UserReportPage() {
  const router = useRouter();
  const { organization } = useAuthStore();
  const [submissionResult, setSubmissionResult] = useState<{ incident: any; trackingId: string } | null>(null);

  const handleSuccess = (result: { incident: any; trackingId: string }) => {
    setSubmissionResult(result);
  };

  const handleError = (error: Error) => {
    console.error('Submission error:', error);
    // Error is displayed in the form component
  };

  if (submissionResult) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Incident Reported Successfully
              </h2>
              <p className="text-gray-600 mb-6">
                Your incident has been submitted and assigned tracking ID <strong>{submissionResult.trackingId}</strong>. 
                You can view it in your dashboard or track it directly.
              </p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm font-medium text-blue-900 mb-2">Incident Details</p>
                <p className="text-lg font-semibold text-blue-800 mb-2">
                  {submissionResult.incident.title}
                </p>
                <p className="text-sm text-blue-700">
                  Status: {submissionResult.incident.status.replace('_', ' ')} • 
                  Severity: {submissionResult.incident.severity}
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/dashboard/my-incidents"
                  className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors font-medium"
                >
                  View My Incidents
                </Link>
                <Link
                  href="/dashboard"
                  className="bg-gray-100 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-200 transition-colors font-medium"
                >
                  Back to Dashboard
                </Link>
              </div>
            </div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="max-w-4xl">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Report New Incident</h1>
            <p className="text-gray-600 mt-1">Submit a detailed incident report for investigation and resolution.</p>
          </div>
          
          <IncidentReportForm
            reporterType="user"
            organizationType={organization?.type || 'corporate'}
            onSuccess={handleSuccess}
            onError={handleError}
          />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
```

CRITICAL GOTCHAS & THINGS TO WATCH OUT FOR:
1. Dashboard layout is responsive - test on different screen sizes
2. Anonymous tracking requires exact tracking ID match - case sensitive
3. Incident filtering happens client-side - will need optimization for large datasets
4. Status and severity colors MUST match between components
5. Navigation uses Next.js Link components - don't use regular anchor tags
6. Protected routes require authentication - anonymous tracker is public
7. Search functionality works across multiple fields including tags and tracking ID
8. Mobile sidebar overlay requires click outside to close
9. LocalStorage is used for persistence - clear browser storage if data gets corrupted
10. File uploads are still mocked - real implementation would need proper file handling

EXPECTED OUTCOME:
After completing this prompt, you should have:
- Complete dashboard layout with responsive navigation and mobile support
- Anonymous incident tracking system using tracking IDs with professional UI
- Comprehensive incident list with advanced filtering and search capabilities
- Dashboard overview with statistics, charts, and recent activity
- Professional reporting pages for anonymous, guest, and authenticated users
- Success pages with tracking information and next steps
- Proper routing structure with protected and public routes
- Mobile-optimized interface that works on all screen sizes
- Real-time search and filtering across all incident data

TESTING THE IMPLEMENTATION:
1. Register/login as a user and verify dashboard loads with proper navigation
2. Create incidents via all three reporting methods (anonymous, guest, user)
3. Test anonymous tracking with generated tracking IDs
4. Use dashboard filters to verify incident filtering works correctly
5. Verify statistics update when new incidents are created
6. Test responsive behavior on mobile screen sizes (use browser dev tools)
7. Check that all status and severity colors are consistent across all components
8. Test search functionality across titles, descriptions, and tracking IDs
9. Verify protected routes redirect to login when not authenticated
10. Test the mobile sidebar menu and overlay functionality

The complete incident management system should now be fully functional with professional dashboards, comprehensive tracking, and advanced management features ready for production use.
```