// eslint-disable-next-line no-undef
const express = require("express");
const router = express.Router();
// eslint-disable-next-line no-undef
const subcategories = require("../controllers/subcategory");

// eslint-disable-next-line no-undef
const verifyToken = require("../config/jwt");

router.post(
  "admin/subcategory",
  verifyToken,
  subcategories.createsubcategories,
);

router.get(
  "/admin/subcategories",
  verifyToken,
  subcategories.getAllSubCategories,
);

router.get(
  "/admin/subcategory/:slug",
  verifyToken,
  subcategories.getSubCategoriesBySlug,
);

router.put(
  "/admin/subcategory/:slug",
  verifyToken,
  subcategories.updateSubCategoriesBySlug,
);

router.delete(
  "/admin/subcategory/:slug",
  verifyToken,
  subcategories.deleteSubCategoriesBySlug,
);
router.get(
  "/admin/subcategories/all",
  verifyToken,
  subcategories.getSubCategories,
);

// User routes

router.get("/subcategories", subcategories.getSubCategories);
router.get("/subcategories/all", subcategories.getAllSubCategories);

router.get("/subcategories/:slug", subcategories.getSubCategoriesBySlug);

// eslint-disable-next-line no-undef
module.exports = router;
