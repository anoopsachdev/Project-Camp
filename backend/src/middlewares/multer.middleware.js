import multer from "multer";

// Use memory storage for Cloudinary uploads
// Files are stored in memory as Buffer objects
const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1000 * 1000, // 10MB limit
  },
});
