const express = require("express"); // Import Express framework
const cors = require("cors"); // Enable CORS for cross-origin requests
const path = require("path"); // Handle file paths safely
const config = require("./config/config"); // Import configuration settings

const mongooseDB = require("./database/mongoose"); // Import MongoDB connection

// Route files
const authRoutes = require("./routes/authRoute"); // Authentication routes
const userRoutes = require("./routes/userRoute"); // User-related routes
const taskRoutes = require("./routes/taskRoute"); // Task-related routes

const app = express(); // Initialize Express app

// ✅ Connect to MongoDB
mongooseDB.connect();

// ✅ Enable Cross-Origin Resource Sharing (CORS)
app.use(cors());

// ✅ Parse JSON and URL-encoded request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Serve static files (image uploads) from configured directory
app.use(`/${config.imageStorage.uploadDir}`, express.static(path.join(__dirname, "..", config.imageStorage.uploadDir)));

// ✅ API routes
app.use("/api", authRoutes); // Auth endpoints (signup, login, refresh)
app.use("/api", userRoutes); // User endpoints
app.use("/api", taskRoutes); // Task endpoints

// ✅ Start server on configured port
app.listen(config.port, () => {
    console.log(`🚀 Server running at http://localhost:${config.port}`);
});