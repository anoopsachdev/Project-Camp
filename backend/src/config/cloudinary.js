import { v2 as cloudinary } from "cloudinary";

// Debug: Check if Cloudinary credentials are loaded
console.log("[Cloudinary] Config check:", {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? "✓" : "✗",
  api_key: process.env.CLOUDINARY_API_KEY ? "✓" : "✗",
  api_secret: process.env.CLOUDINARY_API_SECRET ? "✓" : "✗",
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET?.trim(), // Trim in case of whitespace
});

/**
 * Upload a file buffer to Cloudinary
 * @param {Buffer} fileBuffer - The file buffer
 * @param {string} originalName - Original filename for reference
 * @param {string} folder - Folder path in Cloudinary
 * @returns {Promise<object>} - Cloudinary upload result
 */
export const uploadToCloudinary = async (
  fileBuffer,
  originalName,
  folder = "attachments",
) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        resource_type: "auto", // Automatically detect file type
        public_id: `${Date.now()}-${originalName.replace(/\.[^/.]+$/, "")}`, // Remove extension for public_id
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      },
    );
    uploadStream.end(fileBuffer);
  });
};

/**
 * Delete a file from Cloudinary by public_id
 * @param {string} publicId - The public_id of the file
 * @returns {Promise<object>} - Cloudinary deletion result
 */
export const deleteFromCloudinary = async (publicId) => {
  return cloudinary.uploader.destroy(publicId, { resource_type: "auto" });
};

/**
 * Extract public_id from Cloudinary URL
 * @param {string} url - Cloudinary URL
 * @returns {string|null} - public_id or null
 */
export const getPublicIdFromUrl = (url) => {
  if (!url || !url.includes("cloudinary.com")) {
    return null;
  }
  // URL format: https://res.cloudinary.com/{cloud_name}/{resource_type}/upload/{version}/{folder}/{public_id}.{ext}
  const matches = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[^.]+)?$/);
  return matches ? matches[1] : null;
};

export default cloudinary;
