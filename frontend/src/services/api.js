// API URL - uses relative path for Netlify Functions
const API_URL = import.meta.env.DEV ? 'http://localhost:3001/api' : '/.netlify/functions';

/**
 * Analyze a mission
 */
export async function analyzeMission(missionData) {
  const endpoint = import.meta.env.DEV
    ? `${API_URL}/missions/analyze`
    : `${API_URL}/analyze`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(missionData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to analyze mission');
  }

  return response.json();
}

/**
 * Get all missions - uses localStorage for persistence
 */
export async function getMissions() {
  const missions = JSON.parse(localStorage.getItem('missions') || '[]');
  return { missions };
}

/**
 * Save missions to localStorage
 */
export function saveMissions(missions) {
  localStorage.setItem('missions', JSON.stringify(missions));
}

/**
 * Delete a mission
 */
export async function deleteMission(id) {
  const missions = JSON.parse(localStorage.getItem('missions') || '[]');
  const filtered = missions.filter((m) => m.id !== id);
  localStorage.setItem('missions', JSON.stringify(filtered));
  return { success: true };
}

/**
 * Check API health
 */
export async function checkHealth() {
  if (import.meta.env.DEV) {
    const response = await fetch('http://localhost:3001/health');
    return response.json();
  }
  return { status: 'ok', environment: 'production' };
}
