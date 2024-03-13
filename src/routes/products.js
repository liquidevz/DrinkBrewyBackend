const express = require('express');
const router = express.Router();
const productsController = require('../controllers/products');
router.get('/products', productsController.getProducts);
router.get('/products/filters', productsController.getFilters);
module.exports = router;
