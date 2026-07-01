const attendanceService = require("../services/attendanceService");

/**
 * Attendance controller — handles check-in, today's view, and history.
 */
const attendanceController = {
  /**
   * POST /api/attendance/checkin
   * Uses authenticated user's ID from JWT.
   */
  async checkIn(req, res, next) {
    try {
      const userId = req.user.id;
      const { isHalfDay } = req.body;
      const attendance = await attendanceService.checkIn(userId, isHalfDay);

      res.status(201).json({
        success: true,
        data: attendance,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /api/attendance/checkout
   */
  async checkOut(req, res, next) {
    try {
      const userId = req.user.id;
      const attendance = await attendanceService.checkOut(userId);
      res.json({ success: true, data: attendance });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/attendance/today
   * Admin only — returns today's attendance with summary.
   */
  async getToday(req, res, next) {
    try {
      const result = await attendanceService.getTodayAttendance();
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/attendance/user/:id
   * Admin only — returns attendance history for a specific user.
   * Query params: startDate, endDate (optional)
   */
  async getUserHistory(req, res, next) {
    try {
      const { id } = req.params;
      const { startDate, endDate } = req.query;

      const result = await attendanceService.getUserHistory(id, {
        startDate,
        endDate,
      });

      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/attendance/status
   * Returns current user's attendance status for today.
   */
  async getMyStatus(req, res, next) {
    try {
      const userId = req.user.id;
      const attendance = await attendanceService.checkTodayStatus(userId);

      res.json({
        success: true,
        data: {
          markedToday: !!attendance,
          attendance,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/attendance/my-summary
   * Returns current user's monthly attendance summary.
   */
  async getMySummary(req, res, next) {
    try {
      const userId = req.user.id;
      const summary = await attendanceService.getMyMonthlySummary(userId);
      res.json({ success: true, data: summary });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/attendance/my-history
   * Returns current user's attendance history.
   * Query params: startDate, endDate (optional)
   */
  async getMyHistory(req, res, next) {
    try {
      const userId = req.user.id;
      const { startDate, endDate } = req.query;

      const result = await attendanceService.getUserHistory(userId, {
        startDate,
        endDate,
      });

      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = attendanceController;
