"use client";
import Image from "next/image";
import emptyProduct from '@/assets/images/products/empty.jpeg';
import bufferToBase64 from "@/utils/ImageHelper";
import styles from './ProductCard.module.css';

export default function ProductCard({ product, onAddToCart, onRemoveFromCart, cartItems }) {
  const cartItem = cartItems.find(item => item.product._id === product._id);
  const isInCart = !!cartItem;
  const quantity = cartItem?.quantity || 1;

  const handleAddToCart = async () => {
    await onAddToCart(product, 1); // default add 1
  };

  const handleQuantityChange = async (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= 10) {
      await onAddToCart(product, newQuantity); // same handler for updating quantity
    }
  };

  const handleRemoveItem = async () => {
    await onRemoveFromCart(product._id);
  };

  return (
    <div className={styles.productCard}>
      <div className={styles.imageContainer}>
        <Image
          src={bufferToBase64(product.image) || emptyProduct.src}
          alt={product.productName}
          className={styles.productImage}
          width={250}
          height={250}
          objectFit="cover"
        />
      </div>

      <div className={styles.productDetails}>
        <h3 className={styles.productName}>{product.productName}</h3>
        <p className={styles.productPrice}>₹{product.price}</p>

        {isInCart ? (
          <div className={styles.quantityControls}>
            {quantity === 1 ? (
              <button className={styles.deleteButton} onClick={handleRemoveItem}>
                {/* trash icon */}
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                  <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                </svg>
              </button>
            ) : (
              <button 
                className={styles.quantityButton}
                onClick={() => handleQuantityChange(quantity - 1)}
              >
                −
              </button>
            )}
            <span className={styles.quantityDisplay}>{quantity}</span>
            <button 
              className={styles.quantityButton}
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={quantity >= 10}
            >
              +
            </button>
          </div>
        ) : (
          <button className={styles.addToCartButton} onClick={handleAddToCart}>
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );
}
