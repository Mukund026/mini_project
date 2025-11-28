import React from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "./sidebar/Sidebar";
import Dashboard from "./pages/Dashboard";
import Browse from "./pages/Browse";
import Myorders from "./pages/Myorders";
import Payments from "./pages/Payments";
import PurchaseHistory from "./pages/PurchaseHistory";
import Inventory from "./pages/Inventory";

import Profile from "./pages/Profile";
import AddProduct from "./pages/AddProduct";
import Listings from "./pages/Listings";
import Cart from "./pages/Cart";
import ManageOrders from "./pages/ManageOrders";

const RetailerDashboard = () => {
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem("user"));
  if (!user || user.role !== "retailer") {
    window.location.href = "/login";
    return null;
  }

  const renderContent = () => {
    switch (location.pathname) {
      case "/retailer-dashboard":
      case "/retailer":
        return <Dashboard />;
      case "/retailer-browse":
        return <Browse />;
      case "/retailer-orders":
        return <Myorders />;
      case "/retailer-payments":
        return <Payments />;
      case "/retailer-history":
        return <PurchaseHistory />;
      case "/retailer-inventory":
        return <Inventory />;
      case "/retailer-profile":
        return <Profile />;
      case "/retailer-add-product":
        return <AddProduct />;
      case "/retailer-cart":
        return <Cart />;
      case "/retailer-listings":
        return <Listings />;
      case "/retailer-manage-orders":
        return <ManageOrders />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div
        style={{
          marginLeft: "20px",
          padding: "20px",
          width: "100%",
          position: "relative",
          height: "100vh",
        }}
      >
        {renderContent()}
      </div>
    </div>
  );
};

export default RetailerDashboard;
