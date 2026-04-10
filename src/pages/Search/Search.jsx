import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./Search.css";
import { searchProducts } from "../../services/productService";

const ProductCard = ({ item, onProductClick }) => {
  return (
    <div
      className="product-card"
      onClick={() => onProductClick(item.id)}
      style={{ cursor: 'pointer' }}
    >
      <div className="product-thumb">
        {item.thumb ? (
          <img src={item.thumb} alt={item.title} />
        ) : (
          <span>📦</span>
        )}
      </div>
      <h4>{item.title}</h4>
      <p>{item.desc}</p>

      <div className="price-box">
        <span className="new-price">{item.price}</span>
      </div>

      <button
        className="buy-btn"
        onClick={(e) => {
          e.stopPropagation();
          onProductClick(item.id);
        }}
      >
        View Product
      </button>
    </div>
  );
};

export default function Search() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleSearch = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const products = await searchProducts(searchQuery);
      setResults(products);
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to search products. Please try again.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setSearchParams({ q: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch(query);
  };

  useEffect(() => {
    if (query) {
      handleSearch(query);
    } else {
      setResults([]);
    }
  }, []);

  return (
    <div className="search-page">
      <div className="search-container">
        <div className="search-header">
          <h1>Search Products</h1>
          <p>Find the perfect product for you</p>
        </div>

        <form className="search-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Search for products..."
            value={query}
            onChange={handleInputChange}
            className="search-input"
          />
          <button type="submit" className="search-btn">
            Search
          </button>
        </form>

        <div className="search-results">
          {loading && <p className="loading">Searching...</p>}

          {error && <p className="error">{error}</p>}

          {!loading && !error && results.length === 0 && query && (
            <p className="no-results">No products found for "{query}"</p>
          )}

          {!loading && results.length > 0 && (
            <>
              <p className="results-count">Found {results.length} product(s)</p>
              <div className="products-grid">
                {results.map((product) => (
                  <ProductCard
                    key={product.id}
                    item={{
                      id: product.id,
                      title: product.name,
                      desc: product.description || 'No description',
                      price: `${product.price.toLocaleString()}đ`,
                      thumb: product.thumbnail_url,
                    }}
                    onProductClick={handleProductClick}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}