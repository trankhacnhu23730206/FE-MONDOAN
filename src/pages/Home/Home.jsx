import React from "react";
import "./Home.css";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

const categories = [
  { id: 1, name: "Laptops", icon: "💻" },
  { id: 2, name: "PC", icon: "🖥️" },
  { id: 3, name: "Mice", icon: "🖱️", active: true },
  { id: 4, name: "Keyboard", icon: "⌨️" },
  { id: 5, name: "Mic", icon: "🎙️" },
  { id: 6, name: "Audio", icon: "🎧" },
  { id: 7, name: "Speaker", icon: "🔊" },
  { id: 8, name: "Chair", icon: "🪑" },
  { id: 9, name: "Mouse pad", icon: "🟦" },
];

const laptopProducts = [
  {
    id: 1,
    title: "Laptop MSI Cyborg 15",
    desc: "Intel Core i7 • RTX 4060 • 16GB RAM • 512GB SSD",
    oldPrice: "31.990.000đ",
    price: "27.990.000đ",
    thumb: "💻",
  },
  {
    id: 2,
    title: "Laptop ASUS TUF Gaming",
    desc: "Ryzen 7 • RTX 4050 • 16GB RAM • 512GB SSD",
    oldPrice: "28.490.000đ",
    price: "25.990.000đ",
    thumb: "💻",
  },
  {
    id: 3,
    title: "Laptop Acer Nitro V",
    desc: "Intel Core i5 • RTX 4050 • 16GB RAM • 512GB SSD",
    oldPrice: "25.990.000đ",
    price: "22.490.000đ",
    thumb: "💻",
  },
  {
    id: 4,
    title: "Laptop Lenovo LOQ",
    desc: "Intel Core i5 • RTX 3050 • 16GB RAM • 512GB SSD",
    oldPrice: "23.990.000đ",
    price: "20.990.000đ",
    thumb: "💻",
  },
  {
    id: 5,
    title: "Laptop HP Victus 15",
    desc: "Ryzen 5 • RTX 3050 • 8GB RAM • 512GB SSD",
    oldPrice: "22.990.000đ",
    price: "19.990.000đ",
    thumb: "💻",
  },
  {
    id: 6,
    title: "Laptop Gigabyte G5",
    desc: "Intel Core i5 • RTX 4060 • 16GB RAM • 512GB SSD",
    oldPrice: "29.990.000đ",
    price: "26.990.000đ",
    thumb: "💻",
  },
];

const pcProducts = [
  {
    id: 1,
    title: "PC Gaming RTX 4060",
    desc: "i5-13400F • RTX 4060 • 16GB RAM • 1TB SSD",
    oldPrice: "24.990.000đ",
    price: "21.990.000đ",
    thumb: "🖥️",
  },
  {
    id: 2,
    title: "PC Gaming RTX 3060",
    desc: "Ryzen 5 5600 • RTX 3060 • 16GB RAM • 512GB SSD",
    oldPrice: "21.990.000đ",
    price: "18.990.000đ",
    thumb: "🖥️",
  },
  {
    id: 3,
    title: "PC Creator Intel",
    desc: "i7-12700 • RTX 4060 • 32GB RAM • 1TB SSD",
    oldPrice: "29.990.000đ",
    price: "26.990.000đ",
    thumb: "🖥️",
  },
  {
    id: 4,
    title: "PC Esport",
    desc: "i5-12400F • RTX 3050 • 16GB RAM • 512GB SSD",
    oldPrice: "18.990.000đ",
    price: "16.490.000đ",
    thumb: "🖥️",
  },
  {
    id: 5,
    title: "PC Streaming",
    desc: "Ryzen 7 5700X • RTX 4060 • 32GB RAM • 1TB SSD",
    oldPrice: "28.990.000đ",
    price: "25.990.000đ",
    thumb: "🖥️",
  },
  {
    id: 6,
    title: "PC Mini",
    desc: "i5-13400 • UHD Graphics • 16GB RAM • 512GB SSD",
    oldPrice: "14.990.000đ",
    price: "12.990.000đ",
    thumb: "🖥️",
  },
];

const mouseProducts = [
  {
    id: 1,
    title: "Razer Viper V2 Pro",
    desc: "Wireless • Ultra-light • 30K DPI",
    oldPrice: "3.790.000đ",
    price: "2.990.000đ",
    thumb: "🖱️",
  },
  {
    id: 2,
    title: "Logitech G Pro X Superlight",
    desc: "Wireless • HERO sensor • 63g",
    oldPrice: "3.490.000đ",
    price: "2.890.000đ",
    thumb: "🖱️",
  },
  {
    id: 3,
    title: "Razer DeathAdder V3",
    desc: "Ergonomic • 30K DPI • Wired",
    oldPrice: "1.990.000đ",
    price: "1.590.000đ",
    thumb: "🖱️",
    highlight: true,
  },
  {
    id: 4,
    title: "Logitech G304",
    desc: "Wireless • 12K DPI • Battery",
    oldPrice: "1.190.000đ",
    price: "890.000đ",
    thumb: "🖱️",
  },
  {
    id: 5,
    title: "ASUS TUF M4",
    desc: "Lightweight • Durable switch",
    oldPrice: "990.000đ",
    price: "690.000đ",
    thumb: "🖱️",
  },
  {
    id: 6,
    title: "DareU EM901X",
    desc: "Wireless • RGB • Gaming",
    oldPrice: "790.000đ",
    price: "590.000đ",
    thumb: "🖱️",
  },
];

const keyboardProducts = [
  {
    id: 1,
    title: "Keychron K8 Pro",
    desc: "Wireless • Hot-swap • RGB",
    oldPrice: "3.290.000đ",
    price: "2.790.000đ",
    thumb: "⌨️",
  },
  {
    id: 2,
    title: "Akko 5075B Plus",
    desc: "75% layout • Tri-mode • Foam mod",
    oldPrice: "2.490.000đ",
    price: "2.090.000đ",
    thumb: "⌨️",
  },
  {
    id: 3,
    title: "Razer Huntsman Mini",
    desc: "Optical switch • 60% • RGB",
    oldPrice: "2.990.000đ",
    price: "2.390.000đ",
    thumb: "⌨️",
  },
  {
    id: 4,
    title: "Logitech G Pro Keyboard",
    desc: "TKL • GX switch • Esport",
    oldPrice: "2.790.000đ",
    price: "2.190.000đ",
    thumb: "⌨️",
  },
  {
    id: 5,
    title: "FL-Esports CMK87",
    desc: "TKL • RGB • Hot-swap",
    oldPrice: "1.690.000đ",
    price: "1.390.000đ",
    thumb: "⌨️",
  },
  {
    id: 6,
    title: "DareU EK87",
    desc: "TKL • Mechanical • Budget",
    oldPrice: "990.000đ",
    price: "690.000đ",
    thumb: "⌨️",
  },
];

const perks = [
  { id: 1, title: "Free Shipping", icon: "🚚" },
  { id: 2, title: "Fast Delivery", icon: "⚡" },
  { id: 3, title: "Installment Plans", icon: "💳" },
  { id: 4, title: "Store Events", icon: "✨" },
  { id: 5, title: "Big Sale Day", icon: "🛍️" },
  { id: 6, title: "Member Benefits", icon: "🎁" },
];

const ProductCard = ({ item }) => {
  return (
    <div className={`product-card ${item.highlight ? "highlight-card" : ""}`}>
      <div className="product-thumb">{item.thumb}</div>
      <h4>{item.title}</h4>
      <p>{item.desc}</p>

      <div className="price-box">
        <span className="old-price">{item.oldPrice}</span>
        <span className="new-price">{item.price}</span>
      </div>

      <button className="buy-btn">Add to cart</button>
    </div>
  );
};

const ProductSection = ({ title, tag, products }) => {
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
          <ProductCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
};

const Home = () => {
  return (
    <div className="home-page">
  

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
              className={`category-item ${item.active ? "active-category" : ""}`}
            >
              <div className="category-icon">{item.icon}</div>
              <span>{item.name}</span>
            </div>
          ))}
        </section>

        <ProductSection
          title="Recommended for you"
          tag="Top-selling laptops"
          products={laptopProducts}
        />

        <ProductSection
          title="Top-selling PCs"
          tag="Free shipping"
          products={pcProducts}
        />

        <ProductSection
          title="Top-selling Mice"
          tag="Best choice"
          products={mouseProducts}
        />

        <ProductSection
          title="Top-selling Keyboards"
          tag="Free shipping"
          products={keyboardProducts}
        />

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