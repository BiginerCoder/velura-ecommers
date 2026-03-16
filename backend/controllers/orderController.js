const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

const COUPONS = {
  VELURA10: 10,
  WELCOME20: 20,
  FLAT15: 15,
};

// POST /api/orders
const placeOrder = async (req, res) => {
  try {
    const { shippingAddress, paymentMethod = "COD", couponCode = "" } = req.body;
    if (!shippingAddress)
      return res.status(400).json({ message: "Shipping address required" });

    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product"
    );
    if (!cart || cart.items.length === 0)
      return res.status(400).json({ message: "Cart is empty" });

    const orderItems = cart.items.map((item) => ({
      product: item.product._id,
      name: item.product.name,
      image: item.product.images[0] || "",
      price: item.product.price,
      quantity: item.quantity,
      selectedVariants: item.selectedVariants,
    }));

    let totalAmount = cart.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    let discount = 0;
    if (couponCode && COUPONS[couponCode.toUpperCase()]) {
      discount = Math.round((totalAmount * COUPONS[couponCode.toUpperCase()]) / 100);
      totalAmount -= discount;
    }

    const order = await Order.create({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      totalAmount,
      discount,
      couponCode: couponCode.toUpperCase(),
    });

    // reduce stock
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { stock: -item.quantity },
      });
    }

    // clear cart
    cart.items = [];
    await cart.save();

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/orders/my
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate("orderItems.product", "name images");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/orders/:id
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "orderItems.product",
      "name images price"
    );
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (
      order.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Access denied" });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/orders/:id/cancel
const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.user.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Access denied" });
    if (["SHIPPED", "DELIVERED"].includes(order.orderStatus))
      return res.status(400).json({ message: "Cannot cancel a shipped/delivered order" });

    order.orderStatus = "CANCELLED";
    await order.save();

    // restore stock
    for (const item of order.orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity },
      });
    }
    res.json({ message: "Order cancelled", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/orders/:id/pay  (simulate payment)
const markAsPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    order.paymentStatus = "PAID";
    order.orderStatus = "CONFIRMED";
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/orders/validate-coupon
const validateCoupon = async (req, res) => {
  try {
    const { couponCode } = req.body;
    const discount = COUPONS[couponCode?.toUpperCase()];
    if (!discount) return res.status(400).json({ message: "Invalid coupon code" });
    res.json({ couponCode: couponCode.toUpperCase(), discountPercent: discount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { placeOrder, getMyOrders, getOrderById, cancelOrder, markAsPaid, validateCoupon };
