import "./sidebar.css";
import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="sidebarContainer">
      <ul>
        <Link to="/retailer-dashboard" className="item-link1">
          <li className="item1">Dashboard</li>
        </Link>
        <Link to="/retailer-browse" className="item-link1">
          <li className="item1">Browse Produce</li>
        </Link>
        <Link to="/retailer-listings" className="item-link1">
          <li className="item1">My Listings</li>
        </Link>
        <Link to="/retailer-history" className="item-link1">
          <li className="item1">Purchase History</li>
        </Link>
        <Link to="/retailer-payments" className="item-link1">
          <li className="item1">Payments</li>
        </Link>
        <Link to="/retailer-manage-orders" className="item-link1">
          <li className="item1">Manage Orders</li>
        </Link>
        <Link to="/retailer-cart" className="item-link1">
          <li className="item1">Cart</li>
        </Link>
        <Link to="/retailer-profile" className="item-link1">
          <li className="item1">Profile</li>
        </Link>
      </ul>
    </div>
  );
};

export default Sidebar;
