import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);


export default function Stats() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [timeframe, setTimeframe] = useState('daily');

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const response = await api.getStats();
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Mock data for demonstration
  const mockUsageData = {
    hourly: [12, 19, 8, 15, 22, 17, 25, 12, 19, 8, 15, 22],
    daily: [85, 92, 78, 95, 88, 102, 115],
    weekly: [520, 580, 610, 550, 590]
  };

  const chartData = {
    labels: timeframe === 'hourly' 
      ? Array.from({length: 12}, (_, i) => `${i+6}AM - ${i+7}AM`)
      : timeframe === 'daily' 
        ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        : ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'],
    datasets: [
      {
        label: 'API Requests',
        data: mockUsageData[timeframe],
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `API Requests (${timeframe})`,
      },
    },
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Sidebar />
            
            <div className="md:col-span-3 space-y-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h1 className="text-2xl font-bold mb-6 text-gray-800">API Usage Statistics</h1>
                
                {loading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                ) : stats ? (
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <p className="text-sm text-blue-600 font-medium">Total Requests</p>
                        <p className="text-3xl font-bold text-blue-800">{stats.requests}</p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                        <p className="text-sm text-green-600 font-medium">Last Updated</p>
                        <p className="text-xl font-semibold text-green-800">
                          {new Date(stats.lastUpdated).toLocaleString()}
                        </p>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                        <p className="text-sm text-purple-600 font-medium">Current Rate</p>
                        <p className="text-2xl font-bold text-purple-800">
                          ~{Math.round(stats.requests / 30)} req/day
                        </p>
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold text-gray-800">Request Trends</h2>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setTimeframe('hourly')}
                            className={`px-3 py-1 text-sm rounded-md ${
                              timeframe === 'hourly'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            Hourly
                          </button>
                          <button
                            onClick={() => setTimeframe('daily')}
                            className={`px-3 py-1 text-sm rounded-md ${
                              timeframe === 'daily'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            Daily
                          </button>
                          <button
                            onClick={() => setTimeframe('weekly')}
                            className={`px-3 py-1 text-sm rounded-md ${
                              timeframe === 'weekly'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            Weekly
                          </button>
                        </div>
                      </div>
                      <div className="h-80">
                        <Bar data={chartData} options={chartOptions} />
                      </div>
                    </div>

                  </div>
                ) : (
                  <div className="flex justify-center items-center h-64 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">Failed to load statistics</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}