import { WeatherResponse } from "@/lib/api/types";

const BASE_URL = "https://api.open-meteo.com/v1/forecast";

export const getWeather = async (
  latitude: number,
  longitude: number,
): Promise<WeatherResponse> => {
  const query = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    current: [
      "temperature_2m",
      "relative_humidity_2m",
      "apparent_temperature",
      "precipitation",
      "weather_code",
      "wind_speed_10m",
    ].join(","),
    daily: [
      "weather_code",
      "temperature_2m_max",
      "temperature_2m_min",
      "precipitation_probability_max",
      "precipitation_sum",
    ].join(","),
    timezone: "America/Costa_Rica",
    forecast_days: "5",
  });

  const response = await fetch(`${BASE_URL}?${query.toString()}`);

  if (!response.ok) {
    throw new Error(
      `No se pudo consultar el clima. Código HTTP: ${response.status}`,
    );
  }

  return response.json() as Promise<WeatherResponse>;
};