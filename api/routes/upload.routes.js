// Import necessary modules
import express from "express"; // Import Express for routing
// Import controller functions for image upload functionality
import { uploadImage, uploadMiddleware } from "../controllers/upload.controller.js"; // Image upload controller functions

const router = express.Router(); // Create a new Express router instance

// Route for uploading an image
// POST request to /api/upload with middleware for file handling
router.post("/upload", uploadMiddleware, uploadImage); // POST request to upload image, applying uploadMiddleware for file processing

// Export the router to be used in other parts of the application
export default router;