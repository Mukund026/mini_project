import React, { useState, useEffect } from "react";
import axios from "axios";
import "./manageOrders.css";

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:5000/api/orders/seller/${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Remove duplicates based on product._id to show only one order per product
      const uniqueOrders = response.data.orders.filter(
        (order, index, self) =>
          index === self.findIndex((o) => o.product?._id === order.product?._id)
      );
      setOrders(uniqueOrders);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch orders");
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, action) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/orders/${action}/${orderId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchOrders(); // Refresh orders
    } catch (err) {
      setError("Failed to update order status");
    }
  };

  if (loading) return <div>Loading orders...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="manage-orders">
      <h2>Manage Orders</h2>
      <div className="orders-table">
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Product</th>
              <th>Quantity</th>
              <th>Total Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.product?.name || "N/A"}</td>
                <td>{order.quantity}</td>
                <td>${order.totalPrice}</td>
                <td>{order.status}</td>
                <td>
                  {order.status === "Pending" && (
                    <>
                      <button
                        onClick={() => updateOrderStatus(order._id, "confirm")}
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() =>
                          updateOrderStatus(order._id, "cancel")
                        }
                      >
                        Cancel
                      </button>
                    </>
                  )}
                  {order.status === "Accepted" && (
                    <button
                      onClick={() => updateOrderStatus(order._id, "ship")}
                    >
                      Ship
                    </button>
                  )}
                  {order.status === "Shipped" && (
                    <button
                      onClick={() => updateOrderStatus(order._id, "deliver")}
                    >
                      Deliver
                    </button>
                  )}
                  {(order.status === "Delivered" ||
                    order.status === "Cancelled") && (
                    <span>{order.status}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageOrders;
