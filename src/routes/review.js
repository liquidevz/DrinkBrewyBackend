const express = require('express');
const router = express.Router();
const reviewRoutes = require('../controllers/review');
// Import verifyToken function
const verifyToken = require('../config/jwt');
//user routes
router.post('/review', reviewRoutes.createReview);

//admin routes
router.get('/admin/reviews',verifyToken, reviewRoutes.getReviewsForAdmin);
router.post('/admin/review',verifyToken, reviewRoutes.createReviewForAdmin);


module.exports = router;
