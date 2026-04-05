export const AUTH_ENABLED = import.meta.env.VITE_ENABLE_AUTH === 'true';

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV ? 'http://localhost:8888/.netlify/functions' : '/.netlify/functions');

export const STORAGE_KEYS = {
  missions: 'drone-mission-planner.missions',
  users: 'drone-mission-planner.users',
  token: 'token',
  user: 'user',
};
