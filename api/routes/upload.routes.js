import express from "express";
import { uploadImage, uploadMiddleware } from "../controllers/upload.controller.js";

const router = express.Router();

// POST /api/upload
router.post("/upload", uploadMiddleware, uploadImage);

export default router;