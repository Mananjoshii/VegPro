const prisma = require("../utils/prisma");

/**
 * Data access layer for the User model.
 * All database queries for users go through this repository.
 */
const userRepository = {
  /**
   * Find a user by mobile number
   */
  async findByMobile(mobile) {
    return prisma.user.findUnique({ where: { mobile } });
  },

  /**
   * Find a user by ID
   */
  async findById(id) {
    return prisma.user.findUnique({ where: { id } });
  },

  /**
   * Get all users filtered by role
   */
  async findAllByRole(role) {
    return prisma.user.findMany({
      where: { role },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        mobile: true,
        role: true,
        createdAt: true,
      },
    });
  },

  /**
   * Create a new user
   */
  async create(data) {
    return prisma.user.create({
      data,
      select: {
        id: true,
        name: true,
        mobile: true,
        role: true,
        createdAt: true,
      },
    });
  },

  /**
   * Update a user by ID
   */
  async update(id, data) {
    return prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        mobile: true,
        role: true,
        createdAt: true,
      },
    });
  },

  /**
   * Delete a user by ID
   */
  async delete(id) {
    return prisma.user.delete({ where: { id } });
  },

  /**
   * Count users by role
   */
  async countByRole(role) {
    return prisma.user.count({ where: { role } });
  },
};

module.exports = userRepository;
