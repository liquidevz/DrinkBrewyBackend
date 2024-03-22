const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin');
const verifyToken = require('../config/jwt');

router.get('/admin/users', verifyToken, adminController.getUsersForAdmin);

router.get('/admin/users/:id', verifyToken, adminController.getOrdersByUid);

router.put('/admin/users/:id', verifyToken, adminController.UpdateRoleForAdmin);

// eslint-disable-next-line no-undef

module.exports = router;
