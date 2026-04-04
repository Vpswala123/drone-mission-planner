function normalizeEnvironment(environment) {
  return typeof environment === 'string' && environment.trim()
    ? environment.trim()
    : 'Rural';
}

function normalizeWeather(weather) {
  return typeof weather === 'string' && weather.trim() ? weather.trim() : 'Clear';
}

function normalizeTerrain(terrain) {
  return typeof terrain === 'string' && terrain.trim() ? terrain.trim() : 'Flat';
}

export function validateMissionInput(missionData) {
  const distance = Number.parseFloat(missionData.distance);
  const payload = Number.parseFloat(missionData.payload);
  const environment = normalizeEnvironment(missionData.environment);

  if (!Number.isFinite(distance) || distance <= 0) {
    throw new Error('Distance must be a number greater than 0');
  }

  if (!Number.isFinite(payload) || payload < 0) {
    throw new Error('Payload must be a number greater than or equal to 0');
  }

  if (!environment) {
    throw new Error('Environment is required');
  }

  return {
    distance,
    payload,
    environment,
    weather: normalizeWeather(missionData.weather),
    terrain: normalizeTerrain(missionData.terrain),
    name:
      typeof missionData.name === 'string' && missionData.name.trim()
        ? missionData.name.trim()
        : '',
  };
}

export function generateDemoAnalysis(missionData) {
  const { distance, payload, environment, weather, terrain } = validateMissionInput(missionData);

  let riskScore = 0;
  const factors = [];
  const mitigation = ['Run standard pre-flight checks', 'Maintain line of sight'];

  if (distance > 12) {
    riskScore += 2;
    factors.push('Long-range flight increases communication and battery risk');
    mitigation.push('Plan safe return-to-home and alternate landing points');
  }

  if (payload > 2) {
    riskScore += 2;
    factors.push('Heavy payload reduces endurance and maneuverability');
    mitigation.push('Reduce cruise speed and verify thrust reserve');
  }

  if (environment === 'Urban') {
    riskScore += 2;
    factors.push('Urban obstacles and interference raise navigation complexity');
    mitigation.push('Use obstacle-aware routing and conservative altitude margins');
  }

  if (weather === 'Windy' || weather === 'Rainy') {
    riskScore += 2;
    factors.push('Adverse weather can destabilize the mission profile');
    mitigation.push('Use a weather-rated platform and shorten mission segments');
  }

  if (terrain === 'Mountainous') {
    riskScore += 1;
    factors.push('Terrain elevation changes can affect signal and energy usage');
    mitigation.push('Add terrain clearance margin and verify link coverage');
  }

  const riskLevel = riskScore >= 5 ? 'High' : riskScore >= 3 ? 'Medium' : 'Low';

  const cruiseSpeed = payload > 1.5 ? 28 : environment === 'Urban' ? 24 : 38;
  const durationMinutes = Math.max(8, Math.round((distance / Math.max(cruiseSpeed, 1)) * 60 * 1.2));
  const batterySwaps = Math.max(1, Math.ceil(durationMinutes / 25));
  const batteryCapacity =
    distance > 10 || payload > 2 ? '7000mAh+' : distance > 5 ? '5500mAh+' : '4000mAh+';

  return {
    recommendations: {
      droneType:
        payload > 2.5
          ? 'Heavy-lift hexacopter'
          : environment === 'Urban'
            ? 'Obstacle-aware quadcopter'
            : 'Long-endurance quadcopter',
      batteryCapacity,
      flightMode:
        weather === 'Windy' || weather === 'Rainy'
          ? 'Stabilized GPS mode'
          : environment === 'Urban'
            ? 'GPS plus obstacle avoidance'
            : 'GPS cruise mode',
      speed: `${cruiseSpeed} km/h`,
    },
    riskAnalysis: {
      level: riskLevel,
      factors: factors.length ? factors : ['Mission profile is within conservative planning limits'],
      mitigation,
    },
    flightEstimation: {
      duration: `${durationMinutes} minutes`,
      batteryNeeded: batterySwaps,
      range: `${Math.round(distance * 1.15)} km planned coverage`,
    },
  };
}

export function createDemoMission(missionData) {
  const validated = validateMissionInput(missionData);
  const missionId = `demo-${Date.now()}`;

  return {
    id: missionId,
    name: validated.name || `Mission ${missionId.slice(-4)}`,
    distance: validated.distance,
    payload: validated.payload,
    environment: validated.environment,
    weather: validated.weather,
    terrain: validated.terrain,
    analysis: generateDemoAnalysis(validated),
    createdAt: new Date().toISOString(),
    status: 'planned',
  };
}
