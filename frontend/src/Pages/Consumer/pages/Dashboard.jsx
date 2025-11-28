import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import io from 'socket.io-client';
import "./dashboard.css";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    deliveredOrders: 0,
    pendingOrders: 0,
    totalSpent: 0,
  });
  const [orderHistory, setOrderHistory] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || !user.id) {
          toast.error("Please login to view dashboard");
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
        const orders = await response.json();

        const totalOrders = orders.length;
        const deliveredOrders = orders.filter(
          (order) => order.status === "Delivered"
        ).length;
        const pendingOrders = orders.filter(
          (order) => order.status === "Pending"
        ).length;
        const totalSpent = orders.reduce(
          (sum, order) => sum + parseFloat(order.totalPrice),
          0
        );

        setStats({
          totalOrders,
          deliveredOrders,
          pendingOrders,
          totalSpent: totalSpent.toFixed(2),
        });

        // Set order history for tracking status
        setOrderHistory(orders);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        toast.error("Failed to load dashboard stats");
      }
    };

    fetchStats();

    // Set up socket.io for real-time notifications
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.id) {
      const socket = io('http://localhost:5000');
      socket.emit('joinRoom', user.id);

      socket.on('orderConfirmed', (data) => {
        console.log('Order confirmed notification:', data);
        toast.success(`Your order for ${data.order.product} has been confirmed!`);
        // Refresh stats after confirmation
        fetchStats();
      });

      socket.on('orderShipped', (data) => {
        console.log('Order shipped notification:', data);
        toast.info(`Your order for ${data.order.product} has been shipped!`);
        // Refresh stats after shipping
        fetchStats();
      });

      socket.on('orderDelivered', (data) => {
        console.log('Order delivered notification:', data);
        toast.success(`Your order for ${data.order.product} has been delivered!`);
        // Refresh stats after delivery
        fetchStats();
      });

      return () => {
        socket.disconnect();
      };
    }
  }, []);

  return (
    <div className="dashboard">
      <h1>Dashboard Overview</h1>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Orders</h3>
          <p>{stats.totalOrders}</p>
        </div>
        <div className="stat-card">
          <h3>Delivered Orders</h3>
          <p>{stats.deliveredOrders}</p>
        </div>
        <div className="stat-card">
          <h3>Pending Orders</h3>
          <p>{stats.pendingOrders}</p>
        </div>
        <div className="stat-card">
          <h3>Total Spent</h3>
          <p>${stats.totalSpent}</p>
        </div>
      </div>
      <div className="order-history">
        <h2>Order History</h2>
        {orderHistory.length > 0 ? (
          <div className="order-list">
            {orderHistory.map((order) => (
              <div key={order._id} className="order-item">
                <div className="order-info">
                  <h4>{order.product?.name || "Unknown Product"}</h4>
                  <p>Quantity: {order.quantity}</p>
                  <p>Amount: ${order.totalPrice}</p>
                </div>
                <div className="order-status">
                  <span className={`status ${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No orders found.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
