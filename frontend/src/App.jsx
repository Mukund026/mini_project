import "./App.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FarmerDashboard from "./Pages/Farmer/FarmerDashboard";
import Home from "./Pages/Home";
import DistributerDashboard from "./Pages/Distributer/DistributerDashboard";
import RetailerDashboard from "./Pages/Retailer/RetailerDashboard";
import ConsumerDashboard from "./Pages/Consumer/ConsumerDashboard";
import Login from "./Pages/Login";
import Signup from "./Pages/SignUp";
import Overview from "./Pages/Farmer/pages/Overview";
import Orders from "./Pages/Farmer/pages/Orders";
import Listings from "./Pages/Farmer/pages/Listings";
import Profile from "./Pages/Farmer/pages/Profile";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddProduce from "./Pages/Farmer/pages/addProduce";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/signup" element={<Signup />}></Route>
        <Route path="/" element={<Login />}></Route>
        <Route path="/farmer-dashboard" element={<FarmerDashboard />}></Route>
        <Route path="/distributer" element={<DistributerDashboard />}></Route>
        <Route
          path="/distributer-dashboard"
          element={<DistributerDashboard />}
        ></Route>
        <Route
          path="/distributer-browse"
          element={<DistributerDashboard />}
        ></Route>
        <Route
          path="/distributer-orders"
          element={<DistributerDashboard />}
        ></Route>
        <Route
          path="/distributer-cart"
          element={<DistributerDashboard />}
        ></Route>
        <Route
          path="/distributer-notifications"
          element={<DistributerDashboard />}
        ></Route>
        <Route
          path="/distributer-profile"
          element={<DistributerDashboard />}
        ></Route>
        <Route path="/add-product" element={<DistributerDashboard />}></Route>
        <Route
          path="/distributer-listings"
          element={<DistributerDashboard />}
        ></Route>
        <Route
          path="/distributer-myorders"
          element={<DistributerDashboard />}
        ></Route>
        <Route path="/retailer" element={<RetailerDashboard />}></Route>
        <Route
          path="/retailer-dashboard"
          element={<RetailerDashboard />}
        ></Route>
        <Route path="/retailer-browse" element={<RetailerDashboard />}></Route>
        <Route path="/retailer-orders" element={<RetailerDashboard />}></Route>
        <Route
          path="/retailer-payments"
          element={<RetailerDashboard />}
        ></Route>
        <Route path="/retailer-history" element={<RetailerDashboard />}></Route>
        <Route
          path="/retailer-inventory"
          element={<RetailerDashboard />}
        ></Route>
        <Route
          path="/retailer-notifications"
          element={<RetailerDashboard />}
        ></Route>
        <Route path="/retailer-profile" element={<RetailerDashboard />}></Route>
        <Route
          path="/retailer-add-product"
          element={<RetailerDashboard />}
        ></Route>
        <Route path="/retailer-cart" element={<RetailerDashboard />}></Route>
        <Route
          path="/retailer-listings"
          element={<RetailerDashboard />}
        ></Route>
        <Route
          path="/retailer-manage-orders"
          element={<RetailerDashboard />}
        ></Route>
        <Route path="/consumere" element={<ConsumerDashboard />}></Route>
        <Route
          path="/consumer-dashboard"
          element={<ConsumerDashboard />}
        ></Route>
        <Route path="/consumer-browse" element={<ConsumerDashboard />}></Route>
        <Route path="/consumer-orders" element={<ConsumerDashboard />}></Route>
        <Route path="/consumer-trace" element={<ConsumerDashboard />}></Route>
        <Route
          path="/consumer-feedback"
          element={<ConsumerDashboard />}
        ></Route>
        <Route path="/consumer-profile" element={<ConsumerDashboard />}></Route>
        <Route
          path="/consumer-settings"
          element={<ConsumerDashboard />}
        ></Route>
        <Route path="/Overview" element={<Overview />}></Route>
        <Route path="/Orders" element={<Orders />}></Route>
        <Route path="/Listings" element={<Listings />}></Route>
        <Route path="/Profile" element={<Profile />}></Route>
        <Route path="/AddProduce" element={<AddProduce />}></Route>
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        theme="colored"
        style={{ zIndex: 9999 }}
        progressStyle={{ height: "1px" }}
      />
    </Router>
  );
};

export default App;
