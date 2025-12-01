import http from 'http';

const layout = {
  id: 'example-app-layout',
  elements: [
    {
      id: 'headline',
      type: 'text',
      position: { x: 40, y: 40 },
      size: { width: 720, height: 48 },
      content: 'Hello from Display Example!',
      style: { fontSize: '22px', color: '#ffffff', textAlign: 'center' }
    },
    {
      id: 'desc',
      type: 'text',
      position: { x: 60, y: 100 },
      size: { width: 680, height: 40 },
      content: 'Este layout se envió por HTTP al Mock Cloud y llegó al HUD.',
      style: { fontSize: '14px', color: '#cbd5e1' }
    }
  ]
};

const data = JSON.stringify({ layout });

const req = http.request(
  {
    hostname: 'localhost',
    port: 8787,
    path: '/broadcast/layout',
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) }
  },
  (res) => {
    let body = '';
    res.on('data', (chunk) => (body += chunk));
    res.on('end', () => console.log('Response:', body));
  }
);

req.on('error', (err) => console.error('Error:', err));
req.write(data);
req.end();

