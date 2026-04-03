import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./Payment.css";

import reactLogo from "../../assets/react.svg";
import viteLogo from "../../assets/vite.svg";
import heroImage from "../../assets/hero.png";

const products = [
  {
    id: 1,
    name: "Laptop Gaming MSI Cyborg 15",
    category: "laptop",
    image: heroImage,
    price: 27990000,
  },
  {
    id: 2,
    name: "Laptop ASUS TUF Gaming",
    category: "laptop",
    image: heroImage,
    price: 25990000,
  },
  {
    id: 3,
    name: "Laptop Acer Nitro V",
    category: "laptop",
    image: heroImage,
    price: 22490000,
  },
  {
    id: 4,
    name: "PC Gaming RTX 4060",
    category: "pc",
    image: reactLogo,
    price: 22990000,
  },
  {
    id: 5,
    name: "PC ASUS TUF RTX 4060",
    category: "pc",
    image: reactLogo,
    price: 25990000,
  },
  {
    id: 6,
    name: "PC Office Basic",
    category: "pc",
    image: reactLogo,
    price: 10990000,
  },
  {
    id: 7,
    name: "Razer Viper V3 Pro Counter-Strike 2 Edition Mouse",
    category: "mice",
    image: viteLogo,
    price: 4990000,
  },
  {
    id: 8,
    name: "Logitech G Pro X Superlight",
    category: "mice",
    image: viteLogo,
    price: 2890000,
  },
  {
    id: 9,
    name: "SteelSeries Prime",
    category: "mice",
    image: viteLogo,
    price: 2190000,
  },
  {
    id: 10,
    name: "AKKO 3087 Mechanical Keyboard",
    category: "keyboard",
    image: heroImage,
    price: 1990000,
  },
];

const formatPrice = (value) => value.toLocaleString("vi-VN") + "đ";

export default function Payment() {
  const { productId } = useParams();
  const navigate = useNavigate();

  const product = useMemo(() => {
    return products.find((item) => String(item.id) === String(productId)) || products[0];
  }, [productId]);

  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);

  const [contactInfo, setContactInfo] = useState({
    name: "Phan Nhật Hòa",
    email: "phannhathoa13@gmail.com",
    keepUpdated: true,
  });

  const [shippingInfo, setShippingInfo] = useState({
    name: "Phan Nhật Hòa",
    phone: "0587189159",
    address: "123 Nguyen Van Cong",
    district: "Go Vap",
    city: "Ho Chi Minh",
    country: "Viet Nam",
    sameAsBilling: true,
  });

  const shippingFee = 0;
  const subtotal = product.price;
  const total = subtotal + shippingFee - discount;

  const handleContactChange = (e) => {
    const { name, value, type, checked } = e.target;
    setContactInfo((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleShippingChange = (e) => {
    const { name, value, type, checked } = e.target;
    setShippingInfo((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase();

    if (code === "SALE10") {
      setDiscount(Math.round(product.price * 0.1));
      alert("Áp dụng mã SALE10 thành công!");
      return;
    }

    if (code === "FREESHIP") {
      setDiscount(0);
      alert("Mã FREESHIP đã được áp dụng. Shipping đang miễn phí.");
      return;
    }

    setDiscount(0);
    alert("Mã giảm giá không hợp lệ.");
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();

    if (
      !contactInfo.name ||
      !contactInfo.email ||
      !shippingInfo.name ||
      !shippingInfo.phone ||
      !shippingInfo.address ||
      !shippingInfo.district ||
      !shippingInfo.city ||
      !shippingInfo.country
    ) {
      alert("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    alert("Đặt hàng thành công! Đây là bản demo UI.");
  };

  const benefits = [
    { icon: "🚚", label: "Free Standard Shipping" },
    { icon: "🛡️", label: "Risk-Free Shopping" },
    { icon: "🎧", label: "Dedicated Customer Support" },
  ];

  return (
    <div className="payment-page">
      <div className="payment-container">
        <h1 className="payment-title">Checkout</h1>

        <div className="payment-layout">
          <form className="payment-left" onSubmit={handlePlaceOrder}>
            <section className="payment-box">
              <div className="section-title">
                <span>👤</span>
                <h2>Contact Information</h2>
              </div>

              <div className="form-grid two-cols">
                <div className="input-group">
                  <label>Name</label>
                  <input
                    type="text"
                    name="name"
                    value={contactInfo.name}
                    onChange={handleContactChange}
                    placeholder="Your name"
                  />
                </div>

                <div className="input-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={contactInfo.email}
                    onChange={handleContactChange}
                    placeholder="Your email"
                  />
                </div>
              </div>

              <label className="checkbox-row">
                <input
                  type="checkbox"
                  name="keepUpdated"
                  checked={contactInfo.keepUpdated}
                  onChange={handleContactChange}
                />
                <span>Keep me updated on exclusive offers</span>
              </label>
            </section>

            <section className="payment-box">
              <div className="section-title">
                <span>🚚</span>
                <h2>Shipping Address</h2>
              </div>

              <div className="form-grid two-cols">
                <div className="input-group">
                  <label>Name</label>
                  <input
                    type="text"
                    name="name"
                    value={shippingInfo.name}
                    onChange={handleShippingChange}
                    placeholder="Receiver name"
                  />
                </div>

                <div className="input-group">
                  <label>Phone</label>
                  <input
                    type="text"
                    name="phone"
                    value={shippingInfo.phone}
                    onChange={handleShippingChange}
                    placeholder="Phone number"
                  />
                </div>

                <div className="input-group">
                  <label>Address</label>
                  <input
                    type="text"
                    name="address"
                    value={shippingInfo.address}
                    onChange={handleShippingChange}
                    placeholder="Street address"
                  />
                </div>

                <div className="input-group">
                  <label>District</label>
                  <input
                    type="text"
                    name="district"
                    value={shippingInfo.district}
                    onChange={handleShippingChange}
                    placeholder="District"
                  />
                </div>

                <div className="input-group">
                  <label>City</label>
                  <input
                    type="text"
                    name="city"
                    value={shippingInfo.city}
                    onChange={handleShippingChange}
                    placeholder="City"
                  />
                </div>

                <div className="input-group">
                  <label>Country</label>
                  <input
                    type="text"
                    name="country"
                    value={shippingInfo.country}
                    onChange={handleShippingChange}
                    placeholder="Country"
                  />
                </div>
              </div>

              <label className="checkbox-row">
                <input
                  type="checkbox"
                  name="sameAsBilling"
                  checked={shippingInfo.sameAsBilling}
                  onChange={handleShippingChange}
                />
                <span>Billing address same as shipping</span>
              </label>

              <button className="place-order-btn" type="submit">
                Place Order
              </button>
            </section>
          </form>

          <aside className="payment-right">
            <section className="payment-box summary-box">
              <div className="section-title">
                <h2>Order Summary</h2>
              </div>

              <div className="summary-product">
                <div className="summary-product-image">
                  <img src={product.image} alt={product.name} />
                </div>

                <div className="summary-product-info">
                  <h3>{product.name}</h3>
                  <p>Qty: 1</p>
                </div>
              </div>

              <div className="summary-price-list">
                <div className="price-row">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>

                <div className="promo-row">
                  <input
                    type="text"
                    placeholder="Promo Code (Optional)"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                  />
                  <button type="button" onClick={handleApplyPromo}>
                    Apply
                  </button>
                </div>

                {discount > 0 && (
                  <div className="price-row discount-row">
                    <span>Discount</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}

                <div className="price-row">
                  <span>Shipping</span>
                  <span className="free-text">Free</span>
                </div>

                <div className="price-row total-row">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              <div className="secure-checkout">
                🔒 100% Secure & Encrypted Checkout
              </div>

              <div className="benefit-list">
                {benefits.map((item, index) => (
                  <div className="benefit-item" key={index}>
                    <div className="benefit-icon">{item.icon}</div>
                    <div className="benefit-label">{item.label}</div>
                  </div>
                ))}
              </div>

              <div className="summary-actions">
                <button
                  type="button"
                  className="back-shopping-btn"
                  onClick={() => navigate(-1)}
                >
                  ← Quay lại
                </button>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}