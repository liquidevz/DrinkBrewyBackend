const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');

const verifyToken = require('../config/jwt');
router.get('/users/profile', verifyToken, userController.getOneUser);

router.put('/users/profile', verifyToken, userController.updateUser);

router.get('/users/invoice', verifyToken, userController.getInvoice);

router.put(
  '/users/change-password',
  verifyToken,
  userController.changePassword
);

module.exports = router;
