import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import "./Navbar.css";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [location]);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setSearchOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navLinks = [
    { label: "New In", to: "/products?tags=new" },
    { label: "Women", to: "/products?category=Women" },
    { label: "Men", to: "/products?category=Men" },
    { label: "Accessories", to: "/products?category=Accessories" },
    { label: "Sale", to: "/products?tags=bestseller" },
  ];

  return (
    <>
      <div className="announcement-bar">
        Free shipping on orders above ₹999 &nbsp;·&nbsp; Use code{" "}
        <strong>VELURA10</strong> for 10% off
      </div>
      <nav className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
        <div className="navbar__inner">
          {/* Hamburger */}
          <button
            className={`navbar__hamburger ${menuOpen ? "open" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            <span /><span /><span />
          </button>

          {/* Logo */}
          <Link to="/" className="navbar__logo">
            Velura
          </Link>

          {/* Desktop nav links */}
          <ul className="navbar__links">
            {navLinks.map((l) => (
              <li key={l.label}>
                <Link to={l.to} className="navbar__link">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Actions */}
          <div className="navbar__actions">
            {/* Search */}
            <button
              className="navbar__icon-btn"
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Search"
            >
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
            </button>

            {/* Profile / Auth */}
            {user ? (
              <div className="navbar__user-menu">
                <button className="navbar__icon-btn" aria-label="Account">
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <span className="navbar__user-name">{user.firstName}</span>
                </button>
                <div className="navbar__dropdown">
                  <Link to="/profile" className="dropdown-item">My Profile</Link>
                  <Link to="/orders" className="dropdown-item">My Orders</Link>
                  {user.role === "admin" && (
                    <Link to="/admin" className="dropdown-item">Admin Panel</Link>
                  )}
                  <button onClick={handleLogout} className="dropdown-item dropdown-item--danger">
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="navbar__icon-btn" aria-label="Login">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </Link>
            )}

            {/* Cart */}
            <Link to="/cart" className="navbar__cart-btn" aria-label="Cart">
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
            </Link>
          </div>
        </div>

        {/* Search overlay */}
        {searchOpen && (
          <div className="navbar__search">
            <form onSubmit={handleSearch} className="search-form">
              <input
                ref={searchRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search styles, categories..."
              />
              <button type="submit">Search</button>
              <button type="button" className="search-close" onClick={() => setSearchOpen(false)}>✕</button>
            </form>
          </div>
        )}
      </nav>

      {/* Mobile menu */}
      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        <ul>
          {navLinks.map((l) => (
            <li key={l.label}>
              <Link to={l.to}>{l.label}</Link>
            </li>
          ))}
          <li className="mobile-menu__divider" />
          {user ? (
            <>
              <li><Link to="/profile">Profile</Link></li>
              <li><Link to="/orders">Orders</Link></li>
              <li><button onClick={handleLogout}>Sign Out</button></li>
            </>
          ) : (
            <>
              <li><Link to="/login">Sign In</Link></li>
              <li><Link to="/register">Create Account</Link></li>
            </>
          )}
        </ul>
      </div>
      {menuOpen && <div className="mobile-overlay" onClick={() => setMenuOpen(false)} />}
    </>
  );
};

export default Navbar;
