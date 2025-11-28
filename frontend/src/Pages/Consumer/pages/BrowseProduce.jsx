import React, { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
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
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to place order");
      }

      console.log("Order created:", data);
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
  const [paymentMode, setPaymentMode] = useState("");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!address || !paymentMode) {
      toast.error("Please fill all fields");
      return;
    }
    if (isPlacingOrder) return; // Prevent multiple submissions
    setIsPlacingOrder(true);
    const orderDetails = {
      productName: product.name,
      quantity,
      totalPrice: quantity * parseFloat(product.price),
      address,
      paymentMode,
      productId: product.id || Math.random().toString(36).substr(2, 9),
    };
    await onPlaceOrder(orderDetails);
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
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              min="1"
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
              <option value="Online">Online</option>
            </select>
          </label>
          <button type="submit" disabled={isPlacingOrder}>
            {isPlacingOrder ? "Placing Order..." : "Place Order"}
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
