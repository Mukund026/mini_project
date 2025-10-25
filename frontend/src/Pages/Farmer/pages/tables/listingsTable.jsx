import React, { useEffect, useState } from 'react'

const ListingsTable = () => {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    const storedListings = JSON.parse(localStorage.getItem('farmerListings') || '[]');
    setListings(storedListings);
  }, []);

  return (
    <table style={{ borderCollapse: 'collapse', width: '100%'}}>
      <thead>
        <tr>
          <th style={{border: '2px solid black', padding: '10px', fontWeight: 'bolder', color: 'green'}}>Images</th>
          <th style={{border: '2px solid black', padding: '10px', fontWeight: 'bolder', color: 'green'}}>Name</th>
          <th style={{border: '2px solid black', padding: '10px', fontWeight: 'bolder', color: 'green'}}>Category</th>
          <th style={{border: '2px solid black', padding: '10px', fontWeight: 'bolder', color: 'green'}}>Quantity</th>
          <th style={{border: '2px solid black', padding: '10px', fontWeight: 'bolder', color: 'green'}}>Price</th>
          <th style={{border: '2px solid black', padding: '10px', fontWeight: 'bolder', color: 'green'}}>Status</th>
          <th style={{border: '2px solid black', padding: '10px', fontWeight: 'bolder', color: 'green'}}>Action</th>
        </tr>
      </thead>
      <tbody>
        {listings.length > 0 ? (
          listings.map((listing, index) => (
            <tr key={index}>
              <td style={{ border: '2px solid black', padding: '10px', fontWeight: 'bolder' }}>
                {listing.images && listing.images.length > 0 ? (
                  <img src={listing.images[0]} alt={listing.name} style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
                ) : '-'}
              </td>
              <td style={{ border: '2px solid black', padding: '10px', fontWeight: 'bolder' }}>{listing.name || '-'}</td>
              <td style={{ border: '2px solid black', padding: '10px', fontWeight: 'bolder' }}>{listing.category || '-'}</td>
              <td style={{ border: '2px solid black', padding: '10px', fontWeight: 'bolder' }}>{listing.quantity || '-'}</td>
              <td style={{ border: '2px solid black', padding: '10px', fontWeight: 'bolder' }}>{listing.price || '-'}</td>
              <td style={{ border: '2px solid black', padding: '10px', fontWeight: 'bolder' }}>{listing.status || '-'}</td>
              <td style={{ border: '2px solid black', padding: '10px', fontWeight: 'bolder' }}>
                <button style={{ padding: '5px 10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                  Edit
                </button>
              </td>
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
              <td style={{ border: '2px solid black', padding: '10px', fontWeight: 'bolder' }}>-</td>
            </tr>
            <tr>
              <td style={{ border: '2px solid black', padding: '10px', fontWeight: 'bolder' }}>-</td>
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
              <td style={{ border: '2px solid black', padding: '10px', fontWeight: 'bolder' }}>-</td>
            </tr>
            <tr>
              <td style={{ border: '2px solid black', padding: '10px', fontWeight: 'bolder' }}>-</td>
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
              <td style={{ border: '2px solid black', padding: '10px', fontWeight: 'bolder' }}>-</td>
            </tr>
          </>
        )}
      </tbody>
    </table>
  );
};

export default ListingsTable
