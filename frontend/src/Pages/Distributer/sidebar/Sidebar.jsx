import "./sidebar.css";
import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="sidebarContainer">
      <ul>
        <li>
          <NavLink to="/distributer-dashboard" end>Dashboard</NavLink>
        </li>
        <li>
          <NavLink to="/distributer-dashboard/browse">Browse Produce</NavLink>
        </li>
        <li>
          <NavLink to="/distributer-dashboard/listings">Listings</NavLink>
        </li>
        <li>
          <NavLink to="/distributer-dashboard/orders">Manage Orders</NavLink>
        </li>
        <li>
          <NavLink to="/distributer-dashboard/myorders">My Placed Orders</NavLink>
        </li>
        <li>
          <NavLink to="/distributer-dashboard/cart">Cart</NavLink>
        </li>
        <li>
          <NavLink to="/distributer-dashboard/profile">Profile</NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
