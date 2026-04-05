import { API_BASE_URL, AUTH_ENABLED, STORAGE_KEYS } from '../config';

function normalizeEmail(email) {
  return typeof email === 'string' ? email.trim().toLowerCase() : '';
}

function loadLocalUsers() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.users) || '[]');
  } catch {
    localStorage.removeItem(STORAGE_KEYS.users);
    return [];
  }
}

function storeLocalUsers(users) {
  localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(users));
}

function createLocalSession(user) {
  const token = `local-session:${user.id}`;
  const safeUser = {
    id: user.id,
    name: user.name,
    email: user.email,
  };

  localStorage.setItem(STORAGE_KEYS.token, token);
  localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(safeUser));

  return {
    success: true,
    token,
    user: safeUser,
  };
}

function registerLocalUser(email, password, name) {
  const normalizedEmail = normalizeEmail(email);
  const trimmedName = typeof name === 'string' ? name.trim() : '';

  if (!normalizedEmail || !password) {
    throw new Error('Email and password are required');
  }

  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters');
  }

  const users = loadLocalUsers();
  if (users.some((user) => user.email === normalizedEmail)) {
    throw new Error('User already exists');
  }

  const user = {
    id: `local-user-${Date.now()}`,
    email: normalizedEmail,
    password,
    name: trimmedName || normalizedEmail.split('@')[0],
    createdAt: new Date().toISOString(),
  };

  users.push(user);
  storeLocalUsers(users);

  return createLocalSession(user);
}

function loginLocalUser(email, password) {
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail || !password) {
    throw new Error('Email and password are required');
  }

  const users = loadLocalUsers();
  const user = users.find((entry) => entry.email === normalizedEmail);

  if (!user || user.password !== password) {
    throw new Error('Invalid credentials');
  }

  return createLocalSession(user);
}

/**
 * Register a new user
 */
export async function register(email, password, name) {
  if (!AUTH_ENABLED) {
    return registerLocalUser(email, password, name);
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
    return loginLocalUser(email, password);
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
    const storedUser = localStorage.getItem(STORAGE_KEYS.user);
    if (!storedUser) {
      throw new Error('No active session');
    }

    return { user: JSON.parse(storedUser) };
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
