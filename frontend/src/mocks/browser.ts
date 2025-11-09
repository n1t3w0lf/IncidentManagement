// ============================================
// MSW BROWSER SETUP
// ============================================

import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

// Setup requests interception using the given handlers
export const worker = setupWorker(...handlers);

// Start the worker in development mode
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  worker.start({
    onUnhandledRequest: 'bypass',
    serviceWorker: {
      url: '/mockServiceWorker.js',
    },
  });
}
