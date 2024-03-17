const express = require('express');
const router = express.Router();
const wishlistRoutes = require('../controllers/wishlist');
// Import verifyToken function
const verifyToken = require('../config/jwt');
//user routes
router.get('/wishlist', wishlistRoutes.getWishlist);
router.post('/wishlist', wishlistRoutes.createWishlist);



module.exports = router;
