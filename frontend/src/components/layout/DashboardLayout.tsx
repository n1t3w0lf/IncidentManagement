'use client';

// ============================================
// DASHBOARD LAYOUT
// ============================================

import { ProtectedRoute } from './ProtectedRoute';
import { DashboardHeader } from './DashboardHeader';
import { DashboardSidebar } from './DashboardSidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
  requiredRoles?: string[];
}

export function DashboardLayout({ children, requiredRoles }: DashboardLayoutProps) {
  return (
    <ProtectedRoute requiredRoles={requiredRoles}>
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-primary-600 focus:px-4 focus:py-2 focus:text-white focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
      >
        Skip to main content
      </a>

      <div className="flex h-screen overflow-hidden bg-gray-50">
        {/* Sidebar */}
        <DashboardSidebar />

        {/* Main Content */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Header */}
          <DashboardHeader />

          {/* Page Content */}
          <main id="main-content" className="flex-1 overflow-y-auto" tabIndex={-1}>
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
