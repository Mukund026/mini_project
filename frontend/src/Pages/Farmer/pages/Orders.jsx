import React from 'react';
import Layout from './Layout';
import OT from "./tables/orderTable";

const Orders = () => {
  return (
    <Layout>
      <div className="ordercontainer">
        <OT/>
      </div>
    </Layout>
  )
}

export default Orders
