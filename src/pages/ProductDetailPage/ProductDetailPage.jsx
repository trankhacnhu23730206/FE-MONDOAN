import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./ProductDetailPage.css";
import { getProductById } from "../../services/productService";

import heroImage from "../../assets/hero.png";

const formatPrice = (value) => value.toLocaleString("vi-VN") + "đ";

export default function ProductDetailPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(heroImage);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchedProduct = await getProductById(productId);
        setProduct(fetchedProduct);
        setSelectedImage(fetchedProduct.thumbnail_url || heroImage);
      } catch (err) {
        console.error('Failed to fetch product:', err);
        setError('Không thể tải thông tin sản phẩm');
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  if (loading) {
    return (
      <div className="product-detail-page">
        <div className="product-detail-container">
          <div className="not-found-box">
            <h2>Đang tải...</h2>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-detail-page">
        <div className="product-detail-container">
          <div className="not-found-box">
            <h2>{error || 'Không tìm thấy sản phẩm'}</h2>
            <button onClick={() => navigate("/")}>Quay lại trang chủ</button>
          </div>
        </div>
      </div>
    );
  }

  const features = [
    { icon: "🚚", title: "Free Standard Shipping" },
    { icon: "🛡️", title: "Risk-Free Shopping" },
    { icon: "🎧", title: "Dedicated Customer Support" },
  ];

  return (
    <div className="product-detail-page">
      <div className="product-detail-container">
        <div className="product-detail-card">
          <div className="product-detail-left">
            <div className="product-title-block mobile-only">
              <h1>{product.name}</h1>
              <p>{product.description || 'No description available'}</p>
            </div>

            <div className="product-gallery">
              {product.gallery && product.gallery.length > 0 && (
                <div className="thumbnail-list">
                  {product.gallery.map((img, index) => (
                    <button
                      key={index}
                      className={`thumbnail-item ${
                        selectedImage === img ? "active" : ""
                      }`}
                      onClick={() => setSelectedImage(img)}
                      type="button"
                    >
                      <img src={img} alt={`thumb-${index}`} />
                    </button>
                  ))}
                </div>
              )}

              <div className="main-image-box">
                <img src={selectedImage} alt={product.name} />
              </div>
            </div>

            <div className="service-list">
              {features.map((item, index) => (
                <div className="service-card" key={index}>
                  <div className="service-icon">{item.icon}</div>
                  <div className="service-text">{item.title}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="product-detail-right">
            <div className="product-title-block desktop-only">
              <h1>{product.name}</h1>
              <p>{product.description || 'No description available'}</p>
            </div>

            <div className="product-subtitle">{product.name}</div>

            <div className="product-price-main">{formatPrice(product.price)}</div>

            <div className="detail-action-buttons">
              <button className="add-cart-main-btn" type="button">
                Add to Cart
              </button>
              <button className="buy-now-btn" onClick={() => navigate(`/payment/${productId}`)} type="button">
                Buy Now
              </button>
            </div>

            <div className="expert-text">
              Need help choosing? <span>Talk to an expert</span>
            </div>

            {product.specs && Object.keys(product.specs).length > 0 && (
              <div className="specs-box">
                <div className="specs-title">⚙ Technical Specifications</div>

                <div className="specs-table">
                  {Object.entries(product.specs).map(([key, value]) => (
                    <div className="spec-row" key={key}>
                      <div className="spec-label">{key}</div>
                      <div className="spec-value">{value}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="back-actions">
              <button
                className="back-btn"
                onClick={() => navigate(-1)}
                type="button"
              >
                ← Quay lại
              </button>
              <button
                className="back-btn secondary"
                onClick={() => navigate(`/category/${product.category_id}`)}
                type="button"
              >
                Xem cùng category
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}