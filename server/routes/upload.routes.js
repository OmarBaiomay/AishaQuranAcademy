import express from "express";
import getCloudinaryUploader from "../middleware/cloudinaryMulter.js";
import cloudinary from "../lib/cloudinary.js";
const router = express.Router();

// 👇 Upload to blogs folder
router.post("/image/blog", async (req, res, next) => {
  try {
    const upload = getCloudinaryUploader("blogs").single("image");
    upload(req, res, function (err) {
      if (err) {
        console.error("⚠️ Multer/Cloudinary error:", err);
        return res.status(500).json({ message: "Upload failed", error: err.message });
      }
      if (!req.file?.path) {
        return res.status(400).json({ message: "No image uploaded" });
      }

      return res.status(200).json({
        url: req.file.path,
        public_id: req.file.filename, // 👈 this is the key used for deletion
      });
    });
  } catch (e) {
    return res.status(500).json({ message: "Unexpected error", error: e.message });
  }
});


// 👇 Upload to courses folder
router.post(
  "/image/course",
  getCloudinaryUploader("courses").single("image"), // ⬅️ must match frontend FormData.append("image", file)
  (req, res) => {
    if (!req.file?.path) {
      return res.status(400).json({ message: "Upload failed" });
    }
    res.status(200).json({ url: req.file.path });
  }
);

// 👇 Upload to users folder
router.post("/image/user", getCloudinaryUploader("users").single("image"), (req, res) => {
  if (!req.file?.path) {
    return res.status(400).json({ message: "Upload failed" });
  }

  res.status(200).json({ url: req.file.path });
});

// 👇 Upload to chat folder (images/audio)
router.post(
  "/file/chat",
  getCloudinaryUploader("chat", ["jpg", "jpeg", "png", "webp", "mp3", "wav", "ogg", "m4a", "webm"]).single("file"),
  (req, res) => {
    if (!req.file?.path) {
      return res.status(400).json({ message: "Upload failed" });
    }
    // Determine file type
    const mime = req.file.mimetype;
    let type = 'file';
    if (mime.startsWith('image/')) type = 'image';
    else if (mime.startsWith('audio/')) type = 'audio';
    res.status(200).json({ url: req.file.path, type });
  }
);


router.post("/delete-image", async (req, res) => {
  const { publicId } = req.body;
  try {
    await cloudinary.uploader.destroy(publicId);
    res.json({ message: "Deleted successfully" });
  } catch (e) {
    res.status(500).json({ error: "Deletion failed" });
  }
});


export default router;