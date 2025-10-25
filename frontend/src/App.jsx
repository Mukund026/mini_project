import "./App.css"
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FarmerDashboard from "./Pages/Farmer/FarmerDashboard";
import Home from "./Pages/Home";
import DistributerDashboard from "./Pages/Distributer/DistributerDashboard";
import RetailerDashboard from "./Pages/RetailerDashboard";
import ConsumereDashboard from "./Pages/ConsumereDashboard";
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
        <Route path="/distributer-dashboard" element={<DistributerDashboard />}></Route>
        <Route path="/distributer-browse" element={<DistributerDashboard />}></Route>
        <Route path="/distributer-orders" element={<DistributerDashboard />}></Route>
        <Route path="/distributer-notifications" element={<DistributerDashboard />}></Route>
        <Route path="/distributer-profile" element={<DistributerDashboard />}></Route>
        <Route path="/retailer" element={<RetailerDashboard />}></Route>
        <Route path="/consumere" element={<ConsumereDashboard />}></Route>
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
