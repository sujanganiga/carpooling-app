const fs = require("fs");
const path = require("path");
const User = require("../models/User");

const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password"] },
      raw: true,
    });

    res.json(user);
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Server error during profile fetch" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;
    const updates = { name, phone };

    if (req.file) {
      // Delete old photo if it's not default
      if (
        req.user.profilePhoto &&
        !req.user.profilePhoto.includes("default-profile")
      ) {
        const oldPhotoPath = path.join(
          __dirname,
          "..",
          "public",
          req.user.profilePhoto
        );
        if (fs.existsSync(oldPhotoPath)) {
          fs.unlinkSync(oldPhotoPath);
        }
      }
      updates.profilePhoto = `/uploads/profile/${req.file.filename}`;
    }

    const [updatedCount] = await User.update(updates, {
      where: { id: req.user.id },
    });

    if (updatedCount !== 1) {
      throw new Error("Failed to update profile");
    }

    const updatedUser = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password"] },
      raw: true,
    });

    res.json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      message: error.message || "Server error during profile update",
    });
  }
};

const toggleRole = async (req, res) => {
  try {
    const { isDriver } = req.body;

    if (typeof isDriver !== "boolean") {
      return res.status(400).json({ message: "Invalid role value" });
    }

    const [updatedCount] = await User.update(
      { isDriver },
      {
        where: { id: req.user.id },
      }
    );

    if (updatedCount !== 1) {
      throw new Error("Failed to update role");
    }

    const updatedUser = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password"] },
      raw: true,
    });

    res.json({
      message: "Role updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Toggle role error:", error);
    res
      .status(500)
      .json({ message: error.message || "Server error during role toggle" });
  }
};

module.exports = { getProfile, updateProfile, toggleRole };
