const express = require("express");
const { body } = require("express-validator");
const { validate } = require("../middleware/validate");
const { requireAuth, requireAdmin } = require("../middleware/auth");
const adminController = require("../controllers/adminController");

const router = express.Router();

// All admin management routes require admin authentication
router.use(requireAuth, requireAdmin);

/**
 * GET /api/admins
 */
router.get("/", adminController.getAll);

/**
 * POST /api/admins
 */
router.post(
  "/",
  [
    body("name").trim().notEmpty().withMessage("Name is required."),
    body("mobile")
      .trim()
      .notEmpty()
      .withMessage("Mobile number is required.")
      .isLength({ min: 10, max: 10 })
      .withMessage("Mobile number must be 10 digits.")
      .isNumeric()
      .withMessage("Mobile number must contain only digits."),
    body("password")
      .notEmpty()
      .withMessage("Password is required.")
      .isLength({ min: 4 })
      .withMessage("Password must be at least 4 characters."),
  ],
  validate,
  adminController.create
);

/**
 * PUT /api/admins/:id
 */
router.put(
  "/:id",
  [
    body("name").trim().notEmpty().withMessage("Name is required."),
    body("mobile")
      .trim()
      .notEmpty()
      .withMessage("Mobile number is required.")
      .isLength({ min: 10, max: 10 })
      .withMessage("Mobile number must be 10 digits.")
      .isNumeric()
      .withMessage("Mobile number must contain only digits."),
    body("password")
      .optional()
      .isLength({ min: 4 })
      .withMessage("Password must be at least 4 characters."),
  ],
  validate,
  adminController.update
);

/**
 * DELETE /api/admins/:id
 */
router.delete("/:id", adminController.delete);

module.exports = router;
