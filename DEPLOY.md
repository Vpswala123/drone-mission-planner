# Deploy to Netlify

This app is configured for Netlify deployment with serverless functions.

## Quick Deploy

### Option 1: Netlify CLI

1. Install Netlify CLI:

```bash
npm install -g netlify-cli
```

2. Log in:

```bash
netlify login
```

3. Initialize and deploy:

```bash
netlify init
netlify deploy --prod
```

### Option 2: Git-Based Deployment

1. Push the repository to GitHub.
2. In the Netlify dashboard, import the repository.
3. Netlify will read the build settings from `netlify.toml`.

## Required Environment Variables

Set these in Netlify under Site settings > Environment variables:

```bash
KIMI_API_KEY=your_kimi_api_key_here
MONGODB_URI=your_mongodb_connection_string_here
JWT_SECRET=replace_with_a_long_random_secret
```

Without `KIMI_API_KEY`, the app falls back to heuristic mission analysis.

## Build Settings

Netlify uses the values from `netlify.toml`:

- Build command: `cd frontend && npm install && npm run build`
- Publish directory: `frontend/dist`
- Functions directory: `netlify/functions`

## Local Testing

```bash
npm install
cd frontend && npm install
cd ../netlify/functions && npm install
cd ../..
netlify dev
```

This starts the app at `http://localhost:8888` with the frontend and functions together.

## Deployment Notes

- Frontend assets are served from the CDN.
- API routes are served from `/.netlify/functions/`.
- Mission history and auth data are stored in MongoDB.
