const express = require('express');
const cors = require('cors');
require('dotenv').config();

const registerHandler = require('../netlify/functions/auth/register').handler;
const loginHandler = require('../netlify/functions/auth/login').handler;
const meHandler = require('../netlify/functions/auth/me').handler;
const listMissionsHandler = require('../netlify/functions/missions/list').handler;
const analyzeMissionHandler = require('../netlify/functions/missions/analyze').handler;
const deleteMissionHandler = require('../netlify/functions/missions/delete').handler;

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

function normalizeHeaders(headers = {}) {
  return Object.fromEntries(
    Object.entries(headers).map(([key, value]) => [key, Array.isArray(value) ? value.join(', ') : value])
  );
}

async function runNetlifyHandler(handler, req, res) {
  try {
    const event = {
      httpMethod: req.method,
      headers: normalizeHeaders(req.headers),
      body:
        req.method === 'GET' || req.method === 'DELETE'
          ? undefined
          : JSON.stringify(req.body ?? {}),
      path: req.originalUrl,
      rawUrl: `${req.protocol}://${req.get('host')}${req.originalUrl}`,
      queryStringParameters: req.query,
    };

    const result = await handler(event, {});

    if (result.headers) {
      for (const [key, value] of Object.entries(result.headers)) {
        res.setHeader(key, value);
      }
    }

    res.status(result.statusCode || 200);

    if (!result.body) {
      return res.end();
    }

    const contentType = result.headers?.['Content-Type'] || result.headers?.['content-type'] || '';
    if (contentType.includes('application/json')) {
      return res.send(JSON.parse(result.body));
    }

    return res.send(result.body);
  } catch (error) {
    console.error('Express compatibility handler error:', error);
    return res.status(500).json({ error: 'Compatibility server failed to process request' });
  }
}

app.post('/api/auth/register', (req, res) => runNetlifyHandler(registerHandler, req, res));
app.post('/api/auth/login', (req, res) => runNetlifyHandler(loginHandler, req, res));
app.get('/api/auth/me', (req, res) => runNetlifyHandler(meHandler, req, res));

app.get('/api/missions', (req, res) => runNetlifyHandler(listMissionsHandler, req, res));
app.post('/api/missions/analyze', (req, res) => runNetlifyHandler(analyzeMissionHandler, req, res));
app.delete('/api/missions/:id', (req, res) => runNetlifyHandler(deleteMissionHandler, req, res));

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    runtime: 'express-compatibility',
    apiMode: 'shared-netlify-handlers',
    timestamp: new Date().toISOString(),
  });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Drone Mission Planner compatibility API running on port ${PORT}`);
  });
}

module.exports = app;
