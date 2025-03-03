const WebSocket = require('ws');
const http = require('http');

// Create WebSocket server
const wss = new WebSocket.Server({ port: 8080 });

// Handle WebSocket connections
wss.on('connection', (ws) => {
  console.log('WebSocket client connected.');

  // This WebSocket connection is independent of HTTP server
  ws.on('close', () => {
    console.log('WebSocket client disconnected.');
  });
});

// Create HTTP server to handle notification requests

const server = http.createServer((req, res) => {
  let body = '';
  req.on('data', (chunk) => {
    body += chunk;
  });
  req.on('end', () => {
    try {
      const data = JSON.parse(body);
      console.log('Received notifyClient request:', data);
      
      // Notify all connected WebSocket clients
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send('Valid');
        }
      });

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true }));
    } catch (error) {
      console.error('Error processing request:', error.message);
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: 'Invalid JSON payload' }));
    }
  });
});

// Start the HTTP server
server.listen(8081, () => {
  console.log('HTTP server listening on http://localhost:8081');
});

console.log('WebSocket server running on ws://localhost:8080');
