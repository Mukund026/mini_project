import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "./sidebar/Sidebar";
import Dashboard from "./pages/Dashboard";
import Browse from "./pages/Browse";
import Myorders from "./pages/Myorders";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
import Cart from "./pages/cart";
import Listings from "./pages/Listings";
import AddProduct from "./pages/AddProduct";
import Overview from "./pages/Overview";
import Orders from "./pages/Orders";
import MyPlacedOrders from "./pages/MyPlacedOrders";

const DistributerDashboard = () => {
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem("user"));
  if (!user || user.role !== "distributer") {
    window.location.href = "/login";
    return null;
  }

  useEffect(() => {
    // Additional check if needed
  }, [location]);

  const renderContent = () => {
    switch (location.pathname) {
      case "/distributer-dashboard":
      case "/distributer":
        return <Dashboard />;
      case "/distributer-listings":
        return <Listings />;
      case "/add-product":
        return <AddProduct />;
      case "/distributer-browse":
        return <Browse />;
      case "/distributer-orders":
        return <Orders />;
      case "/distributer-myorders":
        return <MyPlacedOrders />;
      case "/distributer-cart":
        return <Cart />;
      case "/distributer-notifications":
        return <Notifications />;
      case "/distributer-profile":
        return <Profile />;
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

export default DistributerDashboard;
