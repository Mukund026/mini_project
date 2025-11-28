import { Link } from "react-router-dom";
import "./Layout.css";
import React, { useState } from "react";

const Layout = ({ children }) => {
  const [showProfileOptions, setShowProfileOptions] = useState(false);

  const handleProfileClick = () => {
    setShowProfileOptions(!showProfileOptions);
  };

  return (
    <div className="layout">
      <div className="sidebar">
        <ul>
          <Link to="/Overview" className="item-link">
            <li className="item">Overview</li>
          </Link>
          <Link to="/Orders" className="item-link">
            <li className="item">Order</li>
          </Link>
          <Link to="/Listings" className="item-link">
            <li className="item">Listings</li>
          </Link>
          <Link to="/Profile" className="item-link">
            <li className="item">Profile</li>
          </Link>
        </ul>
      </div>
      <div className="main-content">{children}</div>
    </div>
  );
};

export default Layout;
