const express = require("express");
const authRoutes = require("./authRoutes");
const staffRoutes = require("./staffRoutes");
const adminRoutes = require("./adminRoutes");
const attendanceRoutes = require("./attendanceRoutes");

const router = express.Router();

/**
 * Mount all route groups under /api
 */
router.use("/", authRoutes);           // POST /api/login
router.use("/staff", staffRoutes);      // /api/staff/*
router.use("/admins", adminRoutes);     // /api/admins/*
router.use("/attendance", attendanceRoutes); // /api/attendance/*

module.exports = router;
