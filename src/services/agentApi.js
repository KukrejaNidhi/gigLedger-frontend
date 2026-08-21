/**
 * GigLedger Backend Agent API Client
 * The categorize workflow is propose-then-approve, per docs/endpoints.json's
 * sibling agent routes (not in endpoints.json itself, confirmed against the
 * live backend's src/routes/agent.routes.js):
 *   POST /api/agent/run                     — proposes categorize tasks for
 *                                              the caller's pending transactions
 *   PATCH /api/agent/tasks/:id/approve       — applies a proposed task's
 *                                              category to its transaction
 */
import { apiRequest } from './apiClient.js';

export const agentApi = {
  /** @returns {Promise<{ data: { tasks: Array, count: number }, message: string }>} */
  async run() {
    return apiRequest('/api/agent/run', { method: 'POST' });
  },

  /** @returns {Promise<{ data: { transaction: Object, auditLog: Object }, message: string }>} */
  async approveTask(taskId) {
    return apiRequest(`/api/agent/tasks/${taskId}/approve`, { method: 'PATCH' });
  },
};
