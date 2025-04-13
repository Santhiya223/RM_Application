"use client";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { useAuth } from "@/context/AuthContext";
import SalesPieChart from "./SalesPieChart";
import emptyProduct from '@/assets/images/products/empty.jpeg'

const salesData = [
  { name: "Sold", value: 55, color: "#0088FE" },
  { name: "Delivering", value: 10, color: "#00C49F" },
  { name: "Canceled", value: 27, color: "#FFBB28" },
  { name: "Not Sold Yet", value: 8, color: "#AAAAAA" },
];

export default function Dashboard() {
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(10);
   const  {logout}= useAuth();
  useEffect(() => { 
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        order_direction: "desc",
        order_key: "hosts_count",
        page,
        size: perPage,
      }).toString();

      const response = await fetch(`/api/products/fetchProducts?${params}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

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
  }, [page, perPage]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const addToCart = (product) => {
    setCart((prev) => [...prev, product]);
  };

  const removeFromCart = (index) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-1/5 bg-gray-100 p-4">
      <Image src='/images/logo1.jpeg' alt="Logo" width={96} height={96} className="rounded-lg" />
      
        <h2 className="text-xl font-bold">RM Snacks</h2>
        <ul className="mt-4 space-y-2">
          <li className="p-2 bg-red-500 text-white rounded">Dashboard</li>
          <li className="p-2 hover:bg-gray-300 rounded">Orders</li>
          <li className="p-2 hover:bg-gray-300 rounded">Products</li>
          <li className="p-2 hover:bg-gray-300 rounded">Settings</li>
          <li className="p-2 hover:bg-gray-300 rounded" onClick={logout}>Logout</li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="w-4/5 p-6">
        {/* Search Bar */}
        <input type="text" placeholder="Search..." className="w-full p-2 border rounded" />

        {/* Banner */}
        <div className="mt-4 p-6 bg-red-500 text-white text-lg font-bold rounded">
          Discount up to 30% OFF your first order every day!
        </div>

        {/* Products Grid */}
        <h2 className="mt-6 text-xl font-bold">Hot Pizza</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          {products.map((product) => (
            <div key={product._id} className="p-4 border rounded">
              <Image src={product.img || emptyProduct.src} alt={product.productName} className="w-full h-32 object-cover rounded"
               height={40}
               width={40} />
              <h3 className="mt-2">{product.productName}</h3>
              <p className="text-red-500">${product.price}</p>
              <button
                className="mt-2 p-2 bg-red-500 text-white rounded w-full"
                onClick={() => addToCart(product)}
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>

        {/* Right Panel */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Sales Chart */}
          <div className="p-4 border rounded">
            <h3 className="text-lg font-bold">Target Sells</h3>
            <SalesPieChart />
          </div>

          {/* Cart */}
          <div className="p-4 border rounded">
            <h3 className="text-lg font-bold">Cart</h3>
            {cart.map((item, index) => (
              <div key={index} className="flex justify-between p-2 border-b">
                <span>{item.name}</span>
                <button onClick={() => removeFromCart(index)} className="text-red-500">Remove</button>
              </div>
            ))}
            <button className="mt-4 p-2 bg-red-500 text-white rounded w-full">Pay Now</button>
          </div>
        </div>
      </div>
    </div>
  );
}

