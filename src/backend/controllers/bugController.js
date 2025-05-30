// src/controllers/bugController.js
const asyncHandler = require('../middlewares/asyncHandler');
const Bug = require('../models/Bug');
const User = require('../models/User');
const { body, param, query, validationResult } = require('express-validator');


// Create bug
const createBug = [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 100 }),
  body('description').trim().notEmpty().withMessage('Description is required').isLength({ max: 1000 }),
  body('priority').optional().isIn(['Low', 'Medium', 'High']).withMessage('Invalid priority'),
  body('status').optional().isIn(['Open', 'In Progress', 'Closed']).withMessage('Invalid status'),
  body('assignedTo').optional().isMongoId().withMessage('Invalid user ID'),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array().map(e => e.msg) });
    }
    const { title, description, priority, status, assignedTo } = req.body;
    if (assignedTo) {
      const user = await User.findById(assignedTo);
      if (!user) {
        return res.status(404).json({ success: false, message: 'Assigned user not found' });
      }
    }
    const bug = new Bug({
      title,
      description,
      priority: priority || 'Medium',
      status: status || 'Open',
      createdBy: req.user._id,
      assignedTo
    });
    await bug.save();
    await bug.populate([
      { path: 'createdBy', select: 'name' },
      { path: 'assignedTo', select: 'name' }
    ]);
    res.status(201).json({ success: true, bug });
  })
];
// Get bug by ID
const getBugById = [
  param('id').isMongoId().withMessage('Invalid bug ID'),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array().map(e => e.msg) });
    }
    const bug = await Bug.findById(req.params.id).populate([
      { path: 'createdBy', select: 'name' },
      { path: 'assignedTo', select: 'name' }
    ]);
    if (!bug) {
      return res.status(404).json({ success: false, message: 'Bug not found' });
    }
    res.json(bug);
  })
];

// Get all bugs
const getAllBugs = [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1 }).toInt(),
  query('sort').optional().isIn(['createdAt', 'priority', 'status']),
  query('status').optional().isIn(['Open', 'In Progress', 'Closed']),
  query('priority').optional().isIn(['Low', 'Medium', 'High']),
  query('assignedTo').optional().isMongoId(),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array().map(e => e.msg) });
    }
    const { page = 1, limit = 10, sort, status, priority, assignedTo } = req.query;
    const query = {};
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (assignedTo) query.assignedTo = assignedTo;
    const options = {
      skip: (page - 1) * limit,
      limit: parseInt(limit),
      sort: sort ? { [sort]: 1 } : { createdAt: -1 },
      populate: [
        { path: 'createdBy', select: 'name' },
        { path: 'assignedTo', select: 'name' }
      ]
    };
    const bugs = await Bug.find(query, null, options);
    const totalItems = await Bug.countDocuments(query);
    res.json({
      bugs,
      pagination: {
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: parseInt(page),
        itemsPerPage: parseInt(limit)
      }
    });
  })
];



// Update bug
const updateBug = [
  param('id').isMongoId().withMessage('Invalid bug ID'),
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty').isLength({ max: 100 }),
  body('description').optional().trim().notEmpty().withMessage('Description cannot be empty').isLength({ max: 1000 }),
  body('priority').optional().isIn(['Low', 'Medium', 'High']).withMessage('Invalid priority'),
  body('status').optional().isIn(['Open', 'In Progress', 'Closed']).withMessage('Invalid status'),
  body('assignedTo').optional().isMongoId().withMessage('Invalid user ID'),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array().map(e => e.msg) });
    }
    const bug = await Bug.findById(req.params.id);
    if (!bug) {
      return res.status(404).json({ success: false, message: 'Bug not found' });
    }
    if (bug.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
      return res.status(403).json({ success: false, message: 'Not creator or admin' });
    }
    const { title, description, priority, status, assignedTo } = req.body;
    if (assignedTo) {
      const user = await User.findById(assignedTo);
      if (!user) {
        return res.status(404).json({ success: false, message: 'Assigned user not found' });
      }
    }
    const updates = { title, description, priority, status, assignedTo };
    Object.keys(updates).forEach(key => updates[key] === undefined && delete updates[key]);
    const updatedBug = await Bug.findByIdAndUpdate(req.params.id, updates, { new: true }).populate([
      { path: 'createdBy', select: 'name' },
      { path: 'assignedTo', select: 'name' }
    ]);
    res.json({ success: true, bug: updatedBug });
  })
];

// Delete bug
const deleteBug = [
  param('id').isMongoId().withMessage('Invalid bug ID'),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array().map(e => e.msg) });
    }
    const bug = await Bug.findById(req.params.id);
    if (!bug) {
      return res.status(404).json({ success: false, message: 'Bug not found' });
    }
    await bug.deleteOne();
    res.json({ success: true, message: 'Bug deleted successfully' });
  })
];

// Add comment
const addComment = [
  param('id').isMongoId().withMessage('Invalid bug ID'),
  body('text').trim().notEmpty().withMessage('Comment text is required').isLength({ max: 1000 }),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array().map(e => e.msg) });
    }
    const bug = await Bug.findById(req.params.id);
    if (!bug) {
      return res.status(404).json({ success: false, message: 'Bug not found' });
    }
    bug.comments.push({ text: req.body.text, createdBy: req.user._id });
    await bug.save();
    await bug.populate([
      { path: 'createdBy', select: 'name' },
      { path: 'assignedTo', select: 'name' },
      { path: 'comments.createdBy', select: 'name' }
    ]);
    res.status(201).json({ success: true, bug });
  })
];

// Delete comment
const deleteComment = [
  param('id').isMongoId().withMessage('Invalid bug ID'),
  param('commentId').isMongoId().withMessage('Invalid comment ID'),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array().map(e => e.msg) });
    }
    const bug = await Bug.findById(req.params.id);
    if (!bug) {
      return res.status(404).json({ success: false, message: 'Bug not found' });
    }
    const comment = bug.comments.id(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }
    if (comment.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
      return res.status(403).json({ success: false, message: 'Not comment creator or admin' });
    }
    bug.comments.pull(req.params.commentId);
    await bug.save();
    res.json({ success: true, message: 'Comment deleted successfully' });
  })
];

module.exports = { getAllBugs, createBug, getBugById, updateBug, deleteBug, addComment, deleteComment };