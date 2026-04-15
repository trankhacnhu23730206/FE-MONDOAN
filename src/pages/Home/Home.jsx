import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import { getProductsByCategory } from "../../services/productService";
import { getAllCategories } from "../../services/categoryService";
import { perks } from "../../constants";

const ProductCard = ({ item, onProductClick, onBuyNow }) => {

  const handleBuyNow = (e) => {
    e.stopPropagation();
    onBuyNow(item.id);
  };

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

      <div className="product-actions">
        <button className="buy-btn buy-btn--now" onClick={handleBuyNow}>
          View Details
        </button>
      </div>
    </div>
  );
};

const ProductSection = ({ title, tag, products, onProductClick, onBuyNow }) => {
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
          <ProductCard 
            key={item.id} 
            item={item} 
            onProductClick={onProductClick}
            onBuyNow={onBuyNow}
          />
        ))}
      </div>
    </section>
  );
};

const Home = () => {
  const navigate = useNavigate();
  const [topCategories, setTopCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState({});

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleBuyNow = (productId) => {
    navigate(`/product/${productId}`);
  };

  const getRandomCategories = (allCategories) => {
    // Lọc ra các category không phải 2, 10, 15
    const filteredCategories = allCategories.filter(cat => ![2, 10, 15].includes(cat.id));
    
    // Lấy 3 category ngẫu nhiên
    const shuffled = [...filteredCategories].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 3).map(cat => cat.id);
  };

  const fetchCategories = async () => {
    try {
      const fetchedCategories = await getAllCategories();
      setCategories(fetchedCategories);
      
      // Lấy 3 category random sau khi fetch categories
      const randomCategoryIds = getRandomCategories(fetchedCategories);
      setTopCategories(randomCategoryIds);
      
      // Khởi tạo products và loading state với random categories
      const initialProducts = {};
      const initialLoading = {};
      randomCategoryIds.forEach(id => {
        initialProducts[id] = [];
        initialLoading[id] = false;
      });
      setProducts(initialProducts);
      setLoading(initialLoading);
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
    fetchCategories();
  }, []);

  useEffect(() => {
    if (topCategories.length > 0) {
      fetchProductsForTopCategories();
    }
  }, [topCategories]);

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
                  onBuyNow={handleBuyNow}
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