# Weather Forecast Application

A comprehensive weather forecast application with frontend, backend, and automated testing using Selenium.

 Features

 Frontend
- Modern React Application with TypeScript and Tailwind CSS
- Multi-page Architecture with React Router
- Beautiful Weather Dashboard with current conditions and 5-day forecast
- City Search with autocomplete functionality
- Responsive Design optimized for all devices
- Weather-themed UI with dynamic backgrounds and smooth animations

 Backend
- Express.js API Server with RESTful endpoints
- Weather API Integration with mock data (easily replaceable with real weather API)
- CORS Support for frontend communication
- Error Handling and data validation

 Testing
- Selenium WebDriver automation testing
- Single Page Tests for component functionality
- Multi-page Tests for navigation and user flows
- Comprehensive Test Coverage with 20+ test scenarios

 Project Structure

```
weather-forecast-app/
├── backend/
│   └── server.js              # Express API server
├── src/
│   ├── components/            # React components
│   │   ├── Navbar.tsx
│   │   ├── WeatherCard.tsx
│   │   ├── SearchBar.tsx
│   │   └── ForecastCard.tsx
│   ├── pages/                 # Page components
│   │   ├── Home.tsx
│   │   ├── Forecast.tsx
│   │   ├── CityWeather.tsx
│   │   └── Settings.tsx
│   ├── services/              # API services
│   │   └── weatherApi.ts
│   └── App.tsx               # Main app component
├── test/                     # Selenium tests
│   ├── run-tests.js          # Test runner
│   ├── single-page-test.js   # Single page tests
│   └── multi-page-test.js    # Multi-page tests
└── package.json
```

 Available Scripts

 Development
- `npm run dev` - Start both frontend and backend concurrently
- `npm run dev:frontend` - Start only frontend development server
- `npm run dev:backend` - Start only backend API server

 Testing
- `npm test` - Run all Selenium tests
- `npm run test:single` - Run single page tests only
- `npm run test:multi` - Run multi-page tests only

 Production
- `npm run build` - Build frontend for production
- `npm run preview` - Preview production build

 Getting Started

1. Install Dependencies
   ```bash
   npm install
   ```

2. Start Development Servers
   ```bash
   npm run dev
   ```
   This will start:
   - Frontend on http://localhost:5173
   - Backend API on http://localhost:3001

3. Run Tests
   ```bash
   npm test
   ```

 API Endpoints

- `GET /api/weather/current/:city` - Get current weather for a city
- `GET /api/weather/forecast/:city` - Get 5-day forecast
- `GET /api/weather/hourly/:city` - Get hourly forecast
- `GET /api/weather/all/:city` - Get all weather data
- `GET /api/cities/search?q=query` - Search cities
- `GET /api/health` - Health check

 Test Scenarios

 Single Page Tests
1. Page loads correctly
2. Weather card is displayed
3. City name is displayed
4. Temperature is displayed
5. Weather condition is displayed

 Multi-page Tests
1. Navigate to Forecast page
2. Tab switching on Forecast page
3. Navigate to Settings page
4. Settings functionality works

 Technologies Used

 Frontend
- React 18 with TypeScript
- React Router for navigation
- Tailwind CSS for styling
- Lucide React for icons
- Axios for API calls

 Backend
- Node.js with Express
- CORS for cross-origin requests
- RESTful API design

 Testing
- Selenium WebDriver
- Chrome browser automation
- JavaScript test scripts

 Production Deployment

The application is production-ready with:
- Optimized build process
- Error handling and loading states
- Responsive design
- SEO-friendly structure
- Performance optimizations

 Future Enhancements

- Integration with real weather APIs (OpenWeatherMap, AccuWeather)
- User authentication and favorites
- Push notifications for weather alerts
- Offline support with service workers
- Advanced weather maps and radar
- Weather widgets for embedding#
