// eslint-disable-next-line no-undef
const express = require("express");
const router = express.Router();
// eslint-disable-next-line no-undef
const homeController = require("../controllers/home");
router.get("/home/categories", homeController.getCategories);
router.get("/home/products/top", homeController.getTopProducts);
router.get("/home/brands", homeController.getBrands);
// eslint-disable-next-line no-undef
module.exports = router;
