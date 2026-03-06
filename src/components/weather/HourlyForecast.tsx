import { GlassCard } from "./GlassCard";
import { WeatherIcon } from "./WeatherIcon";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface HourData {
  time: string;
  temp: number;
  condition: "sunny" | "cloudy" | "partly-cloudy" | "rain" | "drizzle" | "snow" | "thunderstorm" | "windy";
}

interface HourlyForecastProps {
  hours: HourData[];
}

export const HourlyForecast = ({ hours }: HourlyForecastProps) => {
  return (
    <GlassCard className="p-0 overflow-hidden" hover={false}>
      <div className="p-4 pb-2 border-b border-glass-border">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Hourly Forecast
        </h3>
      </div>
      <ScrollArea className="w-full">
        <div className="flex gap-6 p-4">
          {hours.map((hour, index) => (
            <div
              key={index}
              className="flex flex-col items-center gap-2 min-w-[60px]"
            >
              <span className="text-sm text-muted-foreground">{hour.time}</span>
              <WeatherIcon condition={hour.condition} size="sm" />
              <span className="text-lg font-medium">{hour.temp}°</span>
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </GlassCard>
  );
};
