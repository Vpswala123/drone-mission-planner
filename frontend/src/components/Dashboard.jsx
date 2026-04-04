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
} from 'recharts';
import './Dashboard.css';

export function Dashboard({ missions }) {
  const totalMissions = missions.length;
  const totalDistance = missions.reduce((sum, mission) => sum + mission.distance, 0);
  const avgPayload = totalMissions
    ? (missions.reduce((sum, mission) => sum + mission.payload, 0) / totalMissions).toFixed(2)
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
          <div className="stat-icon" aria-hidden="true">KG</div>
          <div className="stat-info">
            <span className="stat-value">{avgPayload} kg</span>
            <span className="stat-label">Avg Payload</span>
          </div>
        </div>
      </div>

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
