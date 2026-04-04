const { connectToDatabase } = require('../utils/db');
const { getUserIdFromRequest } = require('../utils/auth');
const { analyzeMission } = require('../utils/aiAnalysis');
const { ObjectId } = require('mongodb');

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const userId = getUserIdFromRequest(event);

    if (!userId) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'Unauthorized' }),
      };
    }

    const body = JSON.parse(event.body || '{}');
    const { distance, payload, environment, weather, terrain, name } = body;
    const parsedDistance = Number.parseFloat(distance);
    const parsedPayload = Number.parseFloat(payload);
    const trimmedEnvironment = typeof environment === 'string' ? environment.trim() : '';
    const trimmedName = typeof name === 'string' ? name.trim() : '';

    if (!Number.isFinite(parsedDistance) || parsedDistance <= 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Distance must be a number greater than 0' }),
      };
    }

    if (!Number.isFinite(parsedPayload) || parsedPayload < 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Payload must be a number greater than or equal to 0' }),
      };
    }

    if (!trimmedEnvironment) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Environment is required' }),
      };
    }

    const missionData = {
      distance: parsedDistance,
      payload: parsedPayload,
      environment: trimmedEnvironment,
      weather: weather || 'Clear',
      terrain: terrain || 'Flat',
      name: trimmedName || `Mission ${Date.now()}`,
    };

    // Get AI analysis
    const analysis = await analyzeMission(missionData);

    const { db } = await connectToDatabase();
    const missionsCollection = db.collection('missions');

    const mission = {
      userId: new ObjectId(userId),
      ...missionData,
      analysis,
      createdAt: new Date().toISOString(),
      status: 'planned',
    };

    const result = await missionsCollection.insertOne(mission);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        mission: {
          id: result.insertedId.toString(),
          ...missionData,
          analysis,
          createdAt: mission.createdAt,
          status: 'planned',
        },
      }),
    };
  } catch (error) {
    console.error('Mission analysis error:', error);
    const statusCode = error instanceof SyntaxError ? 400 : 500;
    const errorMessage =
      error instanceof SyntaxError ? 'Invalid JSON request body' : 'Failed to analyze mission';

    return {
      statusCode,
      headers,
      body: JSON.stringify({ error: errorMessage }),
    };
  }
};
