// src/middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const asyncHandler = require("./asyncHandler");

const protect = asyncHandler(async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "No token provided" });
  }
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your_jwt_secret"
    );
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
    }
    next();
  } catch (err) {
    res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }
});

// ✅ Middleware to restrict route access by role(s)
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Requires role: ${allowedRoles.join(", ")}`,
      });
    }
    next();
  };
};
// const isAdmin = (req, res, next) => {
//   if (req.user && req.user.role === 'Admin') {
//     next();
//   } else {
//     return res.status(403).json({ success: false, message: 'Access denied: Admins only' });
//   }
// };

module.exports = { protect, authorizeRoles };
