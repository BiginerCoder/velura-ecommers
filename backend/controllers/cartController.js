const Cart = require("../models/Cart");
const Product = require("../models/Product");

const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product",
      "name price comparePrice images stock category"
    );
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const totalAmount = cart.items.reduce((sum, item) => {
      if (item.product) return sum + item.product.price * item.quantity;
      return sum;
    }, 0);

    res.json({ ...cart.toObject(), totalAmount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1, selectedVariants = {} } = req.body;
    const product = await Product.findById(productId);
    if (!product || !product.isActive)
      return res.status(404).json({ message: "Product not found" });
    if (product.stock < quantity)
      return res.status(400).json({ message: "Insufficient stock" });

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });

    const existingIndex = cart.items.findIndex(
      (i) => i.product.toString() === productId
    );

    if (existingIndex > -1) {
      cart.items[existingIndex].quantity += Number(quantity);
    } else {
      cart.items.push({ product: productId, quantity: Number(quantity), selectedVariants });
    }
    await cart.save();
    const populated = await Cart.findById(cart._id).populate(
      "items.product",
      "name price comparePrice images stock"
    );
    const totalAmount = populated.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
    res.json({ ...populated.toObject(), totalAmount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    if (quantity < 1) return res.status(400).json({ message: "Quantity must be at least 1" });

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const idx = cart.items.findIndex((i) => i.product.toString() === productId);
    if (idx === -1) return res.status(404).json({ message: "Item not in cart" });

    cart.items[idx].quantity = quantity;
    await cart.save();
    const populated = await Cart.findById(cart._id).populate(
      "items.product",
      "name price comparePrice images stock"
    );
    const totalAmount = populated.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
    res.json({ ...populated.toObject(), totalAmount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter((i) => i.product.toString() !== productId);
    await cart.save();
    const populated = await Cart.findById(cart._id).populate(
      "items.product",
      "name price comparePrice images stock"
    );
    const totalAmount = populated.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
    res.json({ ...populated.toObject(), totalAmount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });
    cart.items = [];
    await cart.save();
    res.json({ message: "Cart cleared", ...cart.toObject(), totalAmount: 0 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
