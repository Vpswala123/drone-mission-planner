import { useState, useEffect, useCallback } from 'react';
import { analyzeMission, getMissions, deleteMission, saveMissions } from '../services/api';

export function useMissions() {
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMissions = useCallback(async () => {
    try {
      const { missions } = await getMissions();
      setMissions(missions);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  useEffect(() => {
    fetchMissions();
  }, [fetchMissions]);

  const createMission = async (missionData) => {
    setLoading(true);
    setError(null);

    try {
      const { mission } = await analyzeMission(missionData);
      const updatedMissions = [mission, ...missions];
      setMissions(updatedMissions);
      saveMissions(updatedMissions);
      return mission;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeMission = async (id) => {
    try {
      await deleteMission(id);
      const updatedMissions = missions.filter((m) => m.id !== id);
      setMissions(updatedMissions);
      saveMissions(updatedMissions);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    missions,
    loading,
    error,
    createMission,
    removeMission,
    refreshMissions: fetchMissions,
  };
}
