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

function loadStoredMissions() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.missions) || '[]');
  } catch {
    localStorage.removeItem(STORAGE_KEYS.missions);
    return [];
  }
}

function storeMissions(missions) {
  localStorage.setItem(STORAGE_KEYS.missions, JSON.stringify(missions));
}

/**
 * Analyze a mission
 */
export async function analyzeMission(missionData) {
  if (!AUTH_ENABLED) {
    const mission = createDemoMission(missionData);
    const missions = [mission, ...loadStoredMissions()];
    storeMissions(missions);
    return { success: true, mission };
  }

  const response = await fetch(`${API_BASE_URL}/missions/analyze`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(missionData),
  });

  return parseResponse(response, 'Failed to analyze mission');
}

/**
 * Get all missions for current user
 */
export async function getMissions() {
  if (!AUTH_ENABLED) {
    return { missions: loadStoredMissions() };
  }

  const response = await fetch(`${API_BASE_URL}/missions/list`, {
    headers: getAuthHeaders(),
  });

  return parseResponse(response, 'Failed to fetch missions');
}

/**
 * Delete a mission
 */
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
