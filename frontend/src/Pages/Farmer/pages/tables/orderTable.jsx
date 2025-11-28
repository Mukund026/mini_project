import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import { toast } from "react-toastify";

const OrderTable = ({ refreshTrigger }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const socketRef = useRef(null);

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

      // Emit socket event to update farmer stats and consumer dashboard
      const socket = io("http://localhost:5000");
      socket.emit("orderConfirmed", {
        orderId,
        order: { product: orders.product?.name || "Unknown Product" },
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

      // Emit socket event to update farmer stats and consumer dashboard
      const socket = io("http://localhost:5000");
      socket.emit("orderShipped", {
        orderId,
        order: { product: orders.product?.name || "Unknown Product" },
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

      // Emit socket event to update farmer stats and consumer dashboard
      const socket = io("http://localhost:5000");
      socket.emit("orderDelivered", {
        orderId,
        order: { product: orders.product?.name || "Unknown Product" },
      });
    } catch (err) {
      console.error("Error delivering order:", err);
      toast.error("Failed to deliver order. Please try again.");
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user.id) {
        window.location.href = "/login";
        return;
      }

      const token = localStorage.getItem("token");
      const url = `http://localhost:5000/api/orders/seller/${user.id}`;
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to fetch orders: ${response.status} ${errorText}`
        );
      }

      const data = await response.json();
      setOrders(data.orders);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();

    // Set up Socket.IO connection for real-time updates
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.id && !socketRef.current) {
      socketRef.current = io("http://localhost:5000");
      socketRef.current.emit("joinRoom", user.id);

      // Listen for new orders
      socketRef.current.on("newOrder", (data) => {
        console.log("New order received:", data);
        fetchOrders(); // Refresh orders when new order is placed
      });

      return () => {
        if (socketRef.current) {
          socketRef.current.disconnect();
          socketRef.current = null;
        }
      };
    }
  }, [refreshTrigger]);

  if (loading) return <div>Loading orders...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <button
        onClick={fetchOrders}
        style={{ marginBottom: "10px", padding: "5px 10px" }}
      >
        Refresh Orders
      </button>

      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th
              style={{
                border: "2px solid black",
                padding: "10px",
                fontWeight: "bolder",
                color: "green",
              }}
            >
              Buyer Name
            </th>
            <th
              style={{
                border: "2px solid black",
                padding: "10px",
                fontWeight: "bolder",
                color: "green",
              }}
            >
              Product Name
            </th>
            <th
              style={{
                border: "2px solid black",
                padding: "10px",
                fontWeight: "bolder",
                color: "green",
              }}
            >
              Quantity
            </th>
            <th
              style={{
                border: "2px solid black",
                padding: "10px",
                fontWeight: "bolder",
                color: "green",
              }}
            >
              Total Price
            </th>
            <th
              style={{
                border: "2px solid black",
                padding: "10px",
                fontWeight: "bolder",
                color: "green",
              }}
            >
              Status
            </th>
            <th
              style={{
                border: "2px solid black",
                padding: "10px",
                fontWeight: "bolder",
                color: "green",
              }}
            >
              Contact
            </th>
            <th
              style={{
                border: "2px solid black",
                padding: "10px",
                fontWeight: "bolder",
                color: "green",
              }}
            >
              Date
            </th>
            <th
              style={{
                border: "2px solid black",
                padding: "10px",
                fontWeight: "bolder",
                color: "green",
              }}
            >
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {orders.length > 0 ? (
            orders.map((order, index) => (
              <tr key={order._id || index}>
                <td style={cellStyle}>
                  {order.orderedBy?.name || "-"} ({order.orderedByRole})
                </td>
                <td style={cellStyle}>{order.product?.name || "-"}</td>
                <td style={cellStyle}>{order.quantity || "-"}</td>
                <td style={cellStyle}>{order.totalPrice || "-"}</td>
                <td style={cellStyle}>{order.status || "-"}</td>
                <td style={cellStyle}>{order.orderedBy?.email || "-"}</td>
                <td style={cellStyle}>
                  {new Date(order.createdAt).toLocaleDateString() || "-"}
                </td>
                <td style={cellStyle}>
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
              <td colSpan="8" style={{ ...cellStyle, textAlign: "center" }}>
                No orders found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

// Cell style for cleaner code
const cellStyle = {
  border: "2px solid black",
  padding: "10px",
  fontWeight: "bolder",
};

export default OrderTable;
