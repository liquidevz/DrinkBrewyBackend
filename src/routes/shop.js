const express = require('express');
const router = express.Router();
const shop = require('../controllers/shop');
// Import verifyToken function
const verifyToken = require('../config/jwt');
//Admin routes
router.get('/admin/vendor/shops',verifyToken, shop.getShops);
router.post('/admin/vendor/shops', verifyToken, shop.createShop);
router.get('/admin/vendor/shops/:sid', verifyToken, shop.getShopById);
router.put('/admin/vendor/shops/:sid', verifyToken, shop.updateShopById);
router.delete('/admin/vendor/shops/:sid', verifyToken, shop.deleteShopById);
//User routes
router.get('/vendor/shops', shop.getAllShops);
router.get('/vendor/shops/:sid',shop.getShopById);
module.exports = router;
