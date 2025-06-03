// src/controllers/userController.js
const asyncHandler = require("../middlewares/asyncHandler");
const User = require("../models/User");
const { body, param, validationResult } = require("express-validator");

// Get all users
const getAllUsers = async (req, res) => {
    const users = await User.find().select("-password");
    res.json({ users });
  };

// Get user by ID
const getUserById =async (req, res) => {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.json(user);
  };

// Get Developers in the bug (assignedTo field)

const getDevelopers = async (req, res) => {
    const developers = await User.find({ role: "User" }).select(
      "_id name email"
    );
    res.status(200).json({ success: true, data: developers });
  };

// Update user
const updateUser = async (req, res) => {
    const { name, email, role } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    if (email) {
      const existingUser = await User.findOne({ email });
      if (existingUser && existingUser._id.toString() !== user._id.toString()) {
        return res
          .status(400)
          .json({ success: false, message: "Email already in use" });
      }
    }
    const updates = { name, email, role };
    Object.keys(updates).forEach(
      (key) => updates[key] === undefined && delete updates[key]
    );
    const updatedUser = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    }).select("-password");
    res.json({ success: true, user: updatedUser });
  };

// Delete user
const deleteUser = async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    if (user._id.toString() === req.user._id.toString()) {
      return res
        .status(403)
        .json({ success: false, message: "Cannot delete own admin account" });
    }
    await user.deleteOne();
    res.json({ success: true, message: "User deleted successfully" });
  };

module.exports = {
  getAllUsers,
  getDevelopers,
  getUserById,
  updateUser,
  deleteUser,
};
