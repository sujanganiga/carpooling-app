const express = require("express");
const {
  getProfile,
  updateProfile,
  toggleRole,
} = require("../controllers/userController");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/profile", auth, getProfile);
router.put("/profile", auth, updateProfile);
router.put("/role", auth, toggleRole);

module.exports = router;
