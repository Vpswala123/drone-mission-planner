# Deploy to Netlify

This app is configured for Netlify deployment with serverless functions.

## Quick Deploy

### Option 1: Netlify CLI (Recommended)

1. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Login to Netlify:
```bash
netlify login
```

3. Initialize and deploy:
```bash
netlify init
netlify deploy --prod
```

### Option 2: Git + Continuous Deployment

1. Push to GitHub:
```bash
git add .
git commit -m "Add Netlify deployment config"
git push origin master
```

2. Go to [Netlify Dashboard](https://app.netlify.com/)
3. Click "Add new site" → "Import an existing project"
4. Select your GitHub repo
5. Build settings are auto-detected from `netlify.toml`
6. Click "Deploy site"

## Environment Variables

Add these in Netlify Dashboard → Site settings → Environment variables:

```
KIMI_API_KEY=your_kimi_api_key_here
```

Without this, the app will use fallback analysis (works fine for demo).

## Build Settings

Netlify will automatically use these from `netlify.toml`:
- Build command: `cd frontend && npm install && npm run build`
- Publish directory: `frontend/dist`
- Functions directory: `netlify/functions`

## Local Testing

```bash
# Install dependencies
npm install
cd frontend && npm install && cd ..

# Run Netlify dev server (includes functions)
netlify dev
```

This starts the app at `http://localhost:8888` with both frontend and API working.

## Features

- **Frontend**: React app deployed to CDN
- **Backend**: Serverless functions at `/.netlify/functions/`
- **AI Analysis**: Powered by kimi-k2.5:cloud API
- **Persistence**: localStorage for mission history

## URL Structure

After deployment:
- Site: `https://your-site-name.netlify.app`
- API: `https://your-site-name.netlify.app/.netlify/functions/analyze`
