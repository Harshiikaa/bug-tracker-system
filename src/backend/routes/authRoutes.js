// src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { register, login, getProfile, updateProfile, adminRegister } = require('../controllers/authController');
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');
const { validateRegister, validateLogin } = require('../validators/authValidators');
const { handleValidationErrors } = require('../middlewares/validationMiddleware');
const asyncHandler = require('../middlewares/asyncHandler');

router.post('/register',validateRegister, handleValidationErrors, asyncHandler(register));
router.post('/login',validateLogin,handleValidationErrors, asyncHandler(login));
router.get('/profile', protect, getProfile);
router.put('/profile/:id', protect, updateProfile);
router.post('/admin/register', protect, authorizeRoles('Admin'), adminRegister);

module.exports = router;