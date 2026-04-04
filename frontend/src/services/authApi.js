import { API_BASE_URL, AUTH_ENABLED, STORAGE_KEYS } from '../config';

const DEMO_USER = {
  id: 'guest-user',
  name: 'Guest Pilot',
  email: 'guest@local.demo',
};

function demoAuthResponse() {
  localStorage.setItem(STORAGE_KEYS.token, 'guest-session');
  localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(DEMO_USER));

  return {
    success: true,
    token: 'guest-session',
    user: DEMO_USER,
  };
}

/**
 * Register a new user
 */
export async function register(email, password, name) {
  if (!AUTH_ENABLED) {
    return demoAuthResponse();
  }

  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password, name }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Registration failed');
  }

  return data;
}

/**
 * Login user
 */
export async function login(email, password) {
  if (!AUTH_ENABLED) {
    return demoAuthResponse();
  }

  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Login failed');
  }

  return data;
}

/**
 * Get current user
 */
export async function getCurrentUser(token) {
  if (!AUTH_ENABLED) {
    return { user: DEMO_USER };
  }

  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to get user');
  }

  return data;
}
