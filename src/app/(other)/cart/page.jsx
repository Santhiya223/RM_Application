"use client";
import styles from './CartScreen.module.css';
import Image from "next/image";
import emptyProduct from '@/assets/images/products/empty.jpeg';
import bufferToBase64 from "@/utils/ImageHelper";
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CartScreen() {
  const { addToCart, removeFromCart, cartItems } = useCart();
  const router = useRouter();

  const handleQuantityChange = async (product, newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= 10) {
      await addToCart(product, newQuantity);
    }
  };

  const handleRemove = async (productId) => {
    await removeFromCart(productId);
  };

  const totalAmount = cartItems.reduce((total, item) => {
    return total + item.product.price * item.quantity;
  }, 0);

  return (
    <div className={styles.cartScreen}>
      <Link href="/dashboard" className={styles.backLink}>
        ← Back to Dashboard
      </Link>

      <h2 className={styles.heading}>Shopping Cart</h2>

      {cartItems.length === 0 ? (
        <p className={styles.emptyCart}>Your cart is empty.</p>
      ) : (
        <div className={styles.cartList}>
          {cartItems.map(({ product, quantity }) => (
            <div key={product._id} className={styles.cartItem}>
              <Image
                src={bufferToBase64(product.image) || emptyProduct.src}
                alt={product.productName}
                width={80}
                height={80}
                className={styles.cartImage}
              />
              <div className={styles.cartInfo}>
                <h4>{product.productName}</h4>
                <p>₹{product.price}</p>
                <div className={styles.quantityControls}>
                  {quantity === 1 ? (
                    <button onClick={() => handleRemove(product._id)}>🗑</button>
                  ) : (
                    <button onClick={() => handleQuantityChange(product, quantity - 1)}>−</button>
                  )}
                  <span>{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(product, quantity + 1)}
                    disabled={quantity >= 10}
                  >
                    +
                  </button>
                </div>
              </div>
              <div className={styles.itemTotal}>₹{product.price * quantity}</div>
            </div>
          ))}
        </div>
      )}

      {cartItems.length > 0 && (
        <div className={styles.summary}>
          <div className={styles.total}>
            <span>Total:</span>
            <span>₹{totalAmount.toFixed(2)}</span>
          </div>
          <button className={styles.checkoutButton} onClick={()=>{router.push('/checkout')}}>Proceed to Checkout</button>
        </div>
      )}
    </div>
  );
}
