// src/controolers/AuthCtrl.js

const jwt = require("jsonwebtoken"); // Import JWT for token generation
const Joi = require("joi"); // Import Joi for input validation
const { hashPassword, verifyPassword } = require("../utils/passwordUtils"); // Import password utilities
const User = require("../models/User"); // Import Mongoose User model
const config = require("../config/config"); // Import configuration settings

// Validation schema for user signup
const signupSchema = Joi.object({
    name: Joi.string().min(3).required(), // Name must be at least 3 characters
    countryCode: Joi.string().pattern(/^\+\d{1,4}$/).required(), // Must start with '+'
    phone: Joi.string().pattern(/^\d{7,15}$/).required(), // Ensure phone number is 7-15 digits long
    yearsOfExperience: Joi.number().integer().min(0).max(50).optional(), // Experience range validation
    experienceLevel: Joi.string().valid("junior", "mid", "senior", "expert").optional(), // Restrict to valid levels
    address: Joi.string().optional(), // Address is optional
    password: Joi.string().min(8).required(), // Password must be at least 8 characters
});

// Function to generate an access token
const generateAccessToken = (userId) => {
    return jwt.sign({ id: userId }, config.jwt.secret, { expiresIn: config.jwt.expiresIn });
};

// Function to generate a refresh token
const generateRefreshToken = (userId) => {
    return jwt.sign({ id: userId }, config.jwt.refreshSecret, { expiresIn: config.jwt.refreshExpiresIn });
};

// Temporary storage for valid refresh tokens (use a database in production)
const refreshTokens = [];

// User signup function
const signupUser = async (req, res) => {
    try {
        const { error, value } = signupSchema.validate(req.body); // Validate user input
        if (error) return res.status(400).json({ error: error.details[0].message }); // Return validation error

        value.password = await hashPassword(value.password); // Hash password before storing
        const user = new User(value); // Create user instance
        await user.save(); // Save user to MongoDB

        const accessToken = generateAccessToken(user._id); // Generate access token
        const refreshToken = generateRefreshToken(user._id); // Generate refresh token

        refreshTokens.push(refreshToken); // Store refresh token temporarily
        res.status(201).json({ message: "Signup successful!", accessToken, refreshToken });
    } catch (error) {
        res.status(500).json({ error: error.message }); // Handle any server errors
    }
};

// Login function
const loginUser = async (req, res) => {
    try {
        const { phone, password } = req.body; // Extract phone and password from request
        const user = await User.findOne({ phone }); // Search for user by phone number

        if (!user) return res.status(404).json({ message: "User not found" }); // If user not found, return error

        const validPassword = await verifyPassword(password, user.password); // Check if password matches
        if (!validPassword) return res.status(400).json({ message: "Invalid credentials" }); // Incorrect password

        const accessToken = generateAccessToken(user._id); // Generate access token
        const refreshToken = generateRefreshToken(user._id); // Generate refresh token

        refreshTokens.push(refreshToken); // Store refresh token temporarily
        res.json({ message: "Login successful", accessToken, refreshToken });
    } catch (error) {
        res.status(500).json({ error: error.message }); // Handle any server errors
    }
};

// Refresh access token
const refreshAccessToken = (req, res) => {
    const { token } = req.body; // Extract refresh token from request

    if (!token || !refreshTokens.includes(token)) {
        return res.status(403).json({ message: "Invalid or expired refresh token" }); // Reject if token is missing or invalid
    }

    jwt.verify(token, config.jwt.refreshSecret, (err, user) => {
        if (err) return res.status(403).json({ message: "Token expired or invalid" }); // Handle token expiration

        const newAccessToken = generateAccessToken(user.id); // Generate a fresh access token
        res.json({ accessToken: newAccessToken }); // Send new token to client
    });
};

module.exports = { signupUser, loginUser, refreshAccessToken }; // Export controller functions for use in routes