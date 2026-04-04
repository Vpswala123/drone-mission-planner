const { connectToDatabase } = require('../utils/db');
const { getUserIdFromRequest } = require('../utils/auth');
const { ObjectId } = require('mongodb');

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'GET') {
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

    const { db } = await connectToDatabase();
    const missionsCollection = db.collection('missions');

    const missions = await missionsCollection
      .find({ userId: new ObjectId(userId) })
      .sort({ createdAt: -1 })
      .toArray();

    // Transform _id to id for frontend
    const formattedMissions = missions.map((m) => ({
      id: m._id.toString(),
      name: m.name,
      distance: m.distance,
      payload: m.payload,
      environment: m.environment,
      weather: m.weather,
      terrain: m.terrain,
      analysis: m.analysis,
      createdAt: m.createdAt,
      status: m.status,
    }));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ missions: formattedMissions }),
    };
  } catch (error) {
    console.error('List missions error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to fetch missions' }),
    };
  }
};
