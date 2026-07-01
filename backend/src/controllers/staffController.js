const userService = require("../services/userService");

/**
 * Staff controller — handles CRUD for staff members.
 * All endpoints require admin authentication.
 */
const staffController = {
  /**
   * GET /api/staff
   */
  async getAll(req, res, next) {
    try {
      const staff = await userService.getAllStaff();
      res.json({ success: true, data: staff });
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /api/staff
   * Body: { name, mobile }
   */
  async create(req, res, next) {
    try {
      const { name, mobile } = req.body;
      const staff = await userService.createStaff({ name, mobile });
      res.status(201).json({ success: true, data: staff });
    } catch (error) {
      next(error);
    }
  },

  /**
   * PUT /api/staff/:id
   * Body: { name, mobile }
   */
  async update(req, res, next) {
    try {
      const { id } = req.params;
      const { name, mobile } = req.body;
      const staff = await userService.updateStaff(id, { name, mobile });
      res.json({ success: true, data: staff });
    } catch (error) {
      next(error);
    }
  },

  /**
   * DELETE /api/staff/:id
   */
  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const result = await userService.deleteUser(id, "STAFF");
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = staffController;
