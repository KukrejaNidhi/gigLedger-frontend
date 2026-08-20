/**
 * GigLedger Backend Authentication API Client
 * Integrates the passwordless email-OTP register/login endpoints:
 * - POST /api/auth/register
 * - POST /api/auth/register/verify
 * - POST /api/auth/login
 * - POST /api/auth/login/verify
 * - POST /api/auth/resend-otp
 * - POST /api/auth/refresh
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

/**
 * Generic request helper with JSON parsing and normalized error extraction
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const config = {
    ...options,
    headers,
  };

  if (options.body && typeof options.body === 'object') {
    config.body = JSON.stringify(options.body);
  }

  let response;
  try {
    response = await fetch(url, config);
  } catch (networkError) {
    throw new Error(
      'Unable to connect to GigLedger authentication server. Please ensure the backend is running at http://localhost:5000.'
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
      data?.error ||
      data?.errors?.[0]?.msg ||
      `Server responded with status ${response.status}`;
    const error = new Error(errorMsg);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const authApi = {
  /**
   * Request passwordless registration OTP code
   * @param {Object} params
   * @param {string} params.firstName
   * @param {string} params.lastName
   * @param {string} params.email
   * @returns {Promise<{ data: { pendingSessionId: string }, message: string }>}
   */
  async register({ firstName, lastName, email }) {
    return request('/api/auth/register', {
      method: 'POST',
      body: { firstName, lastName, email },
    });
  },

  /**
   * Verify 6-digit OTP code for registration
   * @param {Object} params
   * @param {string} params.pendingSessionId
   * @param {string} params.code
   * @returns {Promise<{ data: { token: string, user: Object }, message: string }>}
   */
  async verifyRegistration({ pendingSessionId, code }) {
    return request('/api/auth/register/verify', {
      method: 'POST',
      body: { pendingSessionId, code },
    });
  },

  /**
   * Request passwordless login OTP code
   * @param {Object} params
   * @param {string} params.email
   * @returns {Promise<{ data: { pendingSessionId: string }, message: string }>}
   */
  async login({ email }) {
    return request('/api/auth/login', {
      method: 'POST',
      body: { email },
    });
  },

  /**
   * Verify 6-digit OTP code for login
   * @param {Object} params
   * @param {string} params.pendingSessionId
   * @param {string} params.code
   * @returns {Promise<{ data: { token: string, user: Object }, message: string }>}
   */
  async verifyLogin({ pendingSessionId, code }) {
    return request('/api/auth/login/verify', {
      method: 'POST',
      body: { pendingSessionId, code },
    });
  },

  /**
   * Resend 6-digit OTP code
   * @param {Object} params
   * @param {string} params.pendingSessionId
   * @returns {Promise<{ data: Object, message: string }>}
   */
  async resendOtp({ pendingSessionId }) {
    return request('/api/auth/resend-otp', {
      method: 'POST',
      body: { pendingSessionId },
    });
  },

  /**
   * Refresh JWT authentication token
   * @param {string} token
   * @returns {Promise<{ data: { token: string, user: Object }, message: string }>}
   */
  async refresh(token) {
    return request('/api/auth/refresh', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};
