import React, { useEffect } from "react";
import SimpleTable from "./tables/SimpleTable";
import { useNavigate } from "react-router-dom";

const Overview = () => {
  const Navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    // Check if user is logged in and is a distributer
    if (!user || !user.id || user.role !== "distributer") {
      window.location.href = "/login";
      return;
    }
  }, []);

  return (
    <div>
      <button
        id="addProduce"
        style={{
          marginBottom: "5rem",
          height: "50px",
          width: "500",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.53)",
        }}
        onClick={() => {
          Navigate("/add-product");
        }}
      >
        Add new Product
      </button>
      <SimpleTable></SimpleTable>
    </div>
  );
};

export default Overview;
