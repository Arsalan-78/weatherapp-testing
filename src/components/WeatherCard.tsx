import React from 'react';
import { Sun, Cloud, CloudRain, Moon } from 'lucide-react';

interface WeatherCardProps {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  pressure: number;
  visibility: number;
  uvIndex: number;
  icon: string;
}

const WeatherIcon: React.FC<{ icon: string; className?: string }> = ({ icon, className = "h-12 w-12" }) => {
  switch (icon) {
    case 'sun':
      return <Sun className={`${className} text-yellow-400`} />;
    case 'cloud':
      return <Cloud className={`${className} text-gray-400`} />;
    case 'cloud-rain':
      return <CloudRain className={`${className} text-blue-400`} />;
    case 'moon':
      return <Moon className={`${className} text-gray-300`} />;
    case 'partly-cloudy-day':
      return <Sun className={`${className} text-yellow-400`} />;
    default:
      return <Sun className={`${className} text-yellow-400`} />;
  }
};

export const WeatherCard: React.FC<WeatherCardProps> = ({
  temperature,
  condition,
  humidity,
  windSpeed,
  pressure,
  visibility,
  uvIndex,
  icon
}) => {
  return (
    <div 
      className="bg-white/20 backdrop-blur-md rounded-2xl p-6 border border-white/30 transition-all duration-300 hover:bg-white/30"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="text-4xl font-bold text-white mb-2">
          {temperature}°C
        </div>
        <WeatherIcon icon={icon} />
      </div>

      <div className="mb-6">
        <p className="text-white/80 text-xl">{condition}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="text-white/70">
          <span className="block">Humidity</span>
          <span className="text-white font-medium">{humidity}%</span>
        </div>
        <div className="text-white/70">
          <span className="block">Wind</span>
          <span className="text-white font-medium">{windSpeed} km/h</span>
        </div>
        <div className="text-white/70">
          <span className="block">Pressure</span>
          <span className="text-white font-medium">{pressure} hPa</span>
        </div>
        <div className="text-white/70">
          <span className="block">Visibility</span>
          <span className="text-white font-medium">{visibility} km</span>
        </div>
        <div className="text-white/70">
          <span className="block">UV Index</span>
          <span className="text-white font-medium">{uvIndex}</span>
        </div>
      </div>
    </div>
  );
};