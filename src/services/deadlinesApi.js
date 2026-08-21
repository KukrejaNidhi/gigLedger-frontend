/**
 * GigLedger Backend Deadlines API Client
 * Cheap, read-only, no LLM involved — safe to call on every relevant screen
 * open/refresh (GET list/:id; list also syncs server-side on every call, no
 * separate "setup" step needed). POST /run is cheap too (no LLM — it's the
 * on-demand equivalent of the nightly cron), but is still only called from
 * an explicit "Check for reminders now" action, not automatically, since
 * it's a write and can propose new agent-inbox notifications.
 *
 * The backend doesn't support server-side status filtering (no `status`
 * query param) — list() always returns every deadline; filter client-side.
 * Status is one of 'upcoming' | 'due_soon' | 'overdue' | 'completed',
 * computed server-side on every sync — never recompute it from dueDate
 * client-side, the server's window (15 days) is the source of truth.
 */
import { apiRequest } from './apiClient.js';

export const deadlinesApi = {
  /** @returns {Promise<{ data: Array, message: string }>} data is a plain array, not { items } */
  async list() {
    return apiRequest('/api/deadlines');
  },

  /** GET /api/deadlines/:id */
  async get(id) {
    return apiRequest(`/api/deadlines/${id}`);
  },

  /** PATCH /api/deadlines/:id/complete */
  async complete(id) {
    return apiRequest(`/api/deadlines/${id}/complete`, { method: 'PATCH' });
  },

  /**
   * POST /api/deadlines/run — syncs deadlines then proposes agent-inbox
   * notifications for anything newly due_soon.
   * @returns {Promise<{ data: { deadlines: Array, notified: Array, notifiedCount: number }, message: string }>}
   */
  async run() {
    return apiRequest('/api/deadlines/run', { method: 'POST' });
  },
};
