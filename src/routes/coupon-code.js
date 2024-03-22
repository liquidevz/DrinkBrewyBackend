const express = require("express")
const router = express.Router()
const couponCodeRoutes = require("../controllers/coupon-code")
// Import verifyToken function
const verifyToken = require("../config/jwt")
//user routes
router.get("/coupon-codes/:code", couponCodeRoutes.getCouponCodeByCode)

//admin routes
router.get(
	"/admin/coupon-codes",
	verifyToken,
	couponCodeRoutes.getCouponCodesForAdmin
)
router.post(
	"/admin/coupon-codes",
	verifyToken,
	couponCodeRoutes.createCouponCodeForAdmin
)
router.get(
	"/admin/coupon-codes/:id",
	verifyToken,
	couponCodeRoutes.getOneCouponCodeForAdmin
)
router.put(
	"/admin/coupon-codes/:id",
	verifyToken,
	couponCodeRoutes.updatedCouponCodeForAdmin
)
router.delete(
	"/admin/coupon-codes/:id",
	verifyToken,
	couponCodeRoutes.deleteCouponCodeForAdmin
)

module.exports = router
