// Overview.jsx
import React from "react";
import Layout from "./Layout";
import SimpleTable from "./tables/table";
import { useNavigate } from "react-router-dom";

const Overview = () => {
  const Navigate = useNavigate();
  return (
    <Layout>
      <button id="addProduce" style={{ marginBottom: '5rem', height: '50px', width: '500', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.53)' }} onClick={() => {
        Navigate("/addProduce")
      }}>Add new Produce</button>
      <SimpleTable></SimpleTable>
    </Layout>
  );
};

export default Overview;
