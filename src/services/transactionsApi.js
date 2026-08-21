/**
 * GigLedger Backend Transactions API Client
 * POST /api/transactions body per docs/endpoints.json:
 *   { type: 'income'|'expense', amount, date, rawDescription?, source? }
 */
import { apiRequest } from './apiClient.js';

export const transactionsApi = {
  /**
   * @param {Object} params
   * @param {'income'|'expense'} params.type
   * @param {number} params.amount
   * @param {string} params.date - ISO date string (YYYY-MM-DD)
   * @param {string} [params.rawDescription]
   * @param {string} [params.source] - only meaningful for income
   * @returns {Promise<{ data: Object, message: string }>}
   */
  async create({ type, amount, date, rawDescription, source }) {
    return apiRequest('/api/transactions', {
      method: 'POST',
      body: {
        type,
        amount,
        date,
        ...(rawDescription ? { rawDescription } : {}),
        ...(type === 'income' && source ? { source } : {}),
      },
    });
  },

  /**
   * GET /api/transactions — paginated + filtered list, scoped to the caller.
   * @param {Object} [params]
   * @param {'income'|'expense'} [params.type]
   * @param {'pending'|'categorized'|'reconciled'} [params.status]
   * @param {number} [params.page]
   * @param {number} [params.limit] - max 100 per docs/endpoints.json
   * @returns {Promise<{ data: { items: Array, page, limit, total, totalPages }, message: string }>}
   */
  async list({ type, status, page, limit } = {}) {
    const params = new URLSearchParams();
    if (type) params.set('type', type);
    if (status) params.set('status', status);
    if (page) params.set('page', String(page));
    if (limit) params.set('limit', String(limit));
    const qs = params.toString();
    return apiRequest(`/api/transactions${qs ? `?${qs}` : ''}`);
  },

  /**
   * Fetches every page of a filtered transaction list (up to a safety cap),
   * for client-side aggregation (e.g. category breakdown charts).
   */
  async listAll({ type, status, maxPages = 10 } = {}) {
    const limit = 100;
    let page = 1;
    let all = [];
    for (; page <= maxPages; page += 1) {
      const result = await transactionsApi.list({ type, status, page, limit });
      const { items = [], totalPages = 1 } = result?.data || {};
      all = all.concat(items);
      if (page >= totalPages) break;
    }
    return all;
  },
};
