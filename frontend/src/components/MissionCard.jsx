import './MissionCard.css';

export function MissionCard({ mission, onDelete }) {
  const { id, name, distance, payload, environment, weather, terrain, analysis, createdAt } = mission;

  const getRiskColor = (level) => {
    switch (level) {
      case 'Low': return '#22c55e';
      case 'Medium': return '#f59e0b';
      case 'High': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <div className="mission-card">
      <div className="mission-header">
        <div>
          <h3>{name || `Mission ${id.slice(-4)}`</h3>
          <span className="mission-date">{new Date(createdAt).toLocaleDateString()}</span>
        </div>
        <button className="btn-delete" onClick={() => onDelete(id)} title="Delete mission">
          ×
        </button>
      </div>

      <div className="mission-params">
        <div className="param"><span>Distance:</span> {distance} km</div>
        <div className="param"><span>Payload:</span> {payload} kg</div>
        <div className="param"><span>Environment:</span> {environment}</div>
        <div className="param"><span>Weather:</span> {weather}</div>
        <div className="param"><span>Terrain:</span> {terrain}</div>
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
              {analysis.riskAnalysis?.factors?.map((factor, i) => (
                <div key={i} className="risk-factor">⚠️ {factor}</div>
              ))}
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
