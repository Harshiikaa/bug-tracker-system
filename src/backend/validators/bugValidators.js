const { body } = require("express-validator");

exports.validateCreateBug = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ max: 100 }),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ max: 1000 }),

  body("priority")
    .optional()
    .isIn(["Low", "Medium", "High"])
    .withMessage("Priority must be Low, Medium, or High"),

  body("assignedTo")
    .not()
    .exists()
    .withMessage("Cannot assign bug during creation"),
  body("status")
    .not()
    .exists()
    .withMessage("Status cannot be set during creation"),
];
exports.validateGetBugById = [
  param("id").isMongoId().withMessage("Invalid bug ID"),
];

exports.validateGetAllBugs = [
  query("page").optional().isInt({ min: 1 }).toInt(),
  query("limit").optional().isInt({ min: 1 }).toInt(),
  query("sort").optional().isIn(["createdAt", "priority", "status"]),
  query("status").optional().isIn(["Open", "In Progress", "Closed"]),
  query("priority").optional().isIn(["Low", "Medium", "High"]),
  query("assignedTo").optional().isMongoId(),
];

exports.validateUpdateBug = [
  param("id").isMongoId().withMessage("Invalid bug ID"),
  body("title")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Title cannot be empty")
    .isLength({ max: 100 }),
  body("description")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Description cannot be empty")
    .isLength({ max: 1000 }),
  body("priority")
    .optional()
    .isIn(["Low", "Medium", "High"])
    .withMessage("Invalid priority"),
  body("status")
    .optional()
    .isIn(["Open", "In Progress", "Closed"])
    .withMessage("Invalid status"),
  body("assignedTo").optional().isMongoId().withMessage("Invalid user ID"),
];

exports.validateDeleteBug = [
  param("id").isMongoId().withMessage("Invalid bug ID"),
];

exports.validateAddComment = [
  param("id").isMongoId().withMessage("Invalid bug ID"),
  body("text")
    .trim()
    .notEmpty()
    .withMessage("Comment text is required")
    .isLength({ max: 1000 }),
];

exports.validateDeleteComment = [
  param("id").isMongoId().withMessage("Invalid bug ID"),
  param("commentId").isMongoId().withMessage("Invalid comment ID"),
];
