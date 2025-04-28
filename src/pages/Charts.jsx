import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import ChartComponent from "../components/ChartComponent";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export default function Charts() {
  const { user } = useAuth();
  const [indices, setIndices] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [historicalData, setHistoricalData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [days, setDays] = useState(30);

  useEffect(() => {
    const fetchIndices = async () => {
      try {
        const response = await api.getIndices();
        setIndices(response.data);
      } catch (error) {
        console.error("Error fetching indices:", error);
      }
    };

    fetchIndices();
  }, []);

  const fetchHistoricalData = async (symbol) => {
    setLoading(true);
    try {
      const to = Math.floor(Date.now() / 1000);
      const from = to - days * 24 * 60 * 60;

      const response = await api.getHistoricalData(
        symbol,
        from.toString(),
        to.toString()
      );
      if (response.data.s === "ok") {
        setHistoricalData(response.data);
      }
    } catch (error) {
      console.error("Error fetching historical data:", error);
    } finally {
      setLoading(false);
    }
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
                <div className="flex flex-wrap gap-4 items-center">
                  <div className="flex-1 min-w-[200px]">
                    <label
                      htmlFor="index-select"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Select Index
                    </label>
                    <select
                      id="index-select"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={selectedIndex?.symbol || ""}
                      onChange={(e) => {
                        const index = indices.find(
                          (i) => i.symbol === e.target.value
                        );
                        if (index) {
                          setSelectedIndex(index);
                          fetchHistoricalData(index.symbol);
                        }
                      }}
                    >
                      <option value="">Select an index</option>
                      {indices.map((index) => (
                        <option key={index.symbol} value={index.symbol}>
                          {index.name} ({index.symbol})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex-1 min-w-[150px]">
                    <label
                      htmlFor="days-select"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Time Period
                    </label>
                    <select
                      id="days-select"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={days}
                      onChange={(e) => {
                        setDays(Number(e.target.value));
                        if (selectedIndex) {
                          fetchHistoricalData(selectedIndex.symbol);
                        }
                      }}
                    >
                      <option value="7">7 days</option>
                      <option value="30">30 days</option>
                      <option value="90">90 days</option>
                      <option value="180">180 days</option>
                      <option value="365">1 year</option>
                    </select>
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="flex justify-center items-center h-64 bg-white rounded-lg shadow">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : historicalData && selectedIndex ? (
                <ChartComponent
                  data={historicalData}
                  title={`${selectedIndex.name} (${selectedIndex.symbol}) - Last ${days} Days`}
                />
              ) : (
                <div className="bg-white p-6 rounded-lg shadow flex justify-center items-center h-64">
                  <p className="text-gray-500">
                    Select an index to view its chart
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
