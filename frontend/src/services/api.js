const API_URL = 'http://localhost:3001/api';

/**
 * Analyze a mission
 */
export async function analyzeMission(missionData) {
  const response = await fetch(`${API_URL}/missions/analyze`, {
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
 * Get all missions
 */
export async function getMissions() {
  const response = await fetch(`${API_URL}/missions`);

  if (!response.ok) {
    throw new Error('Failed to fetch missions');
  }

  return response.json();
}

/**
 * Delete a mission
 */
export async function deleteMission(id) {
  const response = await fetch(`${API_URL}/missions/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete mission');
  }

  return response.json();
}

/**
 * Check API health
 */
export async function checkHealth() {
  const response = await fetch(`${API_URL.replace('/api', '')}/health`);
  return response.json();
}
