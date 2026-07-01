require("dotenv").config();

const express = require("express");
const cors = require("cors");
const routes = require("./src/routes");
const { errorHandler } = require("./src/middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 5000;

// --------------- Middleware ---------------

// CORS — allow frontend to connect
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
    credentials: true,
  })
);

// Parse JSON bodies
app.use(express.json());

// --------------- Routes ---------------

// Health check
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "VegPro Attendance API is running 🌿",
    timestamp: new Date().toISOString(),
  });
});

// Mount all API routes under /api
app.use("/api", routes);

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: "NOT_FOUND",
      message: `Route ${req.method} ${req.originalUrl} not found.`,
    },
  });
});

// --------------- Error Handler ---------------

app.use(errorHandler);

// --------------- Start Server ---------------

app.listen(PORT, () => {
  console.log("");
  console.log("🌿 VegPro Attendance API");
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log("");
});

module.exports = app;
