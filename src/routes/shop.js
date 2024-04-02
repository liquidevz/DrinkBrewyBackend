const express = require('express');
const router = express.Router();
const shop = require('../controllers/shop');
// Import verifyToken function
const verifyToken = require('../config/jwt');
//Admin routes
router.get('/admin/shops',verifyToken, shop.getShopsByAdmin);
router.post('/admin/shops', verifyToken, shop.createShopByAdmin);
router.get('/admin/shops/:sid', verifyToken, shop.getOneShopByAdmin);
router.put('/admin/shops/:sid', verifyToken, shop.updateOneShopByAdmin);
router.put('/admin/shops/status/:sid', verifyToken, shop.updateShopStatusByAdmin);
router.delete('/admin/shops/:sid', verifyToken, shop.deleteOneShopByAdmin);
//Vendor routes
router.post('/vendor/shops', verifyToken, shop.createShopByVendor);
router.get('/vendor/shops/:sid', verifyToken, shop.getOneShopByVendor);
router.put('/vendor/shops/:sid', verifyToken, shop.updateOneShopByVendor);
router.delete('/vendor/shops/:sid', verifyToken, shop.deleteOneShopByVendor);
//User routes
router.get('/shops', shop.getAllShops);
router.get('/shops/:sid',shop.getOneShopByUser);
module.exports = router;
