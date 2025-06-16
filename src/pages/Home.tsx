import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { WeatherCard } from '../components/WeatherCard';
import { SearchBar } from '../components/SearchBar';
import { ForecastCard } from '../components/ForecastCard';
import { getCurrentWeather, getForecast } from '../services/weatherApi';
import { MapPin, RefreshCw } from 'lucide-react';

interface WeatherData {
  city: string;
  country: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  pressure: number;
  visibility: number;
  uvIndex: number;
  icon: string;
}

interface ForecastData {
  date: string;
  high: number;
  low: number;
  condition: string;
  icon: string;
  precipitation: number;
}

export const Home: React.FC = () => {
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData[]>([]);
  const [selectedCity, setSelectedCity] = useState('London');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchWeatherData = async (city: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const [weatherData, forecastData] = await Promise.all([
        getCurrentWeather(city),
        getForecast(city)
      ]);
      
      setCurrentWeather(weatherData);
      setForecast(forecastData);
    } catch (err) {
      setError('Failed to fetch weather data. Please try again.');
      console.error('Weather data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherData(selectedCity);
  }, [selectedCity]);

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
  };

  const handleWeatherCardClick = () => {
    navigate(`/city/${selectedCity}`);
  };

  const handleRefresh = () => {
    fetchWeatherData(selectedCity);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-white" data-testid="error-message">
        <p className="text-xl mb-4">{error}</p>
        <button 
          onClick={handleRefresh}
          className="bg-white/20 hover:bg-white/30 px-6 py-2 rounded-lg transition-colors duration-200"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center text-white">
        <h1 className="text-4xl font-bold mb-4" data-testid="page-title">Weather Dashboard</h1>
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            <span data-testid="city-name">{currentWeather?.city}</span>
          </div>
          <button
            onClick={handleRefresh}
            className="p-2 hover:bg-white/10 rounded-full transition-colors duration-200"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <SearchBar onCitySelect={handleCitySelect} />

      {/* Weather Card */}
      <div data-testid="weather-card" onClick={handleWeatherCardClick} className="cursor-pointer">
        {currentWeather && (
          <WeatherCard
            temperature={currentWeather.temperature}
            condition={currentWeather.condition}
            humidity={currentWeather.humidity}
            windSpeed={currentWeather.windSpeed}
            pressure={currentWeather.pressure}
            visibility={currentWeather.visibility}
            uvIndex={currentWeather.uvIndex}
            icon={currentWeather.icon}
          />
        )}
      </div>

      {/* Temperature Display */}
      <div className="text-center text-white">
        <span data-testid="temperature">{currentWeather?.temperature}°C</span>
        <span data-testid="condition" className="block mt-2">{currentWeather?.condition}</span>
      </div>

      {/* Forecast Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {forecast.slice(0, 3).map((day, index) => (
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
  );
};