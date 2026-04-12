import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaEnvelope, FaPhoneAlt, FaLock } from "react-icons/fa";
import { FiEye, FiEyeOff } from "react-icons/fi";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import "./EditUser.css";

const EditUser = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    agree: true,
  });

  const [avatar, setAvatar] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [showPassword, setShowPassword] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user")) || {};

    setFormData((prev) => ({
      ...prev,
      fullName: user.user_name || user.fullName || user.name || "Phan Nhat Hoa",
      email: user.email || "phannhathoa13@gmail.com",
      phone: user.phone || "+84 587189159",
    }));

    setAvatar(
      user.avatar_url ||
        "https://ui-avatars.com/api/?name=Phan+Nhat+Hoa&background=ececec&color=555&size=128"
    );
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    setError("");
    setMessage("");
  };

  const togglePassword = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      return "Vui lòng nhập họ tên.";
    }

    if (!formData.email.trim()) {
      return "Vui lòng nhập email.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return "Email không đúng định dạng.";
    }

    if (!formData.phone.trim()) {
      return "Vui lòng nhập số điện thoại.";
    }

    const hasPasswordInput =
      formData.currentPassword ||
      formData.newPassword ||
      formData.confirmPassword;

    if (hasPasswordInput) {
      if (!formData.currentPassword) {
        return "Vui lòng nhập mật khẩu hiện tại.";
      }

      if (!formData.newPassword) {
        return "Vui lòng nhập mật khẩu mới.";
      }

      if (formData.newPassword.length < 6) {
        return "Mật khẩu mới phải có ít nhất 6 ký tự.";
      }

      if (formData.newPassword !== formData.confirmPassword) {
        return "Xác nhận mật khẩu không khớp.";
      }
    }

    if (!formData.agree) {
      return "Bạn cần đồng ý với điều khoản để tiếp tục.";
    }

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");

      // Lưu local trước để test UI
      const oldUser = JSON.parse(localStorage.getItem("user")) || {};
      const updatedUser = {
        ...oldUser,
        user_name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        avatar_url: avatar,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));

      // Nếu bạn có API thì mở đoạn này ra và sửa endpoint cho đúng backend
      /*
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:3000/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Cập nhật thất bại.");
      }
      */

      setMessage("Cập nhật tài khoản thành công.");
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
    } catch (err) {
      setError(err.message || "Có lỗi xảy ra khi cập nhật tài khoản.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const menuItems = [
    { label: "Account Details", path: "/edit-user", active: true },
    { label: "Order History", path: "/orders", active: false },
    { label: "Favorite Item", path: "/wishlist", active: false },
    { label: "Payment Methods", path: "/payment-methods", active: false },
  ];

  return (
    <>
      <div className="edit-user-page">
        <div className="edit-user-container">
          <h1 className="edit-user-title">Account Details</h1>

          <div className="edit-user-layout">
            <aside className="account-sidebar">
              <div className="account-profile-card">
                <div className="account-profile-top">
                  {avatar ? (
                    <img
                      src={avatar}
                      alt="avatar"
                      className="account-avatar-image"
                    />
                  ) : (
                    <FaUserCircle className="account-avatar-icon" />
                  )}

                  <div className="account-user-info">
                    <h3>{formData.fullName || "User Name"}</h3>
                    <p>{formData.email || "email@example.com"}</p>
                  </div>
                </div>

                <div className="account-menu">
                  {menuItems.map((item) => (
                    <button
                      key={item.label}
                      className={`account-menu-item ${
                        item.active ? "active" : ""
                      }`}
                      onClick={() => navigate(item.path)}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>

                <button className="logout-btn" onClick={handleLogout}>
                  Log Out
                </button>
              </div>
            </aside>

            <section className="account-form-section">
              <form className="account-form-card" onSubmit={handleSubmit}>
                <div className="account-form-header">
                  <h2>Edit Account</h2>
                </div>

                {error && <div className="form-alert error">{error}</div>}
                {message && <div className="form-alert success">{message}</div>}

                <div className="form-group">
                  <label>Full name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter full name"
                  />
                </div>

                <div className="form-group">
                  <label>Email Address</label>
                  <div className="input-with-icon">
                    <FaEnvelope className="left-icon" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter email address"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Phone Number</label>
                  <div className="input-with-icon">
                    <FaPhoneAlt className="left-icon" />
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Current Password</label>
                  <div className="input-with-icon password-field">
                    <FaLock className="left-icon" />
                    <input
                      type={
                        showPassword.currentPassword ? "text" : "password"
                      }
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleChange}
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      className="toggle-password"
                      onClick={() => togglePassword("currentPassword")}
                    >
                      {showPassword.currentPassword ? (
                        <FiEyeOff />
                      ) : (
                        <FiEye />
                      )}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label>New Password</label>
                  <div className="input-with-icon password-field">
                    <FaLock className="left-icon" />
                    <input
                      type={showPassword.newPassword ? "text" : "password"}
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      className="toggle-password"
                      onClick={() => togglePassword("newPassword")}
                    >
                      {showPassword.newPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label>Confirm New Password</label>
                  <div className="input-with-icon password-field">
                    <FaLock className="left-icon" />
                    <input
                      type={showPassword.confirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      className="toggle-password"
                      onClick={() => togglePassword("confirmPassword")}
                    >
                      {showPassword.confirmPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                </div>

                <label className="checkbox-row">
                  <input
                    type="checkbox"
                    name="agree"
                    checked={formData.agree}
                    onChange={handleChange}
                  />
                  <span>
                    I agree to the Terms of Service and Privacy Policy
                  </span>
                </label>

                <button
                  type="submit"
                  className="save-btn"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save"}
                </button>
              </form>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditUser;