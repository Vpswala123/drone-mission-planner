/**
 * AI Analysis Service using kimi-k2.5:cloud API
 */

const KIMI_API_URL = 'https://api.moonshot.cn/v1/chat/completions';

/**
 * Analyze mission parameters and generate AI recommendations
 */
async function analyzeMission(missionData) {
  const { distance, payload, environment, weather, terrain } = missionData;

  const prompt = `You are a drone mission planning expert. Analyze this mission and provide recommendations.

Mission Parameters:
- Distance: ${distance} km
- Payload: ${payload} kg
- Environment: ${environment}
- Weather: ${weather || 'Clear'}
- Terrain: ${terrain || 'Flat'}

Provide a JSON response with this structure:
{
  "recommendations": {
    "droneType": "Recommended drone model/type",
    "batteryCapacity": "Recommended battery capacity in mAh",
    "flightMode": "Recommended flight mode",
    "speed": "Recommended cruising speed in km/h"
  },
  "riskAnalysis": {
    "level": "Low/Medium/High",
    "factors": ["risk factor 1", "risk factor 2"],
    "mitigation": ["mitigation 1", "mitigation 2"]
  },
  "flightEstimation": {
    "duration": "Estimated flight time in minutes",
    "batteryNeeded": "Number of battery swaps needed",
    "range": "Estimated range coverage"
  }
}

Respond ONLY with the JSON object, no markdown formatting.`;

  try {
    const response = await fetch(KIMI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.KIMI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'kimi-k2.5:cloud',
        messages: [
          { role: 'system', content: 'You are a drone mission planning expert. Always respond with valid JSON.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      throw new Error(`Kimi API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    const jsonMatch = content.match(/\{[\s\S]*\}/);

    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    throw new Error('Invalid response format from AI');
  } catch (error) {
    console.error('AI Analysis error:', error);
    return generateFallbackAnalysis(missionData);
  }
}

/**
 * Fallback analysis if AI API fails
 */
function generateFallbackAnalysis(missionData) {
  const { distance, payload, environment } = missionData;

  let riskLevel = 'Low';
  const factors = [];
  const mitigation = ['Standard pre-flight checks', 'Maintain visual line of sight'];

  if (distance > 10) {
    riskLevel = 'Medium';
    factors.push('Extended range requires careful battery management');
    mitigation.push('Plan emergency landing zones');
  }

  if (payload > 2) {
    riskLevel = riskLevel === 'Low' ? 'Medium' : 'High';
    factors.push('Heavy payload affects maneuverability');
    mitigation.push('Reduce maximum speed by 20%');
  }

  if (environment === 'Urban') {
    riskLevel = 'High';
    factors.push('Obstacles and interference in urban environment');
    mitigation.push('Use obstacle avoidance sensors', 'Plan flight path carefully');
  }

  const flightTime = (distance / 40) * 60;
  const batteriesNeeded = Math.ceil((flightTime * 2) / 25);

  return {
    recommendations: {
      droneType: payload > 1 ? 'Heavy-lift hexacopter' : 'Standard quadcopter',
      batteryCapacity: distance > 5 ? '6000mAh+' : '4000mAh',
      flightMode: environment === 'Urban' ? 'GPS + Obstacle Avoidance' : 'GPS',
      speed: payload > 1 ? '30 km/h' : '40 km/h',
    },
    riskAnalysis: {
      level: riskLevel,
      factors,
      mitigation,
    },
    flightEstimation: {
      duration: `${Math.round(flightTime)} minutes`,
      batteryNeeded: batteriesNeeded,
      range: `${Math.round(distance * 1.2)} km with safety buffer`,
    },
  };
}

module.exports = { analyzeMission };
