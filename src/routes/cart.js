// eslint-disable-next-line no-undef
const express = require("express");
const router = express.Router();
// eslint-disable-next-line no-undef
const cart = require("../controllers/cart");

router.post("/cart", cart.createCart);
// eslint-disable-next-line no-undef
module.exports = router;
