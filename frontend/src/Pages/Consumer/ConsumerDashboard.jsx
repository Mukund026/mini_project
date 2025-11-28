import React from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "./sidebar/Sidebar";
import Dashboard from "./pages/Dashboard";
import BrowseProduce from "./pages/BrowseProduce";
import MyOrders from "./pages/MyOrders";
import TraceProduct from "./pages/TraceProduct";
import Feedback from "./pages/Feedback";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import "./ConsumerDashboard.css";

const ConsumerDashboard = () => {
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem("user"));
  if (!user || user.role !== "consumer") {
    window.location.href = "/login";
    return null;
  }

  const renderContent = () => {
    switch (location.pathname) {
      case "/consumere":
      case "/consumer-dashboard":
        return <Dashboard />;
      case "/consumer-browse":
        return <BrowseProduce />;
      case "/consumer-orders":
        return <MyOrders />;
      case "/consumer-trace":
        return <TraceProduct />;
      case "/consumer-feedback":
        return <Feedback />;
      case "/consumer-profile":
        return <Profile />;
      case "/consumer-settings":
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="consumer-dashboard">
      <Sidebar />
      <div className="main-content">{renderContent()}</div>
    </div>
  );
};

export default ConsumerDashboard;
