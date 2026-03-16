import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import "./SingleProduct.css";

const SingleProduct = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState({});
  const [adding, setAdding] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [tab, setTab] = useState("description");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data);
        document.title = `${data.name} — Velura`;
        const defaults = {};
        data.variants?.forEach((v) => { defaults[v.label] = v.options[0]; });
        setSelectedVariants(defaults);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) { toast.error("Please sign in first"); return; }
    try {
      setAdding(true);
      await addToCart(product._id, quantity, selectedVariants);
      toast.success("Added to cart!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not add to cart");
    } finally {
      setAdding(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) { toast.error("Sign in to leave a review"); return; }
    try {
      setSubmittingReview(true);
      await api.post(`/products/${id}/reviews`, { rating: reviewRating, comment: reviewText });
      toast.success("Review submitted!");
      setReviewText("");
      const { data } = await api.get(`/products/${id}`);
      setProduct(data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  const discount =
    product?.comparePrice > product?.price
      ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
      : 0;

  if (loading) return <div className="page-wrapper"><div className="spinner-wrap"><div className="spinner" /></div></div>;
  if (!product) return <div className="page-wrapper container"><p>Product not found.</p></div>;

  return (
    <div className="page-wrapper">
      <div className="sp-page container">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/products">Shop</Link>
          <span>/</span>
          <Link to={`/products?category=${product.category}`}>{product.category}</Link>
          <span>/</span>
          <span>{product.name}</span>
        </nav>

        <div className="sp-layout">
          {/* Gallery */}
          <div className="sp-gallery">
            <div className="sp-gallery__main">
              <img src={product.images[activeImg] || "https://via.placeholder.com/600"} alt={product.name} />
              {discount >= 10 && (
                <span className="sp-discount-badge">-{discount}%</span>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="sp-gallery__thumbs">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    className={`sp-thumb ${i === activeImg ? "active" : ""}`}
                    onClick={() => setActiveImg(i)}
                  >
                    <img src={img} alt={`view ${i + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="sp-details">
            <p className="sp-category">{product.subCategory || product.category}</p>
            <h1 className="sp-name">{product.name}</h1>

            {/* Rating */}
            {product.ratings.count > 0 && (
              <div className="sp-rating">
                <span className="stars">{"★".repeat(Math.round(product.ratings.average))}</span>
                <span className="sp-rating-text">
                  {product.ratings.average.toFixed(1)} ({product.ratings.count} reviews)
                </span>
              </div>
            )}

            {/* Price */}
            <div className="sp-price">
              <span className="sp-price-current">₹{product.price.toLocaleString()}</span>
              {product.comparePrice > product.price && (
                <span className="sp-price-compare">₹{product.comparePrice.toLocaleString()}</span>
              )}
              {discount >= 10 && (
                <span className="sp-price-saving">Save {discount}%</span>
              )}
            </div>

            {/* Variants */}
            {product.variants?.map((variant) => (
              <div key={variant.label} className="sp-variant-group">
                <p className="sp-variant-label">
                  {variant.label}: <strong>{selectedVariants[variant.label]}</strong>
                </p>
                <div className="sp-variant-options">
                  {variant.options.map((opt) => (
                    <button
                      key={opt}
                      className={`sp-variant-btn ${selectedVariants[variant.label] === opt ? "active" : ""}`}
                      onClick={() => setSelectedVariants({ ...selectedVariants, [variant.label]: opt })}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {/* Quantity + CTA */}
            <div className="sp-qty-row">
              <div className="sp-qty-control">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}>+</button>
              </div>
              <button
                className="btn btn-primary btn-lg sp-add-btn"
                onClick={handleAddToCart}
                disabled={adding || product.stock === 0}
              >
                {product.stock === 0 ? "Out of Stock" : adding ? "Adding..." : "Add to Cart"}
              </button>
            </div>

            {/* Stock indicator */}
            {product.stock > 0 && product.stock <= 10 && (
              <p className="sp-low-stock">Only {product.stock} left in stock</p>
            )}

            {/* Trust badges */}
            <div className="sp-trust">
              <div className="sp-trust-item">
                <span>🚚</span>
                <span>{product.shippingInfo || "Free delivery above ₹999"}</span>
              </div>
              <div className="sp-trust-item"><span>↩</span><span>15-day easy returns</span></div>
              <div className="sp-trust-item"><span>🔒</span><span>Secure checkout</span></div>
            </div>

            {/* Tabs */}
            <div className="sp-tabs">
              {["description", "details", "reviews"].map((t) => (
                <button
                  key={t}
                  className={`sp-tab ${tab === t ? "active" : ""}`}
                  onClick={() => setTab(t)}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                  {t === "reviews" && ` (${product.ratings.count})`}
                </button>
              ))}
            </div>

            <div className="sp-tab-content">
              {tab === "description" && <p>{product.description}</p>}
              {tab === "details" && (
                <ul className="sp-detail-list">
                  <li><strong>SKU:</strong> {product.sku}</li>
                  <li><strong>Category:</strong> {product.category}</li>
                  <li><strong>Tags:</strong> {product.tags?.join(", ")}</li>
                  <li><strong>Stock:</strong> {product.stock} units available</li>
                </ul>
              )}
              {tab === "reviews" && (
                <div className="sp-reviews">
                  {product.reviews.length === 0 ? (
                    <p className="sp-no-reviews">No reviews yet. Be the first!</p>
                  ) : (
                    product.reviews.map((r) => (
                      <div key={r._id} className="sp-review">
                        <div className="sp-review-header">
                          <span className="sp-review-author">{r.name}</span>
                          <span className="stars" style={{ fontSize: "13px" }}>{"★".repeat(r.rating)}</span>
                        </div>
                        <p className="sp-review-text">{r.comment}</p>
                        <span className="sp-review-date">
                          {new Date(r.createdAt).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}
                        </span>
                      </div>
                    ))
                  )}

                  {user && (
                    <form className="sp-review-form" onSubmit={handleReviewSubmit}>
                      <h4>Leave a Review</h4>
                      <div className="sp-star-select">
                        {[1,2,3,4,5].map((s) => (
                          <button
                            type="button"
                            key={s}
                            className={s <= reviewRating ? "star-filled" : "star-empty"}
                            onClick={() => setReviewRating(s)}
                          >★</button>
                        ))}
                      </div>
                      <textarea
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        placeholder="Share your experience..."
                        rows={3}
                        required
                      />
                      <button className="btn btn-primary" type="submit" disabled={submittingReview}>
                        {submittingReview ? "Submitting..." : "Submit Review"}
                      </button>
                    </form>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleProduct;
