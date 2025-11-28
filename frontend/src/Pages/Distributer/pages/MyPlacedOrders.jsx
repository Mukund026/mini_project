import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { toast } from "react-toastify";
import "./myorders.css";

const MyPlacedOrders = () => {
  const [orders, setOrders] = useState([]);

  const clearAllOrders = () => {
    localStorage.setItem("distributerOrders", JSON.stringify([]));
    setOrders([]);
    toast.success("All orders cleared");
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || !user.id) {
          toast.error("Please login to view orders");
          return;
        }

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
        // Remove duplicates based on product._id (one order per product per user)
        const uniqueOrders = data.filter(
          (order, index, self) =>
            index ===
            self.findIndex((o) => o.product?._id === order.product?._id)
        );
        setOrders(uniqueOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("Failed to load orders");
      }
    };

    fetchOrders();

    // Set up Socket.IO connection for real-time updates
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.id) {
      const socket = io("http://localhost:5000");
      socket.emit("joinRoom", user.id);

      // Listen for order status updates
      socket.on("orderPlaced", (data) => {
        toast.success(`Order placed successfully for ${data.order.product}!`);
        fetchOrders(); // Refresh orders
      });

      socket.on("orderConfirmed", (data) => {
        toast.success(
          `Your order for ${data.order.product} has been confirmed!`
        );
        fetchOrders(); // Refresh orders
      });

      socket.on("orderShipped", (data) => {
        toast.info(`Your order for ${data.order.product} has been shipped!`);
        fetchOrders(); // Refresh orders
      });

      socket.on("orderDelivered", (data) => {
        toast.success(
          `Your order for ${data.order.product} has been delivered!`
        );
        fetchOrders(); // Refresh orders
      });

      return () => {
        socket.disconnect();
      };
    }
  }, []);

  const handleTrace = (orderId) => {
    // Navigate to Trace Product page with orderId
    // For now, just log it
    console.log("Trace order:", orderId);
    toast.info("Trace functionality not implemented yet");
  };

  return (
    <div className="my-orders">
      <h1>My Placed Orders</h1>
      <button onClick={clearAllOrders} style={{ marginBottom: "20px" }}>
        Clear All Orders
      </button>
      <table className="orders-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Product Name</th>
            <th>Quantity</th>
            <th>Total Price</th>
            <th>Status</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <tr key={order._id || index}>
              <td>{order._id || `ORD${index + 1}`}</td>
              <td>{order.product?.name || "-"}</td>
              <td>{order.quantity}</td>
              <td>${order.totalPrice}</td>
              <td>{order.status}</td>
              <td>{new Date(order.createdAt).toLocaleDateString()}</td>
              <td>
                <button onClick={() => handleTrace(order._id)}>Trace</button>
                <button>View Invoice</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MyPlacedOrders;
