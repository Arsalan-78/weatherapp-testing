import React from 'react';
import { Sun, Cloud, CloudRain, Moon } from 'lucide-react';

interface ForecastCardProps {
  date: string;
  high: number;
  low: number;
  condition: string;
  icon: string;
  precipitation: number;
}

const WeatherIcon: React.FC<{ icon: string; className?: string }> = ({ icon, className = "h-8 w-8" }) => {
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

export const ForecastCard: React.FC<ForecastCardProps> = ({
  date,
  high,
  low,
  condition,
  icon,
  precipitation
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="bg-white/20 backdrop-blur-md rounded-xl p-4 border border-white/30 hover:bg-white/30 transition-all duration-300">
      <div className="text-center">
        <div className="text-white/80 text-sm mb-2" data-testid="forecast-date">
          {formatDate(date)}
        </div>
        
        <div className="flex justify-center mb-3">
          <WeatherIcon icon={icon} />
        </div>
        
        <div className="text-white text-sm mb-2" data-testid="forecast-condition">
          {condition}
        </div>
        
        <div className="flex justify-between items-center text-white text-sm mb-2">
          <span className="font-semibold" data-testid="forecast-high">{high}°</span>
          <span className="text-white/70" data-testid="forecast-low">{low}°</span>
        </div>
        
        <div className="text-white/70 text-xs" data-testid="forecast-precipitation">
          {precipitation}% rain
        </div>
      </div>
    </div>
  );
};