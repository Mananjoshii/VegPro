const attendanceRepository = require("../repositories/attendanceRepository");
const userRepository = require("../repositories/userRepository");
const { AppError } = require("../middleware/errorHandler");

/**
 * Get current date and time in IST (India Standard Time)
 * @returns {{ date: string, time: string }}
 */
function getISTDateTime() {
  const now = new Date();
  // IST is UTC+5:30
  const istOffset = 5.5 * 60 * 60 * 1000;
  const istDate = new Date(now.getTime() + istOffset);

  const date = istDate.toISOString().split("T")[0]; // "YYYY-MM-DD"
  const time = istDate.toISOString().split("T")[1].split(".")[0]; // "HH:MM:SS"

  return { date, time };
}

/**
 * Attendance service.
 * Handles business logic for attendance check-in and history retrieval.
 */
const attendanceService = {
  /**
   * Mark attendance (check-in) for a user.
   * Enforces one attendance per user per day.
   *
   * @param {string} userId
   * @returns {Object} Attendance record
   */
  async checkIn(userId) {
    const { date, time } = getISTDateTime();

    // Check if already marked today
    const existing = await attendanceRepository.findByUserAndDate(userId, date);
    if (existing) {
      throw new AppError(
        "Attendance already marked today.",
        409,
        "ALREADY_MARKED"
      );
    }

    // Verify user exists
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new AppError("User not found.", 404, "USER_NOT_FOUND");
    }

    // Create attendance record
    return attendanceRepository.create({
      userId,
      date,
      checkInTime: time,
      status: "Present",
    });
  },

  /**
   * Get today's attendance with summary.
   * Returns all attendance records for today plus counts.
   *
   * @returns {Object} { records, totalStaff, presentToday, absentToday }
   */
  async getTodayAttendance() {
    const { date } = getISTDateTime();

    const [records, totalStaff, presentCount] = await Promise.all([
      attendanceRepository.findByDate(date),
      userRepository.countByRole("STAFF"),
      attendanceRepository.countByDate(date),
    ]);

    return {
      date,
      records,
      totalStaff,
      presentToday: presentCount,
      absentToday: totalStaff - presentCount,
    };
  },

  /**
   * Get attendance history for a specific user.
   * Optionally filtered by date range.
   *
   * @param {string} userId
   * @param {Object} filters - { startDate, endDate }
   * @returns {Array} Attendance records
   */
  async getUserHistory(userId, filters = {}) {
    // Verify user exists
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new AppError("User not found.", 404, "USER_NOT_FOUND");
    }

    const records = await attendanceRepository.findByUserId(userId, filters);

    return {
      user: {
        id: user.id,
        name: user.name,
        mobile: user.mobile,
      },
      records,
    };
  },

  /**
   * Check if a user has already marked attendance today.
   *
   * @param {string} userId
   * @returns {Object|null} Attendance record or null
   */
  async checkTodayStatus(userId) {
    const { date } = getISTDateTime();
    return attendanceRepository.findByUserAndDate(userId, date);
  },
};

module.exports = attendanceService;
