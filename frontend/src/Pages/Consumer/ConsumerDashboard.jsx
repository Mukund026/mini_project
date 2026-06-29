import React, { useState, useCallback } from "react";
import "./ConsumerDashboard.css";
import Sidebar from "./sidebar/Sidebar";
import { Outlet, useLocation } from "react-router-dom";
import WalletSelector from "../../Components/WalletSelector";
import { ethers } from "ethers";

const ConsumerDashboard = () => {
  const location = useLocation();
  const [wallet, setWallet] = useState(null);
  const [account, setAccount] = useState("");

  const handleWalletSelect = useCallback((selectedWallet) => {
    const walletInstance = new ethers.Wallet(selectedWallet.privateKey);
    setWallet(walletInstance);
    setAccount(walletInstance.address);
  }, []);

  const routeKey = (() => {
    const p = location.pathname;
    if (p.includes("/browse")) return "consumere1";
    if (p.includes("/orders")) return "consumere2";
    if (p.includes("/trace")) return "consumere3";
    if (p.includes("/feedback")) return "consumere4";
    if (p.includes("/profile")) return "consumere1";
    if (p.includes("/settings")) return "consumere2";
    return "consumere";
  })();

  const backgroundUrl =
    routeKey === "consumere"
      ? "/images/consumere.jpg"
      : `/images/${routeKey}.jpg`;

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar />

      <div
        className="consumer-main"
        style={{ backgroundImage: `url("${backgroundUrl}")` }}
      >
        <WalletSelector onSelect={handleWalletSelect} />
        <h3>Active Wallet: {account}</h3>

        {/* Nested routes render here */}
        <Outlet />
      </div>
    </div>
  );
};

export default ConsumerDashboard;
