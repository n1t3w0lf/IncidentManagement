'use client';

// ============================================
// LOGIN PAGE
// ============================================

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/stores/authStore';
import { Button, Input, Alert } from '@/components/ui';
import type { LoginCredentials } from '@/types';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error: authError, clearError } = useAuthStore();

  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Partial<LoginCredentials>>({});

  const validate = (): boolean => {
    const newErrors: Partial<LoginCredentials> = {};

    if (!credentials.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credentials.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!credentials.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!validate()) return;

    try {
      await login(credentials);
      router.push('/dashboard');
    } catch (error) {
      // Error is handled by the store
      console.error('Login failed:', error);
    }
  };

  const handleChange = (field: keyof LoginCredentials) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCredentials((prev) => ({ ...prev, [field]: e.target.value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-600 text-white font-bold text-xl">
              I
            </div>
            <span className="text-2xl font-bold text-gray-900">Incident Management</span>
          </Link>
          <h2 className="text-3xl font-bold text-gray-900">Sign in to your account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{' '}
            <Link href="/auth/register" className="font-medium text-primary-600 hover:text-primary-700">
              create a new account
            </Link>
          </p>
        </div>

        {/* Form */}
        <div className="bg-white shadow-xl rounded-lg p-8">
          {authError && (
            <Alert variant="danger" className="mb-6" onClose={clearError}>
              {authError}
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email address"
              type="email"
              value={credentials.email}
              onChange={handleChange('email')}
              error={errors.email}
              placeholder="you@example.com"
              required
              autoComplete="email"
            />

            <Input
              label="Password"
              type="password"
              value={credentials.password}
              onChange={handleChange('password')}
              error={errors.password}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>

              <Link
                href="/auth/forgot-password"
                className="text-sm font-medium text-primary-600 hover:text-primary-700"
              >
                Forgot password?
              </Link>
            </div>

            <Button type="submit" className="w-full" isLoading={isLoading}>
              Sign in
            </Button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 border-t pt-6">
            <p className="text-xs text-gray-500 text-center mb-3">Demo Credentials:</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 bg-gray-50 rounded">
                <p className="font-medium text-gray-700">Super Admin</p>
                <p className="text-gray-600">admin@example.com</p>
                <p className="text-gray-600">password</p>
              </div>
              <div className="p-2 bg-gray-50 rounded">
                <p className="font-medium text-gray-700">Manager</p>
                <p className="text-gray-600">manager@example.com</p>
                <p className="text-gray-600">password</p>
              </div>
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
