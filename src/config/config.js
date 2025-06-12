// src/config/config.js
require('dotenv').config("../../.env");

module.exports = {
    db: {
        uri: process.env.DB_URI || 'mongodb://localhost:27017/taskyDB',
    },

    port: process.env.APP_PORT || 3000,

    imageStorage: {
        uploadDir: process.env.IMAGE_UPLOAD_DIR || "../uploads", // Default folder: /uploads
        baseUrl: process.env.IMAGE_BASE_URL || "http://localhost:3000/uploads" // For public access
    },

    jwt: {
        secret: process.env.JWT_SECRET || '123456', // Secret for signing JWT tokens
        expiresIn: process.env.JWT_EXPIRES || '15m', // Access token expiration time
        refreshSecret: process.env.JWT_REFRESH_SECRET || '654321', // Secret for refresh tokens
        refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES || '7d', // Refresh token expiration time
    },
};