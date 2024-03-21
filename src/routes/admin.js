// eslint-disable-next-line no-undef
const express = require("express");
const router = express.Router();
// eslint-disable-next-line no-undef
const adminController = require("../controllers/admin");


router.get("/admin/users", adminController.getUsersForAdmin);

router.get("/admin/users/:id", adminController.getOrdersByUid);

router.put("/admin/users/:id", adminController.UpdateRoleForAdmin);
// eslint-disable-next-line no-undef
module.exports = router;
