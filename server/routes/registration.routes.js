import express from "express";
import { sendRegistrationEmail } from "../services/mailService.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const formData = req.body;
    await sendRegistrationEmail(formData);
    res.status(200).json({ message: "Registration submitted and email sent!" });
  } catch (err) {
    res.status(500).json({ message: "Failed to send registration email", error: err.message });
  }
});

export default router;
