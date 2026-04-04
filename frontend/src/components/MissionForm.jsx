import { useState } from 'react';
import './MissionForm.css';

export function MissionForm({ onSubmit, loading }) {
  const [formData, setFormData] = useState({
    name: '',
    distance: '',
    payload: '',
    environment: 'Rural',
    weather: 'Clear',
    terrain: 'Flat',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form className="mission-form" onSubmit={handleSubmit}>
      <h2>New Mission</h2>

      <div className="form-group">
        <label htmlFor="name">Mission Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g., Survey North Field"
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="distance">Distance (km) *</label>
          <input
            type="number"
            id="distance"
            name="distance"
            value={formData.distance}
            onChange={handleChange}
            placeholder="e.g., 5"
            required
            min="0.1"
            step="0.1"
          />
        </div>

        <div className="form-group">
          <label htmlFor="payload">Payload (kg) *</label>
          <input
            type="number"
            id="payload"
            name="payload"
            value={formData.payload}
            onChange={handleChange}
            placeholder="e.g., 0.5"
            required
            min="0"
            step="0.1"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="environment">Environment *</label>
          <select
            id="environment"
            name="environment"
            value={formData.environment}
            onChange={handleChange}
            required
          >
            <option value="Rural">Rural</option>
            <option value="Urban">Urban</option>
            <option value="Forest">Forest</option>
            <option value="Coastal">Coastal</option>
            <option value="Mountain">Mountain</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="weather">Weather</label>
          <select
            id="weather"
            name="weather"
            value={formData.weather}
            onChange={handleChange}
          >
            <option value="Clear">Clear</option>
            <option value="Cloudy">Cloudy</option>
            <option value="Windy">Windy</option>
            <option value="Rainy">Rainy</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="terrain">Terrain</label>
        <select
          id="terrain"
          name="terrain"
          value={formData.terrain}
          onChange={handleChange}
        >
          <option value="Flat">Flat</option>
          <option value="Hilly">Hilly</option>
          <option value="Mountainous">Mountainous</option>
        </select>
      </div>

      <button type="submit" className="btn-primary" disabled={loading}>
        {loading ? 'Analyzing...' : 'Analyze Mission'}
      </button>
    </form>
  );
}
