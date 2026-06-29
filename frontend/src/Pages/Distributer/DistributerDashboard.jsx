import React, { useState, useCallback } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./sidebar/Sidebar";
import WalletSelector from "../../Components/WalletSelector";
import { ethers } from "ethers";

const DistributerDashboard = () => {
  const navigate = useNavigate();
  const [wallet, setWallet] = useState(null);
  const [account, setAccount] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || user.role !== "distributer") {
    navigate("/");
    return null;
  }

  const handleWalletSelect = useCallback((selectedWallet) => {
    const walletInstance = new ethers.Wallet(selectedWallet.privateKey);
    setWallet(walletInstance);
    setAccount(walletInstance.address);
  }, []);

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar />

      <div style={{ flex: 1, padding: "20px", marginLeft: "20vw" }}>
        <WalletSelector onSelect={handleWalletSelect} />
        <h3>Active Wallet: {account}</h3>


        {/* Nested routes render here */}
        <Outlet />
      </div>
    </div>
  );
};

export default DistributerDashboard;
