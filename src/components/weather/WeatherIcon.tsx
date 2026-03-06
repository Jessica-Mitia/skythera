import { Sun, Cloud, CloudRain, CloudSnow, CloudLightning, CloudDrizzle, Wind, Cloudy } from "lucide-react";

export type WeatherCondition = "sunny" | "cloudy" | "partly-cloudy" | "rain" | "drizzle" | "snow" | "thunderstorm" | "windy";

interface WeatherIconProps {
  condition: WeatherCondition;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeMap = {
  sm: 24,
  md: 48,
  lg: 80,
  xl: 120,
};

export const WeatherIcon = ({ condition, size = "md", className = "" }: WeatherIconProps) => {
  const iconSize = sizeMap[size];
  
  const iconProps = {
    size: iconSize,
    className: `${className} transition-all duration-500`,
  };

  switch (condition) {
    case "sunny":
      return <Sun {...iconProps} className={`${iconProps.className} text-accent animate-pulse-slow`} />;
    case "cloudy":
      return <Cloudy {...iconProps} className={`${iconProps.className} text-cloud-gray`} />;
    case "partly-cloudy":
      return <Cloud {...iconProps} className={`${iconProps.className} text-cloud-gray`} />;
    case "rain":
      return <CloudRain {...iconProps} className={`${iconProps.className} text-primary`} />;
    case "drizzle":
      return <CloudDrizzle {...iconProps} className={`${iconProps.className} text-primary`} />;
    case "snow":
      return <CloudSnow {...iconProps} className={`${iconProps.className} text-foreground`} />;
    case "thunderstorm":
      return <CloudLightning {...iconProps} className={`${iconProps.className} text-accent`} />;
    case "windy":
      return <Wind {...iconProps} className={`${iconProps.className} text-muted-foreground`} />;
    default:
      return <Sun {...iconProps} className={`${iconProps.className} text-accent`} />;
  }
};
