import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import "./Profile.css";

export const OrderSuccess = () => {
  const { id } = useParams();
  return (
    <div className="page-wrapper">
      <div className="success-page">
        <div className="success-icon">✓</div>
        <h1 className="success-title">Order Placed!</h1>
        <p className="success-sub">Thank you for shopping with Velura. Your order has been confirmed.</p>
        <p className="success-id">Order ID: <strong>{id}</strong></p>
        <div className="success-actions">
          <Link to="/orders" className="btn btn-primary btn-lg">View My Orders</Link>
          <Link to="/products" className="btn btn-outline btn-lg">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
};

export const Profile = () => {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ firstName: "", lastName: "", phoneNumber: "" });
  const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "" });
  const [showPw, setShowPw] = useState(false);
  const [addrForm, setAddrForm] = useState({ flatNo: "", street: "", city: "", state: "", zipCode: "", isDefault: true });
  const [showAddrForm, setShowAddrForm] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    document.title = "My Profile — Velura";
    api.get("/users/profile").then(({ data }) => {
      setProfile(data);
      setForm({ firstName: data.firstName, lastName: data.lastName, phoneNumber: data.phoneNumber || "" });
      setLoading(false);
    });
  }, []);

  const saveProfile = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const { data } = await api.put("/users/profile", form);
      setProfile(data);
      updateUser({ firstName: data.firstName, lastName: data.lastName });
      setEditMode(false);
      toast.success("Profile updated");
    } catch { toast.error("Could not update profile"); }
    finally { setSaving(false); }
  };

  const changePw = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await api.put("/auth/change-password", pwForm);
      toast.success("Password changed");
      setPwForm({ currentPassword: "", newPassword: "" });
      setShowPw(false);
    } catch (err) { toast.error(err.response?.data?.message || "Failed"); }
    finally { setSaving(false); }
  };

  const addAddress = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const { data } = await api.post("/users/address", addrForm);
      setProfile(data);
      setShowAddrForm(false);
      setAddrForm({ flatNo: "", street: "", city: "", state: "", zipCode: "", isDefault: true });
      toast.success("Address added");
    } catch { toast.error("Could not add address"); }
    finally { setSaving(false); }
  };

  const deleteAddress = async (addrId) => {
    try {
      const { data } = await api.delete(`/users/address/${addrId}`);
      setProfile(data);
      toast.success("Address removed");
    } catch { toast.error("Could not remove address"); }
  };

  if (loading) return <div className="page-wrapper"><div className="spinner-wrap"><div className="spinner" /></div></div>;

  return (
    <div className="page-wrapper">
      <div className="profile-page container">
        <h1 className="section-title" style={{ marginBottom: 36 }}>My Account</h1>
        <div className="profile-layout">
          {/* Profile details */}
          <div className="profile-main">
            <div className="profile-card">
              <div className="profile-card__header">
                <div className="profile-avatar">
                  {profile.firstName?.[0]}{profile.lastName?.[0]}
                </div>
                <div>
                  <h3>{profile.firstName} {profile.lastName}</h3>
                  <p>{profile.email}</p>
                  <span className={`account-status ${profile.accountStatus?.toLowerCase()}`}>{profile.accountStatus}</span>
                </div>
                <button className="btn btn-ghost btn-sm" onClick={() => setEditMode(!editMode)}>
                  {editMode ? "Cancel" : "Edit"}
                </button>
              </div>

              {editMode ? (
                <form className="profile-edit-form" onSubmit={saveProfile}>
                  <div className="form-row-auth">
                    <div className="form-group"><label>First Name</label><input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} /></div>
                    <div className="form-group"><label>Last Name</label><input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} /></div>
                  </div>
                  <div className="form-group"><label>Phone</label><input value={form.phoneNumber} onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })} /></div>
                  <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? "Saving..." : "Save Changes"}</button>
                </form>
              ) : (
                <div className="profile-info-grid">
                  <div><span className="info-label">Email</span><span>{profile.email}</span></div>
                  <div><span className="info-label">Phone</span><span>{profile.phoneNumber || "—"}</span></div>
                  <div><span className="info-label">Member Since</span><span>{new Date(profile.createdAt).toLocaleDateString("en-IN", { year: "numeric", month: "long" })}</span></div>
                </div>
              )}
            </div>

            {/* Addresses */}
            <div className="profile-card">
              <div className="profile-card__header">
                <h3>Saved Addresses</h3>
                <button className="btn btn-ghost btn-sm" onClick={() => setShowAddrForm(!showAddrForm)}>
                  {showAddrForm ? "Cancel" : "+ Add Address"}
                </button>
              </div>

              {showAddrForm && (
                <form className="profile-edit-form" onSubmit={addAddress}>
                  <div className="form-row-auth">
                    <div className="form-group"><label>Flat / Building</label><input value={addrForm.flatNo} onChange={(e) => setAddrForm({ ...addrForm, flatNo: e.target.value })} required /></div>
                    <div className="form-group"><label>Street</label><input value={addrForm.street} onChange={(e) => setAddrForm({ ...addrForm, street: e.target.value })} required /></div>
                  </div>
                  <div className="form-row-auth">
                    <div className="form-group"><label>City</label><input value={addrForm.city} onChange={(e) => setAddrForm({ ...addrForm, city: e.target.value })} required /></div>
                    <div className="form-group"><label>State</label><input value={addrForm.state} onChange={(e) => setAddrForm({ ...addrForm, state: e.target.value })} required /></div>
                  </div>
                  <div className="form-group"><label>PIN Code</label><input value={addrForm.zipCode} onChange={(e) => setAddrForm({ ...addrForm, zipCode: e.target.value })} required /></div>
                  <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? "Saving..." : "Save Address"}</button>
                </form>
              )}

              {profile.addresses?.length === 0 && !showAddrForm && (
                <p className="no-data-text">No saved addresses yet.</p>
              )}
              <div className="address-list">
                {profile.addresses?.map((addr) => (
                  <div key={addr._id} className="address-item">
                    {addr.isDefault && <span className="badge badge-new" style={{ fontSize: 10, marginBottom: 6 }}>Default</span>}
                    <p>{addr.flatNo}, {addr.street}</p>
                    <p>{addr.city}, {addr.state} — {addr.zipCode}</p>
                    <button className="btn btn-ghost btn-sm" style={{ marginTop: 8, color: "var(--error)" }} onClick={() => deleteAddress(addr._id)}>Remove</button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="profile-sidebar">
            <div className="profile-card">
              <h3 style={{ marginBottom: 16 }}>Change Password</h3>
              {!showPw ? (
                <button className="btn btn-outline btn-sm" onClick={() => setShowPw(true)}>Change Password</button>
              ) : (
                <form onSubmit={changePw}>
                  <div className="form-group"><label>Current Password</label><input type="password" value={pwForm.currentPassword} onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })} required /></div>
                  <div className="form-group"><label>New Password</label><input type="password" value={pwForm.newPassword} onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })} required minLength={6} /></div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button type="submit" className="btn btn-primary btn-sm" disabled={saving}>{saving ? "..." : "Update"}</button>
                    <button type="button" className="btn btn-ghost btn-sm" onClick={() => setShowPw(false)}>Cancel</button>
                  </div>
                </form>
              )}
            </div>

            <div className="profile-card">
              <h3 style={{ marginBottom: 12 }}>Quick Links</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <a href="/orders" className="btn btn-ghost btn-sm" style={{ justifyContent: "flex-start" }}>📦 My Orders</a>
                <a href="/cart" className="btn btn-ghost btn-sm" style={{ justifyContent: "flex-start" }}>🛒 Cart</a>
                <a href="/products" className="btn btn-ghost btn-sm" style={{ justifyContent: "flex-start" }}>🛍 Shop</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
