// eslint-disable-next-line no-undef
const express = require("express");
const router = express.Router();
// eslint-disable-next-line no-undef
const reviewRoutes = require("../controllers/review");
// Import verifyToken function
// eslint-disable-next-line no-undef
const verifyToken = require("../config/jwt");
//user routes
router.get("/reviews/:pid", reviewRoutes.getReviewsbyPid);
router.post("/reviews", verifyToken, reviewRoutes.createReview);

//admin routes
router.get("/admin/reviews", verifyToken, reviewRoutes.getReviewsForAdmin);
router.post("/admin/review", verifyToken, reviewRoutes.createReviewForAdmin);
// eslint-disable-next-line no-undef
module.exports = router;
