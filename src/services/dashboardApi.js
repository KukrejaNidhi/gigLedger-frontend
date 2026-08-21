/**
 * GigLedger Backend Dashboard API Client
 * Cheap, read-only, no LLM involved — safe on every relevant screen open,
 * same as categories/transactions/deadlines.
 */
import { apiRequest } from './apiClient.js';

export const dashboardApi = {
  /** @param {string} [month] - YYYY-MM, defaults to the current month server-side */
  async summary(month) {
    const qs = month ? `?month=${encodeURIComponent(month)}` : '';
    return apiRequest(`/api/dashboard/summary${qs}`);
  },

  /** @param {string} [month] */
  async incomeBySource(month) {
    const qs = month ? `?month=${encodeURIComponent(month)}` : '';
    return apiRequest(`/api/dashboard/income-by-source${qs}`);
  },

  /** @param {string} [month] */
  async expenseByCategory(month) {
    const qs = month ? `?month=${encodeURIComponent(month)}` : '';
    return apiRequest(`/api/dashboard/expense-by-category${qs}`);
  },

  /** @param {number} [months] - 1-24, defaults to 6 server-side */
  async monthlyTrend(months) {
    const qs = months ? `?months=${months}` : '';
    return apiRequest(`/api/dashboard/monthly-trend${qs}`);
  },

  /** Always "this financial year" — no params. */
  async taxSavings() {
    return apiRequest('/api/dashboard/tax-savings');
  },
};
