"use client";
import styles from './CheckoutScreen.module.css';
import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import emptyProduct from '@/assets/images/products/empty.jpeg';
import bufferToBase64 from '@/utils/ImageHelper';
import Link from 'next/link';
import { useState } from 'react';

export default function CheckoutScreen() {
  const { cartItems, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    shippingAddress: {
      fullName: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      postalCode: '',
      country: 'India', // Default to India if that's your primary market
    },
    paymentMethod: 'Cash on Delivery',
  });

  const totalAmount = cartItems.reduce((sum, item) => {
    return sum + item.product.price * item.quantity;
  }, 0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested shippingAddress fields
    if (name.startsWith('shippingAddress.')) {
      const field = name.split('.')[1];
      setFormData({
        ...formData,
        shippingAddress: {
          ...formData.shippingAddress,
          [field]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleConfirmOrder = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Prepare order data according to your schema
      const orderData = {
        products: cartItems.map(item => ({
          product: item.product._id,
          quantity: item.quantity,
          price: item.product.price
        })),
        shippingAddress: formData.shippingAddress,
        paymentMethod: formData.paymentMethod,
        totalPrice: totalAmount,
      };

      // Call your API endpoint to create the order
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error('Failed to place order');
      }

      const result = await response.json();
      setOrderId(result.orderId);
      setOrderSuccess(true);
      clearCart(); // Clear the cart after successful order
    } catch (error) {
      console.error('Order submission error:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className={styles.successContainer}>
        <div className={styles.successCard}>
          <h2>Order Placed Successfully!</h2>
          <p>Your order ID is: <strong>{orderId}</strong></p>
          <p>Thank you for your purchase. We'll process your order shortly.</p>
          <div className={styles.successActions}>
            <Link href="/dashboard" className={styles.continueShopping}>
              Continue Shopping
            </Link>
            <Link href={`/orders/${orderId}`} className={styles.viewOrder}>
              View Order Details
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0 && !orderSuccess) {
    return (
      <div className={styles.emptyContainer}>
        <h2>Your cart is empty</h2>
        <p>Looks like you haven't added any items to your cart yet.</p>
        <Link href="/dashboard" className={styles.continueShopping}>
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.checkoutPage}>
      <div className={styles.checkoutContainer}>
        <div className={styles.checkoutHeader}>
          <h1>Checkout</h1>
          <div className={styles.steps}>
            <span className={styles.activeStep}>1. Shipping</span>
            <span>2. Payment</span>
            <span>3. Confirmation</span>
          </div>
        </div>

        <form onSubmit={handleConfirmOrder} className={styles.checkoutForm}>
          <div className={styles.formSection}>
            <h2>Shipping Information</h2>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label htmlFor="fullName">Full Name</label>
                <input
                  type="text"
                  id="fullName"
                  name="shippingAddress.fullName"
                  value={formData.shippingAddress.fullName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="addressLine1">Address Line 1</label>
                <input
                  type="text"
                  id="addressLine1"
                  name="shippingAddress.addressLine1"
                  value={formData.shippingAddress.addressLine1}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="addressLine2">Address Line 2 (Optional)</label>
                <input
                  type="text"
                  id="addressLine2"
                  name="shippingAddress.addressLine2"
                  value={formData.shippingAddress.addressLine2}
                  onChange={handleInputChange}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="city">City</label>
                <input
                  type="text"
                  id="city"
                  name="shippingAddress.city"
                  value={formData.shippingAddress.city}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="postalCode">Postal Code</label>
                <input
                  type="text"
                  id="postalCode"
                  name="shippingAddress.postalCode"
                  value={formData.shippingAddress.postalCode}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="country">Country</label>
                <select
                  id="country"
                  name="shippingAddress.country"
                  value={formData.shippingAddress.country}
                  onChange={handleInputChange}
                  required
                >
                  <option value="India">India</option>
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Canada">Canada</option>
                  <option value="Australia">Australia</option>
                </select>
              </div>
            </div>
          </div>

          <div className={styles.formSection}>
            <h2>Payment Method</h2>
            <div className={styles.paymentMethods}>
              <label className={styles.paymentMethod}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="Cash on Delivery"
                  checked={formData.paymentMethod === 'Cash on Delivery'}
                  onChange={handleInputChange}
                />
                <span>Cash on Delivery</span>
              </label>

              <label className={styles.paymentMethod}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="Credit Card"
                  checked={formData.paymentMethod === 'Credit Card'}
                  onChange={handleInputChange}
                />
                <span>Credit Card</span>
              </label>

              <label className={styles.paymentMethod}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="PayPal"
                  checked={formData.paymentMethod === 'PayPal'}
                  onChange={handleInputChange}
                />
                <span>PayPal</span>
              </label>
            </div>
          </div>

          <div className={styles.orderSummary}>
            <h2>Order Summary</h2>
            <div className={styles.itemsList}>
              {cartItems.map(({ product, quantity }) => (
                <div key={product._id} className={styles.orderItem}>
                  <div className={styles.itemImageContainer}>
                    <Image
                      src={bufferToBase64(product.image) || emptyProduct.src}
                      alt={product.productName}
                      width={80}
                      height={80}
                      className={styles.itemImage}
                    />
                    <span className={styles.quantityBadge}>{quantity}</span>
                  </div>
                  <div className={styles.itemDetails}>
                    <h4>{product.productName}</h4>
                    <p>₹{product.price.toFixed(2)} each</p>
                  </div>
                  <div className={styles.itemPrice}>
                    ₹{(product.price * quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.summaryTotals}>
              <div className={styles.totalLine}>
                <span>Subtotal</span>
                <span>₹{totalAmount.toFixed(2)}</span>
              </div>
              <div className={styles.totalLine}>
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className={styles.totalLine}>
                <span>Tax</span>
                <span>₹0.00</span>
              </div>
              <div className={styles.grandTotal}>
                <span>Total</span>
                <span>₹{totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <button
              type="submit"
              className={styles.placeOrderButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Placing Order...' : 'Place Order'}
            </button>

            <Link href="/cart" className={styles.backToCart}>
              ← Back to Cart
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}