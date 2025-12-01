// Minimal local MentraOS Cloud mock for development
// Endpoints:
// - WebSocket: ws://localhost:8787/glasses-ws
// - HTTP POST: http://localhost:8787/broadcast/layout { layout }

import http from 'http';
import url from 'url';
import { WebSocketServer } from 'ws';

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 8787;

const server = http.createServer(async (req, res) => {
  const parsed = url.parse(req.url, true);

  if (req.method === 'POST' && parsed.pathname === '/broadcast/layout') {
    let body = '';
    req.on('data', (chunk) => (body += chunk));
    req.on('end', () => {
      try {
        const payload = JSON.parse(body || '{}');
        const layout = payload.layout || payload;
        const message = JSON.stringify({ type: 'layout_update', layout });
        broadcastToGlasses(message);
        res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
        res.end(JSON.stringify({ ok: true }));
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
        res.end(JSON.stringify({ ok: false, error: 'Invalid JSON' }));
      }
    });
    return;
  }

  // Health check
  if (req.method === 'GET' && parsed.pathname === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    res.end(JSON.stringify({ status: 'ok' }));
    return;
  }

  if (req.method === 'OPTIONS') {
    res.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.end();
    return;
  }

  res.writeHead(404);
  res.end('Not Found');
});

const wss = new WebSocketServer({ noServer: true });
const glassesClients = new Set();

server.on('upgrade', (req, socket, head) => {
  const { pathname } = url.parse(req.url);
  if (pathname === '/glasses-ws') {
    wss.handleUpgrade(req, socket, head, (ws) => {
      wss.emit('connection', ws, req);
    });
  } else {
    socket.destroy();
  }
});

wss.on('connection', (ws, req) => {
  glassesClients.add(ws);
  ws.on('message', (raw) => {
    try {
      const msg = JSON.parse(raw.toString());
      switch (msg.type) {
        case 'auth':
          ws.send(JSON.stringify({ type: 'auth_status', status: 'success' }));
          break;
        case 'button_press':
        case 'head_position':
          // Log inputs for debugging
          console.log('Input from glasses:', msg);
          break;
        default:
          console.log('Unknown message:', msg);
      }
    } catch (e) {
      console.error('Invalid WS message', e);
    }
  });
  ws.on('close', () => glassesClients.delete(ws));
});

function broadcastToGlasses(message) {
  for (const client of glassesClients) {
    if (client.readyState === 1) {
      client.send(message);
    }
  }
}

server.listen(PORT, () => {
  console.log(`Mock Cloud running on http://localhost:${PORT}`);
  console.log(`WS glasses endpoint: ws://localhost:${PORT}/glasses-ws`);
  console.log('POST layout to /broadcast/layout to push to HUD');
});
