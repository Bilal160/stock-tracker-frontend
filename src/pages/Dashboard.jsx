import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import IndexCard from '../components/IndexCard';

export default function Dashboard() {
  const { user } = useAuth();
  const [indices, setIndices] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [indexData, setIndexData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchIndices = async () => {
        try {
            const response = await api.getIndices();
            setIndices(response.data);
      } catch (error) {
        console.error('Error fetching indices:', error);
      }
    };

    fetchIndices();
  }, []);

  const fetchIndexData = async (symbol) => {
    console.log("🚀 ~ fetchIndexData ~ symbol:", symbol)
    setLoading(true);
    try {
      const response = await api.getIndexData(symbol);
      setIndexData(response.data);
    } catch (error) {
      console.error('Error fetching index data:', error);
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {indices.map((index) => (
                  <IndexCard
                    key={index.symbol}
                    index={index}
                    isSelected={selectedIndex?.symbol === index.symbol}
                    onClick={() => {
                      setSelectedIndex(index);
                      fetchIndexData(index.symbol);
                    }}
                  />
                ))}
              </div>
              
              {selectedIndex && (
                <div className="bg-white p-6 rounded-lg shadow">
                  <h2 className="text-xl font-semibold mb-4 text-gray-800">
                    {selectedIndex.name} ({selectedIndex.symbol})
                  </h2>
                  
                  {loading ? (
                    <div className="flex justify-center items-center h-32">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                  ) : indexData ? (
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div className="bg-gray-50 p-3 rounded">
                          <p className="text-sm text-gray-500">Current</p>
                          <p className="text-lg font-medium">{indexData?.c?.toFixed(2)}</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded">
                          <p className="text-sm text-gray-500">High</p>
                          <p className="text-lg font-medium">{indexData?.h?.toFixed(2)}</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded">
                          <p className="text-sm text-gray-500">Low</p>
                          <p className="text-lg font-medium">{indexData?.l?.toFixed(2)}</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="bg-gray-50 p-3 rounded">
                          <p className="text-sm text-gray-500">Open</p>
                          <p className="text-lg font-medium">{indexData?.o?.toFixed(2)}</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded">
                          <p className="text-sm text-gray-500">Previous Close</p>
                          <p className="text-lg font-medium">{indexData?.pc?.toFixed(2)}</p>
                        </div>
                        <div className={`p-3 rounded ${
                          indexData.d >= 0 ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                        }`}>
                          <p className="text-sm">Change</p>
                          <p className="text-lg font-medium">
                            {indexData?.d?.toFixed(2)} ({indexData?.dp?.toFixed(2)}%)
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500">No data available</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}