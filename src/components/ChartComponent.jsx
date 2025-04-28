import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function ChartComponent({ data, title }) {
  const chartData = {
    labels: data.t.map((timestamp) =>
      new Date(timestamp * 1000).toLocaleDateString()
    ),
    datasets: [
      {
        label: "Closing Price",
        data: data.c,
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        tension: 0.1,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: title,
        font: {
          size: 16,
        },
      },
    },
  };

  return (
    <div className="h-96 w-full bg-white p-4 rounded-lg shadow">
      <Line data={chartData} options={options} />
    </div>
  );
}
