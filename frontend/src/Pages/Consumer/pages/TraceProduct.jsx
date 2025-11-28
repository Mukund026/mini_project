import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "./trace.css";

const TraceProduct = () => {
  const [productId, setProductId] = useState("");
  const [traceData, setTraceData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [showProductList, setShowProductList] = useState(false);

  useEffect(() => {
    fetchAvailableProducts();
  }, []);

  const fetchAvailableProducts = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user.id) {
        return;
      }

      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/products/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const products = await response.json();
        setAvailableProducts(products);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleTrace = async () => {
    if (!productId.trim()) {
      toast.error("Please enter a product ID");
      return;
    }

    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user.id) {
        toast.error("Please login to trace product");
        return;
      }

      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/products/trace/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          toast.error("Session expired. Please login again.");
          return;
        }
        if (response.status === 404) {
          toast.error(
            "Product not found. Please check the Product ID and try again."
          );
          return;
        }
        throw new Error("Failed to trace product");
      }

      const data = await response.json();
      setTraceData(data);
    } catch (error) {
      console.error("Error tracing product:", error);
      toast.error("Failed to trace product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const clearTrace = () => {
    setTraceData(null);
    setProductId("");
  };

  return (
    <div className="trace-product-page">
      <h1>Trace Product Supply Chain</h1>
      <div className="trace-input-section">
        <div className="input-group">
          <input
            type="text"
            placeholder="Enter Product ID"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            disabled={loading}
          />
          <button onClick={handleTrace} disabled={loading}>
            {loading ? "Tracing..." : "Trace Product"}
          </button>
          {traceData && (
            <button onClick={clearTrace} className="clear-btn">
              Clear
            </button>
          )}
        </div>
        {availableProducts.length > 0 && (
          <div className="product-list-section">
            <button
              onClick={() => setShowProductList(!showProductList)}
              className="toggle-list-btn"
            >
              {showProductList ? "Hide" : "Show"} Available Products
            </button>
            {showProductList && (
              <div className="product-list">
                <h3>Available Products:</h3>
                <div className="product-grid">
                  {availableProducts.map((product) => (
                    <div
                      key={product._id}
                      className="product-item"
                      onClick={() => {
                        setProductId(product._id);
                        setShowProductList(false);
                      }}
                    >
                      <h4>{product.name}</h4>
                      <p>
                        <strong>ID:</strong> {product._id}
                      </p>
                      <p>
                        <strong>Listed by:</strong>{" "}
                        {product.listedBy?.username || "Unknown"}
                      </p>
                      <p>
                        <strong>Role:</strong> {product.role}
                      </p>
                      <p>
                        <strong>Price:</strong> ${product.price}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {loading && (
        <div className="loading-section">
          <p>Tracing product supply chain...</p>
        </div>
      )}

      {traceData && (
        <div className="trace-result">
          <h2>Supply Chain for: {traceData.productName}</h2>
          <div className="supply-chain-timeline">
            {traceData.supplyChain.map((step, index) => (
              <div key={index} className="supply-chain-step">
                <div className="step-marker"></div>
                <div className="step-content">
                  <h3>{step.role}</h3>
                  <p>
                    <strong>Name:</strong> {step.name}
                  </p>
                  <p>
                    <strong>Date:</strong> {step.date}
                  </p>
                  <p>
                    <strong>Transaction ID:</strong> {step.transactionId}
                  </p>
                  {step.quantity && (
                    <p>
                      <strong>Quantity:</strong> {step.quantity}
                    </p>
                  )}
                  {step.totalPrice && (
                    <p>
                      <strong>Total Price:</strong> ${step.totalPrice}
                    </p>
                  )}
                  {step.status && (
                    <p>
                      <strong>Status:</strong> {step.status}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TraceProduct;
