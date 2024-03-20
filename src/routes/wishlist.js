// eslint-disable-next-line no-undef
const express = require("express");
const router = express.Router();
// eslint-disable-next-line no-undef
const wishlistRoutes = require("../controllers/wishlist");

//user routes
router.get("/wishlist", wishlistRoutes.getWishlist);
router.post("/wishlist", wishlistRoutes.createWishlist);

// eslint-disable-next-line no-undef
module.exports = router;
