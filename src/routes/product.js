const express = require('express');
const router = express.Router();
const product = require('../controllers/product');

// Import verifyToken function
const verifyToken = require('../config/jwt');

// Admin routes

router.post('/admin/products', verifyToken, product.createProductByAdmin);
router.get('/admin/products', verifyToken, product.getProductsByAdmin);
router.get('/admin/products/:slug', verifyToken, product.getOneProductByAdmin);
router.put('/admin/products/:slug', verifyToken, product.updateProductByAdmin);

router.delete(
  '/admin/products/:slug',
  verifyToken,
  product.deletedProductByAdmin
);
// User routes

router.get('/products', product.getProducts);
router.get('/products/filters', product.getFilters);
router.get('/filters/:category', product.getFiltersByCategory);
router.get('/filters/:category/:subcategory', product.getFiltersBySubCategory);
router.get('/products/:slug', product.getOneProductBySlug);
router.get('/products-slugs', product.getAllProductSlug);
router.get('/related-products/:pid', product.relatedProducts);

module.exports = router;
