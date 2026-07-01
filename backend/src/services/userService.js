const bcrypt = require("bcryptjs");
const userRepository = require("../repositories/userRepository");
const { AppError } = require("../middleware/errorHandler");

/**
 * User management service.
 * Handles business logic for creating, updating, and deleting Staff and Admin users.
 */
const userService = {
  /**
   * Get all staff members
   */
  async getAllStaff() {
    return userRepository.findAllByRole("STAFF");
  },

  /**
   * Get all admin users
   */
  async getAllAdmins() {
    return userRepository.findAllByRole("ADMIN");
  },

  /**
   * Create a new staff member
   * @param {Object} data - { name, mobile }
   */
  async createStaff({ name, mobile }) {
    // Check if mobile already exists
    const existing = await userRepository.findByMobile(mobile);
    if (existing) {
      throw new AppError("Mobile number already registered.", 409, "DUPLICATE_MOBILE");
    }

    return userRepository.create({
      name,
      mobile,
      role: "STAFF",
    });
  },

  /**
   * Create a new admin user
   * @param {Object} data - { name, mobile, password }
   */
  async createAdmin({ name, mobile, password }) {
    const existing = await userRepository.findByMobile(mobile);
    if (existing) {
      throw new AppError("Mobile number already registered.", 409, "DUPLICATE_MOBILE");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    return userRepository.create({
      name,
      mobile,
      password: hashedPassword,
      role: "ADMIN",
    });
  },

  /**
   * Update a staff member
   * @param {string} id
   * @param {Object} data - { name, mobile }
   */
  async updateStaff(id, { name, mobile }) {
    const user = await userRepository.findById(id);
    if (!user || user.role !== "STAFF") {
      throw new AppError("Staff member not found.", 404, "NOT_FOUND");
    }

    // Check if new mobile conflicts with another user
    if (mobile && mobile !== user.mobile) {
      const existing = await userRepository.findByMobile(mobile);
      if (existing) {
        throw new AppError("Mobile number already registered.", 409, "DUPLICATE_MOBILE");
      }
    }

    return userRepository.update(id, { name, mobile });
  },

  /**
   * Update an admin user
   * @param {string} id
   * @param {Object} data - { name, mobile, password }
   */
  async updateAdmin(id, { name, mobile, password }) {
    const user = await userRepository.findById(id);
    if (!user || user.role !== "ADMIN") {
      throw new AppError("Admin not found.", 404, "NOT_FOUND");
    }

    // Check if new mobile conflicts with another user
    if (mobile && mobile !== user.mobile) {
      const existing = await userRepository.findByMobile(mobile);
      if (existing) {
        throw new AppError("Mobile number already registered.", 409, "DUPLICATE_MOBILE");
      }
    }

    const updateData = { name, mobile };

    // Only hash and update password if a new one is provided
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    return userRepository.update(id, updateData);
  },

  /**
   * Delete a user (staff or admin)
   * @param {string} id
   * @param {string} role - Expected role ("STAFF" or "ADMIN")
   */
  async deleteUser(id, role) {
    const user = await userRepository.findById(id);
    if (!user || user.role !== role) {
      throw new AppError(`${role === "STAFF" ? "Staff member" : "Admin"} not found.`, 404, "NOT_FOUND");
    }

    await userRepository.delete(id);
    return { message: `${role === "STAFF" ? "Staff member" : "Admin"} deleted successfully.` };
  },

  /**
   * Get total staff count
   */
  async getStaffCount() {
    return userRepository.countByRole("STAFF");
  },
};

module.exports = userService;
