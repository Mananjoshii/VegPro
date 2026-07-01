const express = require("express");
const { requireAuth, requireAdmin } = require("../middleware/auth");
const attendanceController = require("../controllers/attendanceController");

const router = express.Router();

/**
 * POST /api/attendance/checkin
 * Authenticated — any user can mark their own attendance
 */
router.post("/checkin", requireAuth, attendanceController.checkIn);

/**
 * POST /api/attendance/checkout
 * Authenticated — any user can checkout
 */
router.post("/checkout", requireAuth, attendanceController.checkOut);

/**
 * GET /api/attendance/status
 * Authenticated — check if current user has marked today
 */
router.get("/status", requireAuth, attendanceController.getMyStatus);

/**
 * GET /api/attendance/my-summary
 * Authenticated — get current user's monthly summary
 */
router.get("/my-summary", requireAuth, attendanceController.getMySummary);

/**
 * GET /api/attendance/my-history
 * Authenticated — get current user's attendance history
 */
router.get("/my-history", requireAuth, attendanceController.getMyHistory);

/**
 * GET /api/attendance/today
 * Admin only — get today's attendance with summary
 */
router.get("/today", requireAuth, requireAdmin, attendanceController.getToday);

/**
 * GET /api/attendance/user/:id
 * Admin only — get attendance history for a specific user
 */
router.get(
  "/user/:id",
  requireAuth,
  requireAdmin,
  attendanceController.getUserHistory
);

module.exports = router;
