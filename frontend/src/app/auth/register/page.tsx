'use client';

// ============================================
// REGISTER PAGE
// ============================================

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/stores/authStore';
import { Button, Input, Select, Alert } from '@/components/ui';
import { INDUSTRY_TYPES } from '@/lib/constants';
import { getPasswordStrength } from '@/lib/utils';
import type { RegisterData, IndustryType } from '@/types';

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading, error: authError, clearError } = useAuthStore();

  const [formData, setFormData] = useState<RegisterData>({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    organizationName: '',
    organizationType: '' as IndustryType,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof RegisterData, string>>>({});
  const [showPassword, setShowPassword] = useState(false);

  const passwordStrength = formData.password ? getPasswordStrength(formData.password) : null;

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof RegisterData, string>> = {};

    // Personal info
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    // Email
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    // Password
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one lowercase letter';
    } else if (!/(?=.*[A-Z])/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter';
    } else if (!/(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one number';
    }

    // Confirm password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Organization
    if (!formData.organizationName.trim()) {
      newErrors.organizationName = 'Organization name is required';
    }

    if (!formData.organizationType) {
      newErrors.organizationType = 'Please select an industry type';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!validate()) return;

    try {
      await register(formData);
      router.push('/dashboard');
    } catch (error) {
      // Error is handled by the store
      
    }
  };

  const handleChange = (field: keyof RegisterData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-600 text-white font-bold text-xl">
              I
            </div>
            <span className="text-2xl font-bold text-gray-900">Incident Management</span>
          </Link>
          <h2 className="text-3xl font-bold text-gray-900">Create your account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/auth/login" className="font-medium text-primary-600 hover:text-primary-700">
              Sign in
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
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <Input
                  label="First Name"
                  value={formData.firstName}
                  onChange={handleChange('firstName')}
                  error={errors.firstName}
                  placeholder="John"
                  required
                />

                <Input
                  label="Last Name"
                  value={formData.lastName}
                  onChange={handleChange('lastName')}
                  error={errors.lastName}
                  placeholder="Doe"
                  required
                />
              </div>

              <div className="mt-4">
                <Input
                  label="Email Address"
                  type="email"
                  value={formData.email}
                  onChange={handleChange('email')}
                  error={errors.email}
                  placeholder="john.doe@company.com"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Security */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Security</h3>
              <div className="space-y-4">
                <div>
                  <Input
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange('password')}
                    error={errors.password}
                    placeholder="••••••••"
                    required
                    helperText="At least 8 characters, 1 uppercase, 1 lowercase, 1 number"
                  />
                  {passwordStrength && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-gray-600">Password strength:</span>
                        <span className={passwordStrength.label === 'Weak' ? 'text-danger-600' : passwordStrength.label === 'Medium' ? 'text-warning-600' : 'text-success-600'}>
                          {passwordStrength.label}
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all ${passwordStrength.color}`}
                          style={{ width: `${(passwordStrength.score / 6) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <Input
                  label="Confirm Password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange('confirmPassword')}
                  error={errors.confirmPassword}
                  placeholder="••••••••"
                  required
                />

                <div className="flex items-center">
                  <input
                    id="show-password"
                    type="checkbox"
                    checked={showPassword}
                    onChange={(e) => setShowPassword(e.target.checked)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="show-password" className="ml-2 block text-sm text-gray-700">
                    Show password
                  </label>
                </div>
              </div>
            </div>

            {/* Organization */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Organization</h3>
              <div className="space-y-4">
                <Input
                  label="Organization Name"
                  value={formData.organizationName}
                  onChange={handleChange('organizationName')}
                  error={errors.organizationName}
                  placeholder="ABC Mining Corporation"
                  required
                />

                <Select
                  label="Industry Type"
                  value={formData.organizationType}
                  onChange={handleChange('organizationType')}
                  error={errors.organizationType}
                  options={Object.values(INDUSTRY_TYPES).map((type) => ({
                    value: type.value,
                    label: `${type.icon} ${type.label}`,
                  }))}
                  required
                />
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-start">
              <input
                id="terms"
                type="checkbox"
                required
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-0.5"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                I agree to the{' '}
                <a href="#" className="text-primary-600 hover:text-primary-700">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-primary-600 hover:text-primary-700">
                  Privacy Policy
                </a>
              </label>
            </div>

            <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
              Create Account
            </Button>
          </form>
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
