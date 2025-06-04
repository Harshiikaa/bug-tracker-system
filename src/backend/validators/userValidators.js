const { param, body } = require("express-validator");

exports.validateGetUserById = [
  param("id").isMongoId().withMessage("Invalid user ID"),
];

exports.validateUpdateUser = [
  param("id").isMongoId().withMessage("Invalid user ID"),
  body("name").optional().trim().notEmpty().withMessage("Name cannot be empty"),
  body("email").optional().isEmail().withMessage("Invalid email format"),
  body("role")
    .optional()
    .isIn(["User", "Tester", "Admin"])
    .withMessage("Invalid role"),
];

exports.validateDeleteUser=[
    param("id").isMongoId().withMessage("Invalid user ID"),
];
