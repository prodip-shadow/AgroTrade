const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
const { allowRoles } = require('../middlewares/role.middleware');

// Public product & category routes
router.get('/categories', productController.getCategories);
router.get('/', productController.getProducts);

// Farmer & Admin: Add product according to categories
router.post('/', verifyToken, allowRoles('farmer', 'admin'), productController.createProduct);

// Farmer & Admin: View own uploaded products
router.get('/mine', verifyToken, allowRoles('farmer', 'admin'), productController.getMyProducts);

module.exports = router;
