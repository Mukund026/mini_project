import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getContract } from "../../../blockchain/wallet";
import { ethers } from "ethers";
import "./browse.css";

const BrowseProduce = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [orderedProducts, setOrderedProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "http://localhost:5000/api/products/all",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        toast.error("Failed to load products");
      }
    };

    const fetchOrderedProducts = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user?.id) return;

        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:5000/api/orders/user/${user.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch orders");

        const data = await response.json();
        const orderedIds = data
          .map((order) => order.product?._id)
          .filter(Boolean);

        setOrderedProducts(orderedIds);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProducts();
    fetchOrderedProducts();
  }, []);

  const handleOrderNow = (product) => {
    if (orderedProducts.includes(product._id)) {
      toast.error("You have already ordered this product");
      return;
    }
    setSelectedProduct(product);
  };

  const handlePlaceOrder = async (orderDetails) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user?.id) {
        toast.error("Please log in");
        return;
      }

      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/orders/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            productId: selectedProduct._id,
            orderedBy: user.id,
            orderedByRole: "consumer",
            quantity: orderDetails.quantity,
          }),
        }
      );

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Order failed");

      // Record on blockchain
      try {
        const contract = await getContract();
        const tx = await contract.addTrace(
          selectedProduct._id,
          parseInt(orderDetails.quantity),
          parseFloat(selectedProduct.price),
          "Ordered",
          `Order placed by consumer: ${user.username}`
        );
        await tx.wait();
        toast.success("Order recorded on blockchain!");
      } catch (err) {
        toast.warning("Database saved, blockchain failed");
      }

      toast.success("Order placed successfully!");
      setOrderedProducts((prev) => [
        ...prev,
        selectedProduct._id,
      ]);
      setSelectedProduct(null);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="browse-produce">
      <h1>Browse Produce</h1>

      <div className="product-grid">
        {products.map((product) => (
          <div key={product._id} className="product-card">
            {product.images?.length > 0 && (
              <img
                src={product.images[0]}
                alt={product.name}
                className="product-image"
              />
            )}

            <h3>{product.name}</h3>
            <p>Seller: {product.listedBy?.name || product.role}</p>
            <p>Quantity: {product.quantity}</p>
            <p>Price: {product.price} ETH</p>

            <button onClick={() => handleOrderNow(product)}>
              Order Now
            </button>
          </div>
        ))}
      </div>

      {selectedProduct && (
        <OrderForm
          product={selectedProduct}
          onPlaceOrder={handlePlaceOrder}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
};

/* ===========================
        ORDER FORM
=========================== */

const OrderForm = ({ product, onPlaceOrder, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const [address, setAddress] = useState("");
  const [paymentMode, setPaymentMode] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

const handleMetaMaskPayment = async () => {
  try {
    if (!window.ethereum) {
      toast.error("MetaMask not installed");
      return false;
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();

    const farmerWallet = product.farmerWallet;
    if (!farmerWallet) {
      toast.error("Farmer wallet not available");
      return false;
    }

    // Convert priceInWei → ETH
    const priceInETH = ethers.formatEther(product.priceInWei); // must be string
    const totalEth = (quantity * parseFloat(priceInETH)).toString();

    const tx = await signer.sendTransaction({
      to: farmerWallet,
      value: ethers.parseEther(totalEth),
    });

    await tx.wait();
    toast.success("Payment successful!");
    return true;

  } catch (error) {
    console.error(error);
    toast.error("Payment failed");
    return false;
  }
};

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!address || !paymentMode) {
      toast.error("Please fill all fields");
      return;
    }

    if (isProcessing) return;
    setIsProcessing(true);

    try {
      // If Online → MetaMask payment first
      if (paymentMode === "Online") {
        const success = await handleMetaMaskPayment();
        if (!success) {
          setIsProcessing(false);
          return;
        }
      }

      await onPlaceOrder({
        quantity,
        address,
        paymentMode,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="order-modal">
      <div className="modal-content">
        <h2>Place Order</h2>

        <form onSubmit={handleSubmit}>
          <label>Product: {product.name}</label>

          <label>
            Quantity:
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </label>

          <label>
            Delivery Address:
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </label>

          <label>
            Payment Mode:
            <select
              value={paymentMode}
              onChange={(e) => setPaymentMode(e.target.value)}
              required
            >
              <option value="">Select</option>
              <option value="Cash">Cash</option>
              <option value="Online">Online (MetaMask)</option>
            </select>
          </label>

          <button type="submit" disabled={isProcessing}>
            {isProcessing ? "Processing..." : "Place Order"}
          </button>

          <button type="button" onClick={onClose}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default BrowseProduce;