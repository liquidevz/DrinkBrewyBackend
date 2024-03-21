// eslint-disable-next-line no-undef
const express = require("express")
const router = express.Router()
// eslint-disable-next-line no-undef
const categories = require("../controllers/category")

// Import verifyToken function
// eslint-disable-next-line no-undef
const verifyToken = require("../config/jwt")

router.post("admin/category", verifyToken, categories.createCategory)

router.get("admin/categories", verifyToken, categories.getCategories)

router.get("/admin/category/:slug", verifyToken, categories.getCategoryBySlug)

router.put("admin/category/:slug", verifyToken, categories.updateCategoryBySlug)
router.delete(
	"admin/category/:slug",
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
// eslint-disable-next-line no-undef
module.exports = router
