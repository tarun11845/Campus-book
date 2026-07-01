import express from "express";
import Facility from "../models/Facility.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.post("/", auth("admin"), async (req, res) => {
  try {
    const facility = await Facility.create(req.body);
    res.status(201).json(facility);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  const { sportId } = req.query;
  const facilities = await Facility.find({
    sport: sportId,
    isActive: true,
  }).populate("sport");
  res.json(facilities);
});

export default router;
