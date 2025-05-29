// src/controllers/userController.js
const asyncHandler = require('../middlewares/asyncHandler');
const User = require('../models/User');
const { body, param, validationResult } = require('express-validator');

// Get all users
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password');
  res.json({ users });
});

// Get user by ID
const getUserById = [
  param('id').isMongoId().withMessage('Invalid user ID'),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array().map(e => e.msg) });
    }
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json(user);
  })
];

// Update user
const updateUser = [
  param('id').isMongoId().withMessage('Invalid user ID'),
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('email').optional().isEmail().withMessage('Invalid email format'),
  body('role').optional().isIn(['User', 'Tester', 'Admin']).withMessage('Invalid role'),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array().map(e => e.msg) });
    }
    const { name, email, role } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    if (email) {
      const existingUser = await User.findOne({ email });
      if (existingUser && existingUser._id.toString() !== user._id.toString()) {
        return res.status(400).json({ success: false, message: 'Email already in use' });
      }
    }
    const updates = { name, email, role };
    Object.keys(updates).forEach(key => updates[key] === undefined && delete updates[key]);
    const updatedUser = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select('-password');
    res.json({ success: true, user: updatedUser });
  })
];

// Delete user
const deleteUser = [
  param('id').isMongoId().withMessage('Invalid user ID'),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array().map(e => e.msg) });
    }
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Cannot delete own admin account' });
    }
    await user.deleteOne();
    res.json({ success: true, message: 'User deleted successfully' });
  })
];

module.exports = { getAllUsers, getUserById, updateUser, deleteUser };