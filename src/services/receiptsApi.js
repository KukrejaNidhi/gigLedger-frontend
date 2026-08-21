/**
 * GigLedger Backend Receipts API Client
 * POST /api/receipts/upload — multipart form field "receipt" (jpeg, png, or webp).
 * Runs Gemini OCR server-side and returns a suggested (not yet saved)
 * expense: { amount, date, rawDescription, category: {id,name}|null,
 * confidence: 'high'|'low' }. No `type`/`source` — a scanned receipt is
 * always an expense.
 */
import { apiRequest } from './apiClient.js';

export const receiptsApi = {
  /**
   * @param {File} file
   * @returns {Promise<{ data: { amount: number|null, date: string, rawDescription: string, category: {id:string,name:string}|null, confidence: 'high'|'low' }, message: string }>}
   */
  async upload(file) {
    const formData = new FormData();
    formData.append('receipt', file);
    return apiRequest('/api/receipts/upload', {
      method: 'POST',
      body: formData,
    });
  },
};
