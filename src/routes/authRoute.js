const express = require("express");
const { signupUser, loginUser, refreshAccessToken } = require("../controllers/AuthCtrl");

const router = express.Router();

router.post("/auth/signup", signupUser); // Handles user signup
router.post("/auth/login", loginUser); // Handles user authentication and token issuance
router.post("/auth/refresh", refreshAccessToken); // Generates a new access token using a refresh token

module.exports = router;