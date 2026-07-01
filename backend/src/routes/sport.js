import express from "express";
import Sport from "../models/Sport.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.post("/", auth("admin"), async (req, res) => {
  try {
    const sport = await Sport.create({ name: req.body.name });
    res.status(201).json(sport);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  const sports = await Sport.find({ isActive: true });
  res.json(sports);
});

export default router;
