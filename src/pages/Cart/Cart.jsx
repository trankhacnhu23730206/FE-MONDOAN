import React, { useEffect, useState } from "react";
import "./Cart.css";

const Cart = () => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
  }, []);

  const saveCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const changeQty = (id, amount) => {
    const newCart = cart.map((item) =>
      item.id === id
        ? { ...item, qty: Math.max(1, item.qty + amount) }
        : item
    );

    saveCart(newCart);
  };

  const removeItem = (id) => {
    const newCart = cart.filter((item) => item.id !== id);
    saveCart(newCart);
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const formatPrice = (number) => {
    return "$" + number.toLocaleString("en-US");
  };

  return (
    <div className="cart-page">
      <div className="cart-container">
        <div className="cart-head">
          <button className="back-btn" onClick={() => window.history.back()}>
            Back
          </button>
          <h1>Your Cart</h1>
        </div>

        <div className="cart-layout">
          <section className="cart-left card">
            {cart.length === 0 ? (
              <div className="empty-cart">
                <h2>Your cart is empty</h2>
                <p>Add products to your cart to continue shopping.</p>
                <button
                  className="shop-btn"
                  onClick={() => (window.location.href = "/")}
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div className="cart-item" key={item.id}>
                  <img src={item.image} alt={item.name} />

                  <div className="item-info">
                    <h3 className="item-name">{item.name}</h3>
                    <p className="item-desc">{item.desc}</p>
                    <div className="item-price">{formatPrice(item.price)}</div>
                  </div>

                  <div className="item-actions">
                    <div className="qty-box">
                      <button onClick={() => changeQty(item.id, -1)}>-</button>
                      <span>{item.qty}</span>
                      <button onClick={() => changeQty(item.id, 1)}>+</button>
                    </div>

                    <button
                      className="remove-btn"
                      onClick={() => removeItem(item.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </section>

          <aside className="cart-right card">
            <h2>Order Summary</h2>

            <div className="summary-row">
              <span>Subtotal</span>
              <strong>{formatPrice(subtotal)}</strong>
            </div>

            <div className="summary-row">
              <span>Shipping</span>
              <strong className="free-ship">Free</strong>
            </div>

            <div className="summary-total">
              <span>Total</span>
              <span className="total-price">{formatPrice(subtotal)}</span>
            </div>

            <button className="checkout-btn">Proceed to Checkout</button>
            <button
              className="continue-btn"
              onClick={() => (window.location.href = "/")}
            >
              Continue Shopping
            </button>

            <div className="benefits">
              <div className="benefit-item">Free Standard Shipping</div>
              <div className="benefit-item">Risk-Free Shopping</div>
              <div className="benefit-item">Dedicated Customer Support</div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Cart;