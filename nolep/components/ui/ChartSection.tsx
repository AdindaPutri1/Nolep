"use client"; 
import { PieChart, Pie, Cell, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

const pieData = [
    { name: "Awake", value: 41.7 },
    { name: "Asleep", value: 29.8 },
    { name: "Distracted", value: 28.5 },
];

const COLORS = ["#FFD700", "#FFB800", "#1D1D1D"];

const barData = [
    { day: "Monday", alerts: 1 },
    { day: "Tuesday", alerts: 2 },
    { day: "Wednesday", alerts: 2 },
    { day: "Thursday", alerts: 3 },
    { day: "Friday", alerts: 2 },
    { day: "Saturday", alerts: 2 },
    { day: "Sunday", alerts: 1 },
];

export default function ChartSection() {
    return (
        <div className="grid grid-cols-2 md:grid-cols-2 gap-8 mt-20">
            {/* Pie Chart */}
            <div className="flex flex-col items-center">
                <h2 className="text-lg font-semibold mb-4">Weekly Scores</h2>
                <PieChart width={400} height={400}>
                    <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label
                    >
                        {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Legend />
                </PieChart>
            </div>

            {/* Bar Chart */}
            <div className="flex flex-col items-center">
                <h2 className="text-lg font-semibold mb-4">Weekly Drowsiness Alert History</h2>
                <BarChart width={420} height={360} data={barData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="alerts" fill="#FFB800" />
                </BarChart>
            </div>
        </div>
    );
}
