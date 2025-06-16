import React, { useState } from 'react';
import { Settings as SettingsIcon, Thermometer, MapPin, Bell } from 'lucide-react';

export const Settings: React.FC = () => {
  const [temperatureUnit, setTemperatureUnit] = useState<'celsius' | 'fahrenheit'>('celsius');
  const [defaultCity, setDefaultCity] = useState('London');
  const [notifications, setNotifications] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const handleSave = () => {
    // In a real app, you'd save these settings to localStorage or a backend
    alert('Settings saved successfully!');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center text-white">
        <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3" data-testid="settings-title">
          <SettingsIcon className="h-8 w-8" />
          Settings
        </h1>
        <p className="text-xl text-white/80">Customize your weather experience</p>
      </div>

      {/* Settings Form */}
      <div className="max-w-2xl mx-auto bg-white/20 backdrop-blur-md rounded-2xl p-8 border border-white/30">
        <div className="space-y-8">
          {/* Temperature Unit */}
          <div>
            <label className="flex items-center gap-3 text-white text-lg font-medium mb-4">
              <Thermometer className="h-5 w-5" />
              Temperature Unit
            </label>
            <div className="flex gap-4">
              <button
                onClick={() => setTemperatureUnit('celsius')}
                className={`px-6 py-3 rounded-lg transition-all duration-200 ${
                  temperatureUnit === 'celsius'
                    ? 'bg-white/30 text-white border-2 border-white/50'
                    : 'bg-white/10 text-white/70 border-2 border-transparent hover:bg-white/20'
                }`}
                data-testid="celsius-button"
              >
                Celsius (°C)
              </button>
              <button
                onClick={() => setTemperatureUnit('fahrenheit')}
                className={`px-6 py-3 rounded-lg transition-all duration-200 ${
                  temperatureUnit === 'fahrenheit'
                    ? 'bg-white/30 text-white border-2 border-white/50'
                    : 'bg-white/10 text-white/70 border-2 border-transparent hover:bg-white/20'
                }`}
                data-testid="fahrenheit-button"
              >
                Fahrenheit (°F)
              </button>
            </div>
          </div>

          {/* Default City */}
          <div>
            <label className="flex items-center gap-3 text-white text-lg font-medium mb-4">
              <MapPin className="h-5 w-5" />
              Default City
            </label>
            <input
              type="text"
              value={defaultCity}
              onChange={(e) => setDefaultCity(e.target.value)}
              className="w-full px-4 py-3 bg-white/20 backdrop-blur-md border border-white/30 rounded-xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-200"
              placeholder="Enter your default city"
              data-testid="default-city-input"
            />
          </div>

          {/* Notifications */}
          <div>
            <label className="flex items-center gap-3 text-white text-lg font-medium mb-4">
              <Bell className="h-5 w-5" />
              Notifications
            </label>
            <div className="space-y-4">
              <label className="flex items-center gap-3 text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications}
                  onChange={(e) => setNotifications(e.target.checked)}
                  className="w-5 h-5 rounded border-white/30 bg-white/20 text-blue-600 focus:ring-white/50"
                  data-testid="notifications-checkbox"
                />
                <span>Enable weather notifications</span>
              </label>
              <label className="flex items-center gap-3 text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                  className="w-5 h-5 rounded border-white/30 bg-white/20 text-blue-600 focus:ring-white/50"
                  data-testid="auto-refresh-checkbox"
                />
                <span>Auto-refresh weather data</span>
              </label>
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-6">
            <button
              onClick={handleSave}
              className="w-full bg-white/30 hover:bg-white/40 text-white font-medium py-4 px-6 rounded-xl transition-all duration-200 hover:transform hover:scale-105"
              data-testid="save-settings-button"
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};