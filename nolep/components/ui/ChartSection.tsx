"use client";
import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

export default function ChartSection() {
  const [barData, setBarData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/api/status/weekly");
      const data = await res.json();
      setBarData(data);
    }

    fetchData();
  }, []);

  return (
    <div className="flex flex-col items-center mt-20">
      <h2 className="text-lg font-semibold mb-4">
        Weekly Drowsiness Alert History
      </h2>
      <BarChart width={420} height={360} data={barData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="alerts" fill="#FFB800" />
      </BarChart>
    </div>
  );
}
