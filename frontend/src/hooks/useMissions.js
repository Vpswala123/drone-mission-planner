import { useState, useEffect, useCallback } from 'react';
import { analyzeMission, getMissions, deleteMission } from '../services/api';

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
      setMissions((prev) => [mission, ...prev]);
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
      setMissions((prev) => prev.filter((m) => m.id !== id));
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
