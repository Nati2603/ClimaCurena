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

function WeatherMetric({ label, value }: WeatherMetricProps) {
  return (
    <View style={styles.metric}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
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
          <Text style={styles.errorTitle}>Ubicación no encontrada</Text>

          <Pressable style={styles.button} onPress={() => router.back()}>
            <Text style={styles.buttonText}>Volver</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <StatusBar style="dark" />

      <ScrollView contentContainerStyle={styles.content}>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>← Volver</Text>
        </Pressable>

        <Text style={styles.title}>{location.name}</Text>
        <Text style={styles.description}>{location.description}</Text>

        {weatherState.loading && (
          <View style={styles.centeredContainer}>
            <ActivityIndicator size="large" color="#14532D" />

            <Text style={styles.loadingText}>
              Consultando condiciones meteorológicas...
            </Text>
          </View>
        )}

        {weatherState.error && (
          <View style={styles.errorCard}>
            <Text style={styles.errorTitle}>No se pudo cargar el clima</Text>
            <Text style={styles.errorMessage}>{weatherState.error}</Text>

            <Pressable style={styles.button} onPress={loadWeather}>
              <Text style={styles.buttonText}>Reintentar</Text>
            </Pressable>
          </View>
        )}

        {weatherState.data && (
          <>
            <View style={styles.temperatureCard}>
              <Text style={styles.currentLabel}>Temperatura actual</Text>

              <Text style={styles.temperature}>
                {Math.round(
                  weatherState.data.current.temperature_2m,
                )}
                °C
              </Text>

              <Text style={styles.updatedText}>
                Actualización:{" "}
                {weatherState.data.current.time.replace("T", " ")}
              </Text>
            </View>

            <View style={styles.metricsContainer}>
              <WeatherMetric
                label="Sensación térmica"
                value={`${Math.round(
                  weatherState.data.current.apparent_temperature,
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

            <Pressable style={styles.updateButton} onPress={loadWeather}>
              <Text style={styles.updateButtonText}>
                Actualizar información
              </Text>
            </Pressable>

            <Text style={styles.disclaimer}>
              Los pronósticos no sustituyen los avisos oficiales de las
              autoridades.
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
    marginTop: 20,
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