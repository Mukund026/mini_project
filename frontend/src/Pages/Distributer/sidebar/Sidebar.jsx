import "./sidebar.css";
import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="sidebarContainer">
      <ul>
        <Link to="/distributer-dashboard" className="item-link1">
          <li className="item1">Dashboard</li>
        </Link>
        <Link to="/distributer-browse" className="item-link1">
          <li className="item1">Browse Produce</li>
        </Link>
        <Link to="/distributer-listings" className="item-link1">
          <li className="item1">Listings</li>
        </Link>
        <Link to="/distributer-orders" className="item-link1">
          <li className="item1">Manage Orders</li>
        </Link>
        <Link to="/distributer-myorders" className="item-link1">
          <li className="item1">My Placed Orders</li>
        </Link>
        <Link to="/distributer-cart" className="item-link1">
          <li className="item1">Cart</li>
        </Link>
        <Link to="/distributer-profile" className="item-link1">
          <li className="item1">Profile</li>
        </Link>
      </ul>
    </div>
  );
};

export default Sidebar;
