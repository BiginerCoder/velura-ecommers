import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import "./Auth.css";

const AdminLogin = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const data = await login(form.email, form.password);
      if (data.role !== "admin") {
        toast.error("Not an admin account");
        return;
      }
      toast.success("Welcome, Admin!");
      navigate("/admin");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <span className="auth-logo">Velura</span>
          <p style={{ color: "var(--accent)", fontWeight: 500 }}>Admin Access</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Admin Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              placeholder="admin@velura.com"
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              placeholder="••••••••"
            />
          </div>
          <button type="submit" className="btn btn-primary btn-lg auth-submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign In as Admin"}
          </button>
        </form>
        <p style={{ textAlign: "center", fontSize: 12, color: "var(--gray-400)", marginTop: 16 }}>
          Default: admin@velura.com / admin123
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
