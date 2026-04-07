import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import "./Header.css";

const Header = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = token ? JSON.parse(localStorage.getItem("user")) : null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="header-logo">
          <div className="logo-mark">V</div>
        </Link>

        <nav className="header-nav">
          <NavLink to="/" className="nav-item">
            Store
          </NavLink>
          <NavLink to="/" className="nav-item">
            PC
          </NavLink>
          <NavLink to="/" className="nav-item">
            Search
          </NavLink>
          <NavLink to="/" className="nav-item">
            Support
          </NavLink>
          <NavLink to="/" className="nav-item">
            Cart
          </NavLink>
        </nav>

        <div className="header-user">
          {token && user ? (
            <div className="user-menu">
              <div className="user-avatar">
                {user?.email ? user.email.charAt(0).toUpperCase() : "U"}
              </div>
              <span className="user-name">
                {user?.email ? user.email.split("@")[0] : "User"}
              </span>
              <div className="user-dropdown">
                <button
                  type="button"
                  className="dropdown-item"
                  onClick={() => navigate("/create-account")}
                >
                  Edit User
                </button>
                <button
                  type="button"
                  className="dropdown-item"
                  onClick={handleLogout}
                >
                  Log Out
                </button>
              </div>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="auth-button auth-button--secondary">
                Sign In
              </Link>
              <Link to="/create-account" className="auth-button">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;