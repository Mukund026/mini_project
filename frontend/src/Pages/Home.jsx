import { Link } from 'react-router-dom';
import React from 'react';

const Home = () => {
  return (
    <div>
      homepage
      <br />
      <Link to="/farmer-dashboard">Farmer Dashboard</Link>
      <br />
      <Link to="/distributer">Distributer</Link>
      <br />
      <Link to="/retailer">Retailer</Link>
      <br />
      <Link to="/consumere">Consumere</Link>
    </div>
  );
};

export default Home;