import Facility from "../models/Facility.js";

/* =========================
   CREATE FACILITY
========================= */
export const createFacility = async (req, res) => {
  try {
    const facility = await Facility.create(req.body);
    res.status(201).json(facility);
  } catch (err) {
    console.error("Error creating facility:", err);
    res.status(400).json({ error: err.message });
  }
};

/* =========================
   GET FACILITIES BY SPORT
========================= */
export const getFacilities = async (req, res) => {
  try {
    const { sportId } = req.query;
    const facilities = await Facility.find({
      sport: sportId,
      isActive: true,
    }).populate("sport");
    res.json(facilities);
  } catch (err) {
    console.error("Error fetching facilities:", err);
    res.status(500).json({ error: "Failed to fetch facilities" });
  }
};