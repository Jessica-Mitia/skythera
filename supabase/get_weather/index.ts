import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openWeatherApiKey = Deno.env.get('OPENWEATHER_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { city, lat, lon } = await req.json();
    
    let weatherUrl: string;
    let forecastUrl: string;
    
    if (lat && lon) {
      weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${openWeatherApiKey}`;
      forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${openWeatherApiKey}`;
    } else if (city) {
      weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${openWeatherApiKey}`;
      forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&units=metric&appid=${openWeatherApiKey}`;
    } else {
      throw new Error('City or coordinates are required');
    }

    console.log('Fetching weather data...');
    
    const [weatherResponse, forecastResponse] = await Promise.all([
      fetch(weatherUrl),
      fetch(forecastUrl)
    ]);

    if (!weatherResponse.ok) {
      const errorData = await weatherResponse.json();
      console.error('Weather API error:', errorData);
      throw new Error(errorData.message || 'Failed to fetch weather data');
    }

    const weatherData = await weatherResponse.json();
    const forecastData = await forecastResponse.json();

    console.log('Weather data fetched successfully for:', weatherData.name);

    
    const mapCondition = (weatherId: number): string => {
      if (weatherId >= 200 && weatherId < 300) return 'thunderstorm';
      if (weatherId >= 300 && weatherId < 400) return 'drizzle';
      if (weatherId >= 500 && weatherId < 600) return 'rain';
      if (weatherId >= 600 && weatherId < 700) return 'snow';
      if (weatherId >= 700 && weatherId < 800) return 'cloudy';
      if (weatherId === 800) return 'sunny';
      if (weatherId === 801) return 'partly-cloudy';
      return 'cloudy';
    };

    
    const current = {
      location: `${weatherData.name}, ${weatherData.sys.country}`,
      temperature: Math.round(weatherData.main.temp),
      condition: weatherData.weather[0].description,
      weatherType: mapCondition(weatherData.weather[0].id),
      high: Math.round(weatherData.main.temp_max),
      low: Math.round(weatherData.main.temp_min),
      humidity: weatherData.main.humidity,
      windSpeed: Math.round(weatherData.wind.speed * 3.6), // Convert m/s to km/h
      windDirection: getWindDirection(weatherData.wind.deg),
      feelsLike: Math.round(weatherData.main.feels_like),
      visibility: Math.round(weatherData.visibility / 1000),
      pressure: weatherData.main.pressure,
      sunrise: formatTime(weatherData.sys.sunrise, weatherData.timezone),
      sunset: formatTime(weatherData.sys.sunset, weatherData.timezone),
    };

    // Process hourly forecast (next 12 hours from 3-hour intervals)
    const hourly = forecastData.list.slice(0, 8).map((item: any) => ({
      time: formatHour(item.dt, weatherData.timezone),
      temp: Math.round(item.main.temp),
      condition: mapCondition(item.weather[0].id),
    }));

    // Process daily forecast (group by day)
    const dailyMap = new Map();
    forecastData.list.forEach((item: any) => {
      const date = new Date((item.dt + weatherData.timezone) * 1000);
      const day = date.toLocaleDateString('en-US', { weekday: 'short' });
      
      if (!dailyMap.has(day)) {
        dailyMap.set(day, {
          day,
          high: item.main.temp_max,
          low: item.main.temp_min,
          condition: mapCondition(item.weather[0].id),
          precipitation: item.pop ? Math.round(item.pop * 100) : undefined,
        });
      } else {
        const existing = dailyMap.get(day);
        existing.high = Math.max(existing.high, item.main.temp_max);
        existing.low = Math.min(existing.low, item.main.temp_min);
      }
    });

    const daily = Array.from(dailyMap.values()).slice(0, 5).map((d: any) => ({
      ...d,
      high: Math.round(d.high),
      low: Math.round(d.low),
    }));

    
    if (daily.length > 0) {
      daily[0].day = 'Today';
    }

    return new Response(JSON.stringify({ current, hourly, daily }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Error in get-weather function:', error);
    return new Response(JSON.stringify({ error: error.message || 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function getWindDirection(degrees: number): string {
  const directions = ['North', 'Northeast', 'East', 'Southeast', 'South', 'Southwest', 'West', 'Northwest'];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
}

function formatTime(timestamp: number, timezone: number): string {
  const date = new Date((timestamp + timezone) * 1000);
  return date.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true,
    timeZone: 'UTC'
  });
}

function formatHour(timestamp: number, timezone: number): string {
  const date = new Date((timestamp + timezone) * 1000);
  const now = new Date();
  const itemHour = date.getUTCHours();
  const nowHour = now.getUTCHours();
  
  if (Math.abs(itemHour - nowHour) <= 1) {
    return 'Now';
  }
  
  return date.toLocaleTimeString('en-US', { 
    hour: 'numeric',
    hour12: true,
    timeZone: 'UTC'
  });
}
