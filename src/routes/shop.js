const express = require('express');
const router = express.Router();
const shop = require('../controllers/shop');
// Import verifyToken function
const verifyToken = require('../config/jwt');

router.get('/vendor/shops', shop.getShops);
router.post('/vendor/shops', verifyToken, shop.createShop);
router.get('/vendor/shops/:sid', verifyToken, shop.createShop);
router.put('/vendor/shops/:id', verifyToken, shop.createShop);
router.delete('/vendor/shops/:id', verifyToken, shop.createShop);

module.exports = router;
