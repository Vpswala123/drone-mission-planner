const express = require('express');
const router = express.Router();
const { analyzeMission } = require('../services/aiAnalysis');

// Store missions in memory (use database in production)
const missions = [];

/**
 * POST /api/missions/analyze
 * Analyze a mission and get AI recommendations
 */
router.post('/analyze', async (req, res) => {
  try {
    const { distance, payload, environment, weather, terrain, name } = req.body;

    // Validation
    if (!distance || !payload || !environment) {
      return res.status(400).json({
        error: 'Missing required fields: distance, payload, environment',
      });
    }

    const missionData = {
      distance: parseFloat(distance),
      payload: parseFloat(payload),
      environment,
      weather: weather || 'Clear',
      terrain: terrain || 'Flat',
      name: name || `Mission ${missions.length + 1}`,
    };

    // Get AI analysis
    const analysis = await analyzeMission(missionData);

    // Create mission record
    const mission = {
      id: Date.now().toString(),
      ...missionData,
      analysis,
      createdAt: new Date().toISOString(),
      status: 'planned',
    };

    missions.push(mission);

    res.json({ success: true, mission });
  } catch (error) {
    console.error('Mission analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze mission' });
  }
});

/**
 * GET /api/missions
 * Get all missions
 */
router.get('/', (req, res) => {
  res.json({ missions });
});

/**
 * GET /api/missions/:id
 * Get a specific mission
 */
router.get('/:id', (req, res) => {
  const mission = missions.find((m) => m.id === req.params.id);

  if (!mission) {
    return res.status(404).json({ error: 'Mission not found' });
  }

  res.json({ mission });
});

/**
 * DELETE /api/missions/:id
 * Delete a mission
 */
router.delete('/:id', (req, res) => {
  const index = missions.findIndex((m) => m.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: 'Mission not found' });
  }

  missions.splice(index, 1);
  res.json({ success: true, message: 'Mission deleted' });
});

module.exports = router;
