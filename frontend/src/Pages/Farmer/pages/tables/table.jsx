import React from "react";
import "../addProduce.css";

const SimpleTable = () => {
  const Properties = [
    'Total listed Products',
    'Total Earnings',
    'Active Orders',
    'Completed Orders',
    'Recent Sales',
    'Notifications',
  ];

  // Get the count from localStorage
  const totalListedProducts = parseInt(localStorage.getItem('totalListedProducts') || '0');

  // Function to get value based on property
  const getValue = (prop) => {
    switch (prop) {
      case 'Total listed Products':
        return totalListedProducts.toString();
      default:
        return '—';
    }
  };

  return (
    <table style={{ borderCollapse: 'collapse', width: '100%'}}>
      <thead>
        <tr>
          <th style={{ border: '2px solid black', padding: '10px', fontWeight: 'bolder', color: 'green' }}>Properties</th>
          <th style={{ border: '2px solid black', padding: '10px', fontWeight: 'bolder', color: 'green' }}>Value</th>
        </tr>
      </thead>
       <tbody>
        {Properties.map((prop, index) => (
          <tr key={index}>
            <td style={{ border: '2px solid black', padding: '10px', fontWeight: 'bolder' }}>{prop}</td>
            <td style={{ border: '2px solid black', padding: '10px', fontWeight: 'bolder' }}>{getValue(prop)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default SimpleTable;
