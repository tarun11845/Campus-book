import Sport from "../models/Sport.js";

/* =========================
   CREATE SPORT
========================= */
export const createSport = async (req, res) => {
  try {
    const sport = await Sport.create({ name: req.body.name });
    res.status(201).json(sport);
  } catch (err) {
    console.error("Error creating sport:", err);
    res.status(400).json({ error: err.message });
  }
};

/* =========================
   GET ALL ACTIVE SPORTS
========================= */
export const getSports = async (req, res) => {
  try {
    const sports = await Sport.find({ isActive: true });
    res.json(sports);
  } catch (err) {
    console.error("Error fetching sports:", err);
    res.status(500).json({ error: "Failed to fetch sports" });
  }
};