const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
const { allowRoles } = require('../middlewares/role.middleware');

// Public authentication routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected profile route
router.get('/me', verifyToken, authController.getMe);

// Farmers directory route (accessible only by farmers and admins)
router.get('/farmers', verifyToken, allowRoles('farmer', 'admin'), authController.getFarmers);

module.exports = router;
