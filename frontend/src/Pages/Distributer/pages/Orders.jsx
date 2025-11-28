import React, { useEffect, useState } from "react";
import OrderTable from "./tables/OrderTable";
import io from "socket.io-client";

const Orders = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    const socket = io("http://localhost:5000");
    socket.emit("joinRoom", user.id);

    socket.on("newOrder", (data) => {
      console.log("New order received:", data);
      // Force refresh the orders table
      setRefreshKey((prev) => prev + 1);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="ordercontainer">
      <OrderTable refreshTrigger={refreshKey} />
    </div>
  );
};

export default Orders;
