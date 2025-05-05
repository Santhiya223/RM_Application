import styles from './ProductsGrid.module.css';
import ProductCard from './ProductCard';

export default function ProductsGrid({ products, onAddToCart, onRemoveFromCart, cartItems }) {
  return (
    <div className={styles.productsGrid}>
      {products.map((product) => (
        <ProductCard 
          key={product._id} 
          product={product} 
          onRemoveFromCart = {onRemoveFromCart}
          onAddToCart={onAddToCart}
          cartItems={cartItems}
        />
      ))}
    </div>
  );
}