const express = require("express");
const router = express.Router();
const {
  getProfile,
  updateProfile,
  toggleRole,
} = require("../controllers/userController");
const auth = require("../middleware/auth");
const upload = require("../config/multer");

// Get user profile
router.get("/profile", auth, getProfile);

// Update user profile (with file upload)
router.put("/profile", auth, upload.single("profilePhoto"), updateProfile);

// Toggle user role (driver/rider)
router.put("/role", auth, toggleRole);

module.exports = router;
