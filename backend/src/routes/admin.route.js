const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
const { allowRoles } = require('../middlewares/role.middleware');

// All Admin routes require valid JWT token and 'admin' role
router.use(verifyToken, allowRoles('admin'));

// Admin Dashboard stats
router.get('/summary', adminController.getSummary);

// Admin View & Manage Users
router.get('/users', adminController.getUsers);
router.patch('/users/:id/status', adminController.toggleUserStatus);
router.delete('/users/:id', adminController.deleteUser);

// Admin Manage Categories
router.post('/categories', adminController.createCategory);

// Admin View Orders
router.get('/orders', adminController.getOrders);

// Admin Moderate Product (active, rejected, inactive)
router.patch('/products/:id/status', adminController.updateProductStatus);

module.exports = router;
