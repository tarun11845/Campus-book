import express from "express";
import { auth } from "../middleware/auth.js";
import {
  createBooking,
  getMyBookings,
  getAllBookings,
  cancelBooking,
  adminCancelBooking
} from "../controllers/bookings.controller.js";

const router = express.Router();

// POST /api/bookings
router.post("/", auth(), createBooking);

// GET /api/bookings/my-bookings
router.get("/my-bookings", auth(), getMyBookings);

// GET /api/bookings/all (admin only)
router.get("/all", auth("admin"), getAllBookings);

// POST /api/bookings/cancel
router.post("/cancel", auth(), cancelBooking);

// POST /api/bookings/admin-cancel (admin only)
router.post("/admin-cancel", auth("admin"), adminCancelBooking);

export default router;