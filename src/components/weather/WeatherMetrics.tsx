import { Droplets, Wind, Thermometer, Eye, Gauge, Sunrise } from "lucide-react";
import { GlassCard } from "./GlassCard";

interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  subValue?: string;
}

const MetricCard = ({ icon, label, value, subValue }: MetricCardProps) => (
  <GlassCard className="flex flex-col gap-2">
    <div className="flex items-center gap-2 text-muted-foreground">
      {icon}
      <span className="text-xs uppercase tracking-wider">{label}</span>
    </div>
    <div className="text-2xl font-semibold">{value}</div>
    {subValue && <div className="text-sm text-muted-foreground">{subValue}</div>}
  </GlassCard>
);

interface WeatherMetricsProps {
  humidity: number;
  windSpeed: number;
  windDirection: string;
  feelsLike: number;
  visibility: number;
  pressure: number;
  sunrise: string;
  sunset: string;
}

export const WeatherMetrics = ({
  humidity,
  windSpeed,
  windDirection,
  feelsLike,
  visibility,
  pressure,
  sunrise,
  sunset,
}: WeatherMetricsProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <MetricCard
        icon={<Droplets size={16} />}
        label="Humidity"
        value={`${humidity}%`}
        subValue="The dew point is 12°"
      />
      <MetricCard
        icon={<Wind size={16} />}
        label="Wind"
        value={`${windSpeed} km/h`}
        subValue={windDirection}
      />
      <MetricCard
        icon={<Thermometer size={16} />}
        label="Feels Like"
        value={`${feelsLike}°`}
        subValue="Similar to actual temperature"
      />
      <MetricCard
        icon={<Eye size={16} />}
        label="Visibility"
        value={`${visibility} km`}
        subValue="Crystal clear"
      />
      <MetricCard
        icon={<Gauge size={16} />}
        label="Pressure"
        value={`${pressure} hPa`}
        subValue="Normal"
      />
      <MetricCard
        icon={<Sunrise size={16} />}
        label="Sunrise"
        value={sunrise}
        subValue={`Sunset: ${sunset}`}
      />
    </div>
  );
};
