import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  LineChart,
  Line,
} from 'recharts';
import './Dashboard.css';

function getRiskScore(level) {
  switch (level) {
    case 'Low':
      return 88;
    case 'Medium':
      return 64;
    case 'High':
      return 38;
    default:
      return 50;
  }
}

function getReadinessScore(mission) {
  const riskBase = getRiskScore(mission.analysis?.riskAnalysis?.level);
  const payloadPenalty = Math.min(18, mission.payload * 4);
  const distancePenalty = Math.min(18, mission.distance * 1.2);
  return Math.max(20, Math.round(riskBase - payloadPenalty - distancePenalty / 3));
}

export function Dashboard({ missions, selectedMission }) {
  const totalMissions = missions.length;
  const totalDistance = missions.reduce((sum, mission) => sum + mission.distance, 0);

  const readinessScores = missions.map(getReadinessScore);
  const avgReadiness = totalMissions
    ? Math.round(readinessScores.reduce((sum, score) => sum + score, 0) / totalMissions)
    : 0;

  const riskDistribution = missions.reduce((acc, mission) => {
    const level = mission.analysis?.riskAnalysis?.level || 'Unknown';
    acc[level] = (acc[level] || 0) + 1;
    return acc;
  }, {});

  const riskData = Object.entries(riskDistribution).map(([name, value]) => ({ name, value }));

  const envDistribution = missions.reduce((acc, mission) => {
    acc[mission.environment] = (acc[mission.environment] || 0) + 1;
    return acc;
  }, {});

  const envData = Object.entries(envDistribution).map(([name, value]) => ({ name, value }));

  const last30Days = [...Array(30)].map((_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - index));
    return date.toISOString().split('T')[0];
  });

  const missionsByDate = missions.reduce((acc, mission) => {
    const date = mission.createdAt.split('T')[0];
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  const timelineData = last30Days.map((date) => ({
    date: date.slice(5),
    missions: missionsByDate[date] || 0,
  }));

  const scatterData = missions.map((mission) => ({
    distance: mission.distance,
    payload: mission.payload,
    name: mission.name,
  }));

  const progressData = missions
    .slice()
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    .map((mission, index) => ({
      name: `${index + 1}`,
      readiness: getReadinessScore(mission),
      risk: getRiskScore(mission.analysis?.riskAnalysis?.level),
    }));

  const radarData = [
    {
      subject: 'Safety',
      value: avgReadiness,
      fullMark: 100,
    },
    {
      subject: 'Range',
      value: totalMissions
        ? Math.min(100, Math.round((missions.reduce((sum, mission) => sum + mission.distance, 0) / totalMissions) * 5))
        : 0,
      fullMark: 100,
    },
    {
      subject: 'Payload',
      value: totalMissions
        ? Math.min(100, Math.round((missions.reduce((sum, mission) => sum + mission.payload, 0) / totalMissions) * 25))
        : 0,
      fullMark: 100,
    },
    {
      subject: 'Consistency',
      value: Math.min(100, totalMissions * 12),
      fullMark: 100,
    },
    {
      subject: 'Complexity',
      value: Math.min(
        100,
        Math.round(
          (Object.keys(envDistribution).length * 18) +
            (riskDistribution.High || 0) * 12 +
            (riskDistribution.Medium || 0) * 8
        )
      ),
      fullMark: 100,
    },
  ];

  const avgDistance = totalMissions
    ? missions.reduce((sum, mission) => sum + mission.distance, 0) / totalMissions
    : 0;
  const avgPayloadValue = totalMissions
    ? missions.reduce((sum, mission) => sum + mission.payload, 0) / totalMissions
    : 0;

  const noveltyScore = selectedMission
    ? Math.min(
        100,
        Math.round(
          Math.abs(selectedMission.distance - avgDistance) * 6 +
            Math.abs(selectedMission.payload - avgPayloadValue) * 18 +
            ((envDistribution[selectedMission.environment] || 0) === 0 ? 30 : 8)
        )
      )
    : null;

  const selectedReadiness = selectedMission ? getReadinessScore(selectedMission) : null;

  const COLORS = {
    Low: '#22c55e',
    Medium: '#f59e0b',
    High: '#ef4444',
    Unknown: '#6b7280',
  };

  return (
    <div className="dashboard-analytics">
      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-icon" aria-hidden="true">DR</div>
          <div className="stat-info">
            <span className="stat-value">{totalMissions}</span>
            <span className="stat-label">Total Missions</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" aria-hidden="true">KM</div>
          <div className="stat-info">
            <span className="stat-value">{totalDistance.toFixed(1)} km</span>
            <span className="stat-label">Total Distance</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" aria-hidden="true">RS</div>
          <div className="stat-info">
            <span className="stat-value">{avgReadiness}</span>
            <span className="stat-label">Avg Readiness Score</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" aria-hidden="true">MX</div>
          <div className="stat-info">
            <span className="stat-value">
              {selectedMission ? `${noveltyScore}` : `${Object.keys(envDistribution).length}`}
            </span>
            <span className="stat-label">
              {selectedMission ? 'Mission Novelty Index' : 'Environment Mix'}
            </span>
          </div>
        </div>
      </div>

      {selectedMission ? (
        <div className="insight-strip">
          <div className="insight-card">
            <span className="insight-label">Selected Mission Readiness</span>
            <strong>{selectedReadiness}/100</strong>
            <p>Higher means this mission is closer to your established safe operating profile.</p>
          </div>
          <div className="insight-card">
            <span className="insight-label">Novelty vs Your History</span>
            <strong>{noveltyScore}/100</strong>
            <p>Higher means the mission is further from your usual range, payload, or environment mix.</p>
          </div>
          <div className="insight-card">
            <span className="insight-label">Mission DNA</span>
            <strong>
              {selectedMission.environment} / {selectedMission.analysis?.riskAnalysis?.level || 'Unknown'}
            </strong>
            <p>A compact fingerprint for quickly recognizing repeatable versus exploratory missions.</p>
          </div>
        </div>
      ) : null}

      <div className="charts-grid">
        <div className="chart-card wide">
          <h3>Mission Activity (Last 30 Days)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="missions"
                stroke="#4f46e5"
                fill="#4f46e5"
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Readiness Progress Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={progressData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Line type="monotone" dataKey="readiness" stroke="#0f766e" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Mission Capability DNA</h3>
          <ResponsiveContainer width="100%" height={250}>
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis domain={[0, 100]} />
              <Radar
                name="Capability"
                dataKey="value"
                stroke="#4f46e5"
                fill="#4f46e5"
                fillOpacity={0.35}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Risk Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={riskData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {riskData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.name] || COLORS.Unknown} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Environment Types</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={envData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#4f46e5" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card wide">
          <h3>Distance vs Payload Analysis</h3>
          <ResponsiveContainer width="100%" height={250}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid />
              <XAxis type="number" dataKey="distance" name="Distance" unit=" km" />
              <YAxis type="number" dataKey="payload" name="Payload" unit=" kg" />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Scatter data={scatterData} fill="#8884d8" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
