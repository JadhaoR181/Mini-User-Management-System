const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

// DEBUG: Check if all functions are imported
console.log('authController:', Object.keys(authController));
// public routes
router.post('/signup', authController.signup);
router.post('/login', authController.login);

//routes protection
router.get('/me', authenticateToken, authController.getCurrentUser);
router.post('/logout', authenticateToken, authController.logout);

module.exports = router;
