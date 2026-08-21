/**
 * GigLedger Backend Tax API Client
 * GET /api/tax/estimate — real RAG + Gemini call, can take several seconds.
 * Per the timing contract: only ever called on-demand (explicit screen open /
 * quarter switch / "Refresh estimate" tap) — never automatically, never on
 * every transaction change. Caching is the caller's responsibility (the
 * TaxEstimateSection component keeps one cached result per period in state).
 */
import { apiRequest } from './apiClient.js';
import { storage } from '../utils/storage.js';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export const taxApi = {
  /**
   * @param {Object} params
   * @param {string} params.period - e.g. "Q2-2024-25"
   * @param {boolean} [params.refresh] - bypass the backend's own cache too
   * @returns {Promise<{ data: Object, message: string }>}
   */
  async getEstimate({ period, refresh = false }) {
    const qs = new URLSearchParams({ period, ...(refresh ? { refresh: 'true' } : {}) });
    return apiRequest(`/api/tax/estimate?${qs.toString()}`);
  },

  /**
   * GET /api/tax/export — only ever called after a successful getEstimate()
   * for the same period (the caller is responsible for only showing the
   * download buttons once that's true). Triggers a real browser download —
   * not a JSON fetch — by pulling the file as a blob (so the auth header can
   * be attached) and clicking a throwaway object-URL anchor.
   * @param {Object} params
   * @param {string} params.period
   * @param {'pdf'|'excel'} params.format
   */
  async downloadExport({ period, format }) {
    const token = storage.getAuthToken();
    const qs = new URLSearchParams({ period, format });
    const response = await fetch(`${API_BASE_URL}/api/tax/export?${qs.toString()}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    if (!response.ok) {
      let message = `Export failed with status ${response.status}`;
      try {
        const data = await response.json();
        message = data?.message || message;
      } catch {
        // response wasn't JSON (e.g. a raw file on success path never reaches here)
      }
      throw new Error(message);
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const ext = format === 'pdf' ? 'pdf' : 'xlsx';
    const a = document.createElement('a');
    a.href = url;
    a.download = `gigledger-tax-estimate-${period}.${ext}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  },
};

/**
 * Indian fiscal-year quarters (Apr-Jun, Jul-Sep, Oct-Dec, Jan-Mar), matching
 * the backend's required `Q[1-4]-YYYY-YY` period format.
 */
export function currentTaxPeriod(date = new Date()) {
  const month = date.getMonth(); // 0-11
  const year = date.getFullYear();
  // Fiscal year starts in April (month index 3)
  const fyStartYear = month >= 3 ? year : year - 1;
  const quarter = Math.floor(((month + 12 - 3) % 12) / 3) + 1; // Apr-Jun=1 ... Jan-Mar=4
  const fyLabel = `${fyStartYear}-${String((fyStartYear + 1) % 100).padStart(2, '0')}`;
  return `Q${quarter}-${fyLabel}`;
}

/** Last 4 fiscal quarters (current + 3 prior), newest first, for the period picker. */
export function recentTaxPeriods(date = new Date()) {
  const periods = [];
  const cursor = new Date(date);
  for (let i = 0; i < 4; i += 1) {
    periods.push(currentTaxPeriod(cursor));
    cursor.setMonth(cursor.getMonth() - 3);
  }
  return periods;
}
