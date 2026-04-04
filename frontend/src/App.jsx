import { useState } from 'react';
import { MissionForm } from './components/MissionForm';
import { MissionCard } from './components/MissionCard';
import { useMissions } from './hooks/useMissions';
import './App.css';

function App() {
  const { missions, loading, error, createMission, removeMission } = useMissions();
  const [selectedMission, setSelectedMission] = useState(null);

  const handleSubmit = async (formData) => {
    try {
      const mission = await createMission(formData);
      setSelectedMission(mission);
    } catch (err) {
      console.error('Failed to create mission:', err);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this mission?')) {
      await removeMission(id);
      if (selectedMission?.id === id) {
        setSelectedMission(null);
      }
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="container">
          <h1>Drone Mission Planner</h1>
          <p>Plan and analyze drone missions with AI-powered recommendations</p>
        </div>
      </header>

      <main className="container">
        <div className="dashboard">
          <div className="sidebar">
            <MissionForm onSubmit={handleSubmit} loading={loading} />

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}
          </div>

          <div className="content">
            {selectedMission ? (
              <div className="results-section">
                <div className="section-header">
                  <h2>Mission Analysis Results</h2>
                  <button
                    className="btn-secondary"
                    onClick={() => setSelectedMission(null)}
                  >
                    Back to Missions
                  </button>
                </div>
                <MissionCard mission={selectedMission} onDelete={handleDelete} />
              </div>
            ) : (
              <div className="missions-section">
                <div className="section-header">
                  <h2>Mission History</h2>
                  <span className="mission-count">{missions.length} missions</span>
                </div>

                {missions.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">🚁</div>
                    <h3>No missions yet</h3>
                    <p>Create your first mission using the form on the left</p>
                  </div>
                ) : (
                  <div className="missions-grid">
                    {missions.map((mission) => (
                      <div
                        key={mission.id}
                        className="mission-preview"
                        onClick={() => setSelectedMission(mission)}
                      >
                        <div className="preview-header">
                          <h4>{mission.name || `Mission ${mission.id.slice(-4)}`}</h4>
                          <span className="preview-date">
                            {new Date(mission.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="preview-details">
                          <span>{mission.distance} km</span>
                          <span>{mission.payload} kg payload</span>
                          <span>{mission.environment}</span>
                        </div>
                        <div className="preview-risk">
                          Risk:{' '}
                          <span className={`risk-badge ${mission.analysis?.riskAnalysis?.level.toLowerCase()}`}>
                            {mission.analysis?.riskAnalysis?.level || 'Unknown'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="app-footer">
        <div className="container">
          <p>Powered by kimi-k2.5:cloud AI</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
