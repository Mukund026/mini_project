import React, { useEffect, useState, useCallback } from "react";
import "./myorders.css";
import io from "socket.io-client";

const Myorders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      console.log("User from localStorage:", user);
      if (!user || !user.id) {
        window.location.href = "/login";
        return;
      }
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
      // Remove duplicates based on product and buyer (one order per product per buyer)
      const uniqueOrders = data.orders.filter(
        (order, index, self) =>
          index ===
          self.findIndex(
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
  }, []);

  useEffect(() => {
    fetchOrders();

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.id) {
      window.location.href = "/login";
      return;
    }

    // Set up Socket.IO
    const socket = io("http://localhost:5000");
    socket.emit("joinRoom", user.id);

    socket.on("newOrder", (data) => {
      console.log("New order received:", data);
      // Refresh the orders
      fetchOrders();
    });

    socket.on("orderStatusUpdated", (data) => {
      console.log("Order status updated:", data);
      // Refresh the orders
      fetchOrders();
    });

    return () => {
      socket.disconnect();
    };
  }, [fetchOrders]);

  if (loading) return <div>Loading orders...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="myorders-container">
      <h2>My Orders</h2>
      <button
        onClick={fetchOrders}
        style={{ marginBottom: "10px", padding: "5px 10px" }}
      >
        Refresh Orders
      </button>
      <table className="myorders-table">
        <thead>
          <tr>
            <th>Buyer Name</th>
            <th>Product Name</th>
            <th>Quantity</th>
            <th>Total Price</th>
            <th>Status</th>
            <th>Contact</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 ? (
            orders.map((order, index) => (
              <tr key={order._id || index}>
                <td>
                  {order.orderedBy?.name ||
                    order.orderedBy?.username ||
                    "Consumer"}
                </td>
                <td>
                  {order.product?.name ||
                    order.productName ||
                    order.produce ||
                    "-"}
                </td>
                <td>{order.quantity || "-"}</td>
                <td>
                  {order.totalPrice || order.price || order.amount || "-"}
                </td>
                <td>{order.status || "Pending"}</td>
                <td>{order.orderedBy?.email || "-"}</td>
                <td>
                  {new Date(order.createdAt).toLocaleDateString() ||
                    order.date ||
                    "-"}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">No orders placed yet.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Myorders;
