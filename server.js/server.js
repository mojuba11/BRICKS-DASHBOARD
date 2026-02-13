const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// ---------------- Upload Setup ----------------
const storage = multer.diskStorage({
    destination: uploadDir,
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage });

app.post('/upload-video', upload.single('video'), (req, res) => {
    console.log('Video uploaded:', req.file.filename);
    res.status(200).send('Upload successful');
});

// ---------------- Socket Events ----------------
io.on('connection', (socket) => {
    console.log('Device connected');

    socket.on('offer', (data) => {
        socket.broadcast.emit('offer', data);
    });

    socket.on('answer', (data) => {
        socket.broadcast.emit('answer', data);
    });

    socket.on('ice-candidate', (data) => {
        socket.broadcast.emit('ice-candidate', data);
    });

    socket.on('gps-update', (data) => {
        io.emit('gps-update', data);
    });

    socket.on('incident', (data) => {
        io.emit('incident', data);
    });

    socket.on('disconnect', () => {
        console.log('Device disconnected');
    });
});

// ---------------- Render Port ----------------
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`BRICKS Dashboard running on port ${PORT}`);
});
