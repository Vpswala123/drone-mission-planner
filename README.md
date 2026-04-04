# Drone Mission Planner

A full-stack web application for planning and analyzing drone missions.

## Features

- Mission input for distance, payload, environment, weather, and terrain
- AI-generated drone recommendations
- Risk analysis with mitigation steps
- Flight estimation for time, battery usage, and range
- Public demo mode with local mission analysis and browser-only mission history
- Optional auth and Netlify serverless backend for private deployments
- GitHub Pages deployment workflow for a zero-secret public build

## Tech Stack

**Frontend**
- React with Vite
- Custom CSS
- Recharts for analytics

**Backend (optional)**
- Netlify serverless functions
- MongoDB for auth and mission history
- JWT authentication
- `kimi-k2.5:cloud` AI integration

## Project Structure

```text
drone-mission-planner/
|-- frontend/
|   |-- src/
|   |   |-- components/
|   |   |-- contexts/
|   |   |-- hooks/
|   |   `-- services/
|-- netlify/
|   `-- functions/
|       |-- auth/
|       |-- missions/
|       `-- utils/
|-- backend/
|   `-- server.js
`-- README.md
```

## Local Development

1. Install dependencies:

```bash
npm install
cd frontend && npm install
cd ../netlify/functions && npm install
```

2. Start the public static app:

```bash
cd frontend
npm run dev
```

This mode requires no API keys, no login, and no backend.

## Optional Full Backend Mode

Enable auth and the Netlify backend only if you want private user accounts and remote persistence.

Required environment variables:

```bash
VITE_ENABLE_AUTH=true
KIMI_API_KEY=your_kimi_api_key_here
MONGODB_URI=your_mongodb_connection_string_here
JWT_SECRET=replace_with_a_long_random_secret
```

Run with:

```bash
netlify dev
```

The app will run on `http://localhost:8888` with the frontend and serverless API together.

## Public Hosting

### GitHub Pages

This repo includes [`.github/workflows/deploy-pages.yml`](/C:/Users/amans/Downloads/cc/drone-mission-planner/.github/workflows/deploy-pages.yml), which builds and publishes the static public demo automatically on pushes to `master`.

No API keys or secrets are required for the Pages deployment.

### Netlify

You can also deploy the static demo to Netlify without any environment variables. If you later want auth plus remote persistence, add the backend environment variables and use the Netlify functions.

## Why No Free Public API

For a public deployment without exposing secrets, the safest approach is browser-only analysis. Current hosted AI APIs like Hugging Face Inference and Cloudflare Workers AI still require authentication tokens or accounts.

## API Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/.netlify/functions/auth/register` | Register a user |
| POST | `/.netlify/functions/auth/login` | Login a user |
| GET | `/.netlify/functions/auth/me` | Get the current user |
| GET | `/.netlify/functions/missions/list` | Get the current user's missions |
| POST | `/.netlify/functions/missions/analyze` | Create and analyze a mission |
| DELETE | `/.netlify/functions/missions/delete/:id` | Delete a mission |
