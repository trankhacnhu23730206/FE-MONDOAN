import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import "./Order.css";
import heroImage from "../../assets/hero.png";
import { getProductById } from "../../services/productService";

const formatPrice = (value) => value.toLocaleString("vi-VN") + "đ";

const normalizeCheckoutItem = (item) => {
  const productId = Number(item.productId || item.product_id || item.id);

  return {
    productId,
    name: item.name || item.productName || "Product",
    description: item.description || item.desc || item.productSubtitle || "",
    price: Number(item.price || 0),
    quantity: Math.max(1, Number(item.quantity || item.qty || 1)),
    image: item.thumbnail_url || item.image || heroImage,
  };
};

const readStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user")) || {};
  } catch {
    return {};
  }
};

export default function Order() {
  const { productId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const stateCheckoutItems = useMemo(() => {
    const items = location.state?.checkoutItems;

    if (!Array.isArray(items)) {
      return [];
    }

    return items
      .map(normalizeCheckoutItem)
      .filter((item) => Number.isInteger(item.productId) && item.productId > 0);
  }, [location.state]);
  const [checkoutItems, setCheckoutItems] = useState(stateCheckoutItems);
  const [productLoading, setProductLoading] = useState(true);
  const [productError, setProductError] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const storedUser = useMemo(() => readStoredUser(), []);

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
  const subtotal = checkoutItems.reduce(
    (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1),
    0
  );
  const total = subtotal + shippingFee - discount;

  useEffect(() => {
    if (stateCheckoutItems.length > 0) {
      setCheckoutItems(stateCheckoutItems);
      setProductError("");
      setProductLoading(false);
      return;
    }

    const fetchProduct = async () => {
      setProductLoading(true);
      setProductError("");

      try {
        const fetchedProduct = await getProductById(productId);
        setCheckoutItems([
          normalizeCheckoutItem({
            productId: fetchedProduct.id,
            name: fetchedProduct.name,
            description: fetchedProduct.description,
            price: fetchedProduct.price,
            quantity: 1,
            image: fetchedProduct.thumbnail_url,
          }),
        ]);
      } catch (error) {
        setCheckoutItems([]);
        setProductError(error.message || "Không thể tải thông tin sản phẩm");
      } finally {
        setProductLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    } else {
      setCheckoutItems([]);
      setProductLoading(false);
      setProductError("Không tìm thấy sản phẩm để checkout");
    }
  }, [productId, stateCheckoutItems]);

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
      setDiscount(Math.round(subtotal * 0.1));
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

    if (checkoutItems.length === 0) {
      toast.error("Không tìm thấy thông tin sản phẩm để checkout.");
      return;
    }

    const primaryCheckoutItem = checkoutItems[0];
    const summaryProductName =
      checkoutItems.length > 1
        ? `${primaryCheckoutItem.name} + ${checkoutItems.length - 1} sản phẩm`
        : primaryCheckoutItem.name;
    const totalQty = checkoutItems.reduce(
      (sum, item) => sum + Number(item.quantity || 1),
      0
    );

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

    navigate(`/payment/${primaryCheckoutItem.productId}`, {
      state: {
        order: {
          productId: Number(primaryCheckoutItem.productId),
          productName: summaryProductName,
          productSubtitle: "",
          qty: totalQty,
          price: subtotal,
          shipping: shippingFee,
          image: primaryCheckoutItem.image || heroImage,
          items: checkoutItems,
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

  if (productLoading) {
    return (
      <div className="order-page">
        <div className="order-container">
          <h1 className="order-title">Checkout</h1>
          <div className="order-box">
            <p>Đang tải thông tin sản phẩm...</p>
          </div>
        </div>
      </div>
    );
  }

  if (productError || checkoutItems.length === 0) {
    return (
      <div className="order-page">
        <div className="order-container">
          <h1 className="order-title">Checkout</h1>
          <div className="order-box">
            <p>{productError || "Không tìm thấy sản phẩm"}</p>
            <button className="back-shopping-btn" type="button" onClick={() => navigate(-1)}>
              ← Quay lại
            </button>
          </div>
        </div>
      </div>
    );
  }

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

              {checkoutItems.map((item, index) => (
                <div className="summary-product" key={`${item.productId}-${index}`}>
                  <div className="summary-product-image">
                    <img src={item.image || heroImage} alt={item.name || "Product"} />
                  </div>

                  <div className="summary-product-info">
                    <h3>{item.name || "--"}</h3>
                    <p>{formatPrice(item.price)}</p>
                    <p>Qty: {item.quantity}</p>
                  </div>
                </div>
              ))}

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