const express = require("express");
const authenticate = require("../middlewares/authMiddleware"); // Protect routes with JWT
const {
  createUser,
  getUserById,
  updateUser,
  deleteUser
} = require("../controllers/UserCtrl"); // Import user controller

const router = express.Router();

// ✅ Require auth for all other user routes
router.use(authenticate);

// 🔍 Get a user by ID
router.get("/users/:id", getUserById);

// ✏️ Update a user by ID
router.put("/users/:id", updateUser);

// ❌ Delete a User (and its releated Tasks if exists)
router.delete("/users/:id", deleteUser);

module.exports = router;