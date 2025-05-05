"use client";
import styles from './OrderDetails.module.css';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import emptyProduct from '@/assets/images/products/empty.jpeg';
import bufferToBase64 from '@/utils/ImageHelper';
import Link from 'next/link';

export default function OrderDetails({ params }) {
  const router = useRouter();
  const { orderId } = params;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${orderId}`);
        if (!response.ok) throw new Error('Failed to fetch order');
        const data = await response.json();
        setOrder(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) return <div className={styles.loading}>Loading order details...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;
  if (!order) return <div className={styles.notFound}>Order not found</div>;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Order Details</h1>
        <Link href="/orders" className={styles.backLink}>
          ← Back to Orders
        </Link>
      </div>

      <div className={styles.orderSummary}>
        <div className={styles.orderHeader}>
          <div>
            <h2>Order #{order._id}</h2>
            <p className={styles.orderDate}>Placed on {formatDate(order.placedAt)}</p>
          </div>
          <div className={styles.statusBadge} data-status={order.orderStatus.toLowerCase()}>
            {order.orderStatus}
          </div>
        </div>

        <div className={styles.gridLayout}>
          {/* Order Items Section */}
          <div className={styles.orderItems}>
            <h3>Items</h3>
            <div className={styles.itemsList}>
              {order.products.map((item) => (
                <div key={item.product._id} className={styles.item}>
                  <div className={styles.itemImage}>
                    <Image
                      src={bufferToBase64(item.product.image) || emptyProduct.src}
                      alt={item.product.productName}
                      width={80}
                      height={80}
                    />
                  </div>
                  <div className={styles.itemDetails}>
                    <h4>{item.product.productName}</h4>
                    <p>Quantity: {item.quantity}</p>
                    <p>Price: ₹{item.price.toFixed(2)} each</p>
                  </div>
                  <div className={styles.itemTotal}>
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping & Payment Info */}
          <div className={styles.infoSections}>
            <div className={styles.shippingInfo}>
              <h3>Shipping Address</h3>
              <div className={styles.addressBlock}>
              <address>
                <p>{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.addressLine1}</p>
                {order.shippingAddress.addressLine2 && (
                  <p>{order.shippingAddress.addressLine2}</p>
                )}
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                </p>
                <p>{order.shippingAddress.country}</p>
              </address>
              </div>
            </div>

            <div className={styles.paymentInfo}>
              <h3>Payment Information</h3>
              <p>
                <strong>Method:</strong> {order.paymentMethod}
              </p>
              <p>
                <strong>Status:</strong> <span className={styles.paymentStatus}>{order.paymentStatus}</span>
              </p>
              {order.paymentMethod === 'Credit Card' && order.paymentDetails && (
                <p>
                  <strong>Card:</strong> **** **** **** {order.paymentDetails.last4}
                </p>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className={styles.orderTotals}>
            <h3>Order Summary</h3>
            <div className={styles.totalsGrid}>
              <div className={styles.totalRow}>
                <span>Subtotal</span>
                <span>₹{order.totalPrice.toFixed(2)}</span>
              </div>
              <div className={styles.totalRow}>
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className={styles.totalRow}>
                <span>Tax</span>
                <span>₹0.00</span>
              </div>
              <div className={`${styles.totalRow} ${styles.grandTotal}`}>
                <span>Total</span>
                <span>₹{order.totalPrice.toFixed(2)}</span>
              </div>
            </div>

            {order.orderStatus === 'Processing' && (
              <button
                className={styles.cancelButton}
                onClick={() => router.push(`/orders/${orderId}/cancel`)}
              >
                Cancel Order
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}