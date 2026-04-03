import React from "react";
import { Link, NavLink } from "react-router-dom";
import "./Header.css";

const Header = () => {
  const user = JSON.parse(localStorage.getItem("user"));

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
          <div className="user-avatar">👤</div>
          <span className="user-name">
            {user?.email ? user.email.split("@")[0] : "Long Châu"}
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;