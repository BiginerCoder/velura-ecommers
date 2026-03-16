import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import api from "../api";
import toast from "react-hot-toast";
import "./Checkout.css";

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const savedAddr = user?.addresses?.[user.addresses.length - 1];
  const [form, setForm] = useState({
    flatNo: savedAddr?.flatNo || "",
    street: savedAddr?.street || "",
    city: savedAddr?.city || "",
    state: savedAddr?.state || "",
    zipCode: savedAddr?.zipCode || "",
    country: "India",
  });
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [discountPct, setDiscountPct] = useState(0);
  const [couponLoading, setCouponLoading] = useState(false);
  const [placing, setPlacing] = useState(false);

  const subtotal = cart.totalAmount || 0;
  const discountAmt = discount;
  const shipping = (subtotal - discountAmt) >= 999 ? 0 : 99;
  const total = subtotal - discountAmt + shipping;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const applyCoupon = async () => {
    if (!coupon.trim()) return;
    try {
      setCouponLoading(true);
      const { data } = await api.post("/orders/validate-coupon", { couponCode: coupon });
      const saved = Math.round((subtotal * data.discountPercent) / 100);
      setDiscount(saved);
      setDiscountPct(data.discountPercent);
      toast.success(`Coupon applied — ₹${saved} off!`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid coupon");
    } finally {
      setCouponLoading(false);
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    const { flatNo, street, city, state, zipCode } = form;
    if (!flatNo || !street || !city || !state || !zipCode) {
      toast.error("Please fill all address fields"); return;
    }
    try {
      setPlacing(true);
      const { data } = await api.post("/orders", {
        shippingAddress: form,
        paymentMethod,
        couponCode: coupon,
      });
      toast.success("Order placed successfully!");
      navigate(`/order-success/${data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not place order");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="checkout-page container">
        <h1 className="checkout-title">Checkout</h1>
        <form className="checkout-layout" onSubmit={handlePlaceOrder}>
          {/* Left: form */}
          <div className="checkout-form">
            <section className="checkout-section">
              <h2 className="checkout-section-title">Delivery Address</h2>
              <div className="form-row">
                <div className="form-group">
                  <label>Flat / House No.</label>
                  <input name="flatNo" value={form.flatNo} onChange={handleChange} placeholder="e.g. 42B" required />
                </div>
                <div className="form-group">
                  <label>Street / Area</label>
                  <input name="street" value={form.street} onChange={handleChange} placeholder="e.g. MG Road" required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>City</label>
                  <input name="city" value={form.city} onChange={handleChange} placeholder="Mumbai" required />
                </div>
                <div className="form-group">
                  <label>State</label>
                  <input name="state" value={form.state} onChange={handleChange} placeholder="Maharashtra" required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>PIN Code</label>
                  <input name="zipCode" value={form.zipCode} onChange={handleChange} placeholder="400001" required />
                </div>
                <div className="form-group">
                  <label>Country</label>
                  <input name="country" value={form.country} readOnly />
                </div>
              </div>
            </section>

            <section className="checkout-section">
              <h2 className="checkout-section-title">Payment Method</h2>
              <div className="payment-options">
                {[
                  { value: "COD", label: "Cash on Delivery", icon: "💵" },
                  { value: "UPI", label: "UPI / QR Code", icon: "📱" },
                  { value: "CARD", label: "Credit / Debit Card", icon: "💳" },
                  { value: "NET_BANKING", label: "Net Banking", icon: "🏦" },
                ].map((pm) => (
                  <label key={pm.value} className={`payment-option ${paymentMethod === pm.value ? "selected" : ""}`}>
                    <input
                      type="radio"
                      name="payment"
                      value={pm.value}
                      checked={paymentMethod === pm.value}
                      onChange={() => setPaymentMethod(pm.value)}
                    />
                    <span className="pm-icon">{pm.icon}</span>
                    <span>{pm.label}</span>
                  </label>
                ))}
              </div>
              {paymentMethod !== "COD" && (
                <p className="payment-note">
                  This is a demo store. No real payment will be processed.
                </p>
              )}
            </section>
          </div>

          {/* Right: summary */}
          <div className="checkout-summary">
            <h3 className="summary-title">Order Summary</h3>

            <div className="checkout-items">
              {cart.items?.map((item) => (
                <div key={item._id} className="checkout-item">
                  <div className="checkout-item__img">
                    <img src={item.product.images?.[0]} alt={item.product.name} />
                    <span className="checkout-item__qty">{item.quantity}</span>
                  </div>
                  <div className="checkout-item__info">
                    <p className="checkout-item__name">{item.product.name}</p>
                  </div>
                  <p className="checkout-item__price">₹{(item.product.price * item.quantity).toLocaleString()}</p>
                </div>
              ))}
            </div>

            <div className="co-coupon-row">
              <input
                type="text"
                placeholder="Coupon code"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value.toUpperCase())}
              />
              <button type="button" className="btn btn-outline btn-sm" onClick={applyCoupon} disabled={couponLoading}>
                {couponLoading ? "..." : "Apply"}
              </button>
            </div>

            <div className="summary-divider" />
            <div className="summary-row"><span>Subtotal</span><span>₹{subtotal.toLocaleString()}</span></div>
            {discountAmt > 0 && <div className="summary-row" style={{ color: "var(--success)" }}><span>Discount</span><span>−₹{discountAmt}</span></div>}
            <div className="summary-row"><span>Shipping</span><span>{shipping === 0 ? "Free" : `₹${shipping}`}</span></div>
            <div className="summary-divider" />
            <div className="summary-row summary-row--total"><span>Total</span><span>₹{total.toLocaleString()}</span></div>

            <button
              type="submit"
              className="btn btn-primary btn-lg place-order-btn"
              disabled={placing || !cart.items?.length}
            >
              {placing ? "Placing Order..." : `Place Order — ₹${total.toLocaleString()}`}
            </button>

            <p className="checkout-secure">🔒 Your information is encrypted and secure</p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
