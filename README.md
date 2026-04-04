# Drone Mission Planner

A full-stack web application for planning and analyzing drone missions with AI-powered recommendations using kimi-k2.5:cloud API.

## Features

- Mission input (distance, payload, environment, weather, terrain)
- AI-generated drone recommendations
- Risk analysis (Low/Medium/High)
- Flight estimation (duration, battery, range)
- Mission history with detailed analysis
- Clean, responsive dashboard UI

## Tech Stack

**Frontend:**
- React 18 with Vite
- Custom CSS
- REST API integration

**Backend:**
- Node.js with Express
- CORS enabled
- kimi-k2.5:cloud AI integration

## Project Structure

```
drone-mission-planner/
├── backend/
│   ├── package.json
│   ├── server.js
│   ├── .env.example
│   ├── routes/
│   │   └── missions.js
│   └── services/
│       └── aiAnalysis.js
├── frontend/
│   ├── package.json
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── components/
│   │   │   ├── MissionForm.jsx
│   │   │   ├── MissionForm.css
│   │   │   ├── MissionCard.jsx
│   │   │   └── MissionCard.css
│   │   ├── hooks/
│   │   │   └── useMissions.js
│   │   └── services/
│   │       └── api.js
│   └── ...
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- kimi-k2.5:cloud API key

### Backend Setup

```bash
cd backend
cp .env.example .env
# Edit .env and add your KIMI_API_KEY
npm install
npm start
```

The backend will run on http://localhost:3001

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will run on http://localhost:5173

## Environment Variables

Backend `.env`:
```
KIMI_API_KEY=your_kimi_api_key_here
PORT=3001
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /health | Health check |
| GET | /api/missions | Get all missions |
| POST | /api/missions/analyze | Create and analyze mission |
| DELETE | /api/missions/:id | Delete a mission |

## AI Response Format

```json
{
  "recommendations": {
    "droneType": "Recommended drone model/type",
    "batteryCapacity": "Recommended battery capacity in mAh",
    "flightMode": "Recommended flight mode",
    "speed": "Recommended cruising speed in km/h"
  },
  "riskAnalysis": {
    "level": "Low/Medium/High",
    "factors": ["risk factor 1", "risk factor 2"],
    "mitigation": ["mitigation 1", "mitigation 2"]
  },
  "flightEstimation": {
    "duration": "Estimated flight time in minutes",
    "batteryNeeded": "Number of battery swaps needed",
    "range": "Estimated range coverage"
  }
}
```

## License

MIT
