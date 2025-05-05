"use client";
import TopBar from './TopBar';
import { useAuth } from "@/context/AuthContext";
import styles from './MainLayout.module.css';

export default function MainLayout({ children, cartCount, onSearch }) {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className={styles.dashboardContainer}>
      <TopBar cartCount={cartCount} onLogout={handleLogout} onSearch={onSearch} />
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
}