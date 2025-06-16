import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const getCurrentWeather = async (city: string) => {
  try {
    const response = await api.get(`/weather/current/${city}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching current weather:', error);
    throw error;
  }
};

export const getForecast = async (city: string) => {
  try {
    const response = await api.get(`/weather/forecast/${city}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching forecast:', error);
    throw error;
  }
};

export const getHourlyForecast = async (city: string) => {
  try {
    const response = await api.get(`/weather/hourly/${city}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching hourly forecast:', error);
    throw error;
  }
};

export const getAllWeatherData = async (city: string) => {
  try {
    const response = await api.get(`/weather/all/${city}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching all weather data:', error);
    throw error;
  }
};

export const searchCities = async (query: string) => {
  try {
    const response = await api.get(`/cities/search?q=${query}`);
    return response.data;
  } catch (error) {
    console.error('Error searching cities:', error);
    throw error;
  }
};