import React, { useEffect } from 'react'
import Layout from './Layout'
import ListingsTable from './tables/ListingsTable'

const Listings = () => {
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    // Check if user is logged in and is a farmer
    if (!user || !user.id || user.role !== 'farmer') {
      window.location.href = '/login';
      return;
    }
  }, []);

  return (
    <div>
      <Layout>
        <ListingsTable/>
      </Layout>
    </div>
  )
}

export default Listings
