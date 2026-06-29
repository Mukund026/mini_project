import React, { useState, useCallback } from "react";
import "./FarmerDashboard.css";
import Layout from "./pages/Layout";
import WalletSelector from "../../Components/WalletSelector";
import { ethers } from "ethers";
import { useLocation } from "react-router-dom";

const FarmerDashboard = () => {
  const location = useLocation();
  const [wallet, setWallet] = useState(null);
  const [account, setAccount] = useState("");

  const handleWalletSelect = useCallback((selectedWallet) => {
    const walletInstance = new ethers.Wallet(selectedWallet.privateKey);
    setWallet(walletInstance);
    setAccount(walletInstance.address);
  }, []);

  // Match the consumer-style approach (route decides which background image to use)
  const routeKey = (() => {
    const p = location.pathname;
    if (p.includes("/Orders")) return "farmer1";
    if (p.includes("/Listings")) return "farmer2";
    if (p.includes("/Profile")) return "farmer3";
    // default: Overview
    return "farmer";
  })();

  const backgroundUrl = `/images/${routeKey}.jpg`;

  return (
    <div className="layout">
      <div
        className="farmer-main"
        style={{ backgroundImage: `url(${backgroundUrl})` }}
      >
        <Layout>
          <WalletSelector onSelect={handleWalletSelect} />
          <h3>Active Wallet: {account}</h3>

          {/* EXAMPLE PAYMENT CALL */}
          <button
            onClick={async () => {
              if (wallet) {
                console.log("Wallet address:", wallet.address);
              }
            }}
          >
            Test Payment
          </button>
        </Layout>
      </div>
    </div>
  );
};


export default FarmerDashboard;

