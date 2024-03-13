const express = require("express");
const router = express.Router();
const categories = require("../controllers/category");

// Import verifyToken function
const verifyToken = require("../config/jwt");

router.post(
  "/admin/category",
  verifyToken,
  categories.createCategory
);

router.get(
  "/admin/categories",
  verifyToken,
  categories.getCategories
);

router.get(
  "/admin/category/:slug",
  verifyToken,
  categories.getCategoryBySlug
);

router.put(
  "/admin/category/:slug",
  verifyToken,
  categories.updateCategoryBySlug
);

router.delete(
  "/admin/category/:slug",
  verifyToken,
  categories.deleteCategoryBySlug
);
router.get(
    "/admin/categories/all",
    verifyToken,
    categories.getCategories
  );
  
// User routes

router.get("/categories", categories.getCategories);
router.get("/all-categories", categories.getAllCategories);

router.get("/category/:slug", categories.getCategoryBySlug);

module.exports = router;
