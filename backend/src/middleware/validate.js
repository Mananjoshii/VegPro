const { validationResult } = require("express-validator");

/**
 * Middleware: Validate request using express-validator rules.
 * Returns 400 with validation errors if any rules fail.
 */
function validate(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Validation failed.",
        details: errors.array().map((err) => ({
          field: err.path,
          message: err.msg,
        })),
      },
    });
  }

  next();
}

module.exports = { validate };
