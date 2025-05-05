import styles from './HeroBanner.module.css';

export default function HeroBanner() {
  return (
    <div className={styles.heroBanner}>
      <div className={styles.heroContent}>
        <h1>Discount up to 30% OFF</h1>
        <p>Your first order every day!</p>
        <button className={styles.shopNowButton}>Shop Now</button>
      </div>
    </div>
  );
}