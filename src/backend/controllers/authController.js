// src/controllers/authController.js
const asyncHandler = require('../middlewares/asyncHandler');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

// Register User
// const register = [
//     body('name').trim().notEmpty().withMessage('Name is required'),
//     body('email').isEmail().withMessage('Invalid email format'),
//     body('password').isLength({ min: 6 }).withMessage('Password too short'),
//     body('role').optional().isIn(['User', 'Tester']).withMessage('Invalid role'),
//     asyncHandler(async (req, res) => {
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return res.status(400).json({ success: false, errors: errors.array().map(e => e.msg) });
//         }
//         const { name, email, password, role } = req.body;
//         const existingUser = await User.findOne({ email });
//         if (existingUser) {
//             return res.status(400).json({ success: false, message: 'Email already exists' });
//         }
//         const user = new User({ name, email, password, role: role || 'User' });
//         await user.save();
//         res.status(201).json({
//             success: true,
//             message: 'User registered successfully',
//             user: { id: user._id, name: user.name, email: user.email, role: user.role }
//         });
//     })
// ];

const register = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Invalid email format'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    body('role')
        .optional()
        .isIn(['User', 'Tester', 'Admin']) 
        .withMessage('Invalid role'),

    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array().map(e => e.msg)
            });
        }

        const { name, email, password, role } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Email already exists.'
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role: role || 'User' // fallback to default if not provided
        });

        await newUser.save();

        res.status(201).json({
            success: true,
            message: 'User created successfully.'
        });
    })
];

module.exports = register;


// Login User
const login = [
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').notEmpty().withMessage('Password is required'),
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array().map(e => e.msg) });
        }
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '7d' });
        res.json({
            success: true,
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
        });
    })
];

// Get User Profile
const getProfile = asyncHandler(async (req, res) => {
    res.json({
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        createdAt: req.user.createdAt
    });
});

// Update User Profile
const updateProfile = [
    body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
    body('email').optional().isEmail().withMessage('Invalid email format'),
    body('password').optional().isLength({ min: 6 }).withMessage('Password too short'),
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array().map(e => e.msg) });
        }
        const { name, email, password } = req.body;
        const updates = {};
        if (name) updates.name = name;
        if (email) {
            const existingUser = await User.findOne({ email });
            if (existingUser && existingUser._id.toString() !== req.user._id.toString()) {
                return res.status(400).json({ success: false, message: 'Email already in use' });
            }
            updates.email = email;
        }
        if (password) updates.password = password;
        const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select('-password');
        res.json({
            success: true,
            message: 'Profile updated successfully',
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
        });
    })
];

// Admin Register User
const adminRegister = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').isLength({ min: 6 }).withMessage('Password too short'),
    body('role').isIn(['User', 'Tester', 'Admin']).withMessage('Invalid role'),
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array().map(e => e.msg) });
        }
        const { name, email, password, role } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Email already exists' });
        }
        const user = new User({ name, email, password, role });
        await user.save();
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
        });
    })
];

module.exports = { register, login, getProfile, updateProfile, adminRegister };