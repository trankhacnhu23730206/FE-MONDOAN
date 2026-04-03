import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./ProductDetailPage.css";

import reactLogo from "../../assets/react.svg";
import viteLogo from "../../assets/vite.svg";
import heroImage from "../../assets/hero.png";

const products = [
  {
    id: 1,
    name: "Laptop Gaming MSI Cyborg 15",
    category: "laptop",
    image: heroImage,
    gallery: [heroImage, reactLogo, viteLogo, heroImage],
    oldPrice: 31990000,
    price: 27990000,
    shortDesc:
      "Laptop gaming hiệu năng cao, phù hợp chơi game và làm việc sáng tạo.",
    specs: {
      Brand: "MSI",
      Warranty: "24-Month Warranty",
      Color: "Black",
      "Form Factor": "Gaming Laptop",
      Connectivity: "WiFi / Bluetooth",
    },
  },
  {
    id: 2,
    name: "Laptop ASUS TUF Gaming",
    category: "laptop",
    image: heroImage,
    gallery: [heroImage, viteLogo, reactLogo, heroImage],
    oldPrice: 28490000,
    price: 25990000,
    shortDesc: "Dòng laptop bền bỉ, thiết kế gaming, hiệu năng tốt.",
    specs: {
      Brand: "ASUS",
      Warranty: "24-Month Warranty",
      Color: "Gray",
      "Form Factor": "Gaming Laptop",
      Connectivity: "WiFi / Bluetooth",
    },
  },
  {
    id: 3,
    name: "Laptop Acer Nitro V",
    category: "laptop",
    image: heroImage,
    gallery: [heroImage, reactLogo, heroImage, viteLogo],
    oldPrice: 25990000,
    price: 22490000,
    shortDesc: "Laptop gaming tầm trung với hiệu năng mạnh mẽ.",
    specs: {
      Brand: "Acer",
      Warranty: "24-Month Warranty",
      Color: "Black",
      "Form Factor": "Gaming Laptop",
      Connectivity: "WiFi / Bluetooth",
    },
  },
  {
    id: 4,
    name: "PC Gaming RTX 4060",
    category: "pc",
    image: reactLogo,
    gallery: [reactLogo, heroImage, viteLogo, reactLogo],
    oldPrice: 24990000,
    price: 22990000,
    shortDesc: "Bộ PC gaming hiệu năng cao, phù hợp chiến game và stream.",
    specs: {
      Brand: "VTech",
      Warranty: "24-Month Warranty",
      Color: "Black",
      "Form Factor": "Desktop PC",
      Connectivity: "USB / LAN / WiFi",
    },
  },
  {
    id: 5,
    name: "PC ASUS TUF RTX 4060",
    category: "pc",
    image: reactLogo,
    gallery: [reactLogo, viteLogo, heroImage, reactLogo],
    oldPrice: 27990000,
    price: 25990000,
    shortDesc: "PC gaming build sẵn, thiết kế mạnh mẽ, tối ưu chơi game.",
    specs: {
      Brand: "ASUS",
      Warranty: "24-Month Warranty",
      Color: "Black",
      "Form Factor": "Desktop PC",
      Connectivity: "USB / LAN / WiFi",
    },
  },
  {
    id: 6,
    name: "PC Office Basic",
    category: "pc",
    image: reactLogo,
    gallery: [reactLogo, heroImage, viteLogo, reactLogo],
    oldPrice: 12990000,
    price: 10990000,
    shortDesc: "PC văn phòng gọn nhẹ, phù hợp học tập và làm việc cơ bản.",
    specs: {
      Brand: "VTech",
      Warranty: "12-Month Warranty",
      Color: "Black",
      "Form Factor": "Mini PC",
      Connectivity: "USB / LAN",
    },
  },
  {
    id: 7,
    name: "Razer Viper V3 Pro",
    category: "mice",
    image: viteLogo,
    gallery: [viteLogo, heroImage, reactLogo, viteLogo],
    oldPrice: 4590000,
    price: 3990000,
    shortDesc:
      "Ultra-lightweight wireless esports mouse with fast response and high DPI.",
    specs: {
      Brand: "Razer",
      Warranty: "24-Month Warranty",
      Color: "CS2 Edition",
      "Form Factor": "Ergonomic",
      Connectivity: "2.4GHz Wireless",
    },
  },
  {
    id: 8,
    name: "Logitech G Pro X Superlight",
    category: "mice",
    image: viteLogo,
    gallery: [viteLogo, reactLogo, heroImage, viteLogo],
    oldPrice: 3290000,
    price: 2890000,
    shortDesc: "Chuột gaming không dây siêu nhẹ dành cho esport.",
    specs: {
      Brand: "Logitech",
      Warranty: "24-Month Warranty",
      Color: "White",
      "Form Factor": "Symmetrical",
      Connectivity: "2.4GHz Wireless",
    },
  },
  {
    id: 9,
    name: "SteelSeries Prime",
    category: "mice",
    image: viteLogo,
    gallery: [viteLogo, heroImage, reactLogo, viteLogo],
    oldPrice: 2490000,
    price: 2190000,
    shortDesc: "Chuột gaming form cầm thoải mái, phản hồi nhanh.",
    specs: {
      Brand: "SteelSeries",
      Warranty: "24-Month Warranty",
      Color: "Black",
      "Form Factor": "Ergonomic",
      Connectivity: "Wired / Wireless",
    },
  },
  {
    id: 10,
    name: "AKKO 3087 Mechanical Keyboard",
    category: "keyboard",
    image: heroImage,
    gallery: [heroImage, reactLogo, viteLogo, heroImage],
    oldPrice: 2290000,
    price: 1990000,
    shortDesc: "Bàn phím cơ nhỏ gọn, phù hợp game thủ và dân văn phòng.",
    specs: {
      Brand: "AKKO",
      Warranty: "12-Month Warranty",
      Color: "White",
      "Form Factor": "TKL",
      Connectivity: "USB-C",
    },
  },
  {
    id: 11,
    name: "Keychron K8",
    category: "keyboard",
    image: heroImage,
    gallery: [heroImage, viteLogo, reactLogo, heroImage],
    oldPrice: 2590000,
    price: 2190000,
    shortDesc: "Bàn phím cơ wireless hỗ trợ Mac và Windows.",
    specs: {
      Brand: "Keychron",
      Warranty: "12-Month Warranty",
      Color: "Gray",
      "Form Factor": "TKL",
      Connectivity: "Bluetooth / USB-C",
    },
  },
  {
    id: 12,
    name: "Corsair K70 RGB",
    category: "keyboard",
    image: heroImage,
    gallery: [heroImage, reactLogo, viteLogo, heroImage],
    oldPrice: 3490000,
    price: 2990000,
    shortDesc: "Bàn phím cơ cao cấp với LED RGB nổi bật.",
    specs: {
      Brand: "Corsair",
      Warranty: "24-Month Warranty",
      Color: "Black",
      "Form Factor": "Full Size",
      Connectivity: "USB",
    },
  },
];

const formatPrice = (value) => value.toLocaleString("vi-VN") + "đ";

export default function ProductDetailPage() {
  const { productId } = useParams();
  const navigate = useNavigate();

  const product = useMemo(() => {
    return products.find((item) => String(item.id) === String(productId));
  }, [productId]);

  const [selectedImage, setSelectedImage] = useState(product?.gallery?.[0] || "");

  if (!product) {
    return (
      <div className="product-detail-page">
        <div className="product-detail-container">
          <div className="not-found-box">
            <h2>Không tìm thấy sản phẩm</h2>
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
              <p>{product.shortDesc}</p>
            </div>

            <div className="product-gallery">
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
              <p>{product.shortDesc}</p>
            </div>

            <div className="product-subtitle">{product.name}</div>

            <div className="product-price-main">{formatPrice(product.price)}</div>

            <div className="detail-action-buttons">
              <button className="add-cart-main-btn" type="button">
                Add to Cart
              </button>
              <button className="buy-now-btn" type="button">
                Buy Now
              </button>
            </div>

            <div className="expert-text">
              Need help choosing? <span>Talk to an expert</span>
            </div>

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
                onClick={() => navigate(`/category/${product.category}`)}
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