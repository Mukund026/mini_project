import React, { useState, useEffect } from "react";
import useWallet from "../hooks/useWallet";
import { getContractWithSigner } from "../contract";
import { ethers } from "ethers";

/**
 * Props:
 * - role: "consumer" | "retailer" | "distributor" | "farmer"
 * - sellerAddress: address of the seller for this order (when creating order)
 * - productId: bytes32 hex string (or string that will be hashed)
 */
export default function PaymentFlow({ role, sellerAddress, productId }) {
  const { account, signer, connect } = useWallet();
  const [contract, setContract] = useState(null);
  const [orderId, setOrderId] = useState("");
  const [qty, setQty] = useState(1);
  const [pricePerUnit, setPricePerUnit] = useState(""); // in Wei or as number
  const [totalPrice, setTotalPrice] = useState("");
  const [statusInfo, setStatusInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    if (!signer) return;
    const c = getContractWithSigner(signer);
    setContract(c);
  }, [signer]);

  function log(msg) {
    setLogs((l) => [msg, ...l].slice(0, 50));
  }

  // create unique order id
  function makeOrderId(prodId) {
    // keep consistent with contract expecting bytes32
    return ethers.id(prodId + "-" + Date.now()); // returns bytes32 hex
  }

  async function handleConnect() {
    try {
      const addr = await connect();
      log(`Connected ${addr}`);
    } catch (err) {
      log("Connect error: " + (err.message || err));
    }
  }

  async function handleCreateOrder() {
    if (!contract) return alert("Connect wallet first");
    try {
      setLoading(true);
      const id = makeOrderId(productId || "default-product");
      const tot = ethers.parseUnits(String(pricePerUnit || "0"), "wei") * Number(qty);
      // IMPORTANT: your contract createOrder expects totalPrice in uint256 (Wei).
      const tx = await contract.createOrder(id, ethers.id(productId || "p1"), sellerAddress, qty, BigInt(tot));
      await tx.wait();
      setOrderId(id);
      log(`Order created ${id}`);
    } catch (err) {
      log("createOrder error: " + (err.message || err));
    } finally {
      setLoading(false);
    }
  }

  async function handlePayForOrder() {
    if (!contract) return alert("Connect wallet first");
    if (!orderId) return alert("No orderId. Create order first.");
    try {
      setLoading(true);
      // totalPrice must equal the order total set earlier (in Wei)
      const amount = BigInt(totalPrice); // caller must provide Wei value here
      const tx = await contract.payForOrder(orderId, { value: amount });
      await tx.wait();
      log(`Paid order ${orderId} amount ${amount}`);
    } catch (err) {
      log("payForOrder error: " + (err.message || err));
    } finally {
      setLoading(false);
    }
  }

  async function handleShipOrder() {
    if (!contract) return alert("Connect wallet first");
    if (!orderId) return alert("No orderId.");
    try {
      setLoading(true);
      const tx = await contract.shipOrder(orderId);
      await tx.wait();
      log(`Order shipped ${orderId}`);
    } catch (err) {
      log("shipOrder error: " + (err.message || err));
    } finally {
      setLoading(false);
    }
  }

  async function handleDeliverOrder() {
    if (!contract) return alert("Connect wallet first");
    if (!orderId) return alert("No orderId.");
    try {
      setLoading(true);
      const tx = await contract.deliverOrder(orderId);
      await tx.wait();
      log(`Order delivered ${orderId}`);
    } catch (err) {
      log("deliverOrder error: " + (err.message || err));
    } finally {
      setLoading(false);
    }
  }

  async function fetchOrder() {
    if (!contract) return alert("Connect wallet first");
    if (!orderId) return alert("No orderId.");
    try {
      const o = await contract.getOrder(orderId);
      setStatusInfo(o);
      log(`Order fetched: status=${o.status}, escrow=${o.escrowAmount}`);
    } catch (err) {
      log("getOrder error: " + (err.message || err));
    }
  }

  return (
    <div style={{ padding: 12, border: "1px solid #ddd", borderRadius: 8, maxWidth: 800 }}>
      <h3>Role: {role}</h3>

      <div style={{ marginBottom: 8 }}>
        <button onClick={handleConnect}>{account ? `Connected: ${account.slice(0,8)}...` : "Connect MetaMask"}</button>
      </div>

      <div style={{ marginBottom: 8 }}>
        <label>ProductId (string): </label>
        <input value={productId || ""} readOnly />
      </div>

      <div style={{ marginBottom: 8 }}>
        <label>Qty: </label>
        <input type="number" value={qty} min={1} onChange={(e) => setQty(e.target.value)} />
      </div>

      <div style={{ marginBottom: 8 }}>
        <label>Price per unit (wei): </label>
        <input value={pricePerUnit} onChange={(e) => setPricePerUnit(e.target.value)} />
      </div>

      <div style={{ marginBottom: 8 }}>
        <label>Total price (wei) - set before pay: </label>
        <input value={totalPrice} onChange={(e) => setTotalPrice(e.target.value)} placeholder="e.g. 1000000000000000000" />
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        <button onClick={handleCreateOrder} disabled={loading}>Create Order</button>
        <button onClick={handlePayForOrder} disabled={loading}>Pay For Order</button>
        <button onClick={handleShipOrder} disabled={loading}>Ship Order</button>
        <button onClick={handleDeliverOrder} disabled={loading}>Deliver Order</button>
        <button onClick={fetchOrder} disabled={loading}>Fetch Order</button>
      </div>

      <div style={{ marginTop: 12 }}>
        <div><strong>OrderId:</strong> {orderId}</div>
        <div><strong>Status Info:</strong> {statusInfo ? JSON.stringify(statusInfo) : "No data"}</div>
      </div>

      <div style={{ marginTop: 12 }}>
        <h4>Logs</h4>
        <div style={{ maxHeight: 200, overflow: "auto", background: "#fafafa", padding: 8 }}>
          {logs.map((l, i) => <div key={i} style={{ fontSize: 13 }}>{l}</div>)}
        </div>
      </div>
    </div>
  );
}
