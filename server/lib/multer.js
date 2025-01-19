import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.js"; // Import Cloudinary configuration

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "courses", // Specify the folder name in Cloudinary
    allowed_formats: ["jpg", "jpeg", "png"], // Allow only image files
  },
});

const upload = multer({ storage });

export default upload;
