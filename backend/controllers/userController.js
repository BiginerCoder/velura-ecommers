const User = require("../models/User");

// GET /api/users/profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/users/profile
const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, phoneNumber } = req.body;
    const user = await User.findById(req.user._id);
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    await user.save();
    const updated = await User.findById(user._id).select("-password");
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/users/address
const addAddress = async (req, res) => {
  try {
    const { flatNo, street, city, state, zipCode, country, isDefault } = req.body;
    if (!flatNo || !street || !city || !state || !zipCode)
      return res.status(400).json({ message: "All address fields required" });

    const user = await User.findById(req.user._id);
    if (isDefault) user.addresses.forEach((a) => (a.isDefault = false));
    user.addresses.push({ flatNo, street, city, state, zipCode, country, isDefault });
    await user.save();
    const updated = await User.findById(user._id).select("-password");
    res.status(201).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/users/address/:addressId
const updateAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const addr = user.addresses.id(req.params.addressId);
    if (!addr) return res.status(404).json({ message: "Address not found" });

    const { flatNo, street, city, state, zipCode, country, isDefault } = req.body;
    if (isDefault) user.addresses.forEach((a) => (a.isDefault = false));
    Object.assign(addr, { flatNo, street, city, state, zipCode, country, isDefault });
    await user.save();
    const updated = await User.findById(user._id).select("-password");
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/users/address/:addressId
const deleteAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.addresses = user.addresses.filter(
      (a) => a._id.toString() !== req.params.addressId
    );
    await user.save();
    const updated = await User.findById(user._id).select("-password");
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getProfile, updateProfile, addAddress, updateAddress, deleteAddress };
