const express = require('express');
const router = express.Router();
const orderRoutes = require('../controllers/order');
// Import verifyToken function
const verifyToken = require('../config/jwt');
//user routes
router.post('/order', orderRoutes.createOrder);
router.get('/order', orderRoutes.getOrderById);

//admin routes

module.exports = router;
