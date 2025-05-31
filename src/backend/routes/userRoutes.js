// src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { getAllUsers, getUserById, updateUser, deleteUser, getDevelopers } = require('../controllers/userController');
const { protect, authorizeRoles, isAdmin } = require('../middlewares/authMiddleware');

router.get('/', protect, authorizeRoles('Admin'), getAllUsers);
router.get('/developers', protect, authorizeRoles('Admin'), getDevelopers);
router.get('/:id', protect, authorizeRoles('Admin'), getUserById);
router.put('/:id', protect, authorizeRoles('Admin'), updateUser);
router.delete('/:id', protect, authorizeRoles('Admin'), deleteUser);

module.exports = router;