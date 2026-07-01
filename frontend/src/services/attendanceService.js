import api from "./api";

/**
 * Attendance API service.
 */
const attendanceService = {
  /**
   * Mark attendance (check-in) for the current user
   */
  async checkIn() {
    const response = await api.post("/attendance/checkin");
    return response.data.data;
  },

  /**
   * Get current user's attendance status for today
   */
  async getMyStatus() {
    const response = await api.get("/attendance/status");
    return response.data.data;
  },

  /**
   * Get today's attendance with summary (admin only)
   */
  async getToday() {
    const response = await api.get("/attendance/today");
    return response.data.data;
  },

  /**
   * Get attendance history for a specific user (admin only)
   * @param {string} userId
   * @param {Object} filters - { startDate, endDate }
   */
  async getUserHistory(userId, filters = {}) {
    const params = {};
    if (filters.startDate) params.startDate = filters.startDate;
    if (filters.endDate) params.endDate = filters.endDate;

    const response = await api.get(`/attendance/user/${userId}`, { params });
    return response.data.data;
  },
};

export default attendanceService;
