import DashboardTable from './dashboardTable/DashboardTable'
import Sidebar from '../sidebar/Sidebar'
import React from 'react'

const Dashboard = () => {
  return (
    <Sidebar>
    <DashboardTable/>
    </Sidebar>
  )
}

export default Dashboard
