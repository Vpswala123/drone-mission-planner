import { useState, useEffect, useCallback } from 'react';
import { analyzeMission, getMissions, deleteMission } from '../services/api';

export function useMissions() {
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);

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
    setNotice(null);

    try {
      const result = await analyzeMission(missionData);

      if (result.persisted) {
        setMissions((currentMissions) => [result.mission, ...currentMissions]);
      } else if (result.message) {
        setNotice(result.message);
      }

      return result.mission;
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
      setMissions((currentMissions) => currentMissions.filter((m) => m.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    missions,
    loading,
    error,
    notice,
    createMission,
    removeMission,
    refreshMissions: fetchMissions,
  };
}
