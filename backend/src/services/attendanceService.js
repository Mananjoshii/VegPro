const attendanceRepository = require("../repositories/attendanceRepository");
const userRepository = require("../repositories/userRepository");
const { AppError } = require("../middleware/errorHandler");
const ExcelJS = require("exceljs");

/**
 * Get current date and time in IST (India Standard Time)
 * @returns {{ date: string, time: string, yearMonth: string }}
 */
function getISTDateTime() {
  const now = new Date();
  // IST is UTC+5:30
  const istOffset = 5.5 * 60 * 60 * 1000;
  const istDate = new Date(now.getTime() + istOffset);

  const date = istDate.toISOString().split("T")[0]; // "YYYY-MM-DD"
  const time = istDate.toISOString().split("T")[1].split(".")[0]; // "HH:MM:SS"
  const yearMonth = date.substring(0, 7); // "YYYY-MM"

  return { date, time, yearMonth };
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
   * @param {boolean} isHalfDay
   * @returns {Object} Attendance record
   */
  async checkIn(userId, isHalfDay = false) {
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
      status: isHalfDay ? "Half Day" : "Present",
    });
  },

  /**
   * Mark checkout for a user.
   *
   * @param {string} userId
   * @returns {Object} Updated attendance record
   */
  async checkOut(userId) {
    const { date, time } = getISTDateTime();

    const existing = await attendanceRepository.findByUserAndDate(userId, date);
    if (!existing) {
      throw new AppError(
        "You haven't checked in today.",
        400,
        "NOT_CHECKED_IN"
      );
    }

    if (existing.checkOutTime) {
      throw new AppError(
        "You have already checked out today.",
        409,
        "ALREADY_CHECKED_OUT"
      );
    }

    return attendanceRepository.update(existing.id, {
      checkOutTime: time,
    });
  },

  /**
   * Get today's attendance with summary.
   * Returns all attendance records for today plus counts.
   *
   * @returns {Object} { records, totalStaff, presentToday, absentToday, totalWorkHoursStr, totalWorkMins }
   */
  async getTodayAttendance() {
    const { date } = getISTDateTime();

    const [records, totalStaff, presentCount] = await Promise.all([
      attendanceRepository.findByDate(date),
      userRepository.countByRole("STAFF"),
      attendanceRepository.countByDate(date),
    ]);

    // Calculate total working hours from records
    let totalWorkMins = 0;
    records.forEach((record) => {
      if (record.checkInTime && record.checkOutTime) {
        const [inH, inM] = record.checkInTime.split(":");
        const [outH, outM] = record.checkOutTime.split(":");
        
        const inDate = new Date(2000, 0, 1, parseInt(inH), parseInt(inM));
        const outDate = new Date(2000, 0, 1, parseInt(outH), parseInt(outM));
        
        const diffMs = outDate - inDate;
        if (diffMs > 0) {
          totalWorkMins += Math.floor(diffMs / 60000);
        }
      }
    });

    const hours = Math.floor(totalWorkMins / 60);
    const mins = totalWorkMins % 60;
    const totalWorkHoursStr = `${hours}h ${mins}m`;

    return {
      date,
      records,
      totalStaff,
      presentToday: presentCount,
      absentToday: totalStaff - presentCount,
      totalWorkHoursStr,
      totalWorkMins
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

  /**
   * Get monthly summary for a user.
   *
   * @param {string} userId
   * @returns {Object} Summary counts for current month
   */
  async getMyMonthlySummary(userId) {
    const { yearMonth } = getISTDateTime();
    const records = await attendanceRepository.getMonthlySummary(userId, yearMonth);

    let present = 0;
    let halfDay = 0;

    records.forEach(record => {
      if (record.status === "Half Day") {
        halfDay++;
      } else {
        present++;
      }
    });

    return {
      month: yearMonth,
      present,
      halfDay,
      total: present + halfDay
    };
  },

  /**
   * Export all attendance data to Excel buffer
   */
  async exportToExcel() {
    const records = await attendanceRepository.findAll();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Attendance Data");

    worksheet.columns = [
      { header: "Date", key: "date", width: 15 },
      { header: "Staff Name", key: "name", width: 25 },
      { header: "Mobile", key: "mobile", width: 15 },
      { header: "Check In", key: "checkInTime", width: 15 },
      { header: "Check Out", key: "checkOutTime", width: 15 },
      { header: "Status", key: "status", width: 15 },
      { header: "Work Hours", key: "workHours", width: 15 },
    ];

    records.forEach((record) => {
      let workHours = "N/A";
      if (record.checkInTime && record.checkOutTime) {
        const [inH, inM] = record.checkInTime.split(":");
        const [outH, outM] = record.checkOutTime.split(":");
        
        const inDate = new Date(2000, 0, 1, parseInt(inH), parseInt(inM));
        const outDate = new Date(2000, 0, 1, parseInt(outH), parseInt(outM));
        
        const diffMs = outDate - inDate;
        if (diffMs > 0) {
          const totalWorkMins = Math.floor(diffMs / 60000);
          const hours = Math.floor(totalWorkMins / 60);
          const mins = totalWorkMins % 60;
          workHours = `${hours}h ${mins}m`;
        }
      }

      worksheet.addRow({
        date: record.date,
        name: record.user?.name || "Unknown",
        mobile: record.user?.mobile || "Unknown",
        checkInTime: record.checkInTime,
        checkOutTime: record.checkOutTime || "-",
        status: record.status,
        workHours: workHours,
      });
    });

    // Style headers
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).alignment = { horizontal: "center" };

    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
  }
};

module.exports = attendanceService;
