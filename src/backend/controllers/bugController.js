// src/controllers/bugController.js
const asyncHandler = require("../middlewares/asyncHandler");
const Bug = require("../models/Bug");
const User = require("../models/User");
const { body, param, query, validationResult } = require("express-validator");

const createBug = async (req, res) => {
  const { title, description, priority } = req.body;

  const bug = new Bug({
    title,
    description,
    priority: priority || "Medium",
    status: "Open", // force default
    assignedTo: null, // always null at creation
    createdBy: req.user._id,
  });

  await bug.save();
  await bug.populate([{ path: "createdBy", select: "name" }]);

  res.status(201).json({
    success: true,
    message: "Bug created successfully",
    data: bug,
  });
};

const getBugById = async (req, res) => {
  const userId = req.user._id;
  const bug = await Bug.findOne({
    _id: req.params.id,
    createdBy: userId, // restrict to bugs created by this user
  }).populate([
    { path: "createdBy", select: "name" },
    { path: "assignedTo", select: "name" },
  ]);

  if (!bug) {
    return res.status(404).json({
      success: false,
      message: "Bug not found or unauthorized access",
    });
  }

  res.json({ success: true, data: bug });
};

// GET bugs by owner (Tester) and assignedDevelopers
const getBugs = async (req, res) => {
  const user = req.user;
  let bugs;

  if (user.role === "Tester") {
    bugs = await Bug.find({ createdBy: user._id }).populate("assignedTo");
  } else if (user.role === "User") {
    bugs = await Bug.find({ assignedTo: user._id }).populate("createdBy");
  } else {
    return res.status(403).json({
      success: false,
      message:
        "Access denied: Only Testers and Developers can use this endpoint",
    });
  }
  res.status(200).json({
    success: true,
    data: bugs,
  });
};

// Get all bugs
const getAllBugs = async (req, res) => {
  const {
    page = 1,
    limit = 10,
    sort,
    status,
    priority,
    assignedTo,
  } = req.query;
  const query = {};
  if (status) query.status = status;
  if (priority) query.priority = priority;
  if (assignedTo) query.assignedTo = assignedTo;
  const options = {
    skip: (page - 1) * limit,
    limit: parseInt(limit),
    sort: sort ? { [sort]: 1 } : { createdAt: -1 },
    populate: [
      { path: "createdBy", select: "name" },
      { path: "assignedTo", select: "name" },
    ],
  };
  const bugs = await Bug.find(query, null, options);
  const totalItems = await Bug.countDocuments(query);
  res.json({
    bugs,
    pagination: {
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: parseInt(page),
      itemsPerPage: parseInt(limit),
    },
  });
};

// Update bug
const updateBug = async (req, res) => {
  const bug = await Bug.findById(req.params.id);
  if (!bug) {
    return res.status(404).json({ success: false, message: "Bug not found" });
  }

  if (
    bug.createdBy.toString() !== req.user._id.toString() &&
    req.user.role !== "Admin"
  ) {
    return res
      .status(403)
      .json({ success: false, message: "Not creator or admin" });
  }

  const { title, description, priority, status, assignedTo } = req.body;
  // if (assignedTo) {
  //   const user = await User.findById(assignedTo);
  //   if (!user) {
  //     return res
  //       .status(404)
  //       .json({ success: false, message: "Assigned user not found" });
  //   }
  // }
  const updates = { title, description, priority, status, assignedTo };
  Object.keys(updates).forEach(
    (key) => updates[key] === undefined && delete updates[key]
  );
  const updatedBug = await Bug.findByIdAndUpdate(req.params.id, updates, {
    new: true,
  }).populate([
    { path: "createdBy", select: "name" },
    { path: "assignedTo", select: "name" },
  ]);
  res.json({ success: true, bug: updatedBug });
};

// Delete bug
const deleteBug = async (req, res) => {
  const bug = await Bug.findById(req.params.id);
  if (!bug) {
    return res.status(404).json({ success: false, message: "Bug not found" });
  }
  await bug.deleteOne();
  res.json({ success: true, message: "Bug deleted successfully" });
};

// Add comment
const addComment = async (req, res) => {
  const bug = await Bug.findById(req.params.id);
  if (!bug) {
    return res.status(404).json({ success: false, message: "Bug not found" });
  }
  bug.comments.push({ text: req.body.text, createdBy: req.user._id });
  await bug.save();
  await bug.populate([
    { path: "createdBy", select: "name" },
    { path: "assignedTo", select: "name" },
    { path: "comments.createdBy", select: "name" },
  ]);
  res.status(201).json({ success: true, bug });
};

// Delete comment
const deleteComment = async (req, res) => {
  const bug = await Bug.findById(req.params.id);
  if (!bug) {
    return res.status(404).json({ success: false, message: "Bug not found" });
  }
  const comment = bug.comments.id(req.params.commentId);
  if (!comment) {
    return res
      .status(404)
      .json({ success: false, message: "Comment not found" });
  }
  if (
    comment.createdBy.toString() !== req.user._id.toString() &&
    req.user.role !== "Admin"
  ) {
    return res
      .status(403)
      .json({ success: false, message: "Not comment creator or admin" });
  }
  bug.comments.pull(req.params.commentId);
  await bug.save();
  res.json({ success: true, message: "Comment deleted successfully" });
};

module.exports = {
  createBug,
  getAllBugs,
  getBugById,
  getBugs,
  updateBug,
  deleteBug,
  addComment,
  deleteComment,
};
