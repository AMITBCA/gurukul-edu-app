const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:5173",
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
});

const PORT = process.env.PORT || 5000;

// Make io accessible to our routes
app.set('io', io);

io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);
    
    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

const path = require('path');
app.use(cors());
app.use(express.json({ limit: '500mb' }));
app.use(express.urlencoded({ limit: '500mb', extended: true }));

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Initializing API Routes
app.use('/api', require('./routes/index'));

// Serve Frontend in Production
if (process.env.NODE_ENV === 'production') {
    // Set static folder
    app.use(express.static(path.join(__dirname, '../frontend/dist')));

    app.get('*', (req, res) => {
        const indexPath = path.resolve(__dirname, '../frontend', 'dist', 'index.html');
        res.sendFile(indexPath, (err) => {
            if (err) {
                console.error("❌ Error sending index.html:", err);
                res.status(500).send("Frontend build not found. Please check build logs.");
            }
        });
    });
}

// Start Server after DB Connection
const initCronJobs = require('./jobs/cronJobs');

const startServer = async () => {
    try {
        await connectDB();
        
        // Initialize Notification Cron Jobs
        initCronJobs();

        server.listen(PORT, () => {
            console.log(`🚀 Server is running on port: ${PORT}`);
        });
    } catch (error) {
        console.error('CRITICAL: Failed to start server due to DB connection error');
        process.exit(1);
    }
};

startServer();



