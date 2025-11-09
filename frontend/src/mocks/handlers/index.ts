// ============================================
// MSW HANDLERS - Export all handlers
// ============================================

import { authHandlers } from './auth';
import { incidentHandlers } from './incidents';
import { approvalHandlers } from './approvals';
import { notificationHandlers } from './notifications';
import { userHandlers } from './users';

export const handlers = [
  ...authHandlers,
  ...incidentHandlers,
  ...approvalHandlers,
  ...notificationHandlers,
  ...userHandlers,
];
