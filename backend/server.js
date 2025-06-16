import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const OPENWEATHER_API_KEY = 'e347d4c852225224d8d144c6c5045bb4';
const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Middleware
app.use(cors());
app.use(express.json());

// Helper function to get weather icon mapping
const getWeatherIcon = (iconCode) => {
  const iconMap = {
    '01d': 'sun',
    '01n': 'moon',
    '02d': 'partly-cloudy-day',
    '02n': 'partly-cloudy-day',
    '03d': 'cloud',
    '03n': 'cloud',
    '04d': 'cloud',
    '04n': 'cloud',
    '09d': 'cloud-rain',
    '09n': 'cloud-rain',
    '10d': 'cloud-rain',
    '10n': 'cloud-rain',
    '11d': 'cloud-rain',
    '11n': 'cloud-rain',
    '13d': 'cloud-snow',
    '13n': 'cloud-snow',
    '50d': 'cloud',
    '50n': 'cloud'
  };
  return iconMap[iconCode] || 'sun';
};

// Helper function to format forecast data
const formatForecastData = (forecastList) => {
  const dailyForecasts = {};
  
  forecastList.forEach(item => {
    const date = new Date(item.dt * 1000).toISOString().split('T')[0];
    
    if (!dailyForecasts[date]) {
      dailyForecasts[date] = {
        date,
        temps: [],
        conditions: [],
        icons: [],
        precipitation: 0
      };
    }
    
    dailyForecasts[date].temps.push(item.main.temp);
    dailyForecasts[date].conditions.push(item.weather[0].main);
    dailyForecasts[date].icons.push(item.weather[0].icon);
    
    if (item.rain && item.rain['3h']) {
      dailyForecasts[date].precipitation += item.rain['3h'];
    }
  });
  
  return Object.values(dailyForecasts).slice(0, 5).map(day => ({
    date: day.date,
    high: Math.round(Math.max(...day.temps)),
    low: Math.round(Math.min(...day.temps)),
    condition: day.conditions[0],
    icon: getWeatherIcon(day.icons[0]),
    precipitation: Math.round((day.precipitation / day.temps.length) * 100)
  }));
};

// Routes
app.get('/api/weather/current/:city', async (req, res) => {
  try {
    const city = req.params.city;
    const response = await axios.get(
      `${OPENWEATHER_BASE_URL}/weather?q=${city}&appid=${OPENWEATHER_API_KEY}&units=metric`
    );
    
    const data = response.data;
    const weatherData = {
      city: data.name,
      country: data.sys.country,
      temperature: Math.round(data.main.temp),
      condition: data.weather[0].main,
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
      pressure: data.main.pressure,
      visibility: Math.round((data.visibility || 10000) / 1000), // Convert to km
      uvIndex: 5, // OpenWeather UV requires separate API call
      icon: getWeatherIcon(data.weather[0].icon)
    };
    
    res.json(weatherData);
  } catch (error) {
    console.error('Error fetching current weather:', error.message);
    res.status(404).json({ error: 'City not found or API error' });
  }
});

app.get('/api/weather/forecast/:city', async (req, res) => {
  try {
    const city = req.params.city;
    const response = await axios.get(
      `${OPENWEATHER_BASE_URL}/forecast?q=${city}&appid=${OPENWEATHER_API_KEY}&units=metric`
    );
    
    const forecastData = formatForecastData(response.data.list);
    res.json(forecastData);
  } catch (error) {
    console.error('Error fetching forecast:', error.message);
    res.status(404).json({ error: 'City not found or API error' });
  }
});

app.get('/api/weather/hourly/:city', async (req, res) => {
  try {
    const city = req.params.city;
    const response = await axios.get(
      `${OPENWEATHER_BASE_URL}/forecast?q=${city}&appid=${OPENWEATHER_API_KEY}&units=metric`
    );
    
    const hourlyData = response.data.list.slice(0, 5).map(item => ({
      time: new Date(item.dt * 1000).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      }),
      temp: Math.round(item.main.temp),
      condition: item.weather[0].main,
      icon: getWeatherIcon(item.weather[0].icon)
    }));
    
    res.json(hourlyData);
  } catch (error) {
    console.error('Error fetching hourly forecast:', error.message);
    res.status(404).json({ error: 'City not found or API error' });
  }
});

app.get('/api/weather/all/:city', async (req, res) => {
  try {
    const city = req.params.city;
    
    const [currentResponse, forecastResponse] = await Promise.all([
      axios.get(`${OPENWEATHER_BASE_URL}/weather?q=${city}&appid=${OPENWEATHER_API_KEY}&units=metric`),
      axios.get(`${OPENWEATHER_BASE_URL}/forecast?q=${city}&appid=${OPENWEATHER_API_KEY}&units=metric`)
    ]);
    
    const currentData = currentResponse.data;
    const current = {
      city: currentData.name,
      country: currentData.sys.country,
      temperature: Math.round(currentData.main.temp),
      condition: currentData.weather[0].main,
      humidity: currentData.main.humidity,
      windSpeed: Math.round(currentData.wind.speed * 3.6),
      pressure: currentData.main.pressure,
      visibility: Math.round((currentData.visibility || 10000) / 1000),
      uvIndex: 5,
      icon: getWeatherIcon(currentData.weather[0].icon)
    };
    
    const forecast = formatForecastData(forecastResponse.data.list);
    
    const hourly = forecastResponse.data.list.slice(0, 5).map(item => ({
      time: new Date(item.dt * 1000).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      }),
      temp: Math.round(item.main.temp),
      condition: item.weather[0].main,
      icon: getWeatherIcon(item.weather[0].icon)
    }));
    
    res.json({ current, forecast, hourly });
  } catch (error) {
    console.error('Error fetching all weather data:', error.message);
    res.status(404).json({ error: 'City not found or API error' });
  }
});

app.get('/api/cities/search', async (req, res) => {
  try {
    const query = req.query.q || '';
    
    if (query.length < 2) {
      return res.json([]);
    }
    
    // For demo purposes, return some common cities that match the query
    const commonCities = [
      'London', 'New York', 'Tokyo', 'Paris', 'Berlin', 'Sydney', 'Mumbai', 'Beijing',
      'Los Angeles', 'Chicago', 'Toronto', 'Vancouver', 'Madrid', 'Rome', 'Amsterdam',
      'Dubai', 'Singapore', 'Hong Kong', 'Seoul', 'Bangkok', 'Istanbul', 'Moscow',
      'Cairo', 'Lagos', 'Nairobi', 'Cape Town', 'Buenos Aires', 'São Paulo', 'Mexico City'
    ];
    
    const matches = commonCities.filter(city => 
      city.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5);
    
    res.json(matches);
  } catch (error) {
    console.error('Error searching cities:', error.message);
    res.status(500).json({ error: 'Search error' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Weather API server running on port ${PORT}`);
  console.log(`Using OpenWeatherMap API for real weather data`);
});