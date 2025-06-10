const multer = require("multer");
const path = require("path");
const config = require("../config/config");

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, config.imageStorage.uploadDir); // Save in configured upload directory
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // Extract file extension
    const timestamp = Date.now();
    const filename = `task_${timestamp}${ext}`; // Rename file: e.g., task_1718012341234.jpg
    cb(null, filename);
  }
});

const fileFilter = (req, file, cb) => {
  // Accept only image files
  if (file.mimetype.startsWith("image/")) cb(null, true);
  else cb(new Error("Only image files are allowed"), false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 } // Limit to 2MB
});

module.exports = upload;