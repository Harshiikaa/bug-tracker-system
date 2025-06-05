// src/routes/bugRoutes.js

const express = require("express");
const router = express.Router();
const {
  createBug,
  getAllBugs,
  getBugById,
  getBugs,
  updateBug,
  deleteBug,
  addComment,
  deleteComment,
} = require("../controllers/bugController");
const { protect, authorizeRoles } = require("../middlewares/authMiddleware");
const {
  validateCreateBug,
  validateGetAllBugs,
  validateGetBugById,
  validateUpdateBug,
  validateDeleteBug,
  validateAddComment,
  validateDeleteComment,
} = require("../validators/bugValidators");
const {
  handleValidationErrors,
} = require("../middlewares/validationMiddleware");
const asyncHandler = require("../middlewares/asyncHandler");

router.post(
  "/",
  protect,
  validateCreateBug,
  handleValidationErrors,
  authorizeRoles("Tester"),
  asyncHandler(createBug)
);

router.get(
  "/my-bugs",
  protect,
  authorizeRoles("Tester", "User"),
  asyncHandler(getBugs)
); // for testers/devs

router.get(
  "/",
  protect,
  validateGetAllBugs,
  handleValidationErrors,
  authorizeRoles("Admin"),
  asyncHandler(getAllBugs)
); // only for admin

router.get(
  "/:id",
  protect,
  validateGetBugById,
  handleValidationErrors,
  asyncHandler(getBugById)
);

router.put(
  "/:id",
  protect,
  validateUpdateBug,
  handleValidationErrors,
  authorizeRoles("Tester", "Admin", "User"),
  asyncHandler(updateBug)
);

router.delete(
  "/:id",
  protect,
  validateDeleteBug,
  handleValidationErrors,
  authorizeRoles("Admin"),
  asyncHandler(deleteBug)
);

router.post(
  "/:id/comments",
  protect,
  validateAddComment,
  handleValidationErrors,
  asyncHandler(addComment)
);

router.delete(
  "/:id/comments/:commentId",
  protect,
  validateDeleteComment,
  handleValidationErrors,
  asyncHandler(deleteComment)
);

module.exports = router;
