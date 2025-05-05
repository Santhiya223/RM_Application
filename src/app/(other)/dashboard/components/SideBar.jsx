import React from 'react'
import styles from '@/app/(other)/dashboard/dashboard.module.css'
const SideBar = ({onLogout}) => {
  return (
    <div> 
    <aside className={styles.sidebar}>
      <div className={styles.sidebarLogo}>RM Snacks</div>
      <nav className={styles.sidebarNav}>
        <ul>
          <li><a href="/dashboard" className={styles.active}>Dashboard</a></li>
          <li><a href="/orders">Orders</a></li>
          <li><a href="/settings">Settings</a></li>
          <li><button onClick={onLogout}>Logout</button></li>
        </ul>
      </nav>
    </aside></div>
  )
}

export default SideBar