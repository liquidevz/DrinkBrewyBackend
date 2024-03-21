// eslint-disable-next-line no-undef
const express = require("express");
const router = express.Router();
// eslint-disable-next-line no-undef
const notificationRoutes = require("../controllers/notification");
// Import verifyToken function
// eslint-disable-next-line no-undef
const verifyToken = require("../config/jwt");

//admin routes
router.get(
  "/admin/notifications",
  verifyToken,
  notificationRoutes.getNotifications,
);
router.post(
  "/admin/notifications",
  verifyToken,
  notificationRoutes.createNotification,
);
// eslint-disable-next-line no-undef
module.exports = router;
