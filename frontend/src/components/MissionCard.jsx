import './MissionCard.css';

function getReadinessScore(mission) {
  const level = mission.analysis?.riskAnalysis?.level;
  const base = level === 'Low' ? 88 : level === 'Medium' ? 64 : level === 'High' ? 38 : 50;
  const payloadPenalty = Math.min(18, mission.payload * 4);
  const distancePenalty = Math.min(18, mission.distance * 1.2);
  return Math.max(20, Math.round(base - payloadPenalty - distancePenalty / 3));
}

export function MissionCard({ mission, onDelete, historyMissions = [] }) {
  const { id, name, distance, payload, environment, weather, terrain, analysis, createdAt } =
    mission;
  const comparisonPool = historyMissions.filter((entry) => entry.id !== id);
  const avgDistance = comparisonPool.length
    ? comparisonPool.reduce((sum, entry) => sum + entry.distance, 0) / comparisonPool.length
    : distance;
  const avgPayload = comparisonPool.length
    ? comparisonPool.reduce((sum, entry) => sum + entry.payload, 0) / comparisonPool.length
    : payload;
  const readinessScore = getReadinessScore(mission);
  const noveltyIndex = Math.min(
    100,
    Math.round(
      Math.abs(distance - avgDistance) * 6 +
        Math.abs(payload - avgPayload) * 18 +
        (comparisonPool.some((entry) => entry.environment === environment) ? 8 : 28)
    )
  );
  const missionDna = `${environment}-${analysis?.riskAnalysis?.level || 'Unknown'}-${terrain}`;

  const getRiskColor = (level) => {
    switch (level) {
      case 'Low':
        return '#22c55e';
      case 'Medium':
        return '#f59e0b';
      case 'High':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  return (
    <div className="mission-card">
      <div className="mission-header">
        <div>
          <h3>{name || `Mission ${id.slice(-4)}`}</h3>
          <span className="mission-date">{new Date(createdAt).toLocaleDateString()}</span>
        </div>
        <button className="btn-delete" onClick={() => onDelete(id)} title="Delete mission">
          x
        </button>
      </div>

      <div className="mission-params">
        <div className="param">
          <span>Distance:</span> {distance} km
        </div>
        <div className="param">
          <span>Payload:</span> {payload} kg
        </div>
        <div className="param">
          <span>Environment:</span> {environment}
        </div>
        <div className="param">
          <span>Weather:</span> {weather}
        </div>
        <div className="param">
          <span>Terrain:</span> {terrain}
        </div>
      </div>

      {analysis && (
        <div className="mission-analysis">
          <div className="analysis-section">
            <h4>Recommended Drone</h4>
            <div className="recommendation">
              <div className="rec-item">
                <span className="rec-label">Type:</span>
                <span className="rec-value">{analysis.recommendations?.droneType}</span>
              </div>
              <div className="rec-item">
                <span className="rec-label">Battery:</span>
                <span className="rec-value">{analysis.recommendations?.batteryCapacity}</span>
              </div>
              <div className="rec-item">
                <span className="rec-label">Flight Mode:</span>
                <span className="rec-value">{analysis.recommendations?.flightMode}</span>
              </div>
              <div className="rec-item">
                <span className="rec-label">Speed:</span>
                <span className="rec-value">{analysis.recommendations?.speed}</span>
              </div>
            </div>
          </div>

          <div className="analysis-section">
            <h4>Risk Analysis</h4>
            <div
              className="risk-level"
              style={{ color: getRiskColor(analysis.riskAnalysis?.level) }}
            >
              {analysis.riskAnalysis?.level} Risk
            </div>
            <div className="risk-factors">
              {analysis.riskAnalysis?.factors?.map((factor, index) => (
                <div key={index} className="risk-factor">
                  Warning: {factor}
                </div>
              ))}
            </div>
          </div>

          <div className="analysis-section">
            <h4>Unique Mission Insights</h4>
            <div className="insight-grid">
              <div className="insight-tile">
                <span className="insight-tile-label">Readiness Score</span>
                <strong>{readinessScore}/100</strong>
                <p>How closely this mission fits a conservative, repeatable operating profile.</p>
              </div>
              <div className="insight-tile">
                <span className="insight-tile-label">Novelty Index</span>
                <strong>{noveltyIndex}/100</strong>
                <p>How far this mission moves from your usual range, payload, and environment pattern.</p>
              </div>
              <div className="insight-tile">
                <span className="insight-tile-label">Mission DNA</span>
                <strong>{missionDna}</strong>
                <p>A compact fingerprint for comparing this mission with future planning patterns.</p>
              </div>
            </div>
          </div>

          <div className="analysis-section">
            <h4>Flight Estimation</h4>
            <div className="estimation-grid">
              <div className="est-item">
                <span className="est-label">Duration</span>
                <span className="est-value">{analysis.flightEstimation?.duration}</span>
              </div>
              <div className="est-item">
                <span className="est-label">Batteries</span>
                <span className="est-value">{analysis.flightEstimation?.batteryNeeded}</span>
              </div>
              <div className="est-item">
                <span className="est-label">Range</span>
                <span className="est-value">{analysis.flightEstimation?.range}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
