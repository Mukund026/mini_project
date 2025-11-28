import "./DashboardTable.css";
import React, { useEffect, useState } from "react";
import AddProduct from "../AddProduct";

const DashboardTable = () => {
  const [totalOrders, setTotalOrders] = useState(0);
  const [pendingPayments, setPendingPayments] = useState([]);
  const [recentPurchases, setRecentPurchases] = useState([]);
  const [inventoryAlerts, setInventoryAlerts] = useState(0);
  const [showAddProductForm, setShowAddProductForm] = useState(false);
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
        setTotalOrders(orders.length);

        // Calculate pending payments (orders with status not 'Delivered')
        const pending = orders.filter((order) => order.status !== "Delivered");
        setPendingPayments(
          pending.map((order) => ({
            id: order._id || Math.random(),
            orderId: order.product?.name || order.productName || "N/A",
            amount: order.totalPrice || order.price || 0,
            dueDate:
              new Date(order.createdAt).toLocaleDateString() ||
              new Date().toISOString().split("T")[0],
          }))
        );

        // Recent purchases (last 5 orders)
        const recent = orders.slice(-5).map((order) => ({
          id: order._id || Math.random(),
          name: order.product?.name || order.productName || "N/A",
          quantity: order.quantity || 0,
          purchaseDate:
            new Date(order.createdAt).toLocaleDateString() ||
            new Date().toISOString().split("T")[0],
        }));
        setRecentPurchases(recent);

        // Inventory alerts (placeholder - could be based on low stock)
        setInventoryAlerts(0); // For now, set to 0 as retailers don't manage inventory

        // Notifications (sample notifications based on orders)
        const sampleNotifications = orders.slice(-3).map((order, index) => ({
          id: index + 1,
          message: `Order for ${order.product?.name || order.productName} is ${
            order.status
          }`,
          date:
            new Date(order.createdAt).toLocaleDateString() ||
            new Date().toISOString().split("T")[0],
        }));
        setNotifications(sampleNotifications);

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
  }, []);

  return (
    <div className="dashboard-container">
      {/* Flex container for Add Product Button and Notifications */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        {/* Add Product Button */}
        <button
          onClick={() => setShowAddProductForm(true)}
          style={{
            padding: "10px 20px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "16px",
            width: "600px",
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
            margin: "20px 0px 0px 0px",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            color: "white",
            width: "400px",
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

      {showAddProductForm && <AddProduct />}

      {/* Main Summary Table */}
      <table className="summary-table">
        <thead>
          <tr>
            <th>Total Orders</th>
            <th>Pending Payments</th>
            <th>Recent Purchases</th>
            <th>Inventory Alerts</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{totalOrders}</td>
            <td>{pendingPayments.length}</td>
            <td>{recentPurchases.length}</td>
            <td>{inventoryAlerts}</td>
          </tr>
        </tbody>
      </table>

      {/* Subtables for Details */}
      <div className="subtables-container">
        {/* Pending Payments Details Subtable */}
        <h3>Pending Payments Details</h3>
        <table className="subtable">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Amount</th>
              <th>Due Date</th>
            </tr>
          </thead>
          <tbody>
            {pendingPayments.map((payment) => (
              <tr key={payment.id}>
                <td>{payment.orderId}</td>
                <td>${payment.amount}</td>
                <td>{payment.dueDate}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Recent Purchases Subtable */}
        <h3>Recent Purchases</h3>
        <table className="subtable">
          <thead>
            <tr>
              <th>Name</th>
              <th>Quantity</th>
              <th>Purchase Date</th>
            </tr>
          </thead>
          <tbody>
            {recentPurchases.map((purchase) => (
              <tr key={purchase.id}>
                <td>{purchase.name}</td>
                <td>{purchase.quantity}</td>
                <td>{purchase.purchaseDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardTable;
