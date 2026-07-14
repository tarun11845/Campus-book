import express from "express";
import { auth } from "../middleware/auth.js";
import { createFacility, getFacilities } from "../controllers/facility.controller.js";

const router = express.Router();

// POST /api/facility (admin only)
router.post("/", auth("admin"), createFacility);

// GET /api/facility?sportId=xxx
router.get("/", getFacilities);

export default router;