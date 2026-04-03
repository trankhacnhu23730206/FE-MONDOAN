import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./CreateAccount.css";
import heroImg from "../../assets/hero.png";

const CreateAccount = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
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

    if (!formData.email || !formData.password || !formData.confirmPassword) {
      setError("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    if (formData.password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }

    setError("");

    // fake create account
    localStorage.setItem(
      "registeredUser",
      JSON.stringify({
        email: formData.email,
        password: formData.password,
      })
    );

    alert("Tạo tài khoản thành công");
    navigate("/login");
  };

  return (
    <div className="create-page">
      <header className="create-navbar">
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
        className="create-hero"
        style={{
          backgroundImage: `linear-gradient(rgba(8, 12, 22, 0.55), rgba(8, 12, 22, 0.55)), url(${heroImg})`,
        }}
      >
        <div className="create-content">
          <h1 className="welcome-text">Create your account</h1>
          <p className="sub-text">
            Sign up to save your favorites, track orders, and shop faster.
          </p>

          <div className="create-card">
            <h2>Sign Up</h2>

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

              <div className="form-group">
                <label>Confirm Password</label>
                <div className="input-box">
                  <span className="input-icon">🔒</span>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Enter your confirm password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <button type="submit" className="create-btn">
                Create Account
              </button>
            </form>

            <div className="divider">
              <span>or</span>
            </div>

            <button type="button" className="google-btn">
              <span className="google-icon">G</span>
              Continue with Google
            </button>

            <p className="signin-text">
              Already have an account? <Link to="/login">Sign In</Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CreateAccount;