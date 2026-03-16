import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import toast from "react-hot-toast";
import "./Orders.css";

const STATUS_COLORS = {
  PLACED: "#C4956A",
  CONFIRMED: "#3b82f6",
  PROCESSING: "#8b5cf6",
  SHIPPED: "#0891b2",
  DELIVERED: "#2D6A4F",
  CANCELLED: "#C1440E",
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      const { data } = await api.get("/orders/my");
      setOrders(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "My Orders — Velura";
    fetchOrders();
  }, []);

  const handleCancel = async (orderId) => {
    if (!window.confirm("Cancel this order?")) return;
    try {
      await api.put(`/orders/${orderId}/cancel`);
      toast.success("Order cancelled");
      fetchOrders();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not cancel order");
    }
  };

  const handlePay = async (orderId) => {
    try {
      await api.put(`/orders/${orderId}/pay`);
      toast.success("Payment confirmed!");
      fetchOrders();
    } catch (err) {
      toast.error("Payment failed");
    }
  };

  if (loading) return <div className="page-wrapper"><div className="spinner-wrap"><div className="spinner" /></div></div>;

  return (
    <div className="page-wrapper">
      <div className="orders-page container">
        <div className="orders-header">
          <h1 className="section-title">My Orders</h1>
          <Link to="/products" className="btn btn-outline btn-sm">Continue Shopping</Link>
        </div>

        {orders.length === 0 ? (
          <div className="orders-empty">
            <span style={{ fontSize: 48 }}>📦</span>
            <h3>No orders yet</h3>
            <p>Your completed orders will appear here.</p>
            <Link to="/products" className="btn btn-primary">Start Shopping</Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order, i) => (
              <div key={order._id} className="order-card">
                <div className="order-card__header">
                  <div>
                    <p className="order-number">Order #{orders.length - i}</p>
                    <p className="order-date">{new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
                  </div>
                  <div className="order-header-right">
                    <span
                      className="order-status"
                      style={{ background: STATUS_COLORS[order.orderStatus] + "18", color: STATUS_COLORS[order.orderStatus] }}
                    >
                      {order.orderStatus}
                    </span>
                    <span className="order-payment-status" style={{ opacity: 0.7, fontSize: 12 }}>
                      Payment: {order.paymentStatus}
                    </span>
                  </div>
                </div>

                <div className="order-items">
                  {order.orderItems.map((item) => (
                    <div key={item._id} className="order-item">
                      <img src={item.image || item.product?.images?.[0] || "https://via.placeholder.com/60"} alt={item.name} />
                      <div>
                        <p className="order-item-name">{item.name}</p>
                        <p className="order-item-meta">Qty: {item.quantity} · ₹{item.price?.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="order-card__footer">
                  <div className="order-address">
                    <p style={{ fontSize: 12, color: "var(--gray-400)", marginBottom: 2 }}>Delivering to</p>
                    <p style={{ fontSize: 13 }}>
                      {order.shippingAddress.flatNo}, {order.shippingAddress.street}, {order.shippingAddress.city}
                    </p>
                  </div>
                  <div className="order-footer-right">
                    <p className="order-total">₹{order.totalAmount.toLocaleString()}</p>
                    <div className="order-actions">
                      {order.paymentStatus === "PENDING" && order.orderStatus !== "CANCELLED" && (
                        <button className="btn btn-accent btn-sm" onClick={() => handlePay(order._id)}>
                          Pay Now
                        </button>
                      )}
                      {!["SHIPPED", "DELIVERED", "CANCELLED"].includes(order.orderStatus) && (
                        <button className="btn btn-ghost btn-sm" onClick={() => handleCancel(order._id)}>
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
