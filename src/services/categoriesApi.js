/**
 * GigLedger Backend Categories API Client
 * GET /api/categories — master list, optionally filtered by type (docs/endpoints.json)
 */
import { apiRequest } from './apiClient.js';

export const categoriesApi = {
  /**
   * @param {Object} [params]
   * @param {'income'|'expense'} [params.type]
   * @returns {Promise<{ data: Array<{_id, name, type, color, icon}>, message: string }>}
   */
  async list({ type } = {}) {
    const qs = type ? `?type=${encodeURIComponent(type)}` : '';
    return apiRequest(`/api/categories${qs}`);
  },
};
