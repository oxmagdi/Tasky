const bcrypt = require("bcrypt");

// Function to hash a password
const hashPassword = async (password) => {
    const saltRounds = 10; // Define the complexity of hashing
    const salt = await bcrypt.genSalt(saltRounds); // Generate a unique salt
    return await bcrypt.hash(password, salt); // Hash the password with the salt
};

// Function to verify a password during login
const verifyPassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword); // Compare plain text vs. hashed password
};

module.exports = { hashPassword, verifyPassword };