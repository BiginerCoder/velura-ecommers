import React, { useState, useEffect } from "react";
import api from "../api";
import toast from "react-hot-toast";
import "./Admin.css";

const TABS = ["Dashboard", "Products", "Orders", "Customers"];

const Admin = () => {
  const [tab, setTab] = useState("Dashboard");
  const [dashboard, setDashboard] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [productForm, setProductForm] = useState({
    name: "", description: "", price: "", comparePrice: "",
    category: "Women", subCategory: "", stock: "", sku: "",
    images: "", tags: "", shippingInfo: "",
  });

  useEffect(() => { document.title = "Admin — Velura"; fetchDashboard(); }, []);
  useEffect(() => {
    if (tab === "Products") fetchProducts();
    else if (tab === "Orders") fetchOrders();
    else if (tab === "Customers") fetchUsers();
  }, [tab]);

  const fetchDashboard = async () => {
    setLoading(true);
    try { const { data } = await api.get("/admin/dashboard"); setDashboard(data); }
    finally { setLoading(false); }
  };
  const fetchProducts = async () => {
    setLoading(true);
    try { const { data } = await api.get("/products?limit=50"); setProducts(data.products); }
    finally { setLoading(false); }
  };
  const fetchOrders = async () => {
    setLoading(true);
    try { const { data } = await api.get("/admin/orders"); setOrders(data); }
    finally { setLoading(false); }
  };
  const fetchUsers = async () => {
    setLoading(true);
    try { const { data } = await api.get("/admin/users"); setUsers(data); }
    finally { setLoading(false); }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...productForm,
        price: Number(productForm.price),
        comparePrice: Number(productForm.comparePrice) || 0,
        stock: Number(productForm.stock),
        images: productForm.images.split(",").map((s) => s.trim()).filter(Boolean),
        tags: productForm.tags.split(",").map((s) => s.trim()).filter(Boolean),
      };
      await api.post("/products", payload);
      toast.success("Product added!");
      setShowAddProduct(false);
      setProductForm({ name: "", description: "", price: "", comparePrice: "", category: "Women", subCategory: "", stock: "", sku: "", images: "", tags: "", shippingInfo: "" });
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add product");
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Remove this product?")) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success("Product removed");
      fetchProducts();
    } catch { toast.error("Failed"); }
  };

  const updateOrderStatus = async (id, orderStatus) => {
    try {
      await api.put(`/admin/orders/${id}/status`, { orderStatus });
      toast.success("Order updated");
      fetchOrders();
    } catch { toast.error("Failed"); }
  };

  const updateUserStatus = async (id, accountStatus) => {
    try {
      await api.put(`/admin/users/${id}/status`, { accountStatus });
      toast.success("User updated");
      fetchUsers();
    } catch { toast.error("Failed"); }
  };

  const pf = (key) => (e) => setProductForm({ ...productForm, [key]: e.target.value });

  return (
    <div className="page-wrapper">
      <div className="admin-page container">
        <div className="admin-header">
          <h1 className="admin-title">Admin Panel</h1>
          <span className="admin-badge">Velura Control Centre</span>
        </div>

        {/* Tabs */}
        <div className="admin-tabs">
          {TABS.map((t) => (
            <button key={t} className={`admin-tab ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>{t}</button>
          ))}
        </div>

        {loading && <div className="spinner-wrap"><div className="spinner" /></div>}

        {/* ── Dashboard ── */}
        {!loading && tab === "Dashboard" && dashboard && (
          <div className="admin-dashboard">
            <div className="stat-grid">
              {[
                { label: "Total Revenue", value: `₹${dashboard.totalRevenue.toLocaleString()}`, icon: "₹", color: "#C4956A" },
                { label: "Total Orders", value: dashboard.totalOrders, icon: "📦", color: "#3b82f6" },
                { label: "Products", value: dashboard.totalProducts, icon: "🧵", color: "#8b5cf6" },
                { label: "Customers", value: dashboard.totalUsers, icon: "👥", color: "#2D6A4F" },
              ].map((s) => (
                <div key={s.label} className="stat-card">
                  <div className="stat-icon" style={{ background: s.color + "18", color: s.color }}>{s.icon}</div>
                  <div>
                    <p className="stat-label">{s.label}</p>
                    <p className="stat-value">{s.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="admin-section">
              <h3 className="admin-section-title">Recent Orders</h3>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Status</th>
                    <th>Amount</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboard.recentOrders.map((o) => (
                    <tr key={o._id}>
                      <td className="table-id">{o._id.slice(-8).toUpperCase()}</td>
                      <td>{o.user?.firstName} {o.user?.lastName}</td>
                      <td><span className={`status-pill status-${o.orderStatus?.toLowerCase()}`}>{o.orderStatus}</span></td>
                      <td>₹{o.totalAmount?.toLocaleString()}</td>
                      <td>{new Date(o.createdAt).toLocaleDateString("en-IN")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Products ── */}
        {!loading && tab === "Products" && (
          <div className="admin-section">
            <div className="admin-section-header">
              <h3 className="admin-section-title">All Products ({products.length})</h3>
              <button className="btn btn-primary btn-sm" onClick={() => setShowAddProduct(!showAddProduct)}>
                {showAddProduct ? "Cancel" : "+ Add Product"}
              </button>
            </div>

            {showAddProduct && (
              <form className="add-product-form" onSubmit={handleAddProduct}>
                <h4>New Product</h4>
                <div className="form-grid-3">
                  <div className="form-group"><label>Name *</label><input value={productForm.name} onChange={pf("name")} required /></div>
                  <div className="form-group"><label>SKU *</label><input value={productForm.sku} onChange={pf("sku")} required /></div>
                  <div className="form-group"><label>Category *</label>
                    <select value={productForm.category} onChange={pf("category")}>
                      {["Women", "Men", "Unisex", "Accessories", "Footwear", "Kids"].map((c) => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="form-group"><label>Sub Category</label><input value={productForm.subCategory} onChange={pf("subCategory")} /></div>
                  <div className="form-group"><label>Price (₹) *</label><input type="number" value={productForm.price} onChange={pf("price")} required /></div>
                  <div className="form-group"><label>Compare Price (₹)</label><input type="number" value={productForm.comparePrice} onChange={pf("comparePrice")} /></div>
                  <div className="form-group"><label>Stock *</label><input type="number" value={productForm.stock} onChange={pf("stock")} required /></div>
                  <div className="form-group"><label>Tags (comma separated)</label><input value={productForm.tags} onChange={pf("tags")} placeholder="new, bestseller, trending" /></div>
                  <div className="form-group"><label>Shipping Info</label><input value={productForm.shippingInfo} onChange={pf("shippingInfo")} /></div>
                </div>
                <div className="form-group"><label>Image URLs (comma separated) *</label><input value={productForm.images} onChange={pf("images")} required placeholder="https://..." /></div>
                <div className="form-group"><label>Description *</label><textarea rows={3} value={productForm.description} onChange={pf("description")} required /></div>
                <button type="submit" className="btn btn-primary">Add Product</button>
              </form>
            )}

            <table className="admin-table">
              <thead>
                <tr><th>Image</th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Rating</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p._id}>
                    <td><img src={p.images?.[0]} alt={p.name} className="table-product-img" /></td>
                    <td className="table-product-name">{p.name}</td>
                    <td>{p.category}</td>
                    <td>₹{p.price.toLocaleString()}</td>
                    <td>
                      <span className={`stock-pill ${p.stock === 0 ? "out" : p.stock <= 10 ? "low" : "ok"}`}>
                        {p.stock === 0 ? "Out" : p.stock <= 10 ? `Low (${p.stock})` : p.stock}
                      </span>
                    </td>
                    <td>{"★".repeat(Math.round(p.ratings?.average || 0))} ({p.ratings?.count || 0})</td>
                    <td>
                      <button className="btn btn-ghost btn-sm" style={{ color: "var(--error)" }} onClick={() => deleteProduct(p._id)}>Remove</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ── Orders ── */}
        {!loading && tab === "Orders" && (
          <div className="admin-section">
            <h3 className="admin-section-title">All Orders ({orders.length})</h3>
            <table className="admin-table">
              <thead>
                <tr><th>Order ID</th><th>Customer</th><th>Amount</th><th>Payment</th><th>Status</th><th>Date</th><th>Update Status</th></tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o._id}>
                    <td className="table-id">{o._id.slice(-8).toUpperCase()}</td>
                    <td>{o.user?.firstName} {o.user?.lastName}<br /><span style={{ fontSize: 12, color: "var(--gray-400)" }}>{o.user?.email}</span></td>
                    <td>₹{o.totalAmount?.toLocaleString()}</td>
                    <td><span className={`status-pill status-${o.paymentStatus?.toLowerCase()}`}>{o.paymentStatus}</span></td>
                    <td><span className={`status-pill status-${o.orderStatus?.toLowerCase()}`}>{o.orderStatus}</span></td>
                    <td>{new Date(o.createdAt).toLocaleDateString("en-IN")}</td>
                    <td>
                      <select
                        className="admin-select"
                        value={o.orderStatus}
                        onChange={(e) => updateOrderStatus(o._id, e.target.value)}
                      >
                        {["PLACED","CONFIRMED","PROCESSING","SHIPPED","DELIVERED","CANCELLED"].map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ── Customers ── */}
        {!loading && tab === "Customers" && (
          <div className="admin-section">
            <h3 className="admin-section-title">All Customers ({users.length})</h3>
            <table className="admin-table">
              <thead>
                <tr><th>Name</th><th>Email</th><th>Phone</th><th>Status</th><th>Joined</th><th>Update Status</th></tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    <td className="table-product-name">{u.firstName} {u.lastName}</td>
                    <td>{u.email}</td>
                    <td>{u.phoneNumber || "—"}</td>
                    <td><span className={`status-pill ${u.accountStatus === "ACTIVE" ? "status-delivered" : "status-cancelled"}`}>{u.accountStatus}</span></td>
                    <td>{new Date(u.createdAt).toLocaleDateString("en-IN")}</td>
                    <td>
                      <select
                        className="admin-select"
                        value={u.accountStatus}
                        onChange={(e) => updateUserStatus(u._id, e.target.value)}
                      >
                        {["ACTIVE", "INACTIVE", "BLOCKED"].map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
