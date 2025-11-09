'use client';

// ============================================
// DYNAMIC INCIDENT FORM
// ============================================

import { useState, useEffect, useRef } from 'react';
import { Input, Textarea, Select, Button, Alert } from '@/components/ui';
import { ALL_INCIDENT_CATEGORIES } from '@/lib/categories';
import { INDUSTRY_TYPES } from '@/lib/constants';
import type { Incident, IncidentCategory, CustomField, IndustryType, IncidentSeverity } from '@/types';

interface DynamicIncidentFormProps {
  onSubmit: (data: Partial<Incident>) => Promise<void>;
  isLoading?: boolean;
  showReporterInfo?: boolean;
  reporterType: 'anonymous' | 'guest' | 'user';
}

export function DynamicIncidentForm({
  onSubmit,
  isLoading,
  showReporterInfo = false,
  reporterType,
}: DynamicIncidentFormProps) {
  const [selectedIndustry, setSelectedIndustry] = useState<IndustryType | ''>('');
  const [selectedCategory, setSelectedCategory] = useState<IncidentCategory | null>(null);
  const [formData, setFormData] = useState<any>({
    title: '',
    description: '',
    severity: '' as IncidentSeverity | '',
    customFields: {},
    location: {},
    reporterInfo: {},
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());
  const formRefs = useRef<Record<string, HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null>>({});

  // Get categories for selected industry
  const availableCategories = selectedIndustry
    ? ALL_INCIDENT_CATEGORIES.filter((cat) => cat.type === selectedIndustry)
    : [];

  useEffect(() => {
    // Reset category when industry changes
    setSelectedCategory(null);
    setFormData((prev: any) => ({
      ...prev,
      customFields: {},
    }));
  }, [selectedIndustry]);

  useEffect(() => {
    // Set default severity when category changes
    if (selectedCategory) {
      setFormData((prev: any) => ({
        ...prev,
        severity: selectedCategory.defaultSeverity,
      }));
    }
  }, [selectedCategory]);

  const handleCategoryChange = (categoryId: string) => {
    const category = availableCategories.find((cat) => cat.id === categoryId);
    setSelectedCategory(category || null);
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleCustomFieldChange = (fieldId: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      customFields: {
        ...prev.customFields,
        [fieldId]: value,
      },
    }));
    // Clear error for this field
    if (errors[`customFields.${fieldId}`]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[`customFields.${fieldId}`];
        return newErrors;
      });
    }
  };

  const handleReporterInfoChange = (field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      reporterInfo: {
        ...prev.reporterInfo,
        [field]: value,
      },
    }));
  };

  const handleLocationChange = (field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      location: {
        ...prev.location,
        [field]: value,
      },
    }));
  };

  // Validate individual field on blur
  const validateField = (fieldName: string, value?: any): string | undefined => {
    const fieldValue = value !== undefined ? value : formData[fieldName];

    switch (fieldName) {
      case 'title':
        if (!fieldValue || !fieldValue.trim()) {
          return 'Title is required';
        }
        break;

      case 'description':
        if (!fieldValue || !fieldValue.trim()) {
          return 'Description is required';
        }
        break;

      case 'severity':
        if (!fieldValue) {
          return 'Severity is required';
        }
        break;

      case 'category':
        if (!selectedCategory) {
          return 'Category is required';
        }
        break;

      case 'reporterInfo.name':
        if (showReporterInfo && reporterType === 'guest' && !formData.reporterInfo.name) {
          return 'Name is required';
        }
        break;

      case 'reporterInfo.email':
        if (showReporterInfo && reporterType === 'guest') {
          if (!formData.reporterInfo.email) {
            return 'Email is required';
          } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.reporterInfo.email)) {
            return 'Invalid email format';
          }
        }
        break;

      default:
        // Handle custom fields
        if (fieldName.startsWith('customFields.')) {
          const fieldId = fieldName.replace('customFields.', '');
          const customField = selectedCategory?.customFields?.find((f) => f.id === fieldId);

          if (customField) {
            const customValue = formData.customFields[fieldId];

            if (customField.required && !customValue) {
              return `${customField.name} is required`;
            }

            if (customValue) {
              if (customField.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customValue)) {
                return 'Invalid email format';
              }

              if (customField.type === 'phone' && !/^\+?[\d\s\-()]+$/.test(customValue)) {
                return 'Invalid phone number';
              }

              if (customField.type === 'number') {
                const num = Number(customValue);
                if (isNaN(num)) {
                  return 'Must be a number';
                } else if (customField.validation?.min !== undefined && num < customField.validation.min) {
                  return `Must be at least ${customField.validation.min}`;
                } else if (customField.validation?.max !== undefined && num > customField.validation.max) {
                  return `Must be at most ${customField.validation.max}`;
                }
              }
            }
          }
        }
        break;
    }

    return undefined;
  };

  const handleBlur = (fieldName: string) => {
    // Mark field as touched
    setTouchedFields((prev) => new Set(prev).add(fieldName));

    // Validate the field
    const error = validateField(fieldName);

    if (error) {
      setErrors((prev) => ({ ...prev, [fieldName]: error }));
    } else {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Basic fields
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (!formData.severity) {
      newErrors.severity = 'Severity is required';
    }
    if (!selectedCategory) {
      newErrors.category = 'Category is required';
    }

    // Reporter info for guest
    if (showReporterInfo && reporterType === 'guest') {
      if (!formData.reporterInfo.name) {
        newErrors['reporterInfo.name'] = 'Name is required';
      }
      if (!formData.reporterInfo.email) {
        newErrors['reporterInfo.email'] = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.reporterInfo.email)) {
        newErrors['reporterInfo.email'] = 'Invalid email format';
      }
    }

    // Custom fields validation
    if (selectedCategory?.customFields) {
      selectedCategory.customFields.forEach((field) => {
        if (field.required && !formData.customFields[field.id]) {
          newErrors[`customFields.${field.id}`] = `${field.name} is required`;
        }

        // Type-specific validation
        if (formData.customFields[field.id]) {
          const value = formData.customFields[field.id];

          if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            newErrors[`customFields.${field.id}`] = 'Invalid email format';
          }

          if (field.type === 'phone' && !/^\+?[\d\s\-()]+$/.test(value)) {
            newErrors[`customFields.${field.id}`] = 'Invalid phone number';
          }

          if (field.type === 'number') {
            const num = Number(value);
            if (isNaN(num)) {
              newErrors[`customFields.${field.id}`] = 'Must be a number';
            } else if (field.validation?.min !== undefined && num < field.validation.min) {
              newErrors[`customFields.${field.id}`] = `Must be at least ${field.validation.min}`;
            } else if (field.validation?.max !== undefined && num > field.validation.max) {
              newErrors[`customFields.${field.id}`] = `Must be at most ${field.validation.max}`;
            }
          }
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      // Focus management: scroll to and focus the first error field
      const firstErrorField = Object.keys(errors)[0];
      if (firstErrorField && formRefs.current[firstErrorField]) {
        const element = formRefs.current[firstErrorField];
        element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element?.focus();
      }
      return;
    }

    const submitData: Partial<Incident> = {
      title: formData.title,
      description: formData.description,
      severity: formData.severity,
      category: selectedCategory!,
      customFields: formData.customFields,
      location: formData.location,
      reporterType,
      reporterInfo: {
        reporterType,
        ...formData.reporterInfo,
      },
      tags: [],
      assignedTo: [],
    };

    await onSubmit(submitData);
  };

  const renderCustomField = (field: CustomField) => {
    const value = formData.customFields[field.id] || '';
    const error = errors[`customFields.${field.id}`];
    const fieldKey = `customFields.${field.id}`;

    switch (field.type) {
      case 'text':
      case 'email':
      case 'phone':
        return (
          <Input
            key={field.id}
            ref={(el) => (formRefs.current[fieldKey] = el)}
            label={field.name}
            type={field.type === 'email' ? 'email' : field.type === 'phone' ? 'tel' : 'text'}
            value={value}
            onChange={(e) => handleCustomFieldChange(field.id, e.target.value)}
            onBlur={() => handleBlur(fieldKey)}
            error={error}
            placeholder={field.placeholder}
            required={field.required}
            helperText={field.helpText}
          />
        );

      case 'textarea':
        return (
          <Textarea
            key={field.id}
            ref={(el) => (formRefs.current[fieldKey] = el)}
            label={field.name}
            value={value}
            onChange={(e) => handleCustomFieldChange(field.id, e.target.value)}
            onBlur={() => handleBlur(fieldKey)}
            error={error}
            placeholder={field.placeholder}
            required={field.required}
            helperText={field.helpText}
          />
        );

      case 'number':
        return (
          <Input
            key={field.id}
            ref={(el) => (formRefs.current[fieldKey] = el)}
            label={field.name}
            type="number"
            value={value}
            onChange={(e) => handleCustomFieldChange(field.id, e.target.value)}
            onBlur={() => handleBlur(fieldKey)}
            error={error}
            placeholder={field.placeholder}
            required={field.required}
            helperText={field.helpText}
          />
        );

      case 'date':
        return (
          <Input
            key={field.id}
            ref={(el) => (formRefs.current[fieldKey] = el)}
            label={field.name}
            type="date"
            value={value}
            onChange={(e) => handleCustomFieldChange(field.id, e.target.value)}
            onBlur={() => handleBlur(fieldKey)}
            error={error}
            required={field.required}
            helperText={field.helpText}
          />
        );

      case 'select':
        return (
          <Select
            key={field.id}
            ref={(el) => (formRefs.current[fieldKey] = el)}
            label={field.name}
            value={value}
            onChange={(e) => handleCustomFieldChange(field.id, e.target.value)}
            onBlur={() => handleBlur(fieldKey)}
            error={error}
            options={(field.options || []).map((opt) => ({ value: opt, label: opt }))}
            required={field.required}
            helperText={field.helpText}
          />
        );

      case 'boolean':
        return (
          <div key={field.id} className="flex items-center">
            <input
              type="checkbox"
              id={field.id}
              checked={value === true || value === 'true'}
              onChange={(e) => handleCustomFieldChange(field.id, e.target.checked)}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor={field.id} className="ml-2 block text-sm text-gray-700">
              {field.name}
              {field.required && <span className="ml-1 text-danger-600">*</span>}
            </label>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Industry Selection */}
      <Select
        label="Select Industry"
        value={selectedIndustry}
        onChange={(e) => setSelectedIndustry(e.target.value as IndustryType)}
        options={Object.values(INDUSTRY_TYPES).map((type) => ({
          value: type.value,
          label: `${type.icon} ${type.label}`,
        }))}
        error={errors.industry}
        required
      />

      {/* Category Selection */}
      {selectedIndustry && (
        <Select
          label="Incident Category"
          value={selectedCategory?.id || ''}
          onChange={(e) => handleCategoryChange(e.target.value)}
          options={availableCategories.map((cat) => ({
            value: cat.id,
            label: cat.name,
          }))}
          error={errors.category}
          required
          helperText={selectedCategory?.description}
        />
      )}

      {/* Reporter Info (for guest) */}
      {showReporterInfo && reporterType === 'guest' && (
        <div className="space-y-4 rounded-lg border p-4 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900">Your Information</h3>
          <p className="text-sm text-gray-600">
            Provide your contact details so we can follow up with you about this incident.
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              ref={(el) => (formRefs.current['reporterInfo.name'] = el)}
              label="Full Name"
              value={formData.reporterInfo.name || ''}
              onChange={(e) => handleReporterInfoChange('name', e.target.value)}
              onBlur={() => handleBlur('reporterInfo.name')}
              error={errors['reporterInfo.name']}
              placeholder="John Doe"
              required
            />

            <Input
              ref={(el) => (formRefs.current['reporterInfo.email'] = el)}
              label="Email"
              type="email"
              value={formData.reporterInfo.email || ''}
              onChange={(e) => handleReporterInfoChange('email', e.target.value)}
              onBlur={() => handleBlur('reporterInfo.email')}
              error={errors['reporterInfo.email']}
              placeholder="john.doe@example.com"
              required
            />

            <Input
              label="Phone (Optional)"
              type="tel"
              value={formData.reporterInfo.phone || ''}
              onChange={(e) => handleReporterInfoChange('phone', e.target.value)}
              placeholder="+1 234 567 8900"
            />

            <Input
              label="Relationship (Optional)"
              value={formData.reporterInfo.relationship || ''}
              onChange={(e) => handleReporterInfoChange('relationship', e.target.value)}
              placeholder="Employee, Customer, Visitor, etc."
            />
          </div>
        </div>
      )}

      {/* Basic Incident Details */}
      {selectedCategory && (
        <>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Incident Details</h3>

            <Input
              ref={(el) => (formRefs.current['title'] = el)}
              label="Incident Title"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              onBlur={() => handleBlur('title')}
              error={errors.title}
              placeholder="Brief summary of the incident"
              required
            />

            <Textarea
              ref={(el) => (formRefs.current['description'] = el)}
              label="Description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              onBlur={() => handleBlur('description')}
              error={errors.description}
              placeholder="Provide detailed information about what happened..."
              rows={6}
              required
              helperText="Be as specific as possible. Include what happened, when it happened, and any immediate actions taken."
            />

            <Select
              ref={(el) => (formRefs.current['severity'] = el)}
              label="Severity"
              value={formData.severity}
              onChange={(e) => handleChange('severity', e.target.value)}
              onBlur={() => handleBlur('severity')}
              options={[
                { value: 'low', label: 'Low - Minor issue with minimal impact' },
                { value: 'medium', label: 'Medium - Moderate issue requiring attention' },
                { value: 'high', label: 'High - Serious issue requiring urgent attention' },
                { value: 'critical', label: 'Critical - Emergency requiring immediate action' },
              ]}
              error={errors.severity}
              required
            />
          </div>

          {/* Custom Fields */}
          {selectedCategory.customFields && selectedCategory.customFields.length > 0 && (
            <div className="space-y-4 rounded-lg border p-4 bg-blue-50">
              <h3 className="text-lg font-semibold text-gray-900">
                Additional Information - {selectedCategory.name}
              </h3>
              <p className="text-sm text-gray-600">
                Please provide the following information specific to this type of incident:
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                {selectedCategory.customFields.map((field) => renderCustomField(field))}
              </div>
            </div>
          )}

          {/* Location Information */}
          <div className="space-y-4 rounded-lg border p-4">
            <h3 className="text-lg font-semibold text-gray-900">Location (Optional)</h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Facility/Building"
                value={formData.location.facility || ''}
                onChange={(e) => handleLocationChange('facility', e.target.value)}
                placeholder="Main Building, Warehouse, etc."
              />

              <Input
                label="Department/Area"
                value={formData.location.department || ''}
                onChange={(e) => handleLocationChange('department', e.target.value)}
                placeholder="Production, Office, etc."
              />

              <Input
                label="Room/Zone"
                value={formData.location.room || ''}
                onChange={(e) => handleLocationChange('room', e.target.value)}
                placeholder="Room 101, Zone A, etc."
              />

              <Textarea
                label="Additional Details"
                value={formData.location.details || ''}
                onChange={(e) => handleLocationChange('details', e.target.value)}
                placeholder="Any additional location information..."
                rows={2}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-between pt-4 border-t">
            <p className="text-sm text-gray-500">
              <span className="text-danger-600">*</span> Required fields
            </p>
            <Button type="submit" size="lg" isLoading={isLoading}>
              Submit Incident Report
            </Button>
          </div>
        </>
      )}
    </form>
  );
}
