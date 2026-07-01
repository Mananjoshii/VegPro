const bcrypt = require("bcryptjs");
const userRepository = require("../repositories/userRepository");
const { generateToken } = require("../utils/jwt");
const { AppError } = require("../middleware/errorHandler");

/**
 * Authentication service.
 * Handles login logic with differentiated flow for Staff and Admin users.
 */
const authService = {
  /**
   * Login flow:
   * 1. Find user by mobile number
   * 2. If STAFF → login immediately (no password)
   * 3. If ADMIN → verify password, then login
   * 4. Return JWT token
   *
   * @param {string} mobile - Mobile number
   * @param {string|null} password - Password (required for admin only)
   * @returns {Object} { token, user }
   */
  async login(mobile, password) {
    // Find user by mobile
    const user = await userRepository.findByMobile(mobile);

    if (!user) {
      throw new AppError("Mobile number not registered.", 404, "USER_NOT_FOUND");
    }

    // If admin, require password
    if (user.role === "ADMIN") {
      if (!password) {
        // Return role info so frontend knows to show password field
        return {
          requirePassword: true,
          role: "ADMIN",
        };
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new AppError("Invalid password.", 401, "INVALID_PASSWORD");
      }
    }

    // Generate JWT token
    const token = generateToken({
      id: user.id,
      role: user.role,
      name: user.name,
      mobile: user.mobile,
    });

    return {
      requirePassword: false,
      token,
      user: {
        id: user.id,
        name: user.name,
        mobile: user.mobile,
        role: user.role,
      },
    };
  },
};

module.exports = authService;
