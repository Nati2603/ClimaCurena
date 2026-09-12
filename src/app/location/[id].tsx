import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { LOCATIONS } from "@/data/locations";
import {
    type RequestState,
    type WeatherResponse,
} from "@/lib/api/types";
import { getWeather } from "@/lib/api/weather-client";

type WeatherMetricProps = {
  label: string;
  value: string;
};

type ForecastCardProps = {
  date: string;
  weatherCode: number;
  maximumTemperature: number;
  minimumTemperature: number;
  precipitationProbability: number;
  precipitation: number;
};

function WeatherMetric({ label, value }: WeatherMetricProps) {
  return (
    <View style={styles.metric}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
    </View>
  );
}

function getWeatherDescription(weatherCode: number) {
  if (weatherCode === 0) {
    return "Despejado";
  }

  if (weatherCode === 1 || weatherCode === 2) {
    return "Parcialmente nublado";
  }

  if (weatherCode === 3) {
    return "Nublado";
  }

  if (weatherCode === 45 || weatherCode === 48) {
    return "Neblina";
  }

  if (weatherCode >= 51 && weatherCode <= 57) {
    return "Llovizna";
  }

  if (weatherCode >= 61 && weatherCode <= 67) {
    return "Lluvia";
  }

  if (weatherCode >= 71 && weatherCode <= 77) {
    return "Nieve";
  }

  if (weatherCode >= 80 && weatherCode <= 82) {
    return "Aguaceros";
  }

  if (weatherCode >= 85 && weatherCode <= 86) {
    return "Aguaceros de nieve";
  }

  if (weatherCode >= 95 && weatherCode <= 99) {
    return "Tormenta";
  }

  return "Condición variable";
}

function getWeatherSymbol(weatherCode: number) {
  if (weatherCode === 0) {
    return "☀️";
  }

  if (weatherCode === 1 || weatherCode === 2) {
    return "⛅";
  }

  if (weatherCode === 3) {
    return "☁️";
  }

  if (weatherCode === 45 || weatherCode === 48) {
    return "🌫️";
  }

  if (weatherCode >= 51 && weatherCode <= 67) {
    return "🌧️";
  }

  if (weatherCode >= 71 && weatherCode <= 77) {
    return "❄️";
  }

  if (weatherCode >= 80 && weatherCode <= 82) {
    return "🌦️";
  }

  if (weatherCode >= 85 && weatherCode <= 86) {
    return "🌨️";
  }

  if (weatherCode >= 95 && weatherCode <= 99) {
    return "⛈️";
  }

  return "🌤️";
}

function formatForecastDate(date: string, index: number) {
  if (index === 0) {
    return "Hoy";
  }

  const formattedDate = new Date(`${date}T12:00:00`);

  const dayName = formattedDate.toLocaleDateString("es-CR", {
    weekday: "short",
  });

  const dayNumber = formattedDate.toLocaleDateString("es-CR", {
    day: "numeric",
    month: "short",
  });

  return `${dayName} ${dayNumber}`;
}

function ForecastCard({
  date,
  weatherCode,
  maximumTemperature,
  minimumTemperature,
  precipitationProbability,
  precipitation,
}: ForecastCardProps) {
  return (
    <View style={styles.forecastCard}>
      <Text style={styles.forecastDate}>{date}</Text>

      <Text style={styles.weatherSymbol}>
        {getWeatherSymbol(weatherCode)}
      </Text>

      <Text style={styles.forecastDescription}>
        {getWeatherDescription(weatherCode)}
      </Text>

      <View style={styles.forecastTemperatures}>
        <Text style={styles.maximumTemperature}>
          {Math.round(maximumTemperature)}°
        </Text>

        <Text style={styles.minimumTemperature}>
          {Math.round(minimumTemperature)}°
        </Text>
      </View>

      <Text style={styles.forecastRain}>
        Lluvia: {Math.round(precipitationProbability)} %
      </Text>

      <Text style={styles.forecastPrecipitation}>
        Acumulado: {precipitation} mm
      </Text>
    </View>
  );
}

const INITIAL_STATE: RequestState<WeatherResponse> = {
  data: null,
  loading: false,
  error: null,
};

export default function LocationWeather() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [weatherState, setWeatherState] =
    useState<RequestState<WeatherResponse>>(INITIAL_STATE);

  const location = LOCATIONS.find((item) => item.id === id);

  const loadWeather = useCallback(async () => {
    if (!location) {
      return;
    }

    setWeatherState({
      data: null,
      loading: true,
      error: null,
    });

    try {
      const weather = await getWeather(
        location.latitude,
        location.longitude,
      );

      setWeatherState({
        data: weather,
        loading: false,
        error: null,
      });
    } catch (error) {
      setWeatherState({
        data: null,
        loading: false,
        error:
          error instanceof Error
            ? error.message
            : "Ocurrió un error al consultar el clima.",
      });
    }
  }, [location]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      void loadWeather();
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [loadWeather]);

  if (!location) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centeredContainer}>
          <Text style={styles.errorTitle}>
            Ubicación no encontrada
          </Text>

          <Pressable
            style={styles.button}
            onPress={() => router.back()}
          >
            <Text style={styles.buttonText}>Volver</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={["top", "left", "right"]}
    >
      <StatusBar style="dark" />

      <ScrollView contentContainerStyle={styles.content}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Volver al listado de comunidades"
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>← Volver</Text>
        </Pressable>

        <Text style={styles.title}>{location.name}</Text>
        <Text style={styles.description}>
          {location.description}
        </Text>

        {weatherState.loading && (
          <View style={styles.centeredContainer}>
            <ActivityIndicator
              size="large"
              color="#14532D"
            />

            <Text style={styles.loadingText}>
              Consultando condiciones meteorológicas...
            </Text>
          </View>
        )}

        {weatherState.error && (
          <View style={styles.errorCard}>
            <Text style={styles.errorTitle}>
              No se pudo cargar el clima
            </Text>

            <Text style={styles.errorMessage}>
              {weatherState.error}
            </Text>

            <Pressable
              style={styles.button}
              onPress={loadWeather}
            >
              <Text style={styles.buttonText}>
                Reintentar
              </Text>
            </Pressable>
          </View>
        )}

        {weatherState.data && (
          <>
            <View style={styles.temperatureCard}>
              <Text style={styles.currentLabel}>
                Temperatura actual
              </Text>

              <Text style={styles.temperature}>
                {Math.round(
                  weatherState.data.current.temperature_2m,
                )}
                °C
              </Text>

              <Text style={styles.updatedText}>
                Actualización:{" "}
                {weatherState.data.current.time.replace(
                  "T",
                  " ",
                )}
              </Text>
            </View>

            <View style={styles.metricsContainer}>
              <WeatherMetric
                label="Sensación térmica"
                value={`${Math.round(
                  weatherState.data.current
                    .apparent_temperature,
                )} °C`}
              />

              <WeatherMetric
                label="Humedad"
                value={`${weatherState.data.current.relative_humidity_2m} %`}
              />

              <WeatherMetric
                label="Precipitación"
                value={`${weatherState.data.current.precipitation} mm`}
              />

              <WeatherMetric
                label="Viento"
                value={`${weatherState.data.current.wind_speed_10m} km/h`}
              />
            </View>

            <View style={styles.forecastSection}>
              <Text style={styles.sectionTitle}>
                Pronóstico de cinco días
              </Text>

              <Text style={styles.sectionSubtitle}>
                Temperaturas y posibilidad de lluvia
              </Text>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.forecastList}
              >
                {weatherState.data.daily.time
                  .slice(0, 5)
                  .map((date, index) => (
                    <ForecastCard
                      key={date}
                      date={formatForecastDate(date, index)}
                      weatherCode={
                        weatherState.data!.daily
                          .weather_code[index]
                      }
                      maximumTemperature={
                        weatherState.data!.daily
                          .temperature_2m_max[index]
                      }
                      minimumTemperature={
                        weatherState.data!.daily
                          .temperature_2m_min[index]
                      }
                      precipitationProbability={
                        weatherState.data!.daily
                          .precipitation_probability_max[
                          index
                        ]
                      }
                      precipitation={
                        weatherState.data!.daily
                          .precipitation_sum[index]
                      }
                    />
                  ))}
              </ScrollView>
            </View>

            <Pressable
              accessibilityRole="button"
              style={styles.updateButton}
              onPress={loadWeather}
            >
              <Text style={styles.updateButtonText}>
                Actualizar información
              </Text>
            </Pressable>

            <Text style={styles.disclaimer}>
              Los pronósticos no sustituyen los avisos
              oficiales de las autoridades.
            </Text>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F1F7F4",
  },
  content: {
    width: "100%",
    maxWidth: 560,
    alignSelf: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  backButton: {
    alignSelf: "flex-start",
    paddingVertical: 8,
    marginBottom: 12,
  },
  backButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1B5E8C",
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    color: "#14532D",
  },
  description: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
    color: "#4B6B57",
  },
  centeredContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
    paddingHorizontal: 20,
  },
  loadingText: {
    marginTop: 14,
    fontSize: 14,
    color: "#4B6B57",
    textAlign: "center",
  },
  temperatureCard: {
    alignItems: "center",
    marginTop: 24,
    padding: 24,
    borderRadius: 20,
    backgroundColor: "#14532D",
  },
  currentLabel: {
    fontSize: 15,
    color: "#DCEFE2",
  },
  temperature: {
    marginVertical: 6,
    fontSize: 54,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  updatedText: {
    fontSize: 12,
    color: "#DCEFE2",
  },
  metricsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 16,
  },
  metric: {
    minWidth: "46%",
    flexGrow: 1,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#DCEAE0",
    backgroundColor: "#FFFFFF",
  },
  metricLabel: {
    fontSize: 13,
    color: "#4B6B57",
  },
  metricValue: {
    marginTop: 6,
    fontSize: 20,
    fontWeight: "700",
    color: "#14532D",
  },
  forecastSection: {
    marginTop: 28,
  },
  sectionTitle: {
    fontSize: 21,
    fontWeight: "700",
    color: "#14532D",
  },
  sectionSubtitle: {
    marginTop: 4,
    fontSize: 13,
    color: "#4B6B57",
  },
  forecastList: {
    gap: 12,
    paddingTop: 14,
    paddingBottom: 4,
  },
  forecastCard: {
    width: 150,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#DCEAE0",
    backgroundColor: "#FFFFFF",
  },
  forecastDate: {
    fontSize: 14,
    fontWeight: "700",
    color: "#14532D",
    textTransform: "capitalize",
  },
  weatherSymbol: {
    marginTop: 10,
    fontSize: 31,
  },
  forecastDescription: {
    minHeight: 38,
    marginTop: 6,
    fontSize: 13,
    lineHeight: 18,
    color: "#4B6B57",
  },
  forecastTemperatures: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
  },
  maximumTemperature: {
    fontSize: 21,
    fontWeight: "700",
    color: "#14532D",
  },
  minimumTemperature: {
    fontSize: 17,
    fontWeight: "600",
    color: "#6B8375",
  },
  forecastRain: {
    marginTop: 10,
    fontSize: 12,
    fontWeight: "600",
    color: "#1B5E8C",
  },
  forecastPrecipitation: {
    marginTop: 3,
    fontSize: 11,
    color: "#6B8375",
  },
  errorCard: {
    alignItems: "center",
    marginTop: 24,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#F3B8B8",
    backgroundColor: "#FFF3F3",
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#8B1E1E",
    textAlign: "center",
  },
  errorMessage: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
    color: "#704040",
    textAlign: "center",
  },
  button: {
    marginTop: 16,
    paddingVertical: 11,
    paddingHorizontal: 22,
    borderRadius: 12,
    backgroundColor: "#14532D",
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  updateButton: {
    alignItems: "center",
    marginTop: 24,
    paddingVertical: 13,
    borderRadius: 14,
    backgroundColor: "#E3F0FA",
  },
  updateButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1B5E8C",
  },
  disclaimer: {
    marginTop: 24,
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
    color: "#6B8375",
  },
});