const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

app.get('/weather', async (req, res) => {
  try {
    const { city, lat, lon } = req.query;

    let weatherUrl;
    let forecastUrl;

    if (lat && lon) {
      weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${OPENWEATHER_API_KEY}`;
      forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${OPENWEATHER_API_KEY}`;
    } else if (city) {
      weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${OPENWEATHER_API_KEY}`;
      forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&units=metric&appid=${OPENWEATHER_API_KEY}`;
    } else {
      return res.status(400).json({ error: 'City or coordinates are required' });
    }

    console.log('Fetching weather data...');

    const [weatherResponse, forecastResponse] = await Promise.all([
      fetch(weatherUrl),
      fetch(forecastUrl)
    ]);

    if (!weatherResponse.ok) {
      const errorData = await weatherResponse.json();
      console.error('Weather API error:', errorData);
      return res.status(500).json({ error: errorData.message || 'Failed to fetch weather data' });
    }

    const weatherData = await weatherResponse.json();
    const forecastData = await forecastResponse.json();

    console.log('Weather data fetched successfully for:', weatherData.name);

    // Map OpenWeather condition codes to our weather types
    const mapCondition = (code) => {
      if (code >= 200 && code < 300) return 'thunderstorm';
      if (code >= 300 && code < 400) return 'drizzle';
      if (code >= 500 && code < 600) return 'rain';
      if (code >= 600 && code < 700) return 'snow';
      if (code === 800) return 'sunny';
      if (code > 800 && code < 900) return 'partly-cloudy';
      return 'cloudy';
    };

    const current = {
      location: weatherData.name,
      temperature: Math.round(weatherData.main.temp),
      condition: weatherData.weather[0].description,
      weatherType: mapCondition(weatherData.weather[0].id),
      high: Math.round(weatherData.main.temp_max),
      low: Math.round(weatherData.main.temp_min),
      humidity: weatherData.main.humidity,
      windSpeed: weatherData.wind.speed,
      windDirection: weatherData.wind.deg,
      feelsLike: Math.round(weatherData.main.feels_like),
      visibility: weatherData.visibility / 1000,
      pressure: weatherData.main.pressure,
      sunrise: new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      sunset: new Date(weatherData.sys.sunset * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    };

    const hourly = forecastData.list.slice(0, 24).map(item => ({
      time: new Date(item.dt * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      temp: Math.round(item.main.temp),
      condition: mapCondition(item.weather[0].id),
    }));

    const daily = [];
    const dailyMap = {};
    forecastData.list.forEach(item => {
      const date = new Date(item.dt * 1000).toDateString();
      if (!dailyMap[date]) {
        dailyMap[date] = {
          day: date,
          high: item.main.temp_max,
          low: item.main.temp_min,
          condition: mapCondition(item.weather[0].id),
          precipitation: item.pop * 100,
        };
      } else {
        dailyMap[date].high = Math.max(dailyMap[date].high, item.main.temp_max);
        dailyMap[date].low = Math.min(dailyMap[date].low, item.main.temp_min);
      }
    });
    Object.values(dailyMap).forEach(day => daily.push(day));

    res.json({ current, hourly, daily });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});