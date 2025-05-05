"use client";
import styles from './OrdersList.module.css';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function OrdersList() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0
  });
  const [filters, setFilters] = useState({
    status: '',
    dateFrom: '',
    dateTo: '',
    sort: '-placedAt' // newest first
  });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const query = new URLSearchParams({
          page: pagination.page,
          limit: pagination.limit,
          status: filters.status,
          dateFrom: filters.dateFrom,
          dateTo: filters.dateTo,
          sort: filters.sort
        }).toString();

        const response = await fetch(`/api/orders?${query}`);
        if (!response.ok) throw new Error('Failed to fetch orders');
        
        const { data, total } = await response.json();
        setOrders(data);
        setPagination(prev => ({ ...prev, total }));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [pagination.page, pagination.limit, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading) return <div className={styles.loading}>Loading orders...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Your Orders</h1>
        <div className={styles.controls}>
          <Link href="/dashboard" className={styles.backLink}>
            ← Back to Dashboard
          </Link>
        </div>
      </div>

      <div className={styles.filterBar}>
        <div className={styles.filterGroup}>
          <label htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
          >
            <option value="">All Statuses</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label htmlFor="dateFrom">From</label>
          <input
            type="date"
            id="dateFrom"
            name="dateFrom"
            value={filters.dateFrom}
            onChange={handleFilterChange}
          />
        </div>

        <div className={styles.filterGroup}>
          <label htmlFor="dateTo">To</label>
          <input
            type="date"
            id="dateTo"
            name="dateTo"
            value={filters.dateTo}
            onChange={handleFilterChange}
          />
        </div>

        <div className={styles.filterGroup}>
          <label htmlFor="sort">Sort By</label>
          <select
            id="sort"
            name="sort"
            value={filters.sort}
            onChange={handleFilterChange}
          >
            <option value="-placedAt">Newest First</option>
            <option value="placedAt">Oldest First</option>
            <option value="-totalPrice">Amount (High to Low)</option>
            <option value="totalPrice">Amount (Low to High)</option>
          </select>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className={styles.empty}>
          <p>No orders found</p>
          <Link href="/products" className={styles.shopLink}>
            Start Shopping
          </Link>
        </div>
      ) : (
        <>
          <div className={styles.ordersTable}>
            <div className={styles.tableHeader}>
              <div className={styles.colOrderId}>Order ID</div>
              <div className={styles.colDate}>Date</div>
              <div className={styles.colItems}>Items</div>
              <div className={styles.colTotal}>Total</div>
              <div className={styles.colStatus}>Status</div>
              <div className={styles.colAction}>Action</div>
            </div>

            {orders.map((order) => (
              <div key={order._id} className={styles.orderRow}>
                <div className={styles.colOrderId}>
                  <Link href={`/orders/${order._id}`} className={styles.orderLink}>
                    #{order._id.slice(-8).toUpperCase()}
                  </Link>
                </div>
                <div className={styles.colDate}>{formatDate(order.placedAt)}</div>
                <div className={styles.colItems}>
                  {order.products.length} item{order.products.length !== 1 ? 's' : ''}
                </div>
                <div className={styles.colTotal}>{formatCurrency(order.totalPrice)}</div>
                <div className={styles.colStatus}>
                  <span className={styles.statusBadge} data-status={order.orderStatus.toLowerCase()}>
                    {order.orderStatus}
                  </span>
                </div>
                <div className={styles.colAction}>
                  <Link href={`/orders/${order._id}`} className={styles.viewButton}>
                    View
                  </Link>
                  {order.orderStatus === 'Processing' && (
                    <button
                      className={styles.cancelButton}
                      onClick={() => router.push(`/orders/${order._id}/cancel`)}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className={styles.pagination}>
            <button
              disabled={pagination.page === 1}
              onClick={() => handlePageChange(pagination.page - 1)}
            >
              Previous
            </button>
            <span>
              Page {pagination.page} of {Math.ceil(pagination.total / pagination.limit)}
            </span>
            <button
              disabled={pagination.page >= Math.ceil(pagination.total / pagination.limit)}
              onClick={() => handlePageChange(pagination.page + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}