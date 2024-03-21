// eslint-disable-next-line no-undef
const express = require("express")
const router = express.Router()
// eslint-disable-next-line no-undef
const wishlistRoutes = require("../controllers/wishlist")
// eslint-disable-next-line no-undef
const verifyToken = require("../config/jwt")
//user routes
router.get("/wishlist", verifyToken, wishlistRoutes.getWishlist)
router.post("/wishlist", verifyToken, wishlistRoutes.createWishlist)

// eslint-disable-next-line no-undef
module.exports = router
