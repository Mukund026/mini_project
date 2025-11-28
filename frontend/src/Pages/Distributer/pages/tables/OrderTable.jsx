import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { toast } from "react-toastify";

const API_BASE = "http://localhost:5000/api/orders";
const SOCKET_URL = "http://localhost:5000";

const OrderTable = ({ refreshTrigger }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [socket, setSocket] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  //====================================================
  // REUSABLE API FUNCTION
  //====================================================
  const updateOrderStatus = async (endpoint, order) => {
    try {
      const res = await fetch(`${API_BASE}/${endpoint}/${order._id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Failed to update order status");

      toast.success(`Order ${endpoint} successfully!`);
      fetchOrders();

      // Emit socket update to dashboards
      socket?.emit("orderStatusUpdated", {
        orderId: order._id,
        status: endpoint,
        productName: order.product?.name,
      });
    } catch (err) {
      toast.error("Something went wrong. Try again.");
    }
  };

  //====================================================
  // FETCH ORDERS
  //====================================================
  const fetchOrders = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API_BASE}/seller/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch orders");

      const data = await res.json();

      // Remove duplicates based on product + buyer
      const uniqueOrders = data.orders.filter(
        (order, idx, arr) =>
          idx ===
          arr.findIndex(
            (o) =>
              o.product?._id === order.product?._id &&
              o.orderedBy?._id === order.orderedBy?._id
          )
      );

      setOrders(uniqueOrders);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  //====================================================
  // SETUP SOCKET CONNECTION
  //====================================================
  useEffect(() => {
    fetchOrders();

    if (!user?.id) return;

    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    newSocket.emit("joinRoom", user.id);

    newSocket.on("orderStatusUpdated", () => {
      fetchOrders();
    });

    return () => newSocket.disconnect();
  }, [refreshTrigger]);

  if (loading) return <div>Loading orders...</div>;
  if (error) return <div>Error: {error}</div>;

  //====================================================
  // RENDER UI
  //====================================================
  return (
    <div>
      <button
        onClick={fetchOrders}
        style={{ marginBottom: "10px", padding: "6px 12px" }}
      >
        Refresh Orders
      </button>

      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            {["Buyer", "Produce", "Qty", "Amount", "Status", "Contact", "Actions"].map(
              (h) => (
                <th key={h} style={headerStyle}>
                  {h}
                </th>
              )
            )}
          </tr>
        </thead>

        <tbody>
          {orders.length > 0 ? (
            orders.map((order) => (
              <tr key={order._id}>
                <td style={cellStyle}>{order.orderedBy?.name}</td>
                <td style={cellStyle}>{order.product?.name}</td>
                <td style={cellStyle}>{order.quantity}</td>
                <td style={cellStyle}>{order.totalPrice}</td>
                <td style={cellStyle}>{order.status}</td>
                <td style={cellStyle}>{order.orderedBy?.email}</td>

                <td style={cellStyle}>
                  {order.status === "Pending" && (
                    <ActionBtn
                      label="Confirm"
                      color="#4CAF50"
                      onClick={() => updateOrderStatus("confirm", order)}
                    />
                  )}

                  {order.status === "Accepted" && (
                    <ActionBtn
                      label="Ship"
                      color="#2196F3"
                      onClick={() => updateOrderStatus("ship", order)}
                    />
                  )}

                  {order.status === "Shipped" && (
                    <ActionBtn
                      label="Deliver"
                      color="#FF9800"
                      onClick={() => updateOrderStatus("deliver", order)}
                    />
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" style={{ ...cellStyle, textAlign: "center" }}>
                No orders found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

//====================================================
// SMALL COMPONENT FOR BUTTONS
//====================================================
const ActionBtn = ({ label, color, onClick }) => (
  <button
    onClick={onClick}
    style={{
      padding: "6px 12px",
      backgroundColor: color,
      color: "white",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      marginRight: "5px",
    }}
  >
    {label}
  </button>
);

//====================================================
// STYLES
//====================================================
const cellStyle = {
  border: "2px solid black",
  padding: "10px",
  fontWeight: "600",
};

const headerStyle = {
  border: "2px solid black",
  padding: "12px",
  fontWeight: "bold",
  color: "green",
  fontSize: "16px",
};

export default OrderTable;
