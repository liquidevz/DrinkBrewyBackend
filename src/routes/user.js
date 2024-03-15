const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");


router.get("/user/profile", userController.getOneUser);

router.put("/user/profile", userController.updateUser);

router.get("/user/invoice", userController.getInvoice);

router.put("/user/changepassword", userController.changePassword);



module.exports = router;
