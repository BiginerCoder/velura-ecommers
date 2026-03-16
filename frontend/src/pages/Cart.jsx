import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import api from "../api";
import toast from "react-hot-toast";
import "./Cart.css";

const Cart = () => {
  const { cart, updateItem, removeItem, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [discountLabel, setDiscountLabel] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);

  const applyCoupon = async () => {
    if (!coupon.trim()) return;
    try {
      setCouponLoading(true);
      const { data } = await api.post("/orders/validate-coupon", { couponCode: coupon });
      const saved = Math.round((cart.totalAmount * data.discountPercent) / 100);
      setDiscount(saved);
      setDiscountLabel(`${data.couponCode} (${data.discountPercent}% off)`);
      toast.success(`Coupon applied! You save ₹${saved}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid coupon");
      setDiscount(0);
      setDiscountLabel("");
    } finally {
      setCouponLoading(false);
    }
  };

  const finalTotal = cart.totalAmount - discount;
  const shipping = finalTotal >= 999 ? 0 : 99;

  if (!user) {
    return (
      <div className="page-wrapper">
        <div className="cart-empty container">
          <span className="cart-empty-icon">🛍</span>
          <h2>Sign in to view your cart</h2>
          <p>You need to be signed in to access your cart.</p>
          <Link to="/login" className="btn btn-primary btn-lg">Sign In</Link>
        </div>
      </div>
    );
  }

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="page-wrapper">
        <div className="cart-empty container">
          <span className="cart-empty-icon">🛒</span>
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added anything yet.</p>
          <Link to="/products" className="btn btn-primary btn-lg">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="cart-page container">
        <h1 className="cart-title">Shopping Cart <span>({cart.items.length} item{cart.items.length !== 1 ? "s" : ""})</span></h1>

        <div className="cart-layout">
          {/* Cart items */}
          <div className="cart-items">
            {cart.items.map((item) => (
              <div key={item._id} className="cart-item">
                <Link to={`/products/${item.product._id}`} className="cart-item__img-wrap">
                  <img
                    src={item.product.images?.[0] || "https://via.placeholder.com/120"}
                    alt={item.product.name}
                  />
                </Link>
                <div className="cart-item__info">
                  <Link to={`/products/${item.product._id}`} className="cart-item__name">
                    {item.product.name}
                  </Link>
                  <p className="cart-item__category">{item.product.category}</p>
                  {item.selectedVariants && Object.entries(item.selectedVariants).map(([k, v]) => (
                    <p key={k} className="cart-item__variant">{k}: {v}</p>
                  ))}
                  <p className="cart-item__price">₹{item.product.price.toLocaleString()}</p>
                </div>
                <div className="cart-item__actions">
                  <div className="qty-control">
                    <button
                      onClick={() => {
                        if (item.quantity <= 1) removeItem(item.product._id);
                        else updateItem(item.product._id, item.quantity - 1);
                      }}
                    >−</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateItem(item.product._id, item.quantity + 1)}>+</button>
                  </div>
                  <p className="cart-item__subtotal">
                    ₹{(item.product.price * item.quantity).toLocaleString()}
                  </p>
                  <button
                    className="cart-item__remove"
                    onClick={() => removeItem(item.product._id)}
                    aria-label="Remove"
                  >
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                      <path d="M10 11v6M14 11v6"/>
                      <path d="M9 6V4h6v2"/>
                    </svg>
                  </button>
                </div>
              </div>
            ))}

            <div className="cart-actions-row">
              <Link to="/products" className="btn btn-ghost btn-sm">← Continue Shopping</Link>
              <button className="btn btn-ghost btn-sm" onClick={clearCart}>Clear Cart</button>
            </div>
          </div>

          {/* Order summary */}
          <div className="cart-summary">
            <h3 className="summary-title">Order Summary</h3>

            <div className="summary-row"><span>Subtotal</span><span>₹{cart.totalAmount.toLocaleString()}</span></div>
            {discount > 0 && (
              <div className="summary-row summary-row--discount">
                <span>Coupon ({discountLabel})</span>
                <span>−₹{discount.toLocaleString()}</span>
              </div>
            )}
            <div className="summary-row">
              <span>Shipping</span>
              <span>{shipping === 0 ? <span className="free-tag">Free</span> : `₹${shipping}`}</span>
            </div>
            {shipping > 0 && (
              <p className="summary-shipping-note">
                Add ₹{(999 - cart.totalAmount).toLocaleString()} more for free shipping
              </p>
            )}

            <div className="summary-divider" />
            <div className="summary-row summary-row--total">
              <span>Total</span>
              <span>₹{(finalTotal + shipping).toLocaleString()}</span>
            </div>

            {/* Coupon */}
            <div className="coupon-row">
              <input
                type="text"
                placeholder="Coupon code"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === "Enter" && applyCoupon()}
              />
              <button
                className="btn btn-outline btn-sm"
                onClick={applyCoupon}
                disabled={couponLoading}
              >
                {couponLoading ? "..." : "Apply"}
              </button>
            </div>
            <p className="coupon-hint">Try: VELURA10, WELCOME20, FLAT15</p>

            <button
              className="btn btn-primary btn-lg summary-checkout-btn"
              onClick={() => navigate("/checkout")}
            >
              Proceed to Checkout
            </button>

            <div className="summary-trust">
              <span>🔒 Secure checkout</span>
              <span>·</span>
              <span>↩ Easy returns</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
