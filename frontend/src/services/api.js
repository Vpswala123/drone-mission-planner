import { AUTH_ENABLED, API_BASE_URL, STORAGE_KEYS } from '../config';
import { createDemoMission } from './demoAnalysis';

async function parseResponse(response, fallbackMessage) {
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.error || fallbackMessage);
  }

  return data;
}

function getAuthHeaders() {
  const token = localStorage.getItem(STORAGE_KEYS.token);
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.user) || 'null');
  } catch {
    localStorage.removeItem(STORAGE_KEYS.user);
    return null;
  }
}

function getMissionStorageKey(userId) {
  return `${STORAGE_KEYS.missions}.${userId}`;
}

function loadStoredMissions() {
  const user = getStoredUser();

  if (!user?.id) {
    return [];
  }

  try {
    return JSON.parse(localStorage.getItem(getMissionStorageKey(user.id)) || '[]');
  } catch {
    localStorage.removeItem(getMissionStorageKey(user.id));
    return [];
  }
}

function storeMissions(missions) {
  const user = getStoredUser();

  if (!user?.id) {
    throw new Error('Please sign in to save mission history');
  }

  localStorage.setItem(getMissionStorageKey(user.id), JSON.stringify(missions));
}

export async function analyzeMission(missionData) {
  if (!AUTH_ENABLED) {
    const user = getStoredUser();
    const mission = createDemoMission(missionData);

    if (!user?.id) {
      return {
        success: true,
        mission,
        persisted: false,
        message: 'Sign in to save this mission to your history.',
      };
    }

    const missions = [mission, ...loadStoredMissions()];
    storeMissions(missions);
    return {
      success: true,
      mission,
      persisted: true,
    };
  }

  const response = await fetch(`${API_BASE_URL}/missions/analyze`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(missionData),
  });

  return parseResponse(response, 'Failed to analyze mission');
}

export async function getMissions() {
  if (!AUTH_ENABLED) {
    return { missions: loadStoredMissions() };
  }

  const response = await fetch(`${API_BASE_URL}/missions/list`, {
    headers: getAuthHeaders(),
  });

  return parseResponse(response, 'Failed to fetch missions');
}

export async function deleteMission(id) {
  if (!AUTH_ENABLED) {
    const missions = loadStoredMissions().filter((mission) => mission.id !== id);
    storeMissions(missions);
    return { success: true };
  }

  const response = await fetch(`${API_BASE_URL}/missions/delete/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  return parseResponse(response, 'Failed to delete mission');
}
