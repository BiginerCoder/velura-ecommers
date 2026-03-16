const express = require("express");
const router = express.Router();
const {
  getDashboard, getAllUsers, updateUserStatus,
  getAllOrders, updateOrderStatus,
} = require("../controllers/adminController");
const { protect, adminOnly } = require("../middleware/auth");

router.use(protect, adminOnly);
router.get("/dashboard", getDashboard);
router.get("/users", getAllUsers);
router.put("/users/:id/status", updateUserStatus);
router.get("/orders", getAllOrders);
router.put("/orders/:id/status", updateOrderStatus);

module.exports = router;
