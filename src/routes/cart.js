const express = require('express');
const router = express.Router();
const cart = require('../controllers/cart');


router.post('/cart', cart.createCart);


module.exports = router;
