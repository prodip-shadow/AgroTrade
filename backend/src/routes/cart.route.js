const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

// All cart routes require user authentication to guarantee per-user persistent storage
router.get('/', verifyToken, cartController.getCart);
router.post('/', verifyToken, cartController.addToCart);
router.post('/sync', verifyToken, cartController.syncGuestCart);
router.patch('/:productId', verifyToken, cartController.updateQuantity);
router.put('/:productId', verifyToken, cartController.updateQuantity);
router.delete('/:productId', verifyToken, cartController.removeFromCart);
router.delete('/', verifyToken, cartController.clearCart);

module.exports = router;
