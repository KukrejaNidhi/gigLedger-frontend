/**
 * Shared authenticated request helper for GigLedger backend routes that require
 * a Bearer token (everything except /api/auth/*, which has its own client).
 */
import { storage } from '../utils/storage.js';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = storage.getAuthToken();

  const isFormData = options.body instanceof FormData;

  const headers = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const config = { ...options, headers };

  if (options.body && typeof options.body === 'object' && !isFormData) {
    config.body = JSON.stringify(options.body);
  }

  let response;
  try {
    response = await fetch(url, config);
  } catch (networkError) {
    throw new Error(
      'Unable to connect to GigLedger server. Please ensure the backend is running at ' +
        (API_BASE_URL || 'http://localhost:5000') + '.'
    );
  }

  let data;
  try {
    data = await response.json();
  } catch (jsonError) {
    data = null;
  }

  if (!response.ok) {
    const errorMsg =
      data?.message ||
      data?.errors?.[0]?.message ||
      data?.errors?.[0] ||
      `Server responded with status ${response.status}`;
    const error = new Error(errorMsg);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}
