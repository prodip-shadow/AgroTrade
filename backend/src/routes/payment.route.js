const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

// View payment history for customer
router.get('/mine', verifyToken, paymentController.getMyPayments);

// View payment details for an order (Customer can see own order, Admin can see any)
router.get('/order/:id', verifyToken, paymentController.getOrderPayments);

module.exports = router;
