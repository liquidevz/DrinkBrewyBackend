const express = require('express');
const router = express.Router();
const product = require('../controllers/product');

// Import verifyToken function
const verifyToken = require('../config/jwt');

// admin routes

router.post('/admin/product', verifyToken, product.createProduct);
router.get('/admin/products', verifyToken, product.GetAllProductsForAdmin);
router.get('/admin/product/:slug', verifyToken, product.getOneProductBySlug);
router.put('/admin/product/:slug', verifyToken, product.updateProductBySlug);

router.delete(
  '/admin/product/:slug',
  verifyToken,
  product.deletedProductBySlug
);

// user routes
// Define your routes here
router.get('/products', product.getProducts);
router.get('/products/filters', product.getFilters);
router.get('/filters/:category', product.getFiltersByCategory);
router.get('/product/:slug', product.getOneProductBySlug);
router.get('/get-products-by-slugs', product.getAllProductSlug);

module.exports = router;
