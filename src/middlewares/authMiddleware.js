const jwt = require("jsonwebtoken"); // Import JWT for token verification
const config = require("../config/config"); // Import configuration settings

// Middleware to authenticate requests
const authenticate = (req, res, next) => {
    const token = req.header("Authorization"); // Get token from request headers

    if (!token) return res.status(401).json({ message: "Access denied. No token provided." });
    // If no token is found, deny access

    try {
        const decoded = jwt.verify(token.replace("Bearer ", ""), config.jwt.secret); 
        // Verify token using secret key & remove "Bearer " prefix if present

        req.user = decoded; // Attach decoded user info to request object
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        res.status(403).json({ message: "Invalid or expired token." }); 
        // Handle authentication failure
    }
};

module.exports = authenticate; // Export middleware for use in routes