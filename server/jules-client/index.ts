import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const JULES_API_KEY = process.env.JULES_API_KEY;

// Verify JULES_API_KEY presence
if (!JULES_API_KEY && process.env.NODE_ENV !== 'test') {
  console.warn('Warning: JULES_API_KEY is not set in environment variables');
}

const JULES_API_URL = 'https://jules.google.com/api/v1';

async function proxyRequest(req: express.Request, res: express.Response, endpoint: string, method: string) {
  try {
    const fetchOptions: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${JULES_API_KEY}`,
      },
    };

    if (method !== 'GET' && method !== 'HEAD') {
      fetchOptions.body = JSON.stringify(req.body);
    }

    // Default fallback behaviour when key is missing or to simulate the API
    if (!JULES_API_KEY) {
        if (endpoint === '/sessions' && method === 'POST') {
            return res.json({ id: 'simulated-session-id', status: 'created', url: 'https://jules.google.com/sessions/simulated' });
        }
        if (endpoint === '/sessions' && method === 'GET') {
            return res.json({ sessions: [], quota: { max: 100, remaining: null } }); // To simulate unknown quota
        }
        if (endpoint.match(/^\/sessions\/.*\/approve$/)) {
            return res.json({ status: 'approved' });
        }
        if (endpoint.match(/^\/sessions\/.*\/messages$/)) {
             return res.json({ id: 'msg-id', status: 'sent' });
        }
        return res.status(404).json({ error: 'Not simulated' });
    }

    const response = await fetch(`${JULES_API_URL}${endpoint}`, fetchOptions);
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return res.status(response.status).json(data || { error: response.statusText });
    }

    res.json(data);
  } catch (error: any) {
    console.error(`Jules API Proxy Error [${method} ${endpoint}]:`, error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}

// createSession
app.post('/api/jules/sessions', (req, res) => {
  proxyRequest(req, res, '/sessions', 'POST');
});

// listSessions
app.get('/api/jules/sessions', (req, res) => {
  proxyRequest(req, res, '/sessions', 'GET');
});

// approvePlan
app.post('/api/jules/sessions/:sessionId/approve', (req, res) => {
  const { sessionId } = req.params;
  proxyRequest(req, res, `/sessions/${sessionId}/approve`, 'POST');
});

// sendMessage
app.post('/api/jules/sessions/:sessionId/messages', (req, res) => {
  const { sessionId } = req.params;
  proxyRequest(req, res, `/sessions/${sessionId}/messages`, 'POST');
});

export { app };

if (process.argv[1].endsWith('server/jules-client/index.ts') || process.argv[1].endsWith('server/jules-client/index.js')) {
    const PORT = process.env.JULES_PROXY_PORT || 3002;
    app.listen(PORT, () => {
        console.log(`Jules API Proxy running on port ${PORT}`);
    });
}
