const { connectToDatabase } = require('../utils/db');
const { getUserIdFromRequest } = require('../utils/auth');
const { ObjectId } = require('mongodb');

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'DELETE, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'DELETE') {
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

    // Get mission ID from path
    const path = event.path;
    const missionId = path.split('/').pop();

    if (!missionId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Mission ID required' }),
      };
    }

    const { db } = await connectToDatabase();
    const missionsCollection = db.collection('missions');

    const result = await missionsCollection.deleteOne({
      _id: new ObjectId(missionId),
      userId: new ObjectId(userId),
    });

    if (result.deletedCount === 0) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'Mission not found' }),
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, message: 'Mission deleted' }),
    };
  } catch (error) {
    console.error('Delete mission error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to delete mission' }),
    };
  }
};
