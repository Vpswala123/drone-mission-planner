import { useState } from 'react';
import { MissionForm } from './components/MissionForm';
import { MissionCard } from './components/MissionCard';
import { AuthForm } from './components/AuthForm';
import { UserMenu } from './components/UserMenu';
import { Dashboard } from './components/Dashboard';
import { useMissions } from './hooks/useMissions';
import { useAuth } from './contexts/useAuth';
import './App.css';

function AppContent() {
  const { missions, loading, error, notice, createMission, removeMission } = useMissions();
  const { isAuthenticated, loading: authLoading, authEnabled } = useAuth();
  const [selectedMission, setSelectedMission] = useState(null);
  const [showAuthForm, setShowAuthForm] = useState(false);

  if (authLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
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
                : 'Analyze missions freely. Sign in only if you want saved history and progress tracking.'}
            </p>
          </div>
          <UserMenu onOpenAuth={() => setShowAuthForm(true)} />
        </div>
      </header>

      <main className="container">
        <div className="dashboard">
          <div className="sidebar">
            <MissionForm onSubmit={handleSubmit} loading={loading} />

            {!authEnabled && !isAuthenticated ? (
              <div className="error-message">
                History is optional. Create an account only if you want to save missions and progress.
                <div style={{ marginTop: '0.75rem' }}>
                  <button className="btn-secondary" onClick={() => setShowAuthForm((current) => !current)}>
                    {showAuthForm ? 'Hide Account Form' : 'Sign In to Save History'}
                  </button>
                </div>
              </div>
            ) : null}

            {showAuthForm ? (
              <AuthForm
                compact
                onSuccess={() => setShowAuthForm(false)}
                onCancel={() => setShowAuthForm(false)}
              />
            ) : null}

            {error && <div className="error-message">{error}</div>}
            {notice && <div className="error-message">{notice}</div>}
          </div>

          <div className="content">
            {missions.length > 0 ? <Dashboard missions={missions} /> : null}

            {selectedMission ? (
              <div className="results-section">
                <div className="section-header">
                  <h2>Mission Analysis Results</h2>
                  <button className="btn-secondary" onClick={() => setSelectedMission(null)}>
                    Back to Missions
                  </button>
                </div>
                {!authEnabled && !isAuthenticated ? (
                  <div className="error-message">
                    This result is temporary. Sign in if you want it added to your mission history.
                  </div>
                ) : null}
                <MissionCard mission={selectedMission} onDelete={handleDelete} />
              </div>
            ) : (
              <div className="missions-section">
                <div className="section-header">
                  <h2>{isAuthenticated || authEnabled ? 'Mission History' : 'Saved Mission History'}</h2>
                  <span className="mission-count">{missions.length} missions</span>
                </div>

                {missions.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon" aria-hidden="true">DR</div>
                    <h3>No saved missions yet</h3>
                    <p>
                      {isAuthenticated || authEnabled
                        ? 'Create your first mission using the form on the left'
                        : 'Analyze a mission now, then sign in if you want to keep it in your history'}
                    </p>
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
              : 'Free demo mode with optional accounts, saved history, and progress analytics'}
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
