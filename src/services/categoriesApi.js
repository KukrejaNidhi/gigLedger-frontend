/**
 * GigLedger Backend Categories API Client
 * GET /api/categories — master list, optionally filtered by type (docs/endpoints.json)
 *
 * Timing: this list barely ever changes, so results are cached in-memory per
 * `type` key for the lifetime of the tab — call `list()` freely from any
 * screen without worrying about re-fetching. Cache is cleared on logout.
 */
import { apiRequest } from './apiClient.js';

let cache = new Map(); // key: type || 'all' -> Promise<result>

export const categoriesApi = {
  /**
   * @param {Object} [params]
   * @param {'income'|'expense'} [params.type]
   * @param {boolean} [params.forceRefresh] - bypass the cache
   * @returns {Promise<{ data: Array<{_id, name, type, color, icon}>, message: string }>}
   */
  async list({ type, forceRefresh = false } = {}) {
    const key = type || 'all';
    if (forceRefresh) cache.delete(key);
    if (cache.has(key)) return cache.get(key);

    const qs = type ? `?type=${encodeURIComponent(type)}` : '';
    const promise = apiRequest(`/api/categories${qs}`).catch((err) => {
      cache.delete(key); // don't cache a failed fetch
      throw err;
    });
    cache.set(key, promise);
    return promise;
  },

  /** Clears the in-memory cache — call on logout so a new session doesn't inherit stale data. */
  clearCache() {
    cache = new Map();
  },
};
