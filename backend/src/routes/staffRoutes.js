const express = require("express");
const { body } = require("express-validator");
const { validate } = require("../middleware/validate");
const { requireAuth, requireAdmin } = require("../middleware/auth");
const staffController = require("../controllers/staffController");

const router = express.Router();

// All staff routes require admin authentication
router.use(requireAuth, requireAdmin);

/**
 * GET /api/staff
 */
router.get("/", staffController.getAll);

/**
 * POST /api/staff
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
  ],
  validate,
  staffController.create
);

/**
 * PUT /api/staff/:id
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
  ],
  validate,
  staffController.update
);

/**
 * DELETE /api/staff/:id
 */
router.delete("/:id", staffController.delete);

module.exports = router;
