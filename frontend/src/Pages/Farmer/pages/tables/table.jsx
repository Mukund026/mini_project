import React, { useEffect, useState } from "react";
import "../addProduce.css";
import io from "socket.io-client";

const SimpleTable = () => {
  const [stats, setStats] = useState({
    totalListedProducts: 0,
    totalEarnings: 0,
    activeOrders: 0,
    completedOrders: 0,
  });

  const Properties = [
    "Total listed Products",
    "Total Earnings",
    "Active Orders",
    "Completed Orders",
    "Recent Sales",
    "Notifications",
  ];

  useEffect(() => {
    const fetchFarmerStats = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || !user.id) {
          return;
        }

        const token = localStorage.getItem("token");

        // Fetch products listed by farmer
        const productsResponse = await fetch(
          `http://localhost:5000/api/products/farmer/${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (productsResponse.ok) {
          const products = await productsResponse.json();
          setStats((prev) => ({
            ...prev,
            totalListedProducts: products.length,
          }));
        }

        // Fetch orders for farmer
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

          const activeOrders = orders.filter(
            (order) => order.status === "Pending" || order.status === "Accepted"
          ).length;
          const completedOrders = orders.filter(
            (order) => order.status === "Delivered"
          ).length;
          const totalEarnings = orders
            .filter((order) => order.status === "Delivered")
            .reduce((sum, order) => sum + parseFloat(order.totalPrice), 0);

          setStats((prev) => ({
            ...prev,
            activeOrders,
            completedOrders,
            totalEarnings: totalEarnings.toFixed(2),
          }));
        }
      } catch (error) {
        console.error("Error fetching farmer stats:", error);
      }
    };

    fetchFarmerStats();

    // Set up socket.io for real-time updates
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.id) {
      const socket = io("http://localhost:5000");
      socket.emit("joinRoom", user.id);

      // Listen for order status updates
      socket.on("orderConfirmed", () => {
        console.log("Order confirmed, refreshing farmer stats");
        fetchFarmerStats();
      });

      socket.on("orderShipped", () => {
        console.log("Order shipped, refreshing farmer stats");
        fetchFarmerStats();
      });

      socket.on("orderDelivered", () => {
        console.log("Order delivered, refreshing farmer stats");
        fetchFarmerStats();
      });

      return () => {
        socket.disconnect();
      };
    }
  }, []);

  // Function to get value based on property
  const getValue = (prop) => {
    switch (prop) {
      case "Total listed Products":
        return stats.totalListedProducts.toString();
      case "Total Earnings":
        return `$${stats.totalEarnings}`;
      case "Active Orders":
        return stats.activeOrders.toString();
      case "Completed Orders":
        return stats.completedOrders.toString();
      default:
        return "—";
    }
  };

  return (
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
            Properties
          </th>
          <th
            style={{
              border: "2px solid black",
              padding: "10px",
              fontWeight: "bolder",
              color: "green",
            }}
          >
            Value
          </th>
        </tr>
      </thead>
      <tbody>
        {Properties.map((prop, index) => (
          <tr key={index}>
            <td
              style={{
                border: "2px solid black",
                padding: "10px",
                fontWeight: "bolder",
              }}
            >
              {prop}
            </td>
            <td
              style={{
                border: "2px solid black",
                padding: "10px",
                fontWeight: "bolder",
              }}
            >
              {getValue(prop)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default SimpleTable;
