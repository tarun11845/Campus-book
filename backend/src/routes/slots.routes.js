import express from "express";
import { auth } from "../middleware/auth.js";
import { createSlots, getSlots } from "../controllers/slots.controller.js";

const router = express.Router();

// POST /api/slots (admin only)
router.post("/", auth("admin"), createSlots);

// GET /api/slots/list?sportKey=swimming&from=...&to=...
router.get("/list", auth(), getSlots);

export default router;