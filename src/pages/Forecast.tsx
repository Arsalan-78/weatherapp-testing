import React, { useState, useEffect } from 'react';
import { SearchBar } from '../components/SearchBar';
import { ForecastCard } from '../components/ForecastCard';
import { getForecast, getHourlyForecast } from '../services/weatherApi';
import { Calendar, Clock } from 'lucide-react';

interface ForecastData {
  date: string;
  high: number;
  low: number;
  condition: string;
  icon: string;
  precipitation: number;
}

interface HourlyData {
  time: string;
  temp: number;
  condition: string;
  icon: string;
}

export const Forecast: React.FC = () => {
  const [forecast, setForecast] = useState<ForecastData[]>([]);
  const [hourlyForecast, setHourlyForecast] = useState<HourlyData[]>([]);
  const [selectedCity, setSelectedCity] = useState('London');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'daily' | 'hourly'>('daily');

  const fetchForecastData = async (city: string) => {
    setLoading(true);
    try {
      const [dailyData, hourlyData] = await Promise.all([
        getForecast(city),
        getHourlyForecast(city)
      ]);
      
      setForecast(dailyData);
      setHourlyForecast(hourlyData);
    } catch (error) {
      console.error('Failed to fetch forecast data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForecastData(selectedCity);
  }, [selectedCity]);

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center text-white">
        <h1 className="text-4xl font-bold mb-4" data-testid="forecast-page-title">Extended Forecast</h1>
        <p className="text-xl text-white/80">Detailed weather predictions for {selectedCity}</p>
      </div>

      {/* Search Bar */}
      <div className="flex justify-center">
        <SearchBar onCitySelect={handleCitySelect} />
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center">
        <div className="bg-white/20 backdrop-blur-md rounded-xl p-1 border border-white/30">
          <button
            onClick={() => setActiveTab('daily')}
            className={`px-6 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 ${
              activeTab === 'daily' 
                ? 'bg-white/30 text-white' 
                : 'text-white/70 hover:text-white'
            }`}
            data-testid="daily-tab"
          >
            <Calendar className="h-4 w-4" />
            Daily
          </button>
          <button
            onClick={() => setActiveTab('hourly')}
            className={`px-6 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 ${
              activeTab === 'hourly' 
                ? 'bg-white/30 text-white' 
                : 'text-white/70 hover:text-white'
            }`}
            data-testid="hourly-tab"
          >
            <Clock className="h-4 w-4" />
            Hourly
          </button>
        </div>
      </div>

      {/* Daily Forecast */}
      {activeTab === 'daily' && (
        <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 border border-white/30">
          <h3 className="text-xl font-semibold text-white mb-6">5-Day Daily Forecast</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
            {forecast.map((day, index) => (
              <ForecastCard
                key={index}
                date={day.date}
                high={day.high}
                low={day.low}
                condition={day.condition}
                icon={day.icon}
                precipitation={day.precipitation}
              />
            ))}
          </div>
        </div>
      )}

      {/* Hourly Forecast */}
      {activeTab === 'hourly' && (
        <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 border border-white/30">
          <h3 className="text-xl font-semibold text-white mb-6">Today's Hourly Forecast</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
            {hourlyForecast.map((hour, index) => (
              <div 
                key={index}
                className="bg-white/20 backdrop-blur-md rounded-xl p-4 border border-white/30 text-center"
                data-testid={`hourly-${index}`}
              >
                <div className="text-white/80 text-sm mb-2">{hour.time}</div>
                <div className="text-2xl font-bold text-white mb-2">{hour.temp}°C</div>
                <div className="text-white text-sm">{hour.condition}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};