import { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import api from '@/core/api/axios';
import { WeatherData } from '@/shared/types';
import { Navbar } from '@/shared/components/Navbar';

export function DashboardPage() {
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWeatherData();
  }, []);

  const fetchWeatherData = async () => {
    try {
      setLoading(true);
      const response = await api.get<WeatherData[]>('/weather?limit=50');
      setWeatherData(response.data);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format: 'csv' | 'xlsx') => {
    try {
      const response = await api.get(`/weather/export?format=${format}`, {
        responseType: 'blob',
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `weather-data.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Erro ao exportar:', error);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </>
    );
  }

  const latestWeather = weatherData[0];
  const chartData = weatherData.slice(0, 20).reverse().map(item => ({
    time: format(new Date(item.timestamp), 'HH:mm'),
    temperatura: item.temperature,
    umidade: item.humidity,
    vento: item.windSpeed,
  }));

  const avgTemp = weatherData.reduce((sum, d) => sum + d.temperature, 0) / weatherData.length;
  const avgHumidity = weatherData.reduce((sum, d) => sum + d.humidity, 0) / weatherData.length;
  const avgWind = weatherData.reduce((sum, d) => sum + d.windSpeed, 0) / weatherData.length;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1">Monitoramento climático de Salvador, BA</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleExport('csv')}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Exportar CSV
              </button>
              <button
                onClick={() => handleExport('xlsx')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Exportar Excel
              </button>
            </div>
          </div>

          {/* Current Weather Cards */}
          {latestWeather && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Temperatura</p>
                    <p className="text-3xl font-bold text-gray-900">{latestWeather.temperature.toFixed(1)}°C</p>
                    <p className="text-xs text-gray-500 mt-1">Média: {avgTemp.toFixed(1)}°C</p>
                  </div>
                  <div className="text-4xl">🌡️</div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Umidade</p>
                    <p className="text-3xl font-bold text-gray-900">{latestWeather.humidity}%</p>
                    <p className="text-xs text-gray-500 mt-1">Média: {avgHumidity.toFixed(0)}%</p>
                  </div>
                  <div className="text-4xl">💧</div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Vento</p>
                    <p className="text-3xl font-bold text-gray-900">{latestWeather.windSpeed.toFixed(1)} km/h</p>
                    <p className="text-xs text-gray-500 mt-1">Média: {avgWind.toFixed(1)} km/h</p>
                  </div>
                  <div className="text-4xl">💨</div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Condição</p>
                    <p className="text-lg font-bold text-gray-900">{latestWeather.condition}</p>
                    <p className="text-xs text-gray-500 mt-1">{format(new Date(latestWeather.timestamp), 'HH:mm')}</p>
                  </div>
                  <div className="text-4xl">☁️</div>
                </div>
              </div>
            </div>
          )}

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Temperature Chart */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Temperatura (últimas horas)</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="temperatura" stroke="#ef4444" strokeWidth={2} name="Temperatura (°C)" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Humidity Chart */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Umidade (últimas horas)</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="umidade" stroke="#3b82f6" strokeWidth={2} name="Umidade (%)" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Wind Speed Chart */}
            <div className="bg-white p-6 rounded-lg shadow lg:col-span-2">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Velocidade do Vento</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="vento" fill="#10b981" name="Vento (km/h)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
