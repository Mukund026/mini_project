import React from 'react';
import Sidebar from './sidebar/Sidebar';
import Dashboard from './pages/Dashboard';

const DistributerDashboard = () => {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ marginLeft: '250px', padding: '20px', width: '100%' }}>
        <Dashboard />
      </div>
    </div>
  );
};

export default DistributerDashboard;
