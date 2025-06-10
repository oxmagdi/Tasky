const readline = require("readline");
const sequelize = require("./database/sequelize");
const User = require("./src/models/User"); // Import User model
const Task = require("./src/models/Task"); // Import Task model
require("dotenv").config();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

console.log("🚀 Welcome to the Tasky Database CLI!");

rl.question("Do you want to create and sync the database? (yes/no): ", async (answer) => {
    if (answer.toLowerCase() === "yes") {
        try {
            await sequelize.sync();
            console.log("✅ Database & tables created successfully!");
        } catch (error) {
            console.error("❌ Error creating database:", error);
        }
    } else {
        console.log("❌ Database creation aborted.");
    }
    rl.close();
});
