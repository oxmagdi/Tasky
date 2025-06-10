const express = require("express");
const authenticate = require("../middlewares/authMiddleware"); // Auth middleware
const upload = require("../utils/multerConfig"); // Multer upload config for image handling
const {
  createTask,
  getMyTasks,
  getTaskById,
  updateTask,
  deleteTask
} = require("../controllers/TaskCtrl"); // Task controller methods

const router = express.Router();

// Apply authentication middleware to all task routes
router.use(authenticate);

// 🆕 Create a task (with optional image)
router.post("/tasks", upload.single("image"), createTask);

// 📄 Get all tasks for the logged-in user
router.get("/tasks", getMyTasks);

// 🔍 Get one task by ID (must belong to user)
router.get("/tasks/:id", getTaskById);

// ✏️ Update a task and optionally update image
router.put("/tasks/:id", upload.single("image"), updateTask);

// ❌ Delete a task (and its image if exists)
router.delete("/tasks/:id", deleteTask);

module.exports = router;