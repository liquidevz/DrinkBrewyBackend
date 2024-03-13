const express = require("express");
const router = express.Router();
const subcategories = require("../controllers/subcategories");

// Import verifyToken function
const verifyToken = require("../config/jwt");

router.post(
  "/admin/subcategory",
  verifyToken,
  subcategories.createsubcategories
);

router.get(
  "/admin/subcategories",
  verifyToken,
  subcategories.getAllSubCategories
);

router.get(
  "/admin/subcategory/:slug",
  verifyToken,
  subcategories.getSubCategoriesBySlug
);

router.put(
  "/admin/subcategory/:slug",
  verifyToken,
  subcategories.updateSubCategoriesBySlug
);

router.delete(
  "/admin/subcategory/:slug",
  verifyToken,
  subcategories.deleteSubCategoriesBySlug
);
router.get(
    "/admin/subcategories/all",
    verifyToken,
    subcategories.getSubCategories
  );
  
// User routes

router.get("/subcategories", subcategories.getSubCategories);
router.get("/all-subcategories", subcategories.getAllSubCategories);

router.get("/subcategory/:slug", subcategories.getSubCategoriesBySlug);

module.exports = router;
