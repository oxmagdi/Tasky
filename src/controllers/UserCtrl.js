const Joi = require("joi");
const User = require("../models/User");
const { hashPassword, verifyPassword } = require("../utils/passwordUtils"); // Import password utils

// Validation schema for user input
const userSchema = Joi.object({
    name: Joi.string().min(3).required(), // Name must be at least 3 characters
    countryCode: Joi.string().pattern(/^\+\d{1,4}$/).required(), // Must start with '+' followed by digits
    phone: Joi.string().pattern(/^\d{7,15}$/).required(), // Ensure phone number is 7-15 digits long
    yearsOfExperience: Joi.number().integer().min(0).max(50).optional(), // Experience range validation
    experienceLevel: Joi.string().valid("junior", "mid", "senior", "expert").optional(), // Restrict to valid levels
    address: Joi.string().optional(), // Address is optional
    password: Joi.string().min(8).required(), // Password must be at least 8 characters
});

// Secret key for JWT authentication
const SECRET_KEY = "your_secret_key"; 

// Create a new user with hashed password
const createUser = async (req, res) => {
    try {
        const { error, value } = userSchema.validate(req.body); // Validate user input
        if (error) return res.status(400).json({ error: error.details[0].message }); // Return validation error

        value.password = await hashPassword(value.password); // Hash password before saving
        const user = await User.create(value); // Create user in the database

        res.status(201).json({ message: "User created successfully!", user }); // Respond with success
    } catch (error) {
        res.status(500).json({ error: error.message }); // Handle server errors
    }
};

// Get user details by ID
const getUserById = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id, {
            attributes: { exclude: ["password"] } // Explicitly exclude password field
        });
        if (!user) return res.status(404).json({ message: "User not found" });
        
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update user details (including password hashing)
const updateUser = async (req, res) => {
    try {
        const { error, value } = userSchema.validate(req.body); // Validate user input
        if (error) return res.status(400).json({ error: error.details[0].message }); // Return validation error

        if (value.password) value.password = await hashPassword(value.password); // Hash password if updated

        const user = await User.update(value, { where: { id: req.params.id } }); // Update user in DB
        if (!user[0]) return res.status(404).json({ message: "User not found or not updated" }); // Handle update failure

        res.json({ message: "User updated successfully!" }); // Respond with success
    } catch (error) {
        res.status(500).json({ error: error.message }); // Handle errors
    }
};

// Delete a user
const deleteUser = async (req, res) => {
    try {
        const deleted = await User.destroy({ where: { id: req.params.id } }); // Delete user by ID
        if (!deleted) return res.status(404).json({ message: "User not found" }); // Handle missing user
        res.json({ message: "User deleted successfully!" }); // Respond with success
    } catch (error) {
        res.status(500).json({ error: error.message }); // Handle errors
    }
};

module.exports = { createUser, getUserById, updateUser, deleteUser };