const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend files
app.use(express.static(path.join(__dirname, 'public')));

// API routes
app.get('/api/status', (req, res) => {
  res.json({ status: 'BRICKS VMS running', activeCameras: 0 });
});

app.get('/api/cameras', (req, res) => {
  res.json([
    { id: 1, name: 'Bodycam 001', status: 'online' },
    { id: 2, name: 'Bodycam 002', status: 'offline' }
  ]);
});

app.post('/api/log', (req, res) => {
  const { cameraId, message } = req.body;
  console.log(`Log from camera ${cameraId}: ${message}`);
  res.json({ success: true });
});

// Catch-all route for frontend (works with Express 4 & 5)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`BRICKS VMS Dashboard running on port ${PORT}`);
});
