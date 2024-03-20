// eslint-disable-next-line no-undef
const express = require("express");
const router = express.Router();
// eslint-disable-next-line no-undef
const best_seller = require("../controllers/best-seller");

router.get("/best-seller", best_seller.BestSellerProducts);
// eslint-disable-next-line no-undef
module.exports = router;
