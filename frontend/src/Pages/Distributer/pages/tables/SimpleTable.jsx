import React, { useEffect, useState } from "react";
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
    // Set static stats for rendering
    setStats({
      totalListedProducts: 5,
      totalEarnings: 100.0,
      activeOrders: 2,
      completedOrders: 3,
    });
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
