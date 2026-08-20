/**
 * GitLedgers Storage & Cookie Utility
 * Manages persistent user sessions, tokens, remembered emails, and theme preferences.
 */

// Helper to set cookie
export function setCookie(name, value, days = 7) {
  try {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
  } catch (e) {
    console.warn('Could not set cookie', e);
  }
}

// Helper to get cookie
export function getCookie(name) {
  try {
    const nameEQ = `${encodeURIComponent(name)}=`;
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i].trim();
      if (c.indexOf(nameEQ) === 0) {
        return decodeURIComponent(c.substring(nameEQ.length));
      }
    }
  } catch (e) {
    console.warn('Could not get cookie', e);
  }
  return null;
}

// Helper to remove cookie
export function deleteCookie(name) {
  try {
    document.cookie = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`;
  } catch (e) {
    console.warn('Could not delete cookie', e);
  }
}

const AUTH_USER_KEY = 'gitledgers_auth_user';
const AUTH_TOKEN_KEY = 'gitledgers_auth_token';
const REMEMBERED_EMAIL_KEY = 'gitledgers_remembered_email';
const THEME_KEY = 'gitledgers_theme';

export const storage = {
  // Authentication Session
  getAuthSession() {
    try {
      const userJson = localStorage.getItem(AUTH_USER_KEY) || getCookie(AUTH_USER_KEY);
      const token = localStorage.getItem(AUTH_TOKEN_KEY) || getCookie(AUTH_TOKEN_KEY);
      if (userJson && token) {
        return {
          user: JSON.parse(userJson),
          token,
        };
      }
    } catch (e) {
      console.warn('Error reading auth session:', e);
    }
    return null;
  },

  setAuthSession(user, token = `gl_tok_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`) {
    try {
      const userStr = JSON.stringify(user);
      localStorage.setItem(AUTH_USER_KEY, userStr);
      localStorage.setItem(AUTH_TOKEN_KEY, token);
      setCookie(AUTH_USER_KEY, userStr, 7);
      setCookie(AUTH_TOKEN_KEY, token, 7);
    } catch (e) {
      console.warn('Error saving auth session:', e);
    }
  },

  clearAuthSession() {
    try {
      localStorage.removeItem(AUTH_USER_KEY);
      localStorage.removeItem(AUTH_TOKEN_KEY);
      deleteCookie(AUTH_USER_KEY);
      deleteCookie(AUTH_TOKEN_KEY);
    } catch (e) {
      console.warn('Error clearing auth session:', e);
    }
  },

  // Remembered Email
  getRememberedEmail() {
    try {
      return localStorage.getItem(REMEMBERED_EMAIL_KEY) || getCookie(REMEMBERED_EMAIL_KEY) || '';
    } catch {
      return '';
    }
  },

  setRememberedEmail(email) {
    try {
      if (email) {
        localStorage.setItem(REMEMBERED_EMAIL_KEY, email);
        setCookie(REMEMBERED_EMAIL_KEY, email, 30);
      } else {
        localStorage.removeItem(REMEMBERED_EMAIL_KEY);
        deleteCookie(REMEMBERED_EMAIL_KEY);
      }
    } catch (e) {
      console.warn('Error setting remembered email:', e);
    }
  },

  // Theme Preference
  getThemePref() {
    try {
      const val = localStorage.getItem(THEME_KEY);
      if (val !== null) return val === 'dark';
    } catch {}
    // Default to false (light) or system preference
    return false;
  },

  setThemePref(isDark) {
    try {
      localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light');
    } catch (e) {
      console.warn('Error setting theme preference:', e);
    }
  },
};
