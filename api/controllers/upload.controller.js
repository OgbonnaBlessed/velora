// Importing necessary modules
import multer from "multer"; // Multer is used for handling file uploads
import { CloudinaryStorage } from "multer-storage-cloudinary"; // Cloudinary storage configuration for Multer
import cloudinary from "../cloudinary.js"; // Import Cloudinary configuration

// Configure Multer with Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary, // Use the imported Cloudinary configuration
  params: {
    folder: "user-uploads", // Specify the Cloudinary folder where the images will be stored
    allowed_formats: ["jpg", "jpeg", "png"], // Limit accepted file formats to jpg, jpeg, and png
  },
});

// Create an upload instance using Multer with the configured storage
const upload = multer({ storage });

// Controller function to handle file uploads
export const uploadImage = (req, res) => {
  if (req.file) {
    // If file is uploaded successfully, return the URL of the uploaded image
    res.status(200).json({ url: req.file.path });
  } else {
    // If no file is uploaded or an error occurs, send an error response
    res.status(400).json({ error: "File upload failed" });
  }
};

// Middleware for handling single image uploads
// "image" is the field name used in the form
export const uploadMiddleware = upload.single("image"); // The middleware will handle a single image file upload