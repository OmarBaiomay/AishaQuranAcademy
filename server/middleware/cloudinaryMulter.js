import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../lib/cloudinary.js";

// allowedFormats is optional, defaults to images
const getCloudinaryUploader = (folderName, allowedFormats = ["jpg", "jpeg", "png", "webp"]) => {
  const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => ({
      folder: folderName, // ✅ dynamic folder
      resource_type: file.mimetype.startsWith('audio/') ? 'video' : 'image', // Cloudinary uses 'video' for audio too
      allowed_formats: allowedFormats, // ✅ now dynamic
      transformation: file.mimetype.startsWith('image/') ? [{ width: 1200, crop: "limit" }] : undefined,
    }),
  });

  return multer({ storage });
};

export default getCloudinaryUploader;
