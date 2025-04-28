import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export default function Alerts() {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState([]);
  const [indices, setIndices] = useState([]);
  const [newAlert, setNewAlert] = useState({
    symbol: "",
    threshold: "",
    direction: "above" | "below",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [indicesData, alertsData] = await Promise.all([
          api.getIndices(),
          api.getAlerts(),
        ]);
        setIndices(indicesData.data);
        setAlerts(alertsData.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const createdAlert = await api.createAlert({
        ...newAlert,
        threshold: parseFloat(newAlert.threshold),
      });
      setAlerts((prev) => [...prev, createdAlert.data]);
      setNewAlert({
        symbol: "",
        threshold: "",
        direction: "above",
      });
    } catch (error) {
      console.error("Error creating alert:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.deleteAlert(id);
      setAlerts((prev) => prev.filter((alert) => alert.id !== id));
    } catch (error) {
      console.error("Error deleting alert:", error);
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
                <h2 className="text-xl font-semibold mb-4 text-gray-800">
                  Create New Alert
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="symbol"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Index
                    </label>
                    <select
                      id="symbol"
                      name="symbol"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newAlert.symbol}
                      onChange={(e) =>
                        setNewAlert({ ...newAlert, symbol: e.target.value })
                      }
                      required
                    >
                      <option value="">Select an index</option>
                      {indices.map((index) => (
                        <option key={index.symbol} value={index.symbol}>
                          {index.name} ({index.symbol})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="threshold"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Threshold Price
                    </label>
                    <input
                      type="number"
                      id="threshold"
                      name="threshold"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newAlert.threshold}
                      onChange={(e) =>
                        setNewAlert({ ...newAlert, threshold: e.target.value })
                      }
                      step="0.01"
                      min="0"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Direction
                    </label>
                    <div className="flex gap-4">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="direction"
                          value="above"
                          checked={newAlert.direction === "above"}
                          onChange={() =>
                            setNewAlert({ ...newAlert, direction: "above" })
                          }
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="ml-2">Price above threshold</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="direction"
                          value="below"
                          checked={newAlert.direction === "below"}
                          onChange={() =>
                            setNewAlert({ ...newAlert, direction: "below" })
                          }
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="ml-2">Price below threshold</span>
                      </label>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {loading ? "Creating..." : "Create Alert"}
                  </button>
                </form>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">
                  Your Alerts
                </h2>
                {alerts.length === 0 ? (
                  <p className="text-gray-500">No alerts set up yet.</p>
                ) : (
                  <ul className="divide-y divide-gray-200">
                    {alerts.map((alert) => {
                      const index = indices.find(
                        (i) => i.symbol === alert.symbol
                      );
                      return (
                        <li
                          key={alert.id}
                          className="py-4 flex justify-between items-center"
                        >
                          <div>
                            <p className="font-medium text-gray-800">
                              {index ? index.name : alert.symbol} (
                              {alert.symbol})
                            </p>
                            <p className="text-sm text-gray-600">
                              Alert when price is {alert.direction}{" "}
                              {alert.threshold.toFixed(2)}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              Created:{" "}
                              {new Date(alert.createdAt).toLocaleString()}
                            </p>
                          </div>
                          <button
                            onClick={() => handleDelete(alert.id)}
                            className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm"
                          >
                            Delete
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
