import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../cloudinary.js"; // Import Cloudinary config

// Configure Multer with Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "user-uploads", // Specify folder name
    allowed_formats: ["jpg", "jpeg", "png"], // Allowed file types
  },
});

const upload = multer({ storage });

// Controller function for file upload
export const uploadImage = (req, res) => {
  if (req.file) {
    res.status(200).json({ url: req.file.path }); // Return the uploaded file's URL
  } else {
    res.status(400).json({ error: "File upload failed" });
  }
};

export const uploadMiddleware = upload.single("image"); // Middleware for single image uploads