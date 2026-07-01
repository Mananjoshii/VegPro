const { verifyToken } = require("../utils/jwt");
const { AppError } = require("./errorHandler");

/**
 * Middleware: Require authentication.
 * Extracts and verifies JWT from Authorization header.
 * Attaches decoded user to req.user.
 */
function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError("Authentication required.", 401, "AUTH_REQUIRED");
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    req.user = decoded;
    next();
  } catch (error) {
    if (error.isOperational) {
      next(error);
    } else {
      next(new AppError("Invalid or expired token.", 401, "INVALID_TOKEN"));
    }
  }
}

/**
 * Middleware: Require admin role.
 * Must be used after requireAuth.
 */
function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== "ADMIN") {
    return next(new AppError("Admin access required.", 403, "FORBIDDEN"));
  }
  next();
}

module.exports = { requireAuth, requireAdmin };
