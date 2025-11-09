'use client';

// ============================================
// HOME PAGE
// ============================================

import Link from 'next/link';
import { useAuthStore } from '@/stores/authStore';
import { INDUSTRY_TYPES } from '@/lib/constants';

export default function HomePage() {
  const { isAuthenticated, user } = useAuthStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100">
      {/* Header */}
      <header className="border-b bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-600 text-white font-bold text-xl">
                I
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Incident Management System</h1>
                <p className="text-sm text-gray-500">Mining • Healthcare • Retail</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <span className="text-sm text-gray-600">
                    Welcome, {user?.firstName}
                  </span>
                  <Link
                    href="/dashboard"
                    className="btn-primary"
                  >
                    Go to Dashboard
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="text-sm font-medium text-primary-600 hover:text-primary-700"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/register"
                    className="btn-primary"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Report an Incident
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Choose how you'd like to report your incident
          </p>
        </div>

        {/* Reporting Options */}
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* Anonymous Reporting */}
          <div className="card hover:shadow-lg transition-shadow">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100">
              <span className="text-2xl">🔒</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Anonymous</h3>
            <p className="mt-2 text-gray-600">
              Report anonymously without providing any contact information. You'll receive a tracking ID to check status.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-gray-500">
              <li>✓ No personal information required</li>
              <li>✓ Get tracking ID for updates</li>
              <li>✓ Complete confidentiality</li>
            </ul>
            <Link
              href="/report/anonymous"
              className="mt-6 block w-full rounded-md bg-gray-600 px-4 py-2 text-center text-white hover:bg-gray-700 transition-colors"
            >
              Report Anonymously
            </Link>
          </div>

          {/* Guest Reporting */}
          <div className="card hover:shadow-lg transition-shadow border-2 border-primary-200">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100">
              <span className="text-2xl">👤</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Guest</h3>
            <p className="mt-2 text-gray-600">
              Provide basic contact info for follow-up. You'll receive updates via email and get a tracking ID.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-gray-500">
              <li>✓ Provide name and email</li>
              <li>✓ Receive email updates</li>
              <li>✓ Track via email or ID</li>
            </ul>
            <Link
              href="/report/guest"
              className="mt-6 block w-full btn-primary"
            >
              Report as Guest
            </Link>
          </div>

          {/* Authenticated Reporting */}
          <div className="card hover:shadow-lg transition-shadow">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-success-100">
              <span className="text-2xl">✅</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Sign In</h3>
            <p className="mt-2 text-gray-600">
              {isAuthenticated
                ? 'Access your dashboard to manage incidents and view history.'
                : 'Sign in for full access to incident management, dashboard, and history.'}
            </p>
            <ul className="mt-4 space-y-2 text-sm text-gray-500">
              <li>✓ Full dashboard access</li>
              <li>✓ View incident history</li>
              <li>✓ Real-time notifications</li>
            </ul>
            {isAuthenticated ? (
              <Link
                href="/dashboard"
                className="mt-6 block w-full rounded-md bg-success-600 px-4 py-2 text-center text-white hover:bg-success-700 transition-colors"
              >
                Go to Dashboard
              </Link>
            ) : (
              <Link
                href="/auth/login"
                className="mt-6 block w-full rounded-md bg-success-600 px-4 py-2 text-center text-white hover:bg-success-700 transition-colors"
              >
                Sign In to Report
              </Link>
            )}
          </div>
        </div>

        {/* Track Incident Section */}
        <div className="mt-16">
          <div className="card bg-primary-50 border-primary-200">
            <div className="text-center">
              <h3 className="text-2xl font-semibold text-gray-900">Track Existing Incident</h3>
              <p className="mt-2 text-gray-600">
                Have a tracking ID? Check the status of your incident
              </p>
              <Link
                href="/track"
                className="mt-6 inline-block rounded-md bg-primary-600 px-6 py-3 text-white hover:bg-primary-700 transition-colors font-medium"
              >
                Track Incident
              </Link>
            </div>
          </div>
        </div>

        {/* Industries Section */}
        <div className="mt-16">
          <h3 className="text-center text-2xl font-semibold text-gray-900 mb-8">
            Industries We Serve
          </h3>
          <div className="grid gap-6 sm:grid-cols-3">
            {Object.values(INDUSTRY_TYPES).map((industry) => (
              <div key={industry.value} className="text-center p-6 rounded-lg bg-white shadow-sm">
                <div className="text-4xl mb-3">{industry.icon}</div>
                <h4 className="font-semibold text-gray-900">{industry.label}</h4>
                <p className="mt-2 text-sm text-gray-500">
                  Specialized incident categories and workflows
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-gray-500">
            <p>© 2024 Incident Management System. All rights reserved.</p>
            <p className="mt-2">
              24/7 Support • Multi-Industry • Secure & Confidential
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
