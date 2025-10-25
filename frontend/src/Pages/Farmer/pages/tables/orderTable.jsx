import React, { useEffect, useState } from 'react'

const orderTable = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const storedOrders = JSON.parse(localStorage.getItem('farmerOrders') || '[]');
    setOrders(storedOrders);
  }, []);

  return (
    <table style={{ borderCollapse: 'collapse', width: '100%'}}>
      <thead>
        <tr>
          <th style={{border: '2px solid black', padding: '10px', fontWeight: 'bolder', color: 'green'}}>Buyer Name</th>
          <th style={{border: '2px solid black', padding: '10px', fontWeight: 'bolder', color: 'green'}}>Produce</th>
          <th style={{border: '2px solid black', padding: '10px', fontWeight: 'bolder', color: 'green'}}>Quantity</th>
          <th style={{border: '2px solid black', padding: '10px', fontWeight: 'bolder', color: 'green'}}>Amount</th>
          <th style={{border: '2px solid black', padding: '10px', fontWeight: 'bolder', color: 'green'}}>Status</th>
          <th style={{border: '2px solid black', padding: '10px', fontWeight: 'bolder', color: 'green'}}>Contact</th>
        </tr>
      </thead>
      <tbody>
        {orders.length > 0 ? (
          orders.map((order, index) => (
            <tr key={index}>
              <td style={{ border: '2px solid black', padding: '10px', fontWeight: 'bolder' }}>{order.buyerName || '-'}</td>
              <td style={{ border: '2px solid black', padding: '10px', fontWeight: 'bolder' }}>{order.produce || '-'}</td>
              <td style={{ border: '2px solid black', padding: '10px', fontWeight: 'bolder' }}>{order.quantity || '-'}</td>
              <td style={{ border: '2px solid black', padding: '10px', fontWeight: 'bolder' }}>{order.amount || '-'}</td>
              <td style={{ border: '2px solid black', padding: '10px', fontWeight: 'bolder' }}>{order.status || '-'}</td>
              <td style={{ border: '2px solid black', padding: '10px', fontWeight: 'bolder' }}>{order.contact || '-'}</td>
            </tr>
          ))
        ) : (
          <>
            <tr>
              <td style={{ border: '2px solid black', padding: '10px', fontWeight: 'bolder' }}>-</td>
              <td style={{ border: '2px solid black', padding: '10px', fontWeight: 'bolder' }}>-</td>
              <td style={{ border: '2px solid black', padding: '10px', fontWeight: 'bolder' }}>-</td>
              <td style={{ border: '2px solid black', padding: '10px', fontWeight: 'bolder' }}>-</td>
              <td style={{ border: '2px solid black', padding: '10px', fontWeight: 'bolder' }}>-</td>
              <td style={{ border: '2px solid black', padding: '10px', fontWeight: 'bolder' }}>-</td>
            </tr>
            <tr>
              <td style={{ border: '2px solid black', padding: '10px', fontWeight: 'bolder' }}>-</td>
              <td style={{ border: '2px solid black', padding: '10px', fontWeight: 'bolder' }}>-</td>
              <td style={{ border: '2px solid black', padding: '10px', fontWeight: 'bolder' }}>-</td>
              <td style={{ border: '2px solid black', padding: '10px', fontWeight: 'bolder' }}>-</td>
              <td style={{ border: '2px solid black', padding: '10px', fontWeight: 'bolder' }}>-</td>
              <td style={{ border: '2px solid black', padding: '10px', fontWeight: 'bolder' }}>-</td>
            </tr>
            <tr>
              <td style={{ border: '2px solid black', padding: '10px', fontWeight: 'bolder' }}>-</td>
              <td style={{ border: '2px solid black', padding: '10px', fontWeight: 'bolder' }}>-</td>
              <td style={{ border: '2px solid black', padding: '10px', fontWeight: 'bolder' }}>-</td>
              <td style={{ border: '2px solid black', padding: '10px', fontWeight: 'bolder' }}>-</td>
              <td style={{ border: '2px solid black', padding: '10px', fontWeight: 'bolder' }}>-</td>
              <td style={{ border: '2px solid black', padding: '10px', fontWeight: 'bolder' }}>-</td>
            </tr>
            <tr>
              <td style={{ border: '2px solid black', padding: '10px', fontWeight: 'bolder' }}>-</td>
              <td style={{ border: '2px solid black', padding: '10px', fontWeight: 'bolder' }}>-</td>
              <td style={{ border: '2px solid black', padding: '10px', fontWeight: 'bolder' }}>-</td>
              <td style={{ border: '2px solid black', padding: '10px', fontWeight: 'bolder' }}>-</td>
              <td style={{ border: '2px solid black', padding: '10px', fontWeight: 'bolder' }}>-</td>
              <td style={{ border: '2px solid black', padding: '10px', fontWeight: 'bolder' }}>-</td>
            </tr>
            <tr>
              <td style={{ border: '2px solid black', padding: '10px', fontWeight: 'bolder' }}>-</td>
              <td style={{ border: '2px solid black', padding: '10px', fontWeight: 'bolder' }}>-</td>
              <td style={{ border: '2px solid black', padding: '10px', fontWeight: 'bolder' }}>-</td>
              <td style={{ border: '2px solid black', padding: '10px', fontWeight: 'bolder' }}>-</td>
              <td style={{ border: '2px solid black', padding: '10px', fontWeight: 'bolder' }}>-</td>
              <td style={{ border: '2px solid black', padding: '10px', fontWeight: 'bolder' }}>-</td>
            </tr>
          </>
        )}
      </tbody>
    </table>
  );
};

export default orderTable
