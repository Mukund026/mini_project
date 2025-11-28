import React, { useEffect, useState } from "react";
import "./myorders.css";
import io from "socket.io-client";
import { toast } from "react-toastify";

const Myorders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [socket, setSocket] = useState(null);

  const handleConfirmOrder = async (orderId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/orders/confirm/${orderId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to confirm order");
      }

      // Refresh the orders list after confirmation
      fetchOrders();
      toast.success("Order confirmed successfully!");

      // Emit socket event to update distributer stats and consumer dashboard
      const socket = io("http://localhost:5000");
      socket.emit("orderConfirmed", {
        orderId,
        order: { product: "Unknown Product" },
      });
    } catch (err) {
      console.error("Error confirming order:", err);
      toast.error("Failed to confirm order. Please try again.");
    }
  };

  const handleShipOrder = async (orderId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/orders/ship/${orderId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to ship order");
      }

      // Refresh the orders list after shipping
      fetchOrders();
      toast.success("Order shipped successfully!");

      // Emit socket event to update distributer stats and consumer dashboard
      const socket = io("http://localhost:5000");
      socket.emit("orderShipped", {
        orderId,
        order: { product: "Unknown Product" },
      });
    } catch (err) {
      console.error("Error shipping order:", err);
      toast.error("Failed to ship order. Please try again.");
    }
  };

  const handleDeliverOrder = async (orderId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/orders/deliver/${orderId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to deliver order");
      }

      // Refresh the orders list after delivery
      fetchOrders();
      toast.success("Order delivered successfully!");

      // Emit socket event to update distributer stats and consumer dashboard
      const socket = io("http://localhost:5000");
      socket.emit("orderDelivered", {
        orderId,
        order: { product: "Unknown Product" },
      });
    } catch (err) {
      console.error("Error delivering order:", err);
      toast.error("Failed to deliver order. Please try again.");
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        console.log("User from localStorage:", user);
        if (!user || !user.id) {
          window.location.href = "/login";
          return;
        }

        // Set up Socket.IO
        const newSocket = io("http://localhost:5000");
        setSocket(newSocket);
        newSocket.emit("joinRoom", user.id);

        newSocket.on("newOrder", (data) => {
          console.log("New order received:", data);
          // Refresh the orders
          fetchOrders();
        });

        // Fetch orders from API (now includes orders placed by distributors)
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:5000/api/orders/seller/${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status === 401) {
          console.error("Unauthorized: Token might be invalid or expired");
          setError("Unauthorized: Please login again");
          return;
        }
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }
        const data = await response.json();
        setOrders(data.orders);

        return () => {
          newSocket.disconnect();
        };
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <div>Loading orders...</div>;
  if (error) return <div>Error: {error}</div>;

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      console.log("User from localStorage:", user);
      if (!user || !user.id) {
        window.location.href = "/login";
        return;
      }

      // Fetch orders from API (now includes orders placed by distributors)
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/orders/seller/${user.id}`,
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
      setOrders(data.orders);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ordersContainer">
      <h2>My Orders</h2>
      <button
        onClick={fetchOrders}
        style={{ marginBottom: "10px", padding: "5px 10px" }}
      >
        Refresh Orders
      </button>
      <table className="ordersTable">
        <thead>
          <tr>
            <th>Buyer Name</th>
            <th>Product Name</th>
            <th>Quantity</th>
            <th>Total Price</th>
            <th>Status</th>
            <th>Contact</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 ? (
            orders.map((order, index) => (
              <tr key={order._id || index}>
                <td>{order.orderedBy?.name || order.buyerType || "-"}</td>
                <td>{order.product?.name || order.productName || "-"}</td>
                <td>{order.quantity || "-"}</td>
                <td>{order.totalPrice || order.price || "-"}</td>
                <td>{order.status || "-"}</td>
                <td>{order.orderedBy?.email || order.contact || "-"}</td>
                <td>
                  {new Date(order.createdAt).toLocaleDateString() ||
                    order.date ||
                    "-"}
                </td>
                <td>
                  {order.status === "Pending" && (
                    <button
                      onClick={() => handleConfirmOrder(order._id)}
                      style={{
                        padding: "5px 10px",
                        backgroundColor: "#4CAF50",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        marginRight: "5px",
                      }}
                    >
                      Confirm
                    </button>
                  )}
                  {order.status === "Accepted" && (
                    <button
                      onClick={() => handleShipOrder(order._id)}
                      style={{
                        padding: "5px 10px",
                        backgroundColor: "#2196F3",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        marginRight: "5px",
                      }}
                    >
                      Ship
                    </button>
                  )}
                  {order.status === "Shipped" && (
                    <button
                      onClick={() => handleDeliverOrder(order._id)}
                      style={{
                        padding: "5px 10px",
                        backgroundColor: "#FF9800",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      Deliver
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8">No orders placed yet.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Myorders;
