import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import "./Order.css";
import heroImage from "../../assets/hero.png";

const formatPrice = (value) => value.toLocaleString("vi-VN") + "đ";

const readStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user")) || {};
  } catch {
    return {};
  }
};

export default function Order() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const storedUser = useMemo(() => readStoredUser(), []);

  const product = {
    id: productId,
    name: "Razer Viper V3 Pro",
    price: 9998000,
    thumbnail_url: "",
  };

  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);

  const [contactInfo, setContactInfo] = useState(() => ({
    name:
      storedUser.fullName ||
      storedUser.full_name ||
      storedUser.username ||
      storedUser.name ||
      "",
    email: storedUser.email || "",
    keepUpdated: true,
  }));

  const [shippingInfo, setShippingInfo] = useState(() => ({
    name:
      storedUser.fullName ||
      storedUser.full_name ||
      storedUser.username ||
      storedUser.name ||
      "",
    phone: storedUser.phone || storedUser.phoneNumber || storedUser.phone_number || "",
    address:
      storedUser.address ||
      storedUser.shipping_address ||
      storedUser.shippingAddress ||
      "",
    district: storedUser.district || storedUser.shipping_district || "",
    city: storedUser.city || storedUser.shipping_city || "",
    country:
      storedUser.country ||
      storedUser.shipping_country ||
      "Viet Nam",
    sameAsBilling: true,
  }));

  const shippingFee = 0;
  const subtotal = Number(product?.price || 0);
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

    if (!code) {
      toast("Vui lòng nhập mã giảm giá.", { icon: "⚠️" });
      return;
    }

    if (code === "SALE10") {
      setDiscount(Math.round(product.price * 0.1));
      toast.success("Áp dụng mã SALE10 thành công!");
      return;
    }

    if (code === "FREESHIP") {
      setDiscount(0);
      toast.success("Mã FREESHIP đã được áp dụng. Shipping đang miễn phí.");
      return;
    }

    setDiscount(0);
    toast.error("Mã giảm giá không hợp lệ.");
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    setSubmitError("");

    const receiverName = (shippingInfo.name || "").trim();
    const receiverPhone = (shippingInfo.phone || "").trim();
    const address = (shippingInfo.address || "").trim();
    const district = (shippingInfo.district || "").trim();
    const city = (shippingInfo.city || "").trim();
    const country = (shippingInfo.country || "").trim();
    const contactName = (contactInfo.name || "").trim();
    const contactEmail = (contactInfo.email || "").trim();

    if (
      !contactName ||
      !contactEmail ||
      !receiverName ||
      !receiverPhone ||
      !address ||
      !district ||
      !city ||
      !country
    ) {
      toast.error("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    navigate(`/payment/${productId}`, {
      state: {
        order: {
          productId: Number(productId),
          productName: product.name,
          productSubtitle: "",
          qty: 1,
          price: Number(product.price || 0),
          shipping: shippingFee,
          image: product?.thumbnail_url || heroImage,
          contactInfo: {
            name: contactName,
            email: contactEmail,
          },
          shippingInfo: {
            name: receiverName,
            phone: receiverPhone,
            address,
            district,
            city,
            country,
          },
        },
      },
    });
  };

  const benefits = [
    { icon: "🚚", label: "Free Standard Shipping" },
    { icon: "🛡️", label: "Risk-Free Shopping" },
    { icon: "🎧", label: "Dedicated Customer Support" },
  ];

  return (
    <div className="order-page">
      <div className="order-container">
        <h1 className="order-title">Checkout</h1>

        <div className="order-layout">
          <form className="order-left" onSubmit={handlePlaceOrder}>
            <section className="order-box">
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

            <section className="order-box">
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

              {submitError && <p style={{ color: "#c1124c", marginTop: "14px" }}>{submitError}</p>}

              <button className="place-order-btn" type="submit" disabled={submitLoading}>
                {submitLoading ? "Placing Order..." : "Place Order"}
              </button>
            </section>
          </form>

          <aside className="order-right">
            <section className="order-box summary-box">
              <div className="section-title">
                <h2>Order Summary</h2>
              </div>

              <div className="summary-product">
                <div className="summary-product-image">
                  <img src={product?.thumbnail_url || heroImage} alt={product?.name || "Product"} />
                </div>

                <div className="summary-product-info">
                  <h3>{product?.name || "--"}</h3>
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