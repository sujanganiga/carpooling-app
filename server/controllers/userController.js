const User = require("../models/User");

const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password"] },
    });

    res.json(user);
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;

    await User.update({ name, phone }, { where: { id: req.user.id } });

    const updatedUser = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password"] },
    });

    res.json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const toggleRole = async (req, res) => {
  try {
    const { isDriver } = req.body;

    await User.update({ isDriver }, { where: { id: req.user.id } });

    const updatedUser = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password"] },
    });

    res.json({
      message: "Role updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Toggle role error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getProfile, updateProfile, toggleRole };
