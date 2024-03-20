// eslint-disable-next-line no-undef
const express = require("express");
const router = express.Router();
// eslint-disable-next-line no-undef
const userController = require("../controllers/user");

router.get("/users/profile", userController.getOneUser);

router.put("/users/profile", userController.updateUser);

router.get("users/invoice", userController.getInvoice);

router.put("users/changepassword", userController.changePassword);

// eslint-disable-next-line no-undef
module.exports = router;
