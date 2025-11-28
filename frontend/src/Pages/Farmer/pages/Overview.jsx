import React, { useState, useEffect } from "react";
import Layout from "./Layout";
import DashboardTable from "./dashboardTable/DashboardTable";
import AddProduceForm from "./addProduce";

const Overview = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showAddForm, setShowAddForm] = useState(false);

  const handleProductAdded = () => {
    setRefreshTrigger((prev) => prev + 1);
    setShowAddForm(false);
  };

  const handleCloseAddForm = () => {
    setShowAddForm(false);
  };

  useEffect(() => {
    const handleStorage = () => {
      if (localStorage.getItem("refreshOverview") === "true") {
        setRefreshTrigger((prev) => prev + 1);
        localStorage.removeItem("refreshOverview");
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return (
    <div>
      <Layout>
        <DashboardTable
          refreshTrigger={refreshTrigger}
          onShowAddForm={() => setShowAddForm(true)}
        />
        {showAddForm && (
          <AddProduceForm
            onClose={handleCloseAddForm}
            onSuccess={handleProductAdded}
          />
        )}
      </Layout>
    </div>
  );
};

export default Overview;
