const mongoose = require('mongoose')
const logger = require('../utils/logger');


const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.DATABASE_URI, {
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        })

        logger.info(`MongoDB Connected ${conn.connection.host}`);

        mongoose.connection.on('error', (err) => {
            logger.warn(`MongoDB Connection error: ${err.message}`)
        })

        mongoose.connection.on('disconnected', () => {
            logger.error(`MongoDB disconnected. Attemtping restart 😎`);
        })

    } catch (error) {
        logger.error(`MongoDB connection failed: ${error.message}`);
        process.exit(1);
    }
}
module.exports = connectDB;