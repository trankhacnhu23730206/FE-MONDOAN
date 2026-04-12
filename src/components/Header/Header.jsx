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

  const handleSearch = (e) => {
    e.preventDefault();
    const query = e.target.search.value.trim();
    if (query) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="header-logo">
          <div className="logo-mark">V</div>
        </Link>

        <nav className="header-nav">
          <NavLink end to="/" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            Store
          </NavLink>
          {/* <NavLink end to="/category/2" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            PC
          </NavLink> */}
          <NavLink to="/support" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            Support
          </NavLink>
          <NavLink to="/cart" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            Cart
          </NavLink>
        </nav>

        <form className="header-search" onSubmit={handleSearch}>
          <input
            type="text"
            name="search"
            placeholder="Search products..."
            className="search-input"
          />
          <button type="submit" className="search-btn">
            🔍
          </button>
        </form>

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
                <Link
                  to="/edit-user"
                  className="dropdown-item"
                >
                  Edit User
                </Link>
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