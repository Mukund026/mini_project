import "./sidebar.css";
import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="sidebarContainer">
      <ul>
        <li>
          <NavLink to="/retailer-dashboard" className="item1">
            Dashboard
          </NavLink>
        </li>

        <li>
          <NavLink to="/retailer-dashboard/browse" className="item1">
            Browse Produce
          </NavLink>
        </li>

        <li>
          <NavLink to="/retailer-dashboard/listings" className="item1">
            My Listings
          </NavLink>
        </li>

        <li>
          <NavLink to="/retailer-dashboard/history" className="item1">
            Purchase History
          </NavLink>
        </li>

        <li>
          <NavLink to="/retailer-dashboard/payments" className="item1">
            Payments
          </NavLink>
        </li>

        <li>
          <NavLink to="/retailer-dashboard/manage-orders" className="item1">
            Manage Orders
          </NavLink>
        </li>

        <li>
          <NavLink to="/retailer-dashboard/cart" className="item1">
            Cart
          </NavLink>
        </li>

        <li>
          <NavLink to="/retailer-dashboard/profile" className="item1">
            Profile
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
