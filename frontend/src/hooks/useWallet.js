import { useState, useEffect } from "react";
import { ethers } from "ethers";

export default function useWallet() {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (window.ethereum) {
      const prov = new ethers.BrowserProvider(window.ethereum);
      setProvider(prov);

      // Load current selected account
      prov.getSigner().getAddress()
        .then((addr) => setAccount(addr))
        .catch(() => setAccount(null));

      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length === 0) {
          setAccount(null);
          setSigner(null);
        } else {
          setAccount(accounts[0]);
          setSigner(prov.getSigner());
        }
      });

      window.ethereum.on("chainChanged", () => {
        window.location.reload();
      });
    }
  }, []);

  async function connect() {
    if (!window.ethereum) throw new Error("MetaMask not found");
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const prov = new ethers.BrowserProvider(window.ethereum);
    const s = prov.getSigner();
    const addr = await s.getAddress();
    setProvider(prov);
    setSigner(s);
    setAccount(addr);
    return addr;
  }

  return { account, provider, signer, connect };
}
