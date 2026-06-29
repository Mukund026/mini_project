import { NavLink } from "react-router-dom";
import "./Layout.css";
import React from "react";

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <div className="sidebar">
        <ul>
          <li className="item">
            <NavLink to="/Overview" className="item-link">
              Overview
            </NavLink>
          </li>

          <li className="item">
            <NavLink to="/Orders" className="item-link">
              Order
            </NavLink>
          </li>

          <li className="item">
            <NavLink to="/Listings" className="item-link">
              Listings
            </NavLink>
          </li>

          <li className="item">
            <NavLink to="/Profile" className="item-link">
              Profile
            </NavLink>
          </li>
        </ul>
      </div>

      <div className="main-content">{children}</div>
    </div>
  );
};

export default Layout;
