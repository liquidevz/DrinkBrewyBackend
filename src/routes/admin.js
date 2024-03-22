const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin");
const verifyToken = require("../config/jwt");

router.get("/admin/users", adminController.getUsersForAdmin);

router.get("/admin/users/:id", adminController.getOrdersByUid);

router.put("/admin/users/:id", adminController.UpdateRoleForAdmin);

module.exports = router;
