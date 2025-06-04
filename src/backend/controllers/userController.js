// src/controllers/userController.js
const asyncHandler = require("../middlewares/asyncHandler");
const User = require("../models/User");
const { body, param, validationResult } = require("express-validator");

// Get all users
const getAllUsers = async (req, res) => {
  const users = await User.find().select("-password");
  return sendSuccess(res, 200, "Users fetched successfully", users);
};

// Get user by ID
const getUserById = async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) {
    return sendError(res, 404, "User not found");
  }
  return sendSuccess(res, 200, "User fetched successfully", user);
};

// Get Developers in the bug (assignedTo field)

const getDevelopers = async (req, res) => {
  const developers = await User.find({ role: "User" }).select("_id name email");
  return sendSuccess(res, 200, "Developers fetched successfully", developers);
};

// Update user
const updateUser = async (req, res) => {
  const { name, email, role } = req.body;
  const user = await User.findById(req.params.id);
  if (!user) {
    return sendError(res, 404, "User not found");
  }
  if (email) {
    const existingUser = await User.findOne({ email });
    const isDifferentUser =
      existingUser && existingUser._id.toString() !== user._id.toString();

    if (isDifferentUser) {
      return sendError(res, 400, "Email already in use");
    }
  }
  const updates = { name, email, role };
  Object.keys(updates).forEach(
    (key) => updates[key] === undefined && delete updates[key]
  );
  const updatedUser = await User.findByIdAndUpdate(req.params.id, updates, {
    new: true,
  }).select("-password");
  return sendSuccess(res, 200, "User updated successfully", updatedUser);
};

// Delete user
const deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return sendError(res, 404, "User not found");
  }
  if (user._id.toString() === req.user._id.toString()) {
    return sendError(res, 403, "Cannot delete own admin account");
  }
  await user.deleteOne();
  return sendSuccess(res, 200, "User deleted successfully");
};

module.exports = {
  getAllUsers,
  getDevelopers,
  getUserById,
  updateUser,
  deleteUser,
};
