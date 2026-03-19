import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api";
import ProductCard from "../components/ProductCard";
import "./Products.css";

const CATEGORIES = ["All", "Women", "Men", "Unisex", "Accessories", "Footwear", "Kids"];
const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
];

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);

  const category = searchParams.get("category") || "All";
  const sort = searchParams.get("sort") || "newest";
  const search = searchParams.get("search") || "";
  const tags = searchParams.get("tags") || "";
  const page = parseInt(searchParams.get("page") || "1");

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (category && category !== "All") params.set("category", category);
      if (sort) params.set("sort", sort);
      if (search) params.set("search", search);
      if (tags) params.set("tags", tags);
      params.set("page", page);
      params.set("limit", 12);
      const { data } = await api.get(`/products?${params.toString()}`);
      setProducts(data.products);
      setTotal(data.total);
    } finally {
      setLoading(false);
    }
  }, [category, sort, search, tags, page]);

  useEffect(() => {
    document.title = "Shop All — Velura";
    fetchProducts();
  }, [fetchProducts]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value && value !== "All") next.set(key, value);
    else next.delete(key);
    next.delete("page");
    setSearchParams(next);
  };

  const pageTitle = tags === "bestseller"
    ? "Best Sellers"
    : tags === "new"
    ? "New Arrivals"
    : search
    ? `Results for "${search}"`
    : category !== "All"
    ? category
    : "All Products";

  return (
    <div className="page-wrapper">
      <div className="products-page container">
        
        {/* Page header */}
        <div className="products-header">
          <div>
            <h1 className="products-title">{pageTitle}</h1>
            <p className="products-count">{total} item{total !== 1 ? "s" : ""}</p>
          </div>
          <button
            className="btn btn-ghost filter-toggle-btn"
            onClick={() => setFilterOpen(!filterOpen)}
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/>
              <line x1="11" y1="18" x2="13" y2="18"/>
            </svg>
            Filters
          </button>
        </div>

        <div className="products-layout">
          {/* Sidebar filters */}
          <aside className={`products-sidebar ${filterOpen ? "open" : ""}`}>
            <div className="sidebar-section">
              <h3 className="sidebar-heading">Category</h3>
              <ul className="category-list">
                {CATEGORIES.map((cat) => (
                  <li key={cat}>
                    <button
                      className={`category-btn ${category === cat ? "active" : ""}`}
                      onClick={() => updateParam("category", cat)}
                    >
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="sidebar-section">
              <h3 className="sidebar-heading">Sort By</h3>
              <ul className="category-list">
                {SORT_OPTIONS.map((opt) => (
                  <li key={opt.value}>
                    <button
                      className={`category-btn ${sort === opt.value ? "active" : ""}`}
                      onClick={() => updateParam("sort", opt.value)}
                    >
                      {opt.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="sidebar-section">
              <h3 className="sidebar-heading">Collection</h3>
              <ul className="category-list">
                {[["new", "New Arrivals"], ["bestseller", "Best Sellers"], ["trending", "Trending"]].map(([val, label]) => (
                  <li key={val}>
                    <button
                      className={`category-btn ${tags === val ? "active" : ""}`}
                      onClick={() => updateParam("tags", tags === val ? "" : val)}
                    >
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Product grid */}
          <div className="products-main">
            {loading ? (
              <div className="spinner-wrap"><div className="spinner" /></div>
            ) : products.length === 0 ? (
              <div className="no-products">
                <span className="no-products-icon">🧵</span>
                <h3>No products found</h3>
                <p>Try adjusting your filters or search terms.</p>
                <button className="btn btn-outline" onClick={() => setSearchParams({})}>
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <div className="product-grid">
                  {products.map((p) => <ProductCard key={p._id} product={p} />)}
                </div>
                {/* Pagination */}
                {total > 12 && (
                  <div className="pagination">
                    <button
                      className="btn btn-ghost btn-sm"
                      disabled={page <= 1}
                      onClick={() => updateParam("page", page - 1)}
                    >
                      ← Prev
                    </button>
                    <span className="pagination-info">
                      Page {page} of {Math.ceil(total / 12)}
                    </span>
                    <button
                      className="btn btn-ghost btn-sm"
                      disabled={page >= Math.ceil(total / 12)}
                      onClick={() => updateParam("page", page + 1)}
                    >
                      Next →
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
