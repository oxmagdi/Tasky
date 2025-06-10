// Built-in Node modules
const fs = require("fs"); // To manage image file deletion
const path = require("path"); // To safely construct file paths

// External packages
const Joi = require("joi"); // Used for validating task input data
const Task = require("../models/Task"); // Sequelize Task model
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
    const task = await Task.create({ ...value, image, userId: req.user.id }); // Create task with authenticated user's ID

    const imageUrl = image ? `${config.imageStorage.baseUrl}/${image}` : null; // Generate public image URL
    res.status(201).json({ message: "Task created", task: { ...task.toJSON(), image: imageUrl } }); // Respond with task data
  } catch (err) {
    res.status(500).json({ error: err.message }); // Handle unexpected errors
  }
};


// ✅ READ all tasks for user
const getMyTasks = async (req, res) => {
  try {
    const tasks = await Task.findAll({ where: { userId: req.user.id } }); // Fetch all tasks for logged-in user

    // Map each task to include full image URL if it exists
    const withUrls = tasks.map(task => ({
      ...task.toJSON(),
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
    // Find the task owned by the authenticated user
    const task = await Task.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!task) return res.status(404).json({ message: "Task not found" });

    const imageUrl = task.image ? `${config.imageStorage.baseUrl}/${task.image}` : null; // Attach image URL
    res.json({ ...task.toJSON(), image: imageUrl }); // Respond with task data
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ✅ UPDATE task
const updateTask = async (req, res) => {
  try {
    const { error, value } = taskSchema.validate(req.body); // Validate input
    if (error) return res.status(400).json({ error: error.details[0].message });

    const task = await Task.findOne({ where: { id: req.params.id, userId: req.user.id } }); // Find task owned by user
    if (!task) return res.status(404).json({ message: "Task not found" });

    // If new image uploaded and there's an old image → delete the old one
    if (req.file && task.image) {
      const oldPath = path.join(__dirname, "..", config.imageStorage.uploadDir, task.image);
      fs.existsSync(oldPath) && fs.unlinkSync(oldPath);
    }

    const image = req.file ? req.file.filename : task.image; // Use new image if uploaded, otherwise keep existing
    await task.update({ ...value, image }); // Update task with validated values and image name

    const imageUrl = image ? `${config.imageStorage.baseUrl}/${image}` : null;
    res.json({ message: "Task updated", task: { ...task.toJSON(), image: imageUrl } }); // Respond with updated data
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ✅ DELETE task
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOne({ where: { id: req.params.id, userId: req.user.id } }); // Find the task owned by user
    if (!task) return res.status(404).json({ message: "Task not found" });

    // Delete the image from disk if it exists
    if (task.image) {
      const imagePath = path.join(__dirname, "..", config.imageStorage.uploadDir, task.image);
      fs.existsSync(imagePath) && fs.unlinkSync(imagePath);
    }

    await task.destroy(); // Delete the task from the database
    res.json({ message: "Task deleted successfully" });
  } catch (err) {
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