// eslint-disable-next-line no-undef
const express = require("express");
const router = express.Router();
// eslint-disable-next-line no-undef
const orderRoutes = require("../controllers/order");
// Import verifyToken function
// eslint-disable-next-line no-undef
const verifyToken = require("../config/jwt");
//user routes
router.post("/orders", orderRoutes.createOrder);
router.get("/orders/:id", orderRoutes.getOrderById);

//admin routes
router.get("/admin/orders", verifyToken, orderRoutes.getOrderforAdmin);
router.get("/admin/orders/:id", verifyToken, orderRoutes.getOneOrderForAdmin);
router.put("/admin/orders/:id", verifyToken, orderRoutes.updateOrderForAdmin);
router.delete(
  "/admin/orders/:id",
  verifyToken,
  orderRoutes.deleteOrderForAdmin,
);
// eslint-disable-next-line no-undef
module.exports = router;
