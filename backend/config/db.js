const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        if (!process.env.MONGODB_URI || process.env.MONGODB_URI === 'your_mongodb_connection_string_here') {
            console.warn("MongoDB URI is missing or default. Skipping database connection for now.");
            return;
        }
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        return conn;
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        // Instead of exiting, we throw so the caller knows it failed
        throw error;
    }
};

module.exports = connectDB;
