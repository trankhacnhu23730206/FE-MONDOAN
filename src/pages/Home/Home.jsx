import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import { getProductsByCategory } from "../../services/productService";
import { getAllCategories } from "../../services/categoryService";
import { perks } from "../../constants";

const ProductCard = ({ item, onProductClick }) => {
  return (
    <div 
      className={`product-card ${item.highlight ? "highlight-card" : ""}`}
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
        <span className="old-price">{item.oldPrice}</span>
        <span className="new-price">{item.price}</span>
      </div>

      <button
        className="buy-btn"
        onClick={(e) => {
          e.stopPropagation();
          onProductClick(item.id);
        }}
      >
        Add to cart
      </button>
    </div>
  );
};

const ProductSection = ({ title, tag, products, onProductClick }) => {
  return (
    <section className="home-section">
      <div className="section-top">
        <div className="section-left">
          <h3>{title}</h3>
          {tag && <span className="section-tag">{tag}</span>}
        </div>
        <button className="view-all-btn">View all</button>
      </div>

      <div className="products-grid">
        {products.map((item) => (
          <ProductCard key={item.id} item={item} onProductClick={onProductClick} />
        ))}
      </div>
    </section>
  );
};

const Home = () => {
  const navigate = useNavigate();
  const topCategories = [2, 10, 15];
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState({
    2: [],
    10: [],
    15: [],
  });
  const [loading, setLoading] = useState({
    2: false,
    10: false,
    15: false,
  });

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const fetchCategories = async () => {
    try {
      const fetchedCategories = await getAllCategories();
      setCategories(fetchedCategories);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      setCategories([]);
    }
  };

  const fetchProductsForTopCategories = async () => {
    for (const categoryId of topCategories) {
      setLoading((prev) => ({ ...prev, [categoryId]: true }));
      try {
        const fetchedProducts = await getProductsByCategory(categoryId);
        setProducts((prev) => ({ ...prev, [categoryId]: fetchedProducts }));
      } catch (error) {
        console.error(`Failed to fetch products for category ${categoryId}:`, error);
        setProducts((prev) => ({ ...prev, [categoryId]: [] }));
      } finally {
        setLoading((prev) => ({ ...prev, [categoryId]: false }));
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchCategories();
      await fetchProductsForTopCategories();
    };

    fetchData();
  }, []);

  return (
    <div className="home-page">
      {/* <Header /> */}

      <main className="home-container">
        <section className="store-heading">
          <div>
            <h2>Store</h2>
            <p>The best you buy the product you love to.</p>
          </div>
        </section>

        <section className="category-bar">
          {categories.map((item) => (
            <div
              key={item.id}
              className={`category-item ${topCategories.includes(item.id) ? "active-category" : ""}`}
              onClick={() => navigate(`/category/${item.id}`)}
              style={{ cursor: 'pointer' }}
            >
              <div className="category-icon">{item.icon}</div>
              <span>{item.name}</span>
            </div>
          ))}
        </section>

        {topCategories.map((categoryId) => {
          const categoryName = categories.find((cat) => cat.id === categoryId)?.name || 'Products';
          const categoryIcon = categories.find((cat) => cat.id === categoryId)?.icon || '📦';
          const categoryProducts = products[categoryId] || [];
          const isLoading = loading[categoryId];

          return (
            <div key={categoryId}>
              {isLoading ? (
                <p>Loading products...</p>
              ) : (
                <ProductSection
                  title={<><span className="top-selling-text">Top Selling</span> {categoryName}</>}
                  tag="Recommended"
                  products={categoryProducts.map((product) => ({
                    id: product.id,
                    title: product.name,
                    desc: product.description || 'No description',
                    oldPrice: `${(product.price * 1.2).toLocaleString()}đ`,
                    price: `${product.price.toLocaleString()}đ`,
                    thumb: product.thumbnail_url,
                  }))}
                  onProductClick={handleProductClick}
                />
              )}
            </div>
          );
        })} 

        <section className="perks-section">
          <h3>The Perks of VTech</h3>
          <div className="perks-grid">
            {perks.map((item) => (
              <div key={item.id} className="perk-card">
                <div className="perk-icon">{item.icon}</div>
                <p>{item.title}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;