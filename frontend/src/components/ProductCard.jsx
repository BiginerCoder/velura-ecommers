import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import "./ProductCard.css";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [adding, setAdding] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);

  const discount =
    product.comparePrice > product.price
      ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
      : 0;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!user) { toast.error("Please sign in to add items to cart"); return; }
    try {
      setAdding(true);
      await addToCart(product._id, 1);
      toast.success(`${product.name} added to cart`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not add to cart");
    } finally {
      setAdding(false);
    }
  };

  const stars = (avg) => {
    const full = Math.floor(avg);
    const half = avg % 1 >= 0.5;
    return "★".repeat(full) + (half ? "½" : "") + "☆".repeat(5 - full - (half ? 1 : 0));
  };

  return (
    <Link to={`/products/${product._id}`} className="product-card">
      <div className="product-card__image-wrap">
        <img
          src={product.images?.[0] || "https://via.placeholder.com/400x500?text=Velura"}
          alt={product.name}
          className="product-card__img"
          loading="lazy"
        />

        {/* badges */}
        <div className="product-card__badges">
          {product.tags?.includes("new") && <span className="badge badge-new">New</span>}
          {product.tags?.includes("trending") && <span className="badge badge-trending">Trending</span>}
          {discount >= 10 && <span className="badge badge-sale">-{discount}%</span>}
        </div>

        {/* wishlist */}
        <button
          className={`product-card__wishlist ${wishlisted ? "active" : ""}`}
          onClick={(e) => { e.preventDefault(); setWishlisted(!wishlisted); }}
          aria-label="Wishlist"
        >
          <svg width="16" height="16" fill={wishlisted ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>

        {/* quick add overlay */}
        <div className="product-card__overlay">
          <button
            className="btn btn-primary btn-sm"
            onClick={handleAddToCart}
            disabled={adding || product.stock === 0}
          >
            {product.stock === 0 ? "Out of Stock" : adding ? "Adding..." : "Add to Cart"}
          </button>
        </div>
      </div>

      <div className="product-card__info">
        <p className="product-card__category">{product.subCategory || product.category}</p>
        <h3 className="product-card__name">{product.name}</h3>
        <div className="product-card__bottom">
          <div className="product-card__price">
            <span className="price-current">₹{product.price.toLocaleString()}</span>
            {product.comparePrice > product.price && (
              <span className="price-compare">₹{product.comparePrice.toLocaleString()}</span>
            )}
          </div>
          {product.ratings?.count > 0 && (
            <div className="product-card__rating">
              <span className="stars" style={{ fontSize: "12px" }}>
                {"★".repeat(Math.round(product.ratings.average))}
              </span>
              <span className="rating-count">({product.ratings.count})</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
