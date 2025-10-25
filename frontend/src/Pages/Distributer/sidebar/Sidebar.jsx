import "./sidebar.css"
import React from 'react'
import { Link } from 'react-router-dom'

const Sidebar = () => {
  return (
    <div className='sidebarContainer'>
      <ul>
        <Link to="/distributer-dashboard" className="item-link1"><li className="item1">Dashboard Overview</li></Link>
        <Link to="/distributer-browse" className="item-link1"><li className="item1">Browse Produce</li></Link>
        <Link to="/distributer-orders" className="item-link1"><li className="item1">My Orders</li></Link>
        <Link to="/distributer-notifications" className="item-link1"><li className="item1">Notifications</li></Link>
        <Link to="/distributer-profile" className="item-link1"><li className="item1">Profile</li></Link>
      </ul>
    </div>
  )
}

export default Sidebar
