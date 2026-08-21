/**
 * GigLedger Backend Receipts API Client
 * POST /api/receipts/upload — multipart form field "receipt" (jpeg, png, or webp).
 * Runs Gemini OCR server-side and returns extracted transaction fields.
 */
import { apiRequest } from './apiClient.js';

export const receiptsApi = {
  /**
   * @param {File} file
   * @returns {Promise<{ data: Object, message: string }>}
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
