// eslint-disable-next-line no-undef
const express = require("express")
const router = express.Router()
// eslint-disable-next-line no-undef
const categories = require("../controllers/category")

// Import verifyToken function
// eslint-disable-next-line no-undef
const verifyToken = require("../config/jwt")

router.post("/admin/categories", verifyToken, categories.createCategory)

router.get("/admin/categories", verifyToken, categories.getCategories)

router.get("/admin/categories/:slug", verifyToken, categories.getCategoryBySlug)

router.put(
	"/admin/categories/:slug",
	verifyToken,
	categories.updateCategoryBySlug
)
router.delete(
	"/admin/categories/:slug",
	verifyToken,
	categories.deleteCategoryBySlug
)
router.get("/admin/categories/all", verifyToken, categories.getCategories)

// User routes

router.get("/categories", categories.getCategories)
router.get("/categories/all", categories.getAllCategories)
router.get("/categories-slugs", categories.getCategoriesSlugs)
router.get("/subcategories-slugs", categories.getSubCategoriesSlugs)
router.get("/categories/:slug", categories.getCategoryBySlug)
router.get("/category-title/:slug", categories.getCategoryNameBySlug)

// eslint-disable-next-line no-undef
module.exports = router
