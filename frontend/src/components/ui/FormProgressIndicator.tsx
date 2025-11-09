'use client';

// ============================================
// FORM PROGRESS INDICATOR COMPONENT
// ============================================

interface FormSection {
  name: string;
  completed: boolean;
}

interface FormProgressIndicatorProps {
  sections: FormSection[];
  className?: string;
}

export function FormProgressIndicator({ sections, className = '' }: FormProgressIndicatorProps) {
  const completedCount = sections.filter((s) => s.completed).length;
  const totalCount = sections.length;
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className={`sticky top-20 z-10 bg-white border rounded-lg p-4 shadow-sm ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-900">Form Progress</h3>
        <span className="text-sm font-bold text-primary-600">{percentage}%</span>
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
          <div
            className="bg-primary-600 h-2.5 rounded-full transition-all duration-300 ease-in-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-2">
        {sections.map((section, index) => (
          <div key={index} className="flex items-center space-x-2">
            {section.completed ? (
              <svg
                className="w-4 h-4 text-success-600 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                className="w-4 h-4 text-gray-300 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            <span
              className={`text-sm ${
                section.completed ? 'text-gray-900 font-medium' : 'text-gray-500'
              }`}
            >
              {section.name}
            </span>
          </div>
        ))}
      </div>

      {/* Completion Message */}
      {percentage === 100 && (
        <div className="mt-3 pt-3 border-t">
          <p className="text-xs text-success-600 font-medium">
            All required sections completed!
          </p>
        </div>
      )}
    </div>
  );
}
