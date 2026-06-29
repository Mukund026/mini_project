import React, { useState, useCallback } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./sidebar/Sidebar";
import WalletSelector from "../../Components/WalletSelector";
import { ethers } from "ethers";

const RetailerDashboard = () => {
  const navigate = useNavigate();
  const [wallet, setWallet] = useState(null);
  const [account, setAccount] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || user.role !== "retailer") {
    navigate("/login");
    return null;
  }

  const handleWalletSelect = useCallback((selectedWallet) => {
    const walletInstance = new ethers.Wallet(selectedWallet.privateKey);
    setWallet(walletInstance);
    setAccount(walletInstance.address);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
      }}
    >
      <Sidebar />

      {/* Take the remaining width after the sidebar */}
      <div
        style={{
          flex: "1 1 auto",
          width: "calc(100vw - 20vw)",
          padding: "20px",
          minWidth: 0,
          overflow: "auto",
        }}
      >
        <WalletSelector onSelect={handleWalletSelect} />
        <h3>Active Wallet: {account}</h3>

        {/* Nested routes render here */}
        <Outlet />
      </div>
    </div>
  );
};

export default RetailerDashboard;
