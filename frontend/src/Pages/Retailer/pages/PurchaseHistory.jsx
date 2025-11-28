import React, { useEffect, useState } from "react";
import "./myorders.css";

const PurchaseHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || !user.id) {
          window.location.href = "/login";
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
        setOrders(data.orders || data); // adjust if backend returns { orders: [...] }
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

  return (
    <div className="myorders-container">
      <h2>Purchase History</h2>
      <table className="myorders-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Product Name</th>
            <th>Category</th>
            <th>Quantity</th>
            <th>Total Price</th>
            <th>Buyer Name</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 ? (
            orders.map((order, index) => (
              <tr key={order._id || index}>
                <td>{order._id}</td>
                <td>{order.product?.name || "-"}</td>
                <td>{order.product?.category || "-"}</td>
                <td>{order.quantity || "-"}</td>
                <td>{order.totalPrice || "-"}</td>
                <td>{order.orderedBy?.name || "-"}</td>
                <td>{order.status || "-"}</td>
                <td>{new Date(order.createdAt).toLocaleString() || "-"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" style={{ textAlign: "center" }}>
                No orders found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PurchaseHistory;
