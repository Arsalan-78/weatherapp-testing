import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { WeatherCard } from '../components/WeatherCard';
import { ForecastCard } from '../components/ForecastCard';
import { getAllWeatherData } from '../services/weatherApi';
import { ArrowLeft, MapPin, Eye, Gauge, Wind } from 'lucide-react';

interface WeatherData {
  current: {
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
  };
  forecast: Array<{
    date: string;
    high: number;
    low: number;
    condition: string;
    icon: string;
    precipitation: number;
  }>;
  hourly: Array<{
    time: string;
    temp: number;
    condition: string;
    icon: string;
  }>;
}

export const CityWeather: React.FC = () => {
  const { cityName } = useParams<{ cityName: string }>();
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCityWeather = async () => {
      if (!cityName) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const data = await getAllWeatherData(cityName);
        setWeatherData(data);
      } catch (err) {
        setError('Failed to fetch weather data for this city.');
        console.error('City weather fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCityWeather();
  }, [cityName]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error || !weatherData) {
    return (
      <div className="text-center text-white">
        <h1 className="text-2xl font-bold mb-4">Weather data not available</h1>
        <p className="mb-6">{error || 'City not found'}</p>
        <Link 
          to="/" 
          className="bg-white/20 hover:bg-white/30 px-6 py-3 rounded-lg transition-colors duration-200 inline-flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Navigation */}
      <div className="flex items-center gap-4">
        <Link 
          to="/" 
          className="text-white/80 hover:text-white transition-colors duration-200 flex items-center gap-2"
          data-testid="back-button"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Home
        </Link>
      </div>

      {/* Header */}
      <div className="text-center text-white">
        <h1 className="text-4xl font-bold mb-2 flex items-center justify-center gap-3" data-testid="city-title">
          <MapPin className="h-8 w-8" />
          {weatherData.current.city}, {weatherData.current.country}
        </h1>
        <p className="text-xl text-white/80">Complete weather information</p>
      </div>

      {/* Current Weather - Large Display */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white/20 backdrop-blur-md rounded-2xl p-8 border border-white/30">
          <h3 className="text-2xl font-semibold text-white mb-6">Current Weather</h3>
          <div className="text-center mb-6">
            <div className="text-6xl font-bold text-white mb-2" data-testid="large-temperature">
              {weatherData.current.temperature}°C
            </div>
            <div className="text-xl text-white/80" data-testid="large-condition">
              {weatherData.current.condition}
            </div>
          </div>
        </div>

        {/* Weather Details */}
        <div className="bg-white/20 backdrop-blur-md rounded-2xl p-8 border border-white/30">
          <h3 className="text-2xl font-semibold text-white mb-6">Weather Details</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-white/70 flex items-center gap-2">
                <Wind className="h-4 w-4" />
                Wind Speed
              </span>
              <span className="text-white font-medium" data-testid="detail-wind">
                {weatherData.current.windSpeed} km/h
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/70 flex items-center gap-2">
                <Gauge className="h-4 w-4" />
                Pressure
              </span>
              <span className="text-white font-medium" data-testid="detail-pressure">
                {weatherData.current.pressure} hPa
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/70 flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Visibility
              </span>
              <span className="text-white font-medium" data-testid="detail-visibility">
                {weatherData.current.visibility} km
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/70">Humidity</span>
              <span className="text-white font-medium" data-testid="detail-humidity">
                {weatherData.current.humidity}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/70">UV Index</span>
              <span className="text-white font-medium" data-testid="detail-uv">
                {weatherData.current.uvIndex}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Hourly Forecast */}
      <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 border border-white/30">
        <h3 className="text-xl font-semibold text-white mb-6">Today's Hourly Forecast</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {weatherData.hourly.map((hour, index) => (
            <div 
              key={index}
              className="bg-white/20 backdrop-blur-md rounded-xl p-4 border border-white/30 text-center"
              data-testid={`city-hourly-${index}`}
            >
              <div className="text-white/80 text-sm mb-2">{hour.time}</div>
              <div className="text-2xl font-bold text-white mb-2">{hour.temp}°C</div>
              <div className="text-white text-sm">{hour.condition}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 5-Day Forecast */}
      <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 border border-white/30">
        <h3 className="text-xl font-semibold text-white mb-6">5-Day Forecast</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
          {weatherData.forecast.map((day, index) => (
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
    </div>
  );
};