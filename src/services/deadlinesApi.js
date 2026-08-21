/**
 * GigLedger Backend Deadlines API Client
 * Cheap, read-only, no LLM involved — safe to call on every relevant screen
 * open/refresh (GET list/:id). POST /run is cheap too (no LLM), but is still
 * only called from an explicit "Check for reminders now" action, not
 * automatically, since it's a write.
 */
import { apiRequest } from './apiClient.js';

export const deadlinesApi = {
  /**
   * @param {Object} [params]
   * @param {'upcoming'|'completed'} [params.status]
   * @returns {Promise<{ data: { items: Array }, message: string }>}
   */
  async list({ status } = {}) {
    const qs = status ? `?status=${encodeURIComponent(status)}` : '';
    return apiRequest(`/api/deadlines${qs}`);
  },

  /** GET /api/deadlines/:id */
  async get(id) {
    return apiRequest(`/api/deadlines/${id}`);
  },

  /** PATCH /api/deadlines/:id/complete */
  async complete(id) {
    return apiRequest(`/api/deadlines/${id}/complete`, { method: 'PATCH' });
  },

  /** POST /api/deadlines/run — (re)generates the standard statutory set. */
  async run() {
    return apiRequest('/api/deadlines/run', { method: 'POST' });
  },
};
