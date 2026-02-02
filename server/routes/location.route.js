import express from "express";
import axios from "axios";

const router = express.Router();

router.get("/location", async (req, res) => {
  try {
    const response = await axios.get("https://ipwho.is/");
    res.json(response.data);
    console.log(response.data.country_code)
  } catch (err) {
    console.error("IP Location Error:", err.message);
    res.status(500).json({ error: "Failed to fetch location" });
  }
});

export default router;