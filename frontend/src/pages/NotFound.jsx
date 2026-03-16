import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => (
  <div style={{
    display: "flex", flexDirection: "column", alignItems: "center",
    justifyContent: "center", minHeight: "80vh", textAlign: "center", padding: "40px 24px",
    paddingTop: "calc(var(--navbar-h) + 60px)"
  }}>
    <p style={{ fontFamily: "var(--font-heading)", fontSize: "120px", fontWeight: 300, color: "var(--gray-200)", lineHeight: 1 }}>404</p>
    <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "32px", fontWeight: 400, color: "var(--primary)", marginBottom: 12 }}>
      Page not found
    </h2>
    <p style={{ color: "var(--gray-400)", marginBottom: 32 }}>
      The page you're looking for doesn't exist or has been moved.
    </p>
    <div style={{ display: "flex", gap: 14 }}>
      <Link to="/" className="btn btn-primary">Go Home</Link>
      <Link to="/products" className="btn btn-outline">Shop All</Link>
    </div>
  </div>
);

export default NotFound;
