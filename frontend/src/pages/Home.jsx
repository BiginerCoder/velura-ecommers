import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import ProductCard from "../components/ProductCard";
import "./Home.css";

const HERO_SLIDES = [
  {
    title: "New Season,\nNew Story",
    subtitle: "Thoughtfully crafted essentials for the modern wardrobe.",
    cta: "Shop New In",
    link: "/products?tags=new",
    bg: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1400&q=80",
  },
  {
    title: "The Linen\nCollection",
    subtitle: "Breathable, minimal, and endlessly versatile.",
    cta: "Explore Now",
    link: "/products?category=Women",
    bg: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1400&q=80",
  },
  {
    title: "Men's\nEssentials",
    subtitle: "Clean lines. Timeless cuts. Everyday confidence.",
    cta: "Shop Men",
    link: "/products?category=Men",
    bg: "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=1400&q=80",
  },
];

const COLLECTIONS = [
  { label: "Women", image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&q=80", link: "/products?category=Women" },
  { label: "Men", image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=500&q=80", link: "/products?category=Men" },
  { label: "Accessories", image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&q=80", link: "/products?category=Accessories" },
  { label: "Footwear", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80", link: "/products?category=Footwear" },
];

const TRUST_ITEMS = [
  { icon: "🚚", title: "Free Shipping", desc: "On orders above ₹999" },
  { icon: "↩", title: "Easy Returns", desc: "15-day hassle-free returns" },
  { icon: "🔒", title: "Secure Payments", desc: "100% safe & encrypted" },
  { icon: "✦", title: "Genuine Quality", desc: "Handpicked, quality-checked" },
];

const Home = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [bestsellers, setBestsellers] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Velura — Modern Fashion";
    const fetchProducts = async () => {
      try {
        const [bsRes, naRes] = await Promise.all([
          api.get("/products?tags=bestseller&limit=4"),
          api.get("/products?tags=new&limit=4"),
        ]);
        setBestsellers(bsRes.data.products);
        setNewArrivals(naRes.data.products);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = HERO_SLIDES[activeSlide];

  return (
    <div className="home">
      {/* ── Hero ── */}
      <section className="hero">
        <div
          className="hero__bg"
          style={{ backgroundImage: `url(${slide.bg})` }}
        />
        <div className="hero__overlay" />
        <div className="hero__content container">
          <p className="hero__eyebrow">Velura Collection 2025</p>
          <h1 className="hero__title">
            {slide.title.split("\n").map((line, i) => (
              <span key={i}>{line}<br /></span>
            ))}
          </h1>
          <p className="hero__subtitle">{slide.subtitle}</p>
          <div className="hero__actions">
            <Link to={slide.link} className="btn btn-accent btn-lg">{slide.cta}</Link>
            <Link to="/products" className="btn btn-outline btn-lg hero__btn-ghost">Shop All</Link>
          </div>
        </div>
        <div className="hero__dots">
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              className={`hero__dot ${i === activeSlide ? "active" : ""}`}
              onClick={() => setActiveSlide(i)}
            />
          ))}
        </div>
      </section>

      {/* ── Trust bar ── */}
      <section className="trust-bar">
        <div className="container trust-bar__grid">
          {TRUST_ITEMS.map((t) => (
            <div key={t.title} className="trust-item">
              <span className="trust-emoji">{t.icon}</span>
              <div>
                <p className="trust-title">{t.title}</p>
                <p className="trust-desc">{t.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Collections grid ── */}
      <section className="section container">
        <div className="section-header">
          <h2 className="section-title">Shop by Category</h2>
          <p className="section-subtitle">Explore collections curated for every style.</p>
        </div>
        <div className="collections-grid">
          {COLLECTIONS.map((col) => (
            <Link key={col.label} to={col.link} className="collection-card">
              <img src={col.image} alt={col.label} />
              <div className="collection-card__label">
                <span>{col.label}</span>
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <line x1="5" y1="12" x2="19" y2="12"/>
                  <polyline points="12 5 19 12 12 19"/>
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Best sellers ── */}
      <section className="section container">
        <div className="section-header section-header--row">
          <div>
            <h2 className="section-title">Best Sellers</h2>
            <p className="section-subtitle">Our most-loved pieces, season after season.</p>
          </div>
          <Link to="/products?tags=bestseller" className="btn btn-outline">View All</Link>
        </div>
        {loading ? (
          <div className="spinner-wrap"><div className="spinner" /></div>
        ) : (
          <div className="product-grid">
            {bestsellers.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
      </section>

      {/* ── Banner ── */}
      <section className="mid-banner">
        <div className="mid-banner__inner">
          <p className="mid-banner__eyebrow">Limited Time</p>
          <h2 className="mid-banner__title">Use code <span>VELURA10</span> for 10% off your first order</h2>
          <Link to="/products" className="btn btn-accent btn-lg">Shop Now</Link>
        </div>
      </section>

      {/* ── New arrivals ── */}
      <section className="section container">
        <div className="section-header section-header--row">
          <div>
            <h2 className="section-title">New Arrivals</h2>
            <p className="section-subtitle">Fresh drops added every week.</p>
          </div>
          <Link to="/products?tags=new" className="btn btn-outline">See All New</Link>
        </div>
        {loading ? (
          <div className="spinner-wrap"><div className="spinner" /></div>
        ) : (
          <div className="product-grid">
            {newArrivals.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
      </section>

      {/* ── Testimonials ── */}
      <section className="section testimonials">
        <div className="container">
          <h2 className="section-title" style={{ textAlign: "center", marginBottom: 8 }}>What Our Customers Say</h2>
          <p className="section-subtitle" style={{ textAlign: "center" }}>Real people, honest reviews.</p>
          <div className="testimonials__grid">
            {[
              { name: "Priya S.", loc: "Mumbai", text: "The linen blazer is everything. The fabric drapes so well and the fit is perfect. Already ordered two more colours!", rating: 5 },
              { name: "Arjun M.", loc: "Bangalore", text: "Velura is now my go-to for work outfits. The quality is genuinely premium — way better than what I've seen at this price point.", rating: 5 },
              { name: "Neha K.", loc: "Delhi", text: "Obsessed with the wrap dress. Received so many compliments at a wedding last week. Shipping was super fast too.", rating: 5 },
            ].map((t) => (
              <div key={t.name} className="testimonial-card">
                <div className="stars" style={{ marginBottom: 12 }}>{"★".repeat(t.rating)}</div>
                <p className="testimonial-text">"{t.text}"</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">{t.name[0]}</div>
                  <div>
                    <p className="testimonial-name">{t.name}</p>
                    <p className="testimonial-loc">{t.loc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
