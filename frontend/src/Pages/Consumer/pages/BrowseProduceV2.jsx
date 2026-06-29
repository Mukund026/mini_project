import React, { useEffect, useState, useRef } from "react";
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
        const response = await fetch("http://localhost:5000/api/products/all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Failed to load products");
      }
    };

    const fetchOrderedProducts = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || !user.id) return;

        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:5000/api/orders/user/${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }
        const data = await response.json();
        const orderedProductIds = data
          .map((order) => order.product?._id)
          .filter(Boolean);
        setOrderedProducts(orderedProductIds);
      } catch (error) {
        console.error("Error fetching ordered products:", error);
      }
    };

    fetchProducts();
    fetchOrderedProducts();
  }, []);

  const handleOrderNow = (product) => {
    // Check if user has already ordered this product
    const user = JSON.parse(localStorage.getItem("user"));
    if (orderedProducts.includes(product._id)) {
      toast.error("You have already ordered this product");
      return;
    }
    setSelectedProduct(product);
  };

  const handlePlaceOrder = async (orderDetails) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user.id) {
        toast.error("Please log in to place an order");
        return;
      }

      // Get seller address from product (assuming retailer/distributor address is stored)
      const sellerAddress =
        selectedProduct.listedBy?.walletAddress ||
        "0x0000000000000000000000000000000000000000";

      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/orders/create", {
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
          paymentMode: "blockchain", // Updated payment mode
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to place order");
      }

      console.log("Order created:", data);

      // Blockchain payment flow
      try {
        const contract = await getContract();
        const orderId = ethers.id(data._id + Date.now().toString());
        const totalPrice = ethers.parseEther(
          (orderDetails.quantity * parseFloat(selectedProduct.price)).toString()
        );

        // Step 1: Create order on blockchain
        const createOrderTx = await contract.createOrder(
          orderId,
          selectedProduct._id,
          sellerAddress,
          parseInt(orderDetails.quantity),
          totalPrice
        );
        await createOrderTx.wait();
        toast.info("Order created on blockchain, proceeding to payment...");

        // Step 2: Pay for order (escrow payment)
        const payTx = await contract.payForOrder(orderId, {
          value: totalPrice,
        });
        await payTx.wait();
        toast.success("Payment sent to escrow successfully!");

        // Step 3: Add trace for order placement
        const traceTx = await contract.addTrace(
          selectedProduct._id,
          parseInt(orderDetails.quantity),
          ethers.parseEther(selectedProduct.price.toString()),
          "Ordered", // quality/status
          `Order placed by consumer: ${user.username} - Payment in escrow` // metaUri
        );
        await traceTx.wait();

        toast.success("Order and payment completed on blockchain!");
      } catch (blockchainError) {
        console.error("Blockchain error:", blockchainError);
        toast.warning(
          "Order placed in database, but blockchain payment failed. Please contact support."
        );
      }

      toast.success("Order placed successfully!");
      setOrderedProducts((prev) => [...prev, selectedProduct._id]);
      setSelectedProduct(null);
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error(error.message || "Failed to place order");
    }
  };

  return (
    <div className="browse-produce">
      <h1>Browse Produce</h1>
      <div className="product-grid">
        {products.map((product, index) => (
          <div key={index} className="product-card">
            {product.images && product.images.length > 0 && (
              <img
                src={product.images[0]}
                alt={product.name}
                className="product-image"
              />
            )}
            <h3>{product.name}</h3>
            <p>Seller: {product.listedBy?.name || product.role}</p>
            <p>Quantity: {product.quantity}</p>
            <p>Price: ${product.price}</p>
            <button onClick={() => handleOrderNow(product)}>Order Now</button>
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

const OrderForm = ({ product, onPlaceOrder, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const [address, setAddress] = useState("");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!address) {
      toast.error("Please provide delivery address");
      return;
    }
    if (isPlacingOrder) return; // Prevent multiple submissions
    setIsPlacingOrder(true);
    const orderDetails = {
      productName: product.name,
      quantity,
      totalPrice: quantity * parseFloat(product.price),
      address,
      paymentMode: "blockchain", // Always blockchain payment
      productId: product.id || Math.random().toString(36).substr(2, 9),
    };
    await onPlaceOrder(orderDetails);
    setIsPlacingOrder(false);
  };

  return (
    <div className="order-modal">
      <div className="modal-content">
        <h2>Place Order with Blockchain Payment</h2>
        <div className="payment-info">
          <p>
            <strong>Payment Method:</strong> Blockchain Escrow (MetaMask)
          </p>
          <p>
            <strong>Security:</strong> Funds held in smart contract until
            delivery
          </p>
          <p>
            <strong>Transparency:</strong> Every transaction is recorded on
            blockchain
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          <label>Product: {product.name}</label>
          <label>
            Quantity:
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              min="1"
            />
          </label>
          <label>
            Total Price: ${(quantity * parseFloat(product.price)).toFixed(2)}
          </label>
          <label>
            Delivery Address:
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              placeholder="Enter your complete delivery address"
            />
          </label>
          <div className="payment-notice">
            <p>
              ⚠️ <strong>Important:</strong> Payment will be sent to escrow via
              MetaMask. Funds are secure and will be released to seller only
              upon successful delivery confirmation.
            </p>
          </div>
          <button type="submit" disabled={isPlacingOrder}>
            {isPlacingOrder
              ? "Processing Payment..."
              : "Pay with MetaMask & Place Order"}
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
