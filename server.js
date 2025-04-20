const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { spawn } = require('child_process');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const port = parseInt(process.env.PORT, 10) || 3000;

app.prepare().then(() => {
  // Start FastAPI backend
  console.log('Starting FastAPI backend...');
  const fastapi = spawn('python', ['-m', 'uvicorn', 'api.main:app', '--host', '0.0.0.0', '--port', '8000']);
  
  fastapi.stdout.on('data', (data) => {
    console.log(`FastAPI: ${data}`);
  });
  
  fastapi.stderr.on('data', (data) => {
    console.error(`FastAPI Error: ${data}`);
  });
  
  fastapi.on('close', (code) => {
    console.log(`FastAPI process exited with code ${code}`);
  });

  // Start Next.js frontend
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('Shutting down...');
  process.exit();
});