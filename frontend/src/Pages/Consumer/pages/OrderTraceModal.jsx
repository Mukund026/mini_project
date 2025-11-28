import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "./trace.css";

const OrderTraceModal = ({ productId, onClose }) => {
  const [traceData, setTraceData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (productId) {
      fetchTraceDetails();
    }
  }, [productId]);

  const fetchTraceDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login to trace product");
        return;
      }

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

  if (loading) {
    return (
      <div className="trace-modal">
        <div className="trace-modal-content">
          <div className="trace-modal-header">
            <h2>Order Status Timeline</h2>
            <button className="close-btn" onClick={onClose}>
              ×
            </button>
          </div>
          <div className="loading">Loading supply chain details...</div>
        </div>
      </div>
    );
  }

  if (!traceData) {
    return (
      <div className="trace-modal">
        <div className="trace-modal-content">
          <div className="trace-modal-header">
            <h2>Supply Chain Timeline</h2>
            <button className="close-btn" onClick={onClose}>
              ×
            </button>
          </div>
          <div className="error">Failed to load trace details</div>
        </div>
      </div>
    );
  }

  return (
    <div className="trace-modal">
      <div className="trace-modal-content">
        <div className="trace-modal-header">
          <h2>Supply Chain Timeline</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="trace-result">
          <h3>Supply Chain for: {traceData.productName}</h3>
          <div className="supply-chain-timeline">
            {traceData.supplyChain.map((step, index) => (
              <div key={index} className="supply-chain-step">
                <div className="step-marker"></div>
                <div className="step-content">
                  <h4>{step.role}</h4>
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
      </div>
    </div>
  );
};

export default OrderTraceModal;
