import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import heroImg from "../../assets/hero.png";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError("Vui lòng nhập đầy đủ email và mật khẩu");
      return;
    }

    setError("");

    // fake auth để test private route
    localStorage.setItem("token", "demo_token");
    localStorage.setItem(
      "user",
      JSON.stringify({
        email: formData.email,
      })
    );

    navigate("/");
  };

  return (
    <div className="login-page">
      <header className="login-navbar">
        <Link to="/" className="brand">
          V<span>Store</span>
        </Link>

        <nav className="nav-links">
          <a href="/">Store</a>
          <a href="/">PC</a>
          <a href="/">Search</a>
          <a href="/">Support</a>
          <a href="/">Cart</a>
        </nav>
      </header>

      <section
        className="login-hero"
        style={{
          backgroundImage: `linear-gradient(rgba(8, 12, 22, 0.55), rgba(8, 12, 22, 0.55)), url(${heroImg})`,
        }}
      >
        <div className="login-content">
          <h1 className="welcome-text">Welcome back</h1>
          <p className="sub-text">Log in to your account</p>

          <div className="login-card">
            <h2>Log In</h2>

            {error && <p className="error-message">{error}</p>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Email Address</label>
                <div className="input-box">
                  <span className="input-icon">✉</span>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <div className="password-row">
                  <label>Password</label>
                  <button type="button" className="forgot-btn">
                    Forgot Password?
                  </button>
                </div>

                <div className="input-box">
                  <span className="input-icon">🔒</span>
                  <input
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <button type="submit" className="login-btn">
                Log In
              </button>
            </form>

            <div className="divider">
              <span>or</span>
            </div>

            <button type="button" className="google-btn">
              <span className="google-icon">G</span>
              Continue with Google
            </button>

            <p className="signup-text">
              Don't have an account? <Link to="/create-account">Sign up</Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Login;