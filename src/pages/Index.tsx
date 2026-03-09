import { CurrentWeather } from "@/components/weather/CurrentWeather";
import { HourlyForecast } from "@/components/weather/HourlyForecast";
import { DailyForecast } from "@/components/weather/DailyForecast";
import { WeatherMetrics } from "@/components/weather/WeatherMetrics";
import { SearchLocation } from "@/components/weather/SearchLocation";
import { WeatherSkeleton } from "@/components/weather/WeatherSkeleton";
import { useWeather } from "@/hooks/useWeather";

const Index = () => {
  const { data, loading, searchCity } = useWeather('Antananarivo');

  return (
    <div className="min-h-screen gradient-sky">
      <div className="container  mx-auto px-4 py-6 pb-20">
        <div className="max-w-lg mx-auto"><SearchLocation onSearch={searchCity} isLoading={loading}/></div>
        
        {loading ? (
          <WeatherSkeleton />
        ) : data ? (
          <>
            <CurrentWeather
              location={data.current.location}
              temperature={data.current.temperature}
              condition={data.current.condition}
              weatherType={data.current.weatherType}
              high={data.current.high}
              low={data.current.low}
            />

            <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 md:mt-6">
              <HourlyForecast hours={data.hourly} />
              <DailyForecast days={data.daily} />
              <WeatherMetrics
                humidity={data.current.humidity}
                windSpeed={data.current.windSpeed}
                windDirection={data.current.windDirection}
                feelsLike={data.current.feelsLike}
                visibility={data.current.visibility}
                pressure={data.current.pressure}
                sunrise={data.current.sunrise}
                sunset={data.current.sunset}
              />
            </div>
          </>
        ) : (
          <div className="text-center text-white/60 py-20">
            Failed to load weather data. Please try again.
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
