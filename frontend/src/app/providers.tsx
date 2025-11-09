'use client';

// ============================================
// APP PROVIDERS
// ============================================

import { useEffect, useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [mswReady, setMswReady] = useState(false);

  useEffect(() => {
    // Initialize MSW in development
    if (process.env.NODE_ENV === 'development') {
      import('@/mocks/browser').then(({ worker }) => {
        worker.start({
          onUnhandledRequest: 'bypass',
        }).then(() => {
          console.log('[MSW] Mock Service Worker started');
          setMswReady(true);
        });
      });
    } else {
      setMswReady(true);
    }
  }, []);

  // Show loading state while MSW initializes
  if (!mswReady) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-600 border-r-transparent"></div>
          <p className="text-gray-600">Initializing...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
