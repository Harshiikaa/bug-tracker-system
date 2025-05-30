// src/routes/bugRoutes.js
const express = require('express');
const router = express.Router();
const { getAllBugs, createBug, getBugById, updateBug, deleteBug, addComment, deleteComment } = require('../controllers/bugController');
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');

router.post('/', protect,authorizeRoles('Tester'), createBug);
router.get('/', protect, getAllBugs);
router.get('/', protect, getBugs);

router.get('/:id', protect, getBugById);
router.put('/:id', protect,authorizeRoles('Tester','Admin'), updateBug);
router.delete('/:id', protect, authorizeRoles('Admin'), deleteBug);
router.post('/:id/comments', protect, addComment);
router.delete('/:id/comments/:commentId', protect, deleteComment);

module.exports = router;
