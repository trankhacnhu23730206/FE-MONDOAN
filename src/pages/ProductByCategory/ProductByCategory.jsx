import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./ProductByCategory.css";

// Chỉ dùng ảnh có sẵn trong assets của bạn
import reactLogo from "../../assets/react.svg";
import viteLogo from "../../assets/vite.svg";
import heroImage from "../../assets/hero.png";

const categories = [
  { id: 1, name: "Laptop", slug: "laptop", icon: "💻" },
  { id: 2, name: "PC", slug: "pc", icon: "🖥️" },
  { id: 3, name: "Mice", slug: "mice", icon: "🖱️" },
  { id: 4, name: "Keyboard", slug: "keyboard", icon: "⌨️" },
  { id: 5, name: "Mic", slug: "mic", icon: "🎙️" },
  { id: 6, name: "Audio", slug: "audio", icon: "🎧" },
  { id: 7, name: "Speaker", slug: "speaker", icon: "🔊" },
  { id: 8, name: "Chair", slug: "chair", icon: "🪑" },
  { id: 9, name: "Mouse pad", slug: "mouse-pad", icon: "🟦" },
];

const products = [
  {
    id: 1,
    name: "Laptop Gaming MSI Cyborg 15",
    category: "laptop",
    image: heroImage,
    oldPrice: 31990000,
    price: 27990000,
    specs: ["Intel Core i7", "RTX 4060", "16GB RAM", "512GB SSD"],
  },
  {
    id: 2,
    name: "Laptop ASUS TUF Gaming",
    category: "laptop",
    image: heroImage,
    oldPrice: 28490000,
    price: 25990000,
    specs: ["Ryzen 7", "RTX 4050", "16GB RAM", "512GB SSD"],
  },
  {
    id: 3,
    name: "Laptop Acer Nitro V",
    category: "laptop",
    image: heroImage,
    oldPrice: 25990000,
    price: 22490000,
    specs: ["Intel Core i5", "RTX 4050", "16GB RAM", "512GB SSD"],
  },
  {
    id: 4,
    name: "PC Gaming RTX 4060",
    category: "pc",
    image: reactLogo,
    oldPrice: 24990000,
    price: 22990000,
    specs: ["Intel Core i5", "RTX 4060", "16GB RAM", "1TB SSD"],
  },
  {
    id: 5,
    name: "PC ASUS TUF RTX 4060",
    category: "pc",
    image: reactLogo,
    oldPrice: 27990000,
    price: 25990000,
    specs: ["Ryzen 7", "RTX 4060", "16GB RAM", "512GB SSD"],
  },
  {
    id: 6,
    name: "PC Office Basic",
    category: "pc",
    image: reactLogo,
    oldPrice: 12990000,
    price: 10990000,
    specs: ["Intel i3", "8GB RAM", "256GB SSD", "Office use"],
  },
  {
    id: 7,
    name: "Razer Viper V3 Pro",
    category: "mice",
    image: viteLogo,
    oldPrice: 4590000,
    price: 3990000,
    specs: ["Wireless", "2.4GHz", "High DPI", "Gaming mouse"],
  },
  {
    id: 8,
    name: "Logitech G Pro X Superlight",
    category: "mice",
    image: viteLogo,
    oldPrice: 3290000,
    price: 2890000,
    specs: ["Superlight", "Wireless", "Esport", "Fast sensor"],
  },
  {
    id: 9,
    name: "SteelSeries Prime",
    category: "mice",
    image: viteLogo,
    oldPrice: 2490000,
    price: 2190000,
    specs: ["Ergonomic", "Gaming", "Fast click", "Good grip"],
  },
  {
    id: 10,
    name: "AKKO 3087 Mechanical Keyboard",
    category: "keyboard",
    image: heroImage,
    oldPrice: 2290000,
    price: 1990000,
    specs: ["Mechanical", "RGB", "Hot swap", "87 keys"],
  },
  {
    id: 11,
    name: "Keychron K8",
    category: "keyboard",
    image: heroImage,
    oldPrice: 2590000,
    price: 2190000,
    specs: ["Wireless", "RGB", "Mac/Win", "Mechanical"],
  },
  {
    id: 12,
    name: "Corsair K70 RGB",
    category: "keyboard",
    image: heroImage,
    oldPrice: 3490000,
    price: 2990000,
    specs: ["Premium build", "RGB", "Gaming", "Mechanical"],
  },
  {
    id: 13,
    name: "USB Streaming Microphone",
    category: "mic",
    image: reactLogo,
    oldPrice: 1890000,
    price: 1590000,
    specs: ["USB", "RGB", "Clear voice", "Streaming"],
  },
  {
    id: 14,
    name: "Studio Mic Basic",
    category: "mic",
    image: reactLogo,
    oldPrice: 1290000,
    price: 990000,
    specs: ["Recording", "Noise reduction", "Easy setup", "USB"],
  },
  {
    id: 15,
    name: "Gaming Headset Pro",
    category: "audio",
    image: viteLogo,
    oldPrice: 1990000,
    price: 1490000,
    specs: ["Surround", "Mic", "Comfort fit", "Gaming"],
  },
  {
    id: 16,
    name: "Wireless Headphone X",
    category: "audio",
    image: viteLogo,
    oldPrice: 2490000,
    price: 1990000,
    specs: ["Bluetooth", "Bass", "Long battery", "Modern"],
  },
  {
    id: 17,
    name: "Speaker 2.0 Compact",
    category: "speaker",
    image: reactLogo,
    oldPrice: 1290000,
    price: 990000,
    specs: ["Stereo", "Compact", "Clear sound", "Desk setup"],
  },
  {
    id: 18,
    name: "Ergonomic Gaming Chair",
    category: "chair",
    image: heroImage,
    oldPrice: 4990000,
    price: 4290000,
    specs: ["Adjustable", "Soft cushion", "Gaming style", "Comfort"],
  },
  {
    id: 19,
    name: "Large Mouse Pad RGB",
    category: "mouse-pad",
    image: viteLogo,
    oldPrice: 590000,
    price: 399000,
    specs: ["Large size", "RGB edge", "Smooth surface", "Gaming"],
  },
];

const formatPrice = (value) => {
  return value.toLocaleString("vi-VN") + "đ";
};

export default function ProductByCategory() {
  const { categorySlug } = useParams();
  const navigate = useNavigate();

  const [sortBy, setSortBy] = useState("featured");
  const [visibleCount, setVisibleCount] = useState(12);

  const activeCategory =
    categories.find((item) => item.slug === categorySlug) || categories[0];

  const filteredProducts = useMemo(() => {
    const result = products.filter(
      (item) => item.category === activeCategory.slug
    );

    if (sortBy === "price-asc") {
      return [...result].sort((a, b) => a.price - b.price);
    }

    if (sortBy === "price-desc") {
      return [...result].sort((a, b) => b.price - a.price);
    }

    if (sortBy === "name-asc") {
      return [...result].sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [activeCategory.slug, sortBy]);

  const displayedProducts = filteredProducts.slice(0, visibleCount);

  return (
    <div className="product-category-page">
      <div className="product-category-container">
        <div className="category-nav">
          {categories.map((item) => (
            <button
              key={item.id}
              className={`category-btn ${
                item.slug === activeCategory.slug ? "active" : ""
              }`}
              onClick={() => {
                setVisibleCount(12);
                navigate(`/category/${item.slug}`);
              }}
            >
              <div className="category-circle">{item.icon}</div>
              <span>{item.name}</span>
            </button>
          ))}
        </div>

        <div className="category-heading">
          <div>
            <h1>{activeCategory.name}</h1>
            <p>
              Designed for every setup, with quality options to suit your
              playstyle.
            </p>
          </div>

          <div className="category-tools">
            <button className="filter-btn" type="button">
              Filter
            </button>

            <select
              className="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="featured">Sort by: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name: A-Z</option>
            </select>
          </div>
        </div>

        <div className="product-block">
          <h2>Top-Selling {activeCategory.name}</h2>

          {displayedProducts.length === 0 ? (
            <div className="empty-box">Không có sản phẩm trong category này.</div>
          ) : (
            <>
              <div className="product-grid">
                {displayedProducts.map((item) => (
                  <div className="product-card" key={item.id}>
                    <div className="product-image-wrap">
                      <img src={item.image} alt={item.name} />
                    </div>

                    <h3>{item.name}</h3>

                    <ul className="product-specs">
                      {item.specs.map((spec, index) => (
                        <li key={index}>{spec}</li>
                      ))}
                    </ul>

                    <div className="product-price">
                      <span className="old-price">
                        {formatPrice(item.oldPrice)}
                      </span>
                      <span className="new-price">
                        {formatPrice(item.price)}
                      </span>
                    </div>

                    <button className="add-cart-btn" type="button">
                      Add to cart
                    </button>
                  </div>
                ))}
              </div>

              {visibleCount < filteredProducts.length && (
                <div className="load-more-wrap">
                  <button
                    className="load-more-btn"
                    type="button"
                    onClick={() => setVisibleCount((prev) => prev + 6)}
                  >
                    Load more
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}