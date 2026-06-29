import "./DashboardTable.css";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddProduct from "../AddProduct";

const DashboardTable = () => {
  const navigate = useNavigate();
  const [totalOrders, setTotalOrders] = useState(0);
  const [ongoingDeliveries, setOngoingDeliveries] = useState([]);
  const [newProduce, setNewProduce] = useState([]);
  const [totalSpending, setTotalSpending] = useState(0);
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

        // Fetch orders for this distributer (as a buyer)
        const ordersResponse = await fetch(
          `http://localhost:5000/api/orders/user/${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (ordersResponse.ok) {
          const orders = await ordersResponse.json();
          setTotalOrders(orders.length);

          // Ongoing deliveries (orders with status 'Shipped')
          const ongoing = orders.filter((order) => order.status === "Shipped");
          setOngoingDeliveries(
            ongoing.slice(0, 5).map((order) => ({
              id: order._id || Math.random(),
              orderId: order.product?.name || order.productName || "N/A",
              status: order.status,
              destination: "N/A",
            }))
          );

          // Total spending (sum of delivered orders)
          const spending = orders
            .filter((order) => order.status === "Delivered")
            .reduce((sum, order) => sum + (order.totalPrice || 0), 0);
          setTotalSpending(spending.toFixed(2));

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

        // Fetch products listed by this distributer
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
          const recentProducts = products.slice(-5).map((product) => ({
            id: product._id || Math.random(),
            name: product.name || "N/A",
            quantity: product.quantity || 0,
            addedDate:
              new Date(product.createdAt).toLocaleDateString() ||
              new Date().toISOString().split("T")[0],
          }));
          setNewProduce(recentProducts);
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
            <th>Ongoing Deliveries</th>
            <th>New Produce Added</th>
            <th>Total Spending on All Orders</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{totalOrders}</td>
            <td>{ongoingDeliveries.length}</td>
            <td>{newProduce.length}</td>
            <td>${totalSpending}</td>
          </tr>
        </tbody>
      </table>

      {/* Subtables for Details */}
      <div className="subtables-container">
        {/* Ongoing Delivery Details Subtable */}
        <h3>Ongoing Delivery Details</h3>
        <table className="subtable">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Status</th>
              <th>Destination</th>
            </tr>
          </thead>
          <tbody>
            {ongoingDeliveries.map((delivery) => (
              <tr key={delivery.id}>
                <td>{delivery.orderId}</td>
                <td>{delivery.status}</td>
                <td>{delivery.destination}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* New Produce Added Subtable */}
        <h3>New Produce Added</h3>
        <table className="subtable">
          <thead>
            <tr>
              <th>Name</th>
              <th>Quantity</th>
              <th>Added Date</th>
            </tr>
          </thead>
          <tbody>
            {newProduce.map((produce) => (
              <tr key={produce.id}>
                <td>{produce.name}</td>
                <td>{produce.quantity}</td>
                <td>{produce.addedDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardTable;
