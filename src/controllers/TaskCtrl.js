// src/controolers/TaskCtrl.js

const fs = require("fs"); // To manage image file deletion
const path = require("path"); // To safely construct file paths

// External packages
const Joi = require("joi"); // Used for validating task input data
const Task = require("../models/Task"); // Import Mongoose Task model
const config = require("../config/config"); // Centralized config for storage paths, URLs, etc.

// Define validation schema for tasks using Joi
const taskSchema = Joi.object({
  title: Joi.string().min(3).required(), // Title must be at least 3 characters and is required
  description: Joi.string().allow("").optional(), // Optional description (empty string allowed)
  priority: Joi.string().valid("low", "medium", "high").default("medium"), // Priority must be one of these three
  dueDate: Joi.date().optional() // Optional due date
});

// ✅ CREATE Task
const createTask = async (req, res) => {
  try {
    // Validate the incoming request body
    const { error, value } = taskSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message }); // Send validation error

    const image = req.file ? req.file.filename : null; // If image uploaded, get filename
    const task = new Task({ ...value, image, userId: req.user.id }); // Create task with authenticated user's ID
    await task.save(); // Save task to MongoDB

    const imageUrl = image ? `${config.imageStorage.baseUrl}/${image}` : null; // Generate public image URL
    res.status(201).json({ message: "Task created", task: { ...task.toObject(), image: imageUrl } }); // Respond with task data
  } catch (err) {
    res.status(500).json({ error: err.message }); // Handle unexpected errors
  }
};

// ✅ READ all tasks for user
const getMyTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id }); // Fetch all tasks for logged-in user

    // Map each task to include full image URL if it exists
    const withUrls = tasks.map(task => ({
      ...task.toObject(),
      image: task.image ? `${config.imageStorage.baseUrl}/${task.image}` : null
    }));

    res.json(withUrls); // Respond with list of tasks
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ READ a single task by ID
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user.id }); // Find task owned by user
    if (!task) return res.status(404).json({ message: "Task not found" });

    const imageUrl = task.image ? `${config.imageStorage.baseUrl}/${task.image}` : null; // Attach image URL
    res.json({ ...task.toObject(), image: imageUrl }); // Respond with task data
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ UPDATE task
const updateTask = async (req, res) => {
  try {
    const { error, value } = taskSchema.validate(req.body); // Validate input
    if (error) return res.status(400).json({ error: error.details[0].message });

    const task = await Task.findOne({ _id: req.params.id, userId: req.user.id }); // Find task owned by user
    if (!task) return res.status(404).json({ message: "Task not found" });

    // If new image uploaded and there's an old image → delete the old one
    if (req.file && task.image) {
      const oldPath = path.join(__dirname, "..", config.imageStorage.uploadDir, task.image);
      fs.existsSync(oldPath) && fs.unlinkSync(oldPath);
    }

    const image = req.file ? req.file.filename : task.image; // Use new image if uploaded, otherwise keep existing
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, { ...value, image }, { new: true }); // Update task

    const imageUrl = image ? `${config.imageStorage.baseUrl}/${image}` : null;
    res.json({ message: "Task updated", task: { ...updatedTask.toObject(), image: imageUrl } }); // Respond with updated data
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ DELETE task
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user.id }); // Find the task owned by user
    
    if (!task) {
      console.log("❌ Task not found for deletion:", req.params.id);
      return res.status(404).json({ message: "Task not found" });
    }

    // ✅ Step 1: Delete the image first, before removing the task
    if (task.image) {
      const imagePath = path.join(__dirname, "..", "..", config.imageStorage.uploadDir, task.image);
      console.log("🗑️ Trying to delete image:", imagePath);

      try {
        await fs.promises.unlink(imagePath);
        console.log("✅ Image deleted successfully:", imagePath);
      } catch (err) {
        if (err.code === "ENOENT") {
          console.warn("⚠️ Image file not found, skipping:", imagePath);
        } else {
          console.error("❌ Error deleting image:", err);
          return res.status(500).json({ message: "Error deleting task image" });
        }
      }
    }

    // ✅ Step 2: Delete the task from the database
    await Task.findByIdAndDelete(req.params.id);
    console.log("✅ Task deleted successfully:", req.params.id);

    res.json({ message: "Task and associated image deleted successfully" });

  } catch (err) {
    console.error("❌ Server error while deleting task:", err);
    res.status(500).json({ error: err.message });
  }
};

// Export all controller functions
module.exports = {
  createTask,
  getMyTasks,
  getTaskById,
  updateTask,
  deleteTask
};