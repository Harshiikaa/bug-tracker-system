// src/routes/userRoutes.js
const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getDevelopers,
} = require("../controllers/userController");
const {
  protect,
  authorizeRoles,
  isAdmin,
} = require("../middlewares/authMiddleware");
const {
  handleValidationErrors,
} = require("../middlewares/validationMiddleware");
const {
  validateUpdateUser,
  validateDeleteUser,
} = require("../validators/userValidators");
const asyncHandler = require("../middlewares/asyncHandler");

router.get("/", protect, authorizeRoles("Admin"), asyncHandler(getAllUsers));
router.get(
  "/:id",
  protect,
  handleValidationErrors,
  authorizeRoles("Admin"),
  asyncHandler(getUserById)
);
router.get(
  "/developers",
  protect,
  authorizeRoles("Admin"),
  asyncHandler(getDevelopers)
);
router.put(
  "/:id",
  protect,
  validateUpdateUser,
  handleValidationErrors,
  authorizeRoles("Admin"),
  asyncHandler(updateUser)
);
router.delete(
  "/:id",
  protect,
  validateDeleteUser,
  handleValidationErrors,
  authorizeRoles("Admin"),
  asyncHandler(deleteUser)
);

module.exports = router;
