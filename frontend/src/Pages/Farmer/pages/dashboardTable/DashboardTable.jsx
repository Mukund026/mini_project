import "./DashboardTable.css";
import React, { useEffect, useState } from "react";

const DashboardTable = ({ onShowAddForm, refreshTrigger }) => {
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [recentOrders, setRecentOrders] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [readNotifications, setReadNotifications] = useState(new Set());

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) {
      // Mark all notifications as read when opening
      const allIds = notifications.map((n) => n.id);
      const newRead = new Set([...readNotifications, ...allIds]);
      setReadNotifications(newRead);
      localStorage.setItem("readNotifications", JSON.stringify([...newRead]));
    }
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || !user.id) {
          window.location.href = "/login";
          return;
        }

        const token = localStorage.getItem("token");

        // Fetch products listed by this farmer
        const productsResponse = await fetch(
          `http://localhost:5000/api/products/byuser/${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (productsResponse.ok) {
          const products = await productsResponse.json();
          setTotalProducts(products.length);
        }

        // Fetch orders for this farmer
        const ordersResponse = await fetch(
          `http://localhost:5000/api/orders/seller/${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (ordersResponse.ok) {
          const data = await ordersResponse.json();
          const orders = data.orders;
          setTotalOrders(orders.length);

          // Calculate total revenue
          const revenue = orders.reduce(
            (sum, order) => sum + (order.totalPrice || 0),
            0
          );
          setTotalRevenue(revenue);

          // Calculate pending orders
          const pending = orders.filter(
            (order) => order.status !== "Delivered"
          );
          setPendingOrders(pending.length);

          // Recent orders (last 5)
          const recent = orders.slice(-5).map((order) => ({
            id: order._id || Math.random(),
            productName: order.product?.name || order.productName || "N/A",
            quantity: order.quantity || 0,
            price: order.totalPrice || order.price || 0,
            status: order.status || "Pending",
            date:
              new Date(order.createdAt).toLocaleDateString() ||
              new Date().toISOString().split("T")[0],
          }));
          setRecentOrders(recent);

          // Notifications (sample notifications based on orders)
          const sampleNotifications = orders.slice(-3).map((order, index) => ({
            id: index + 1,
            message: `Order for ${
              order.product?.name || order.productName
            } is ${order.status}`,
            date:
              new Date(order.createdAt).toLocaleDateString() ||
              new Date().toISOString().split("T")[0],
          }));
          setNotifications(sampleNotifications);
        }

        // Load read notifications from localStorage
        const read = new Set(
          JSON.parse(localStorage.getItem("readNotifications") || "[]")
        );
        setReadNotifications(read);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      }
    };

    fetchDashboardData();

    // Polling every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000);

    return () => clearInterval(interval);
  }, [refreshTrigger]);

  return (
    <div className="dashboard-container">
      {/* Flex container for Add Product Button and Notifications */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "20px",
          flexWrap: "wrap",
          gap: "20px",
        }}
      >
        {/* Add Product Button */}
        <button
          onClick={onShowAddForm}
          style={{
            padding: "10px 20px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "16px",
            flex: "1",
            minWidth: "200px",
            maxWidth: "400px",
          }}
        >
          ➕ Add Product
        </button>

        {/* Notifications Section */}
        <div
          className="notifications-section"
          style={{
            backgroundColor: notifications.some(
              (n) => !readNotifications.has(n.id)
            )
              ? "yellow"
              : "#4CAF50",
            padding: "10px",
            borderRadius: "5px",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            color: "white",
            flex: "1",
            minWidth: "200px",
            maxWidth: "400px",
          }}
          onClick={handleNotificationClick}
        >
          <h3 style={{ margin: "0 0 10px 0", textAlign: "center" }}>
            Notifications ({notifications.length})
          </h3>
          {showNotifications && (
            <div style={{ marginTop: "auto" }}>
              {notifications.length > 0 ? (
                <ul
                  style={{ margin: 0, paddingLeft: "20px", fontSize: "15px" }}
                >
                  {notifications.map((notif) => (
                    <li key={notif.id} style={{ marginBottom: "5px" }}>
                      {notif.message} - {notif.date}
                    </li>
                  ))}
                </ul>
              ) : (
                <p style={{ margin: 0, fontSize: "12px", textAlign: "center" }}>
                  No new notifications.
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Summary Table */}
      <table className="summary-table">
        <thead>
          <tr>
            <th>Total Products</th>
            <th>Total Orders</th>
            <th>Total Revenue</th>
            <th>Pending Orders</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{totalProducts}</td>
            <td>{totalOrders}</td>
            <td>${totalRevenue}</td>
            <td>{pendingOrders}</td>
          </tr>
        </tbody>
      </table>

      {/* Subtables for Details */}
      <div className="subtables-container">
        {/* Recent Orders Subtable */}
        <h3>Recent Orders</h3>
        <table className="subtable">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((order) => (
              <tr key={order.id}>
                <td>{order.productName}</td>
                <td>{order.quantity}</td>
                <td>${order.price}</td>
                <td>{order.status}</td>
                <td>{order.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardTable;
