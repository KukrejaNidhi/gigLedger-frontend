/**
 * GigLedger Backend Agent API Client — the categorize workflow is
 * propose-then-approve (confirmed against the live backend's
 * src/routes/agent.routes.js):
 *   POST /api/agent/run                      — proposes categorize tasks for
 *                                               the caller's pending
 *                                               transactions (LLM-backed —
 *                                               only ever call this from an
 *                                               explicit user action, e.g. a
 *                                               "Categorize my transactions"
 *                                               button, never automatically)
 *   GET /api/agent/tasks?status=proposed      — list the current inbox
 *   PATCH /api/agent/tasks/:id/approve|reject — user resolves one suggestion
 */
import { apiRequest } from './apiClient.js';

export const agentApi = {
  /** @returns {Promise<{ data: { tasks: Array, count: number }, message: string }>} */
  async run() {
    return apiRequest('/api/agent/run', { method: 'POST' });
  },

  /**
   * @param {Object} [params]
   * @param {'proposed'|'approved'|'rejected'|'auto_applied'} [params.status]
   * @param {number} [params.page]
   * @param {number} [params.limit]
   */
  async listTasks({ status = 'proposed', page, limit } = {}) {
    const params = new URLSearchParams({ status });
    if (page) params.set('page', String(page));
    if (limit) params.set('limit', String(limit));
    return apiRequest(`/api/agent/tasks?${params.toString()}`);
  },

  /** @returns {Promise<{ data: { transaction: Object, auditLog: Object }, message: string }>} */
  async approveTask(taskId) {
    return apiRequest(`/api/agent/tasks/${taskId}/approve`, { method: 'PATCH' });
  },

  /** @returns {Promise<{ data: { _id: string, status: string }, message: string }>} */
  async rejectTask(taskId) {
    return apiRequest(`/api/agent/tasks/${taskId}/reject`, { method: 'PATCH' });
  },
};
