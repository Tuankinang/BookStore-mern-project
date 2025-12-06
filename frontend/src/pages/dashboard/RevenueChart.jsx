// src/components/RevenueChart.jsx
import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const RevenueChart = ({ data: monthlyData }) => {
  const revenueData =
    Array.isArray(monthlyData) && monthlyData.length === 12
      ? monthlyData
      : [500, 700, 800, 600, 750, 900, 650, 870, 960, 1020, 1100, 1150];

  const data = {
    labels: [
      "Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec",
    ],
    datasets: [
      {
        label: "Revenue (USD)",
        data: revenueData,
        backgroundColor: "rgba(34, 197, 94, 0.7)",
        borderColor: "rgba(34, 197, 94, 1)",
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, 
    plugins: {
      legend: { display: false },
      title: {
        display: false, 
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: "rgba(0,0,0,0.06)" },
      },
      x: {
        grid: { display: false },
      },
    },
  };

  return (
    <div className="w-full h-full">
      <Bar data={data} options={options} />
    </div>
  );
};

export default RevenueChart;
