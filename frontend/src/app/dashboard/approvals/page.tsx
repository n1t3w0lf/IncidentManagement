'use client';

// ============================================
// APPROVALS PAGE
// ============================================

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent, Badge, Alert } from '@/components/ui';

export default function ApprovalsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Approvals Queue</h1>
          <p className="mt-2 text-gray-600">
            Review and approve pending incident reports
          </p>
        </div>

        {/* Info Alert */}
        <Alert variant="info">
          <p className="font-medium">Feature Under Development</p>
          <p className="mt-1 text-sm">
            The approval workflow interface is currently being developed. This page will allow managers
            and administrators to review, approve, or reject incident reports based on escalation levels.
          </p>
        </Alert>

        {/* Planned Features */}
        <Card>
          <CardHeader>
            <CardTitle>Planned Features</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start">
                <Badge variant="default" className="mr-3 mt-0.5">Phase 1</Badge>
                <div>
                  <p className="font-medium text-gray-900">Approval Queue</p>
                  <p className="text-sm text-gray-600">View all incidents pending approval with filtering by escalation level</p>
                </div>
              </li>
              <li className="flex items-start">
                <Badge variant="default" className="mr-3 mt-0.5">Phase 1</Badge>
                <div>
                  <p className="font-medium text-gray-900">Quick Actions</p>
                  <p className="text-sm text-gray-600">Approve or reject incidents directly from the queue with comments</p>
                </div>
              </li>
              <li className="flex items-start">
                <Badge variant="default" className="mr-3 mt-0.5">Phase 2</Badge>
                <div>
                  <p className="font-medium text-gray-900">Bulk Operations</p>
                  <p className="text-sm text-gray-600">Select multiple incidents for batch approval or assignment</p>
                </div>
              </li>
              <li className="flex items-start">
                <Badge variant="default" className="mr-3 mt-0.5">Phase 2</Badge>
                <div>
                  <p className="font-medium text-gray-900">SLA Tracking</p>
                  <p className="text-sm text-gray-600">Monitor approval timeouts and escalation deadlines</p>
                </div>
              </li>
              <li className="flex items-start">
                <Badge variant="default" className="mr-3 mt-0.5">Phase 3</Badge>
                <div>
                  <p className="font-medium text-gray-900">Delegation</p>
                  <p className="text-sm text-gray-600">Reassign approval tasks to other managers or administrators</p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Current Workaround */}
        <Card>
          <CardHeader>
            <CardTitle>Current Workaround</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">
              In the meantime, you can manage incident approvals through the <strong>Incidents</strong> page:
            </p>
            <ol className="mt-3 list-decimal list-inside space-y-2 text-sm text-gray-600">
              <li>Navigate to the <strong>Incidents</strong> page from the sidebar</li>
              <li>Filter by status: "Pending Approval"</li>
              <li>Click on an incident to view details</li>
              <li>Use the status change actions in the sidebar to approve or reject</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
