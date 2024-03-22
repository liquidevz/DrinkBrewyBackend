const express = require('express');
const router = express.Router();
const best_seller = require('../controllers/best-seller');


router.get('/best-seller', best_seller.BestSellerProducts);


module.exports = router;
