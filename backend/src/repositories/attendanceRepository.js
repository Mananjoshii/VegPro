const prisma = require("../utils/prisma");

/**
 * Data access layer for the Attendance model.
 * All database queries for attendance records go through this repository.
 */
const attendanceRepository = {
  /**
   * Create a new attendance record
   */
  async create(data) {
    return prisma.attendance.create({
      data,
      include: {
        user: {
          select: { id: true, name: true, mobile: true },
        },
      },
    });
  },

  /**
   * Find attendance record for a specific user on a specific date
   */
  async findByUserAndDate(userId, date) {
    return prisma.attendance.findUnique({
      where: {
        userId_date: { userId, date },
      },
    });
  },

  /**
   * Get all attendance records for a specific date
   */
  async findByDate(date) {
    return prisma.attendance.findMany({
      where: { date },
      include: {
        user: {
          select: { id: true, name: true, mobile: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  /**
   * Get attendance history for a specific user
   * Optionally filter by date range
   */
  async findByUserId(userId, { startDate, endDate } = {}) {
    const where = { userId };

    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = startDate;
      if (endDate) where.date.lte = endDate;
    }

    return prisma.attendance.findMany({
      where,
      orderBy: { date: "desc" },
    });
  },

  /**
   * Count attendance records for a specific date
   */
  async countByDate(date) {
    return prisma.attendance.count({ where: { date } });
  },

  /**
   * Update an existing attendance record
   */
  async update(id, data) {
    return prisma.attendance.update({
      where: { id },
      data,
    });
  },

  /**
   * Get summary for a user in a specific month
   */
  async getMonthlySummary(userId, yearMonth) {
    // yearMonth is like "2026-07"
    return prisma.attendance.findMany({
      where: {
        userId,
        date: {
          startsWith: yearMonth,
        },
      },
    });
  },
  /**
   * Get all attendance records across all dates
   */
  async findAll() {
    return prisma.attendance.findMany({
      include: {
        user: {
          select: { id: true, name: true, mobile: true, role: true },
        },
      },
      orderBy: [{ date: "desc" }, { checkInTime: "desc" }],
    });
  },
};

module.exports = attendanceRepository;
