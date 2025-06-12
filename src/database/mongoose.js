// src/database/mongoose.js
const mongoose = require("mongoose"); // Import Mongoose library for MongoDB interaction
const { db } = require("../config/config"); // Import database configuration from config file

// Define a Database class to manage MongoDB connection
class Database {
    constructor() {
        if (!Database.instance) { // Check if an instance of the class already exists
            this.connect(); // If not, establish the connection
            Database.instance = this; // Store the instance to ensure singleton behavior
        }
        return Database.instance; // Always return the same instance
    }

    async connect() { // Asynchronous function to connect to MongoDB
        try {
            await mongoose.connect(db.uri, { // Use URI from config file to connect
                useNewUrlParser: true, // Enable new URL parser for MongoDB driver
                useUnifiedTopology: true, // Use the new Server Discover and Monitoring engine
            });
            console.log("MongoDB connected successfully!"); // Log success message
        } catch (error) { // Catch any connection errors
            console.error("MongoDB connection error:", error); // Log error details
            process.exit(1); // Exit process if connection fails
        }
    }
}

// Create an instance of the Database class
const databaseInstance = new Database(); 
Object.freeze(databaseInstance); // Ensure the instance remains unchanged (singleton pattern)

module.exports = databaseInstance; // Export the singleton instance for use across the app