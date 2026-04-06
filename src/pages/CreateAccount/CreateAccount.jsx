import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./CreateAccount.css";
import heroImg from "../../assets/hero.png";
import axios from "axios";

const CreateAccount = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
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

    try {
      const response = await axios.post('http://localhost:3000/api/auth/register', {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      alert("Tạo tài khoản thành công");
      navigate("/login");
    } catch (error) {
      setError(error.response?.data?.message || "Đã xảy ra lỗi khi tạo tài khoản");
    }
  };

  return (
    <div className="create-page">
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
                <label>Username</label>
                <div className="input-box">
                  <span className="input-icon">👤</span>
                  <input
                    type="text"
                    name="username"
                    placeholder="Enter your username"
                    value={formData.username}
                    onChange={handleChange}
                  />
                </div>
              </div>

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