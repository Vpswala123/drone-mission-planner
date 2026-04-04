import { useState } from 'react';
import { MissionForm } from './components/MissionForm';
import { MissionCard } from './components/MissionCard';
import { AuthForm } from './components/AuthForm';
import { UserMenu } from './components/UserMenu';
import { useMissions } from './hooks/useMissions';
import { useAuth } from './contexts/useAuth';
import './App.css';

function AppContent() {
  const { missions, loading, error, createMission, removeMission } = useMissions();
  const { isAuthenticated, loading: authLoading, authEnabled } = useAuth();
  const [selectedMission, setSelectedMission] = useState(null);

  if (authLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthForm />;
  }

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
    <>
      <header className="app-header">
        <div className="container header-content">
          <div>
            <h1>Drone Mission Planner</h1>
            <p>
              {authEnabled
                ? 'Plan and analyze drone missions with AI-powered recommendations'
                : 'Public demo mode with local mission analysis and browser-only storage'}
            </p>
          </div>
          <UserMenu />
        </div>
      </header>

      <main className="container">
        <div className="dashboard">
          <div className="sidebar">
            <MissionForm onSubmit={handleSubmit} loading={loading} />
            {error && <div className="error-message">{error}</div>}
          </div>

          <div className="content">
            {selectedMission ? (
              <div className="results-section">
                <div className="section-header">
                  <h2>Mission Analysis Results</h2>
                  <button className="btn-secondary" onClick={() => setSelectedMission(null)}>
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
                    <div className="empty-icon" aria-hidden="true">DR</div>
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
                          <span
                            className={`risk-badge ${(
                              mission.analysis?.riskAnalysis?.level || 'unknown'
                            ).toLowerCase()}`}
                          >
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
          <p>
            {authEnabled
              ? 'Powered by kimi-k2.5:cloud AI'
              : 'Running in public demo mode without external API keys'}
          </p>
        </div>
      </footer>
    </>
  );
}

function App() {
  return (
    <div className="app">
      <AppContent />
    </div>
  );
}

export default App;
