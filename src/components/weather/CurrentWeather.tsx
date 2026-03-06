import { MapPin } from "lucide-react";
import { WeatherIcon } from "./WeatherIcon";

interface CurrentWeatherProps {
  location: string;
  temperature: number;
  condition: string;
  weatherType: "sunny" | "cloudy" | "partly-cloudy" | "rain" | "drizzle" | "snow" | "thunderstorm" | "windy";
  high: number;
  low: number;
}

export const CurrentWeather = ({
  location,
  temperature,
  condition,
  weatherType,
  high,
  low,
}: CurrentWeatherProps) => {
  return (
    <div className="flex flex-col items-center text-center py-8">
      <div className="flex items-center gap-2 text-muted-foreground mb-2">
        <MapPin size={18} />
        <span className="text-lg font-medium">{location}</span>
      </div>
      
      <div className="my-6 animate-float">
        <WeatherIcon condition={weatherType} size="xl" />
      </div>
      
      <div className="text-8xl font-light tracking-tighter text-glow mb-2">
        {temperature}°
      </div>
      
      <p className="text-xl text-muted-foreground capitalize mb-4">{condition}</p>
      
      <div className="flex gap-4 text-lg">
        <span className="text-foreground">H: {high}°</span>
        <span className="text-muted-foreground">L: {low}°</span>
      </div>
    </div>
  );
};
