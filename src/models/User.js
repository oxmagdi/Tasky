// src/models/User.js

// ✅ Correct: require Mongoose directly
const mongoose = require("mongoose");

// Define User schema using Mongoose
const userSchema = new mongoose.Schema({
    name: { type: String, required: true }, // User's name (required)
    countryCode: { type: String, required: true }, // Country code (required)
    phone: { type: String, required: true, unique: true }, // Unique phone number (required)
    yearsOfExperience: { type: Number }, // Optional years of experience
    experienceLevel: { 
        type: String, 
        enum: ["junior", "mid", "senior", "expert"] 
    }, // Experience level (optional, must match one of the enum values)
    address: { type: String }, // Optional address field
    password: { type: String, required: true } // User password (required)
}, { 
    timestamps: true // Enables createdAt and updatedAt timestamps
});

// Create User model from schema
const User = mongoose.model("User", userSchema);

module.exports = User; // Export model for use across the app