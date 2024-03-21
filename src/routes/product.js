// eslint-disable-next-line no-undef
const express = require("express");
const router = express.Router();
// eslint-disable-next-line no-undef
const product = require("../controllers/product");

// Import verifyToken function
// eslint-disable-next-line no-undef
const verifyToken = require("../config/jwt");

// admin routes

router.post("/admin/products", verifyToken, product.createProduct);
router.get("/admin/products", verifyToken, product.GetAllProductsForAdmin);
router.get("/admin/products/:slug", verifyToken, product.getOneProductBySlug);
router.put("/admin/products/:slug", verifyToken, product.updateProductBySlug);

router.delete(
  "/admin/products/:slug",
  verifyToken,
  product.deletedProductBySlug,
);

// user routes
// Define your routes here
router.get("/products", product.getProducts);
router.get("/products/filters", product.getFilters);
router.get("/filters/:category", product.getFiltersByCategory);
router.get("/filters/:category/:subcategory", product.getFiltersBySubCategory);
router.get("/products/:slug", product.getOneProductBySlug);
router.get("/products-slugs", product.getAllProductSlug);
// eslint-disable-next-line no-undef
module.exports = router;
