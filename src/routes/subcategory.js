const express = require('express');
const router = express.Router();
const subcategories = require('../controllers/subcategory');

// Import verifyToken function
const verifyToken = require('../config/jwt');

router.post(
  '/admin/subcategories',
  verifyToken,
  subcategories.createsubcategories
);

router.get(
  '/admin/subcategories',
  verifyToken,
  subcategories.getAllSubCategories
);

router.get(
  '/admin/subcategories/:slug',
  verifyToken,
  subcategories.getSubCategoriesBySlug
);

router.put(
  '/admin/subcategories/:slug',
  verifyToken,
  subcategories.updateSubCategoriesBySlug
);

router.delete(
  '/admin/subcategories/:slug',
  verifyToken,
  subcategories.deleteSubCategoriesBySlug
);
router.get(
  '/admin/subcategories/all',
  verifyToken,
  subcategories.getSubCategories
);

// User routes

router.get('/subcategories', subcategories.getSubCategories);
router.get('/subcategories/all', subcategories.getAllSubCategories);

router.get('/subcategories/:slug', subcategories.getSubCategoriesBySlug);

module.exports = router;
