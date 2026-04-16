import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Payment.css";
import { createOrder } from "../../services/orderService";
import { confirmPayment } from "../../services/paymentService";

const demoOrder = {
  id: "ORD-240415-001",
  productName: "Razer Viper V3 Pro",
  productSubtitle: "Counter-Strike 2 Edition Mouse",
  qty: 1,
  price: 9998000,
  shipping: 0,
  image: "",
  items: [],
};

const normalizeOrderItem = (item) => ({
  productId: Number(item.productId || item.product_id || 0),
  productName: item.productName || item.name || "Product",
  productSubtitle: item.productSubtitle || item.description || item.desc || "",
  quantity: Math.max(1, Number(item.quantity || item.qty || 1)),
  price: Number(item.price || 0),
  image: item.image || item.thumbnail_url || "",
});

const supportedBanks = [
  "Vietcombank",
  "VietinBank",
  "Techcombank",
  "ACB",
  "Sacombank",
  "Eximbank",
  "OCB",
  "SHB",
  "VIB",
  "SCB",
  "MB",
];

function Payment() {
  const navigate = useNavigate();
  const location = useLocation();

  const orderFromState = location.state?.order || {};
  const order = {
    ...demoOrder,
    ...orderFromState,
  };
  const orderItems = useMemo(() => {
    if (Array.isArray(order.items) && order.items.length > 0) {
      return order.items
        .map(normalizeOrderItem)
        .filter((item) => Number.isInteger(item.productId) && item.productId > 0);
    }

    const fallbackItem = normalizeOrderItem({
      productId: order.productId,
      productName: order.productName,
      productSubtitle: order.productSubtitle,
      quantity: order.qty,
      price: order.price,
      image: order.image,
    });

    return Number.isInteger(fallbackItem.productId) && fallbackItem.productId > 0
      ? [fallbackItem]
      : [];
  }, [order]);

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [bankPayment, setBankPayment] = useState({
    bankName: supportedBanks[0],
    accountNumber: "",
    accountName: "",
  });

  const [masterCardInfo, setMasterCardInfo] = useState({
    number: "",
    expiry: "",
    name: "",
    cvv: "",
  });

  const formatCurrency = (value) => {
    return `${Number(value || 0).toLocaleString("vi-VN")}đ`;
  };

  const subtotal = useMemo(() => {
    return orderItems.reduce(
      (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1),
      0
    );
  }, [orderItems]);

  const shipping = Number(order.shipping || 0);

  const total = useMemo(() => {
    return Math.max(subtotal + shipping - discount, 0);
  }, [subtotal, shipping, discount]);

  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase();

    if (!code) {
      alert("Vui lòng nhập promo code.");
      return;
    }

    if (code === "EASTER10") {
      setDiscount(Math.round(subtotal * 0.1));
      alert("Áp dụng mã EASTER10 thành công.");
      return;
    }

    if (code === "FREESHIP") {
      setDiscount(shipping);
      alert("Áp dụng mã FREESHIP thành công.");
      return;
    }

    setDiscount(0);
    alert("Mã không hợp lệ.");
  };

  const handleCardChange = (field, value) => {
    let nextValue = value;

    if (field === "number") {
      nextValue = value
        .replace(/\D/g, "")
        .slice(0, 16)
        .replace(/(\d{4})(?=\d)/g, "$1 ");
    }

    if (field === "expiry") {
      const raw = value.replace(/\D/g, "").slice(0, 4);
      nextValue =
        raw.length >= 3 ? `${raw.slice(0, 2)}/${raw.slice(2, 4)}` : raw;
    }

    if (field === "cvv") {
      nextValue = value.replace(/\D/g, "").slice(0, 4);
    }

    setMasterCardInfo((prev) => ({
      ...prev,
      [field]: nextValue,
    }));
  };

  const handleBankPaymentChange = (field, value) => {
    let nextValue = value;

    if (field === "accountNumber") {
      nextValue = value.replace(/\D/g, "").slice(0, 20);
    }

    setBankPayment((prev) => ({
      ...prev,
      [field]: nextValue,
    }));
  };

  const isValidMastercardNumber = (value) => {
    const digits = value.replace(/\s/g, "");
    return /^((5[1-5]\d{14})|(2(2[2-9]|[3-6]\d|7[01])\d{12})|(2720\d{12}))$/.test(
      digits
    );
  };

  const validateForm = () => {
    if (paymentMethod === "bank_card") {
      if (
        !bankPayment.bankName ||
        !bankPayment.accountNumber.trim() ||
        !bankPayment.accountName.trim()
      ) {
        alert("Vui lòng nhập đầy đủ thông tin thẻ ngân hàng.");
        return false;
      }
    }

    if (paymentMethod === "mastercard") {
      if (
        !masterCardInfo.number.trim() ||
        !masterCardInfo.expiry.trim() ||
        !masterCardInfo.name.trim() ||
        !masterCardInfo.cvv.trim()
      ) {
        alert("Vui lòng nhập đầy đủ thông tin thẻ Mastercard.");
        return false;
      }

      if (!isValidMastercardNumber(masterCardInfo.number)) {
        alert("Số thẻ Mastercard không hợp lệ.");
        return false;
      }
    }

    return true;
  };

  const mapPaymentMethodToApi = (method) => {
    if (method === "cod") return "COD";
    if (method === "mastercard" || method === "bank_card") {
      return "BANK_TRANSFER";
    }
    return "COD";
  };

  const buildTransactionCode = () => {
    return `TXN_${Date.now()}`;
  };

  const handleProceedCheckout = async () => {
    if (submitLoading) return;
    setSubmitError("");

    if (!validateForm()) return;

    const apiItems = orderItems
      .filter((item) => Number.isInteger(item.productId) && item.productId > 0)
      .map((item) => ({
        product_id: item.productId,
        quantity: Number(item.quantity || 1),
      }));

    if (apiItems.length === 0) {
      setSubmitError("Thiếu sản phẩm hợp lệ để tạo đơn hàng.");
      return;
    }

    const shippingInfo = order.shippingInfo || {};
    const contactInfo = order.contactInfo || {};

    const apiPayload = {
      shipping_full_name: shippingInfo.name || contactInfo.name || "",
      shipping_phone: shippingInfo.phone || "",
      shipping_address_line1: shippingInfo.address || "",
      shipping_district: shippingInfo.district || "",
      shipping_city: shippingInfo.city || "",
      shipping_country: shippingInfo.country || "Viet Nam",
      note: contactInfo.email ? `Contact email: ${contactInfo.email}` : "",
      payment_method: mapPaymentMethodToApi(paymentMethod),
      shipping_fee: shipping,
      discount_amount: discount,
      items: apiItems,
    };

    const payload = {
      orderId: order.id,
      productName: order.productName,
      qty: order.qty,
      items: orderItems,
      subtotal,
      shipping,
      discount,
      total,
      paymentMethod,
      bankPayment: paymentMethod === "bank_card" ? bankPayment : null,
      masterCardInfo: paymentMethod === "mastercard" ? masterCardInfo : null,
    };

    try {
      setSubmitLoading(true);
      const created = await createOrder(apiPayload);
      const createdOrder = created?.order || null;

      if (createdOrder?.id && paymentMethod !== "cod") {
        await confirmPayment({
          orderId: createdOrder.id,
          provider: mapPaymentMethodToApi(paymentMethod),
          transactionCode: buildTransactionCode(),
        });
      }

      console.log("PAYMENT PAYLOAD:", payload);
      console.log("ORDER API RESPONSE:", created);

      navigate("/payment-success", {
        state: {
          order: {
            ...payload,
            apiOrder: createdOrder,
          },
        },
      });
    } catch (error) {
      setSubmitError(error.message || "Không thể tạo đơn hàng. Vui lòng thử lại.");
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="payment-page">
      <div className="payment-shell">
        <main className="payment-main">
          <div className="payment-page-title">
            <button className="back-btn" onClick={() => navigate(-1)}>
              Back
            </button>
            <h1>Checkout</h1>
          </div>

          <div className="payment-grid">
            <section className="payment-left-card">
              <h2>Payment</h2>
              <p className="payment-subtext">
                Please select a payment method to complete your purchase.
              </p>

              <div
                className={`payment-option ${
                  paymentMethod === "cod" ? "active" : ""
                }`}
                onClick={() => setPaymentMethod("cod")}
              >
                <div className="payment-option-head">
                  <label className="radio-wrap">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === "cod"}
                      onChange={() => setPaymentMethod("cod")}
                    />
                    <span>Thanh toán khi nhận hàng (COD)</span>
                  </label>
                </div>
                <p>Bạn thanh toán tiền mặt khi nhận hàng tại nhà.</p>
              </div>

              <div
                className={`payment-option ${
                  paymentMethod === "mastercard" ? "active" : ""
                }`}
                onClick={() => setPaymentMethod("mastercard")}
              >
                <div className="payment-option-head">
                  <label className="radio-wrap">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === "mastercard"}
                      onChange={() => setPaymentMethod("mastercard")}
                    />
                    <span>Thanh toán bằng thẻ Mastercard</span>
                  </label>

                  <div className="card-badges">
                    <span>Mastercard</span>
                  </div>
                </div>

                <p>Nhập thông tin thẻ Mastercard để thanh toán ngay.</p>

                <div
                  className={`option-content ${
                    paymentMethod !== "mastercard" ? "disabled" : ""
                  }`}
                >
                  <div className="card-number-row">
                    <input
                      type="text"
                      placeholder="0000 0000 0000 0000"
                      value={masterCardInfo.number}
                      onChange={(e) =>
                        handleCardChange("number", e.target.value)
                      }
                    />
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={masterCardInfo.expiry}
                      onChange={(e) =>
                        handleCardChange("expiry", e.target.value)
                      }
                    />
                  </div>

                  <div className="card-bottom-row">
                    <input
                      type="text"
                      placeholder="Cardholder Name"
                      value={masterCardInfo.name}
                      onChange={(e) => handleCardChange("name", e.target.value)}
                    />
                    <input
                      type="password"
                      placeholder="CVV"
                      value={masterCardInfo.cvv}
                      onChange={(e) => handleCardChange("cvv", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div
                className={`payment-option ${
                  paymentMethod === "bank_card" ? "active" : ""
                }`}
                onClick={() => setPaymentMethod("bank_card")}
              >
                <div className="payment-option-head">
                  <label className="radio-wrap">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === "bank_card"}
                      onChange={() => setPaymentMethod("bank_card")}
                    />
                    <span>Thẻ ngân hàng nội địa</span>
                  </label>

                  <div className="card-badges">
                    <span>NAPAS</span>
                  </div>
                </div>

                <p>Chọn ngân hàng và nhập thông tin để thanh toán.</p>

                <div
                  className={`option-content ${
                    paymentMethod !== "bank_card" ? "disabled" : ""
                  }`}
                >
                  <div className="bank-select-row">
                    <select
                      value={bankPayment.bankName}
                      onChange={(e) =>
                        handleBankPaymentChange("bankName", e.target.value)
                      }
                    >
                      {supportedBanks.map((bank) => (
                        <option key={bank} value={bank}>
                          {bank}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="card-number-row">
                    <input
                      type="text"
                      placeholder="Số tài khoản"
                      value={bankPayment.accountNumber}
                      onChange={(e) =>
                        handleBankPaymentChange("accountNumber", e.target.value)
                      }
                    />
                    <input
                      type="text"
                      placeholder="Tên chủ tài khoản"
                      value={bankPayment.accountName}
                      onChange={(e) =>
                        handleBankPaymentChange("accountName", e.target.value)
                      }
                    />
                  </div>

                  <p className="option-note">
                    Ngân hàng đã chọn: <strong>{bankPayment.bankName}</strong>
                  </p>
                </div>
              </div>
            </section>

            <aside className="payment-summary-card">
              <h2>Order Summary</h2>

              {orderItems.map((item, index) => (
                <div className="summary-product" key={`${item.productId}-${index}`}>
                  {item.image ? (
                    <img src={item.image} alt={item.productName} />
                  ) : (
                    <div className="summary-product-fallback">
                      {item.productName?.charAt(0) || "P"}
                    </div>
                  )}

                  <div className="summary-product-info">
                    <h3>{item.productName}</h3>
                    <p>{item.productSubtitle}</p>
                    <span>Qty: {item.quantity}</span>
                  </div>
                </div>
              ))}

              <div className="summary-line">
                <span>Subtotal</span>
                <strong>{formatCurrency(subtotal)}</strong>
              </div>

              <div className="summary-line">
                <span>Shipping</span>
                <strong className={shipping === 0 ? "free-text" : ""}>
                  {shipping === 0 ? "Free" : formatCurrency(shipping)}
                </strong>
              </div>

              {discount > 0 && (
                <div className="summary-line">
                  <span>Discount</span>
                  <strong className="discount-text">
                    -{formatCurrency(discount)}
                  </strong>
                </div>
              )}

              <div className="promo-row">
                <input
                  type="text"
                  placeholder="Promo Code (Optional)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                />
                <button onClick={handleApplyPromo}>Apply</button>
              </div>

              <div className="summary-line total-line">
                <span>Total</span>
                <strong>{formatCurrency(total)}</strong>
              </div>

              {submitError && (
                <p style={{ color: "#c1124c", marginTop: "12px", marginBottom: 0 }}>
                  {submitError}
                </p>
              )}

              <button
                className="proceed-btn"
                onClick={handleProceedCheckout}
                disabled={submitLoading}
              >
                {submitLoading ? "Processing..." : "Proceed to Checkout"}
              </button>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Payment;