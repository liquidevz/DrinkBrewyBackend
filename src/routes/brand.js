// eslint-disable-next-line no-undef
const express = require("express");
const router = express.Router();
// eslint-disable-next-line no-undef
const brand = require("../controllers/brand");

// Import verifyToken function
// eslint-disable-next-line no-undef
const verifyToken = require("../config/jwt");

// admin routes

router.post("/admin/brands", verifyToken, brand.createBrand);

router.get("/admin/brands", verifyToken, brand.getAllBrands);

router.get("/admin/brand/:slug", verifyToken, brand.getBrandBySlug);

router.put("/admin/brand/:slug", verifyToken, brand.updateBrandBySlug);

router.delete("/admin/brand/:slug", verifyToken, brand.deleteBrandBySlug);

router.get("/admin/brands/all", verifyToken, brand.getBrands);

// User routes

router.get("/brands", brand.getAllBrands);
// eslint-disable-next-line no-undef
module.exports = router;
