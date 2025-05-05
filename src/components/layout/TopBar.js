"use client";
import styles from './TopBar.module.css';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaSearch } from "react-icons/fa";

export default function TopBar({ cartCount, onLogout, onSearch }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const router = useRouter();

  // Debounce effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (debouncedQuery.trim() !== '') {
        onSearch(debouncedQuery); // Only call onSearch when debouncedQuery changes
      }
    }, 500); // 500ms debounce delay

    return () => clearTimeout(timer);
  }, [debouncedQuery, onSearch]);

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
    setDebouncedQuery(e.target.value);
  };

  return (
    <div className={styles.topBar}>
      <div className={styles.logo}>RM SNACKS</div>
      
      <div className={styles.searchBar}>
        <input 
          type="text" 
          placeholder="Search products..." 
          value={searchQuery}
          onChange={handleInputChange}
        />
        <button className={styles.searchButton} onClick={() => onSearch(searchQuery)}>
          <FaSearch />
        </button>
      </div>

      <div className={styles.topBarActions}>
        {/* Orders Button */}
        <button 
          className={styles.actionButton}
          onClick={() => router.push('/orders')}
        >
          {/* SVG omitted for brevity */}
          <span>Orders</span>
        </button>

        {/* Cart Button */}
        <button className={styles.actionButton}
          onClick={() => router.push('/cart')}>
          <span>Cart ({cartCount})</span>
        </button>

        {/* Logout Button */}
        <button 
          className={styles.actionButton}
          onClick={onLogout}
        >
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
