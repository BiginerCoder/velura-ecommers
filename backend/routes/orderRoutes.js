const express = require("express");
const router = express.Router();
const {
  placeOrder, getMyOrders, getOrderById,
  cancelOrder, markAsPaid, validateCoupon,
} = require("../controllers/orderController");
const { protect } = require("../middleware/auth");

router.use(protect);
router.post("/", placeOrder);
router.get("/my", getMyOrders);
router.get("/:id", getOrderById);
router.put("/:id/cancel", cancelOrder);
router.put("/:id/pay", markAsPaid);
router.post("/validate-coupon", validateCoupon);

module.exports = router;
