"use client";
import { useState, useEffect, useCallback } from "react";
import MainLayout from "@/components/layout/MainLayout";
import HeroBanner from "@/components/HeroBanner";
import ProductsGrid from "@/components/products/ProductsGrid";
import { useCart } from "@/context/CartContext";

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const { cartItems, cartCount, addToCart, removeFromCart, fetchCart } = useCart();

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        order_direction: "desc",
        order_key: "hosts_count",
        page,
        size: perPage,
        search: searchQuery,
      }).toString();

      const response = await fetch(`/api/products/fetchProducts?${params}`);
      if (response.ok) {
        const data = await response.json();
        setProducts(data?.data || []);
        setTotalRecords(data?.totalItems || 0);
      }
    } catch (ex) {
      console.error("Error fetching products:", ex);
    } finally {
      setLoading(false);
    }
  }, [page, perPage, searchQuery]);

  useEffect(() => {
    fetchProducts();
    fetchCart();
  }, [fetchProducts, fetchCart]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setPage(0); // Reset page to 0 on new search
  };

  return (
    <MainLayout cartCount={cartCount} onSearch={handleSearch}>
      <HeroBanner />
      <div className="section">
        {/* <h2 className="sectionTitle">Featured Products</h2> */}
        {loading ? (
          <div className="loadingSpinner">Loading...</div>
        ) : (
          <ProductsGrid 
            products={products} 
            onAddToCart={addToCart}
            onRemoveFromCart={removeFromCart}
            cartItems={cartItems}
          />
        )}
      </div>
    </MainLayout>
  );
}
