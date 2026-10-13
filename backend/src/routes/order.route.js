const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
const { allowRoles } = require('../middlewares/role.middleware');

// Customer only: Place an order
router.post('/', verifyToken, allowRoles('customer'), orderController.placeOrder);

// Customer only: View personal order history
router.get('/mine', verifyToken, allowRoles('customer'), orderController.getMyOrders);

// Customer only: Cancel a placed order
router.patch('/:id/cancel', verifyToken, allowRoles('customer'), orderController.cancelOrder);

module.exports = router;
