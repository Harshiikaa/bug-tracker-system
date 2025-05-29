// src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { register, login, getProfile, updateProfile, adminRegister } = require('../controllers/authController');
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.post('/admin/register', protect, authorizeRoles('Admin'), adminRegister);

module.exports = router;