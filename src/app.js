const express = require("express");
const cors = require("cors");
const path = require("path");
const config = require("./config/config");

const sequelize = require('./database/sequelize');

// Route files
const authRoutes = require("./routes/authRoute");
const userRoutes = require("./routes/userRoute");
const taskRoutes = require("./routes/taskRoute");

const app = express();

// ✅ Enable Cross-Origin Resource Sharing (CORS)
app.use(cors());

// ✅ Parse JSON and URL-encoded request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Test Database Connection
sequelize.authenticate()
    .then(() => console.log('Database connected successfully'))
    .catch(err => console.error('Unable to connect to DB:', err));

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