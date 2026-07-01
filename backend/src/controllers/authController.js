const authService = require("../services/authService");

/**
 * Auth controller — handles login requests.
 */
const authController = {
  /**
   * POST /api/login
   * Body: { mobile, password? }
   */
  async login(req, res, next) {
    try {
      const { mobile, password } = req.body;
      const result = await authService.login(mobile, password || null);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = authController;
