// eslint-disable-next-line no-undef
const express = require("express")
const router = express.Router()
// eslint-disable-next-line no-undef
const userController = require("../controllers/user")
// eslint-disable-next-line no-undef
const verifyToken = require("../config/jwt")
router.get("/users/profile", verifyToken, userController.getOneUser)

router.put("/users/profile", verifyToken, userController.updateUser)

router.get("/users/invoice", verifyToken, userController.getInvoice)

router.put("/users/change-password", verifyToken, userController.changePassword)
// eslint-disable-next-line no-undef
module.exports = router
