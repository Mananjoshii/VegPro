const userService = require("../services/userService");

/**
 * Admin controller — handles CRUD for admin users.
 * All endpoints require admin authentication.
 */
const adminController = {
  /**
   * GET /api/admins
   */
  async getAll(req, res, next) {
    try {
      const admins = await userService.getAllAdmins();
      res.json({ success: true, data: admins });
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /api/admins
   * Body: { name, mobile, password }
   */
  async create(req, res, next) {
    try {
      const { name, mobile, password } = req.body;
      const admin = await userService.createAdmin({ name, mobile, password });
      res.status(201).json({ success: true, data: admin });
    } catch (error) {
      next(error);
    }
  },

  /**
   * PUT /api/admins/:id
   * Body: { name, mobile, password? }
   */
  async update(req, res, next) {
    try {
      const { id } = req.params;
      const { name, mobile, password } = req.body;
      const admin = await userService.updateAdmin(id, { name, mobile, password });
      res.json({ success: true, data: admin });
    } catch (error) {
      next(error);
    }
  },

  /**
   * DELETE /api/admins/:id
   */
  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const result = await userService.deleteUser(id, "ADMIN");
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = adminController;
