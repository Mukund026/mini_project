import "./sidebar.css";
import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="sidebarContainer">
      <ul>
        <Link to="/consumer-dashboard" className="item-link1">
          <li className="item1">Dashboard</li>
        </Link>
        <Link to="/consumer-browse" className="item-link1">
          <li className="item1">Browse Produce</li>
        </Link>
        <Link to="/consumer-orders" className="item-link1">
          <li className="item1">My Orders</li>
        </Link>
        <Link to="/consumer-trace" className="item-link1">
          <li className="item1">Trace Product</li>
        </Link>
        <Link to="/consumer-feedback" className="item-link1">
          <li className="item1">Feedback</li>
        </Link>
        <Link to="/consumer-profile" className="item-link1">
          <li className="item1">Profile</li>
        </Link>
        <Link to="/consumer-settings" className="item-link1">
          <li className="item1">Settings</li>
        </Link>
      </ul>
    </div>
  );
};

export default Sidebar;
