// API URL - uses relative path for Netlify Functions
const API_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV ? 'http://localhost:8888/.netlify/functions' : '/.netlify/functions');

async function parseResponse(response, fallbackMessage) {
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.error || fallbackMessage);
  }

  return data;
}

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

/**
 * Analyze a mission
 */
export async function analyzeMission(missionData) {
  const response = await fetch(`${API_URL}/missions/analyze`, {
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
  const response = await fetch(`${API_URL}/missions/list`, {
    headers: getAuthHeaders(),
  });

  return parseResponse(response, 'Failed to fetch missions');
}

/**
 * Delete a mission
 */
export async function deleteMission(id) {
  const response = await fetch(`${API_URL}/missions/delete/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  return parseResponse(response, 'Failed to delete mission');
}
