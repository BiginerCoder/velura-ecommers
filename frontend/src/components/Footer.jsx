import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="footer">
      <div className="footer__top">
        <div className="container footer__grid">
          {/* Brand */}
          <div className="footer__brand">
            <h3 className="footer__logo">Velura</h3>
            <p className="footer__tagline">
              Thoughtfully crafted clothing for the way you live. Modern essentials with lasting quality.
            </p>
            <div className="footer__socials">
              <a href="#instagram" aria-label="Instagram" className="social-link">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
              <a href="#pinterest" aria-label="Pinterest" className="social-link">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.236 2.636 7.855 6.356 9.312-.088-.791-.167-2.005.035-2.868.181-.78 1.172-4.97 1.172-4.97s-.299-.598-.299-1.482c0-1.388.806-2.428 1.808-2.428.853 0 1.267.641 1.267 1.408 0 .858-.548 2.142-.83 3.33-.236.994.499 1.806 1.476 1.806 1.772 0 3.137-1.867 3.137-4.566 0-2.387-1.715-4.057-4.163-4.057-2.836 0-4.5 2.126-4.5 4.325 0 .856.33 1.773.741 2.274a.3.3 0 0 1 .069.286c-.076.313-.244.994-.277 1.134-.044.183-.146.222-.336.134-1.249-.581-2.03-2.407-2.03-3.874 0-3.154 2.292-6.052 6.608-6.052 3.469 0 6.165 2.473 6.165 5.776 0 3.447-2.173 6.22-5.19 6.22-1.013 0-1.966-.527-2.292-1.148l-.623 2.378c-.226.869-.835 1.958-1.244 2.621.937.29 1.931.446 2.962.446 5.522 0 10-4.477 10-10S17.522 2 12 2z"/>
                </svg>
              </a>
              <a href="#twitter" aria-label="Twitter" className="social-link">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Shop */}
          <div className="footer__col">
            <h4 className="footer__heading">Shop</h4>
            <ul className="footer__links">
              <li><Link to="/products?category=Women">Women</Link></li>
              <li><Link to="/products?category=Men">Men</Link></li>
              <li><Link to="/products?category=Accessories">Accessories</Link></li>
              <li><Link to="/products?category=Footwear">Footwear</Link></li>
              <li><Link to="/products?tags=new">New Arrivals</Link></li>
              <li><Link to="/products?tags=bestseller">Best Sellers</Link></li>
            </ul>
          </div>

          {/* Help */}
          <div className="footer__col">
            <h4 className="footer__heading">Help</h4>
            <ul className="footer__links">
              <li><a href="#faq">FAQ</a></li>
              <li><a href="#shipping">Shipping & Returns</a></li>
              <li><a href="#sizing">Size Guide</a></li>
              <li><a href="#contact">Contact Us</a></li>
              <li><Link to="/orders">Track Order</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div className="footer__col">
            <h4 className="footer__heading">Company</h4>
            <ul className="footer__links">
              <li><a href="#about">About Velura</a></li>
              <li><a href="#sustainability">Sustainability</a></li>
              <li><a href="#careers">Careers</a></li>
              <li><a href="#privacy">Privacy Policy</a></li>
              <li><a href="#terms">Terms of Use</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="footer__newsletter">
            <h4 className="footer__heading">Stay in the Loop</h4>
            <p>Be first to know about new collections, exclusive offers, and style guides.</p>
            {subscribed ? (
              <p className="footer__subscribed">✓ You're on the list!</p>
            ) : (
              <form className="footer__subscribe-form" onSubmit={handleSubscribe}>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button type="submit">Subscribe</button>
              </form>
            )}
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        <div className="container footer__bottom-inner">
          <p>© {new Date().getFullYear()} Velura. All rights reserved.</p>
          <div className="footer__payments">
            <span className="payment-chip">Visa</span>
            <span className="payment-chip">Mastercard</span>
            <span className="payment-chip">UPI</span>
            <span className="payment-chip">COD</span>
          </div>
          <Link to="/admin-login" className="footer__admin-link">Admin</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
