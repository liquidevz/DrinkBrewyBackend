const express = require("express");
const router = express.Router();
const product = require("../controllers/product");

// Import verifyToken function
const verifyToken = require("../config/jwt");

// admin routes
router.post("/admin/product", verifyToken, product.createProduct);
router.get("/admin/products", verifyToken, product.GetAllProducts);
router.get(
  "/admin/product/:id",
  verifyToken,
  product.getOneProductBySlug
);
router.put(
  "/admin/product/:id",
  verifyToken,
  product.updateProductBySlug
);

router.delete(
  "/admin/product/:id",
  verifyToken,
  product.deletedProductBySlug
);

// user routes
// Define your routes here
router.get("/products", product.GetAllProducts); // Add token verification middleware
router.get("/filters/:category", product.getFiltersByCategory);
router.get("/product/:slug", product.getOneProductBySlug);
router.get("/filters", product.getAllFilters);

module.exports = router;
