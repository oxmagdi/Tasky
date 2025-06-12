// src/controolers/UserCtrl.js

const Joi = require("joi"); // Import Joi for validation
const User = require("../models/User"); // Import Mongoose User model
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

// Create a new user with hashed password
const createUser = async (req, res) => {
    try {
        const { error, value } = userSchema.validate(req.body); // Validate user input
        if (error) return res.status(400).json({ error: error.details[0].message }); // Return validation error

        value.password = await hashPassword(value.password); // Hash password before saving
        const user = new User(value); // Create user instance
        await user.save(); // Save user to MongoDB

        res.status(201).json({ message: "User created successfully!", user }); // Respond with success
    } catch (error) {
        res.status(500).json({ error: error.message }); // Handle server errors
    }
};

// Get user details by ID
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password"); // Fetch user without password
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

        const user = await User.findByIdAndUpdate(req.params.id, value, { new: true }); // Update user
        if (!user) return res.status(404).json({ message: "User not found or not updated" }); // Handle update failure

        res.json({ message: "User updated successfully!", user });
    } catch (error) {
        res.status(500).json({ error: error.message }); // Handle errors
    }
};

// Delete a user
const deleteUser = async (req, res) => {
    try {
        const deletedUser = await User.findOneAndDelete({ _id: userId }); // Delete user and their related tasks by ID
        if (!deletedUser) return res.status(404).json({ message: "User not found" }); // Handle missing user

        res.json({ message: "User deleted successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message }); // Handle errors
    }
};

module.exports = { createUser, getUserById, updateUser, deleteUser };