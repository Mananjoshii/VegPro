/**
 * Custom application error class for consistent error handling.
 * Includes HTTP status code and an optional error code for the client.
 */
class AppError extends Error {
  constructor(message, statusCode, code = "ERROR") {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Centralized error handling middleware.
 * Catches all errors thrown in route handlers and sends a consistent response.
 */
function errorHandler(err, req, res, next) {
  // Default values
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";
  let code = err.code || "INTERNAL_ERROR";

  // Prisma unique constraint violation
  if (err.code === "P2002") {
    statusCode = 409;
    message = "A record with this value already exists.";
    code = "DUPLICATE_ENTRY";
  }

  // Prisma record not found
  if (err.code === "P2025") {
    statusCode = 404;
    message = "Record not found.";
    code = "NOT_FOUND";
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token.";
    code = "INVALID_TOKEN";
  }
  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token has expired.";
    code = "TOKEN_EXPIRED";
  }

  // Log error in development
  if (process.env.NODE_ENV === "development") {
    console.error("❌ Error:", err);
  }

  res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
    },
  });
}

module.exports = { AppError, errorHandler };
