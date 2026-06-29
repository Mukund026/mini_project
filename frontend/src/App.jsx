import "./App.css";
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Auth
import Login from "./Pages/Login";
import Signup from "./Pages/SignUp";

// Dashboards
import FarmerDashboard from "./Pages/Farmer/FarmerDashboard";
import DistributerDashboard from "./Pages/Distributer/DistributerDashboard";
import RetailerDashboard from "./Pages/Retailer/RetailerDashboard";
import ConsumerDashboard from "./Pages/Consumer/ConsumerDashboard";

// Distributor pages
import DistDashboard from "./Pages/Distributer/pages/Dashboard";
import DistBrowse from "./Pages/Distributer/pages/Browse";
import DistListings from "./Pages/Distributer/pages/Listings";
import DistOrders from "./Pages/Distributer/pages/Orders";
import DistMyorders from "./Pages/Distributer/pages/MyPlacedOrders";
import DistCart from "./Pages/Distributer/pages/cart";
import DistProfile from "./Pages/Distributer/pages/Profile";

// Farmer pages
import FarmerOverview from "./Pages/Farmer/pages/Overview";
import FarmerOrders from "./Pages/Farmer/pages/Orders";
import FarmerListings from "./Pages/Farmer/pages/Listings";
import FarmerProfile from "./Pages/Farmer/pages/Profile";
import AddProduce from "./Pages/Farmer/pages/addProduce";

// Consumer pages
import BrowseProduce from "./Pages/Consumer/pages/BrowseProduce";
import MyOrders from "./Pages/Consumer/pages/MyOrders";
import TraceProduct from "./Pages/Consumer/pages/TraceProduct";
import Feedback from "./Pages/Consumer/pages/Feedback";
import Settings from "./Pages/Consumer/pages/Settings";
import Dashboard from "./Pages/Consumer/pages/Dashboard";
import Profile from "./Pages/Consumer/pages/Profile";
import Sidebar from "./Pages/Consumer/sidebar/Sidebar";
import TracePage from "./Pages/TracePage";

// Retailer pages
import RetailerDashboardPage from "./Pages/Retailer/pages/Dashboard";
import RetailerBrowse from "./Pages/Retailer/pages/Browse";
import RetailerListings from "./Pages/Retailer/pages/Listings";
import RetailerPurchaseHistory from "./Pages/Retailer/pages/PurchaseHistory";
import RetailerPayments from "./Pages/Retailer/pages/Payments";
import RetailerManageOrders from "./Pages/Retailer/pages/ManageOrders";
import RetailerCart from "./Pages/Retailer/pages/Cart";
import RetailerProfile from "./Pages/Retailer/pages/Profile";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Auth */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Distributor (nested routes) */}
        <Route
          path="/distributer-dashboard/*"
          element={<DistributerDashboard />}
        >
          <Route index element={<DistDashboard />} />
          <Route path="browse" element={<DistBrowse />} />
          <Route path="listings" element={<DistListings />} />
          <Route path="orders" element={<DistOrders />} />
          <Route path="myorders" element={<DistMyorders />} />
          <Route path="cart" element={<DistCart />} />
          <Route path="profile" element={<DistProfile />} />
        </Route>

        {/* Retailer (nested routes) */}
        <Route
          path="/retailer"
          element={<Navigate to="/retailer-dashboard" replace />}
        />
        <Route path="/retailer-dashboard/*" element={<RetailerDashboard />}>
          <Route index element={<RetailerDashboardPage />} />
          <Route path="browse" element={<RetailerBrowse />} />
          <Route path="listings" element={<RetailerListings />} />
          <Route path="history" element={<RetailerPurchaseHistory />} />
          <Route path="payments" element={<RetailerPayments />} />
          <Route path="manage-orders" element={<RetailerManageOrders />} />
          <Route path="cart" element={<RetailerCart />} />
          <Route path="profile" element={<RetailerProfile />} />
        </Route>

        {/* Farmer */}
        <Route path="/Overview" element={<FarmerOverview />} />
        <Route path="/Orders" element={<FarmerOrders />} />
        <Route path="/Listings" element={<FarmerListings />} />
        <Route path="/Profile" element={<FarmerProfile />} />

        {/* Consumer */}
        <Route path="/consumer-dashboard/*" element={<ConsumerDashboard />}>
          <Route index element={<Dashboard />} />
          <Route path="browse" element={<BrowseProduce />} />
          <Route path="orders" element={<MyOrders />} />
          <Route path="trace" element={<TraceProduct />} />
          <Route path="feedback" element={<Feedback />} />
          <Route path="settings" element={<Settings />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Ensure every consumer page uses the same ConsumerDashboard wrapper (background + layout) */}
        <Route
          path="/consumer-settings"
          element={<Navigate to="/consumer-dashboard/settings" replace />}
        />
        <Route
          path="/consumer-browse"
          element={<Navigate to="/consumer-dashboard/browse" replace />}
        />
        <Route
          path="/consumer-orders"
          element={<Navigate to="/consumer-dashboard/orders" replace />}
        />
        <Route
          path="/consumer-trace"
          element={<Navigate to="/consumer-dashboard/trace" replace />}
        />
        <Route
          path="/consumer-feedback"
          element={<Navigate to="/consumer-dashboard/feedback" replace />}
        />
        <Route
          path="/consumer-profile"
          element={<Navigate to="/consumer-dashboard/profile" replace />}
        />

        <Route path="/trace/:hash" element={<TracePage />} />
      </Routes>

      <ToastContainer position="top-right" autoClose={2000} theme="colored" />
    </Router>
  );
};

export default App;
