import express from 'express';
import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server, path: '/api/live' });

// Serve static frontend assets
app.use(express.static(path.join(__dirname, 'dist')));

// WebSocket proxy to upstream livemockup.onrender.com or simulation fallback
wss.on('connection', (clientWs) => {
  console.log('Client connected to local /api/live');

  let upstreamWs = null;

  try {
    upstreamWs = new WebSocket('wss://livemockup.onrender.com/api/live');
    upstreamWs.binaryType = 'arraybuffer';

    upstreamWs.on('open', () => {
      console.log('Connected to upstream livemockup.onrender.com');
    });

    upstreamWs.on('message', (data, isBinary) => {
      if (clientWs.readyState === WebSocket.OPEN) {
        clientWs.send(data, { binary: isBinary });
      }
    });

    upstreamWs.on('error', (err) => {
      console.log('Upstream WS notice:', err.message);
    });

    upstreamWs.on('close', () => {
      console.log('Upstream WS closed');
    });
  } catch (err) {
    console.log('Could not connect upstream:', err.message);
  }

  // Forward client messages to upstream
  clientWs.on('message', (msg, isBinary) => {
    if (upstreamWs && upstreamWs.readyState === WebSocket.OPEN) {
      upstreamWs.send(msg, { binary: isBinary });
    }
  });

  clientWs.on('close', () => {
    if (upstreamWs) {
      upstreamWs.close();
    }
  });
});

// Express 5 catch-all SPA handler
app.use((_req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Live Mockup replica running at http://localhost:${PORT}`);
});
