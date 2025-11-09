'use client';

// ============================================
// ANALYTICS PAGE
// ============================================

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent, Badge, Alert } from '@/components/ui';

export default function AnalyticsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Comprehensive insights and reporting on incident management
          </p>
        </div>

        {/* Planned Analytics */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Planned Visualizations</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-primary-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                  </svg>
                  <div>
                    <p className="font-medium text-gray-900">Incident Trends</p>
                    <p className="text-sm text-gray-600">Time-series charts showing incident volumes over time</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-primary-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="font-medium text-gray-900">Category Distribution</p>
                    <p className="text-sm text-gray-600">Breakdown by incident category and industry</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-primary-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="font-medium text-gray-900">Resolution Times</p>
                    <p className="text-sm text-gray-600">Average time to resolve by severity and category</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-primary-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="font-medium text-gray-900">User Performance</p>
                    <p className="text-sm text-gray-600">Reporter and resolver activity metrics</p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Planned Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Badge variant="primary" className="mr-2 mt-0.5">CSV</Badge>
                  <div>
                    <p className="font-medium text-gray-900">Executive Summary</p>
                    <p className="text-sm text-gray-600">High-level monthly or quarterly overview</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Badge variant="primary" className="mr-2 mt-0.5">PDF</Badge>
                  <div>
                    <p className="font-medium text-gray-900">Compliance Report</p>
                    <p className="text-sm text-gray-600">Industry-specific regulatory compliance</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Badge variant="primary" className="mr-2 mt-0.5">CSV</Badge>
                  <div>
                    <p className="font-medium text-gray-900">Detailed Incident Log</p>
                    <p className="text-sm text-gray-600">Complete incident history with all fields</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Badge variant="primary" className="mr-2 mt-0.5">PDF</Badge>
                  <div>
                    <p className="font-medium text-gray-900">Custom Reports</p>
                    <p className="text-sm text-gray-600">Build your own reports with filters</p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Key Metrics Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Planned Key Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg border p-4">
                <p className="text-sm font-medium text-gray-500">Total Incidents</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">---</p>
                <p className="mt-1 text-sm text-gray-600">All time</p>
              </div>
              <div className="rounded-lg border p-4">
                <p className="text-sm font-medium text-gray-500">Avg Resolution Time</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">---</p>
                <p className="mt-1 text-sm text-gray-600">Hours</p>
              </div>
              <div className="rounded-lg border p-4">
                <p className="text-sm font-medium text-gray-500">Critical Open</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">---</p>
                <p className="mt-1 text-sm text-gray-600">Requires attention</p>
              </div>
              <div className="rounded-lg border p-4">
                <p className="text-sm font-medium text-gray-500">Resolution Rate</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">---%</p>
                <p className="mt-1 text-sm text-gray-600">Last 30 days</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
