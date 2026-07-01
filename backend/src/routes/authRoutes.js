const express = require("express");
const { body } = require("express-validator");
const { validate } = require("../middleware/validate");
const authController = require("../controllers/authController");

const router = express.Router();

/**
 * POST /api/login
 * Public — no auth required
 */
router.post(
  "/login",
  [
    body("mobile")
      .trim()
      .notEmpty()
      .withMessage("Mobile number is required.")
      .isLength({ min: 10, max: 10 })
      .withMessage("Mobile number must be 10 digits.")
      .isNumeric()
      .withMessage("Mobile number must contain only digits."),
  ],
  validate,
  authController.login
);

module.exports = router;
