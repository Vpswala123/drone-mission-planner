// Netlify Function for mission analysis
const { analyzeMission } = require('./utils/aiAnalysis');

exports.handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { distance, payload, environment, weather, terrain, name } = JSON.parse(event.body);

    // Validation
    if (!distance || !payload || !environment) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: 'Missing required fields: distance, payload, environment'
        })
      };
    }

    const missionData = {
      distance: parseFloat(distance),
      payload: parseFloat(payload),
      environment,
      weather: weather || 'Clear',
      terrain: terrain || 'Flat',
      name: name || `Mission ${Date.now()}`
    };

    // Get AI analysis
    const analysis = await analyzeMission(missionData);

    const mission = {
      id: Date.now().toString(),
      ...missionData,
      analysis,
      createdAt: new Date().toISOString(),
      status: 'planned'
    };

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, mission })
    };
  } catch (error) {
    console.error('Mission analysis error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to analyze mission' })
    };
  }
};
