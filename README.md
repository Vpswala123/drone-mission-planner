# Drone Mission Planner

A full-stack web application for planning and analyzing drone missions with AI-powered recommendations using the `kimi-k2.5:cloud` API.

## Features

- Mission input for distance, payload, environment, weather, and terrain
- AI-generated drone recommendations
- Risk analysis with mitigation steps
- Flight estimation for time, battery usage, and range
- User authentication with separate mission history
- Netlify deployment via serverless functions

## Tech Stack

**Frontend**
- React with Vite
- Custom CSS
- Recharts for analytics

**Backend**
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

2. Configure environment variables:

```bash
KIMI_API_KEY=your_kimi_api_key_here
MONGODB_URI=your_mongodb_connection_string_here
JWT_SECRET=replace_with_a_long_random_secret
```

3. Start the unified local app:

```bash
netlify dev
```

The app will run on `http://localhost:8888` with the frontend and serverless API together.

4. Optional Express compatibility server:

```bash
cd backend
npm install
npm start
```

This exposes the same auth and mission behavior at `http://localhost:3001/api/*` by reusing the Netlify handlers.

## API Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/.netlify/functions/auth/register` | Register a user |
| POST | `/.netlify/functions/auth/login` | Login a user |
| GET | `/.netlify/functions/auth/me` | Get the current user |
| GET | `/.netlify/functions/missions/list` | Get the current user's missions |
| POST | `/.netlify/functions/missions/analyze` | Create and analyze a mission |
| DELETE | `/.netlify/functions/missions/delete/:id` | Delete a mission |
