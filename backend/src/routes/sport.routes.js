import express from "express";
import { auth } from "../middleware/auth.js";
import { createSport, getSports } from "../controllers/sport.controller.js";

const router = express.Router();

// POST /api/sport (admin only)
router.post("/", auth("admin"), createSport);

// GET /api/sport
router.get("/", getSports);

export default router;