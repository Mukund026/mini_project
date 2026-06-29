import "./sidebar.css";
import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <ul>
        <li>
          <NavLink to="/consumer-dashboard" className="link">
            Dashboard
          </NavLink>
        </li>

        <li>
          <NavLink to="/consumer-browse" className="link">
            Browse Produce
          </NavLink>
        </li>

        <li>
          <NavLink to="/consumer-orders" className="link">
            My Orders
          </NavLink>
        </li>

        <li>
          <NavLink to="/consumer-trace" className="link">
            Trace Product
          </NavLink>
        </li>

        <li>
          <NavLink to="/consumer-feedback" className="link">
            Feedback
          </NavLink>
        </li>

        <li>
          <NavLink to="/consumer-profile" className="link">
            Profile
          </NavLink>
        </li>

        <li>
          <NavLink to="/consumer-settings" className="link">
            Settings
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
