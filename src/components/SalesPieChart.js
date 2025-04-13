"use client";
import React from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";

const salesData = [
  { name: "Sold", value: 55, color: "#0088FE" },
  { name: "Delivering", value: 10, color: "#00C49F" },
  { name: "Canceled", value: 27, color: "#FFBB28" },
  { name: "Not Sold Yet", value: 8, color: "#AAAAAA" },
];

const SalesPieChart = () => {
  return (
    <PieChart width={200} height={200}>
      <Pie data={salesData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60}>
        {salesData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={entry.color} />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
  );
};

export default SalesPieChart;
