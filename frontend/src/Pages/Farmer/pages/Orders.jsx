import React, { useEffect, useState } from "react";
import Layout from "./Layout";
import OT from "./tables/orderTable";
import io from "socket.io-client";

const Orders = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    // Check if user is logged in and is a farmer
    if (!user || !user.id || user.role !== "farmer") {
      window.location.href = "/login";
      return;
    }

    const socket = io("http://localhost:5000");
    socket.emit("joinRoom", user.id);

    socket.on("newOrder", (data) => {
      console.log("New order received:", data);
      // Force refresh the orders table
      setRefreshKey((prev) => prev + 1);
      // Trigger notification update in dashboard
      localStorage.setItem("readNotificationsFarmer", JSON.stringify([]));
      window.dispatchEvent(new CustomEvent("notificationUpdate"));
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <Layout>
      <div className="ordercontainer">
        <OT refreshTrigger={refreshKey} />
      </div>
    </Layout>
  );
};

export default Orders;
