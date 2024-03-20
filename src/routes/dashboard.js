// eslint-disable-next-line no-undef
const express = require("express");
const router = express.Router();
// eslint-disable-next-line no-undef
const dashboard = require("../controllers/dashboard");

// Import verifyToken function
// eslint-disable-next-line no-undef
const verifyToken = require("../config/jwt");

router.get(
  "/admin/dashboard-analytics",
  verifyToken,
  dashboard.getDashboardAnalytics,
);

router.get("/admin/notifications", verifyToken, dashboard.getNofications);
// eslint-disable-next-line no-undef
module.exports = router;
