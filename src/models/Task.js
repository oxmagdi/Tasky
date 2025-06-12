// src/models/Task.js

// ✅ Correct: require Mongoose directly
const mongoose = require("mongoose");

// Define Task schema using Mongoose
const taskSchema = new mongoose.Schema({
    image: { type: String }, // Optional image URL or path
    title: { type: String, required: true }, // Task title (required)
    description: { type: String }, // Optional description field
    priority: { 
        type: String, 
        enum: ["low", "medium", "high"], 
        default: "medium"
    }, // Priority with default value (required)
    dueDate: { type: Date }, // Optional due date
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", // Reference User model
        required: true 
    } // Link task to a specific user
}, { 
    timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Create Task model from schema
const Task = mongoose.model("Task", taskSchema);

module.exports = Task; // Export Task model for use across the app