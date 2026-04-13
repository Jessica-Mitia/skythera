import { useState, useEffect } from "react";
import { toast } from "sonner";

export interface CurrentWeatherData {
  location: string;
  temperature: number;
  condition: string;
  weatherType:
    | "sunny"
    | "partly-cloudy"
    | "cloudy"
    | "rain"
    | "drizzle"
    | "snow"
    | "thunderstorm";
  high: number;
  low: number;
  humidity: number;
  windSpeed: number;
  windDirection: string;
  feelsLike: number;
  visibility: number;
  pressure: number;
  sunrise: string;
  sunset: string;
}

export interface HourlyData {
  time: string;
  temp: number;
  condition:
    | "sunny"
    | "partly-cloudy"
    | "cloudy"
    | "rain"
    | "drizzle"
    | "snow"
    | "thunderstorm";
}

export interface DailyData {
  day: string;
  high: number;
  low: number;
  condition:
    | "sunny"
    | "partly-cloudy"
    | "cloudy"
    | "rain"
    | "drizzle"
    | "snow"
    | "thunderstorm";
  precipitation?: number;
}

export interface WeatherData {
  current: CurrentWeatherData;
  hourly: HourlyData[];
  daily: DailyData[];
}

export function useWeather(initialCity: string = "Antanarivo") {
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [city, setCity] = useState(initialCity);

  const fetchWeather = async (searchCity?: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `http://localhost:3000/weather?city=${encodeURIComponent(searchCity || city)}`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch weather data");
      }

      const weatherData = await response.json();

      if (weatherData.error) {
        throw new Error(weatherData.error);
      }

      setData(weatherData);
      if (searchCity) {
        setCity(searchCity);
      }
    } catch (err: any) {
      console.error("Weather fetch error:", err);
      setError(err.message || "Failed to fetch weather data");
      toast.error("Failed to fetch weather data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const searchCity = (newCity: string) => {
    fetchWeather(newCity);
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  return { data, loading, error, searchCity, refetch: () => fetchWeather() };
}
