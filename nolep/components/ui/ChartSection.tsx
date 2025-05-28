"use client";
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useUser } from "@clerk/nextjs";

export default function ChartSection() {
  const [barData, setBarData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // Updated type here
  const { user } = useUser();

  useEffect(() => {
    async function fetchData() {
      if (!user?.id) return;

      try {
        setLoading(true);
        const res = await fetch(`/api/status/weekly?userId=${user.id}`);

        if (!res.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await res.json();
        setBarData(data);
      } catch (err) {
        console.error("Error fetching weekly data:", err);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [user?.id]);

  if (loading)
    return <div className="text-center p-8">Loading chart data...</div>;
  if (error)
    return <div className="text-center p-8 text-red-500">Error: {error}</div>;

  return (
    <div className="flex flex-col items-center mt-20 w-full max-w-4xl mx-auto">
      <h2 className="text-lg font-semibold mb-4">
        Weekly Drowsiness Alert History
      </h2>
      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip
              contentStyle={{ backgroundColor: "#fff", borderRadius: "4px" }}
              formatter={(value) => [`${value} alerts`, "Drowsiness"]}
              labelFormatter={(label) => `Day: ${label}`}
            />
            <Bar
              dataKey="alerts"
              fill="#FFB800"
              radius={[4, 4, 0, 0]}
              name="Drowsiness Alerts"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
