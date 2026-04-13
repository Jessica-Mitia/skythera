import { GlassCard } from "./GlassCard";
import { WeatherIcon } from "./WeatherIcon";

interface DayData {
  day: string;
  high: number;
  low: number;
  condition: "sunny" | "cloudy" | "partly-cloudy" | "rain" | "drizzle" | "snow" | "thunderstorm" | "windy";
  precipitation?: number;
}

interface DailyForecastProps {
  days: DayData[];
}

export const DailyForecast = ({ days }: DailyForecastProps) => {
  const maxHigh = Math.max(...days.map((d) => d.high)).toFixed(0);
  const minLow = Math.min(...days.map((d) => d.low)).toFixed(0);
  const range = parseFloat(maxHigh) - parseFloat(minLow);

  return (
    <GlassCard className="p-0 overflow-hidden" hover={false}>
      <div className="p-4 pb-2 border-b border-glass-border">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          5-Day Forecast
        </h3>
      </div>
      <div className="divide-y divide-glass-border">
        {days.map((day, index) => {
          const lowPos = ((day.low - parseFloat(minLow)) / range) * 100;
          const highPos = ((day.high - parseFloat(minLow)) / range) * 100;
          const barWidth = highPos - lowPos;

          return (
            <div
              key={index}
              className="flex items-center justify-between p-4 hover:bg-glass-hover transition-colors"
            >
              <span className="font-medium">{day.day}</span>
              
              <div className="flex items-center gap-2 w-16">
                <WeatherIcon condition={day.condition} size="sm" />
                {day.precipitation && (
                  <span className="text-xs text-primary">{day.precipitation.toFixed(0)}%</span>
                )}
              </div>
              
              <div className="flex items-center gap-3 flex-1 max-w-[200px]">
                <span className="text-muted-foreground w-8 text-right">{day.low}°</span>
                <div className="flex-1 h-1 bg-muted rounded-full relative">
                  <div
                    className="absolute h-full rounded-full bg-gradient-to-r from-primary to-accent"
                    style={{
                      left: `${lowPos}%`,
                      width: `${barWidth}%`,
                    }}
                  />
                </div>
                <span className="w-8">{day.high}°</span>
              </div>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
};
