const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');
router.get('/home/categories', homeController.getCategories);
router.get('/home/products/top', homeController.getTopProducts);
router.get('/home/brands', homeController.getBrands);
module.exports = router;
