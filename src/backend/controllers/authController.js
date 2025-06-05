// src/controllers/authController.js
const asyncHandler = require("../middlewares/asyncHandler");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const { sendError, sendSuccess } = require("../utils/response");

// Register User

const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return sendError(res, 400, "Email already exists.");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = new User({
    name,
    email,
    password: hashedPassword,
    role: role || "User", // fallback to default if not provided
  });

  await newUser.save();

  return sendSuccess(res, 201, "User created successfully.");
};

// Login User
const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  const isPasswordValid = user && (await user.comparePassword(password));

  if (!isPasswordValid) {
    return sendError(res, 401, "Invalid credentials");
  }
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  return sendSuccess(res, 200, "Login successful", {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
};

// Get User Profile
const getProfile = async (req, res) => {
  if (!req.user) {
    return sendError(res, 401, "Unauthorized");
  }
  const userProfile = {
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
    createdAt: req.user.createdAt,
  };

  return sendSuccess(res, 200, "Profile fetched successfully", userProfile);
};

// Update User Profile
const updateProfile = async (req, res) => {
  if (!req.body || typeof req.body !== "object") {
    return sendError(res, 400, "Invalid request body", [
      "Request body is missing or invalid",
    ]);
  }
  const { name, email, password } = req.body;
  const updates = {};

  if (name) updates.name = name;

  if (email) {
    const existingUser = await User.findOne({ email });
    const isAnotherUser =
      existingUser && existingUser._id.toString() !== req.user._id.toString();

    if (isAnotherUser) {
      return sendError(res, 400, "Email already in use");
    }
    updates.email = email;
  }

  if (password) {
    const salt = await bcrypt.genSalt(10);
    updates.password = await bcrypt.hash(password, salt);
  }

  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true,
  }).select("-password");

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }
  return sendSuccess(res, 200, "Profile updated successfully", {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  });
};

// Admin Register User
// const adminRegister = [
//   body("name").trim().notEmpty().withMessage("Name is required"),
//   body("email").isEmail().withMessage("Invalid email format"),
//   body("password")
//     .isLength({ min: 6 })
//     .withMessage("Password must be at least 6 characters long"),
//   body("role").isIn(["User", "Tester", "Admin"]).withMessage("Invalid role"),

//   asyncHandler(async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({
//         success: false,
//         errors: errors.array().map((e) => e.msg),
//       });
//     }

//     const { name, email, password, role } = req.body;

//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({
//         success: false,
//         message: "Email already exists",
//       });
//     }

//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     const user = new User({ name, email, password: hashedPassword, role });
//     await user.save();

//     res.status(201).json({
//       success: true,
//       message: "User registered successfully",
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//       },
//     });
//   }),
// ];

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
};
