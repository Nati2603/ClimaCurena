import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useMemo } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { LocationCard } from "@/components/LocationCard";
import { useFavorites } from "@/context/FavoritesContext";
import { LOCATIONS, type Location } from "@/data/locations";

export default function Index() {
  const router = useRouter();

  const {
    favoriteIds,
    loading,
    error,
    isFavorite,
    addFavorite,
    removeFavorite,
  } = useFavorites();

  const orderedLocations = useMemo(() => {
    const favoriteLocations = LOCATIONS.filter((location) =>
      favoriteIds.includes(location.id),
    );

    const otherLocations = LOCATIONS.filter(
      (location) => !favoriteIds.includes(location.id),
    );

    return [...favoriteLocations, ...otherLocations];
  }, [favoriteIds]);

  async function toggleFavorite(locationId: string) {
    if (isFavorite(locationId)) {
      await removeFavorite(locationId);
      return;
    }

    await addFavorite(locationId);
  }

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={["top", "left", "right"]}
    >
      <StatusBar style="dark" />

      <FlatList<Location>
        data={orderedLocations}
        keyExtractor={(location) => location.id}
        renderItem={({ item }) => (
          <LocationCard
            name={item.name}
            description={item.description}
            favorite={isFavorite(item.id)}
            onPress={() =>
              router.push({
                pathname: "/location/[id]",
                params: {
                  id: item.id,
                },
              })
            }
            onToggleFavorite={() => {
              void toggleFavorite(item.id);
            }}
          />
        )}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => (
          <View style={styles.separator} />
        )}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>
              Clima Cureña
            </Text>

            <Text style={styles.subtitle}>
              Información meteorológica de comunidades
              cercanas a Unión del Toro
            </Text>

            <View style={styles.hint}>
              <Text style={styles.hintText}>
                Selecciona una comunidad para consultar su
                clima
              </Text>
            </View>

            <View style={styles.favoritesSummary}>
              {loading ? (
                <>
                  <ActivityIndicator
                    size="small"
                    color="#14532D"
                  />

                  <Text style={styles.favoritesText}>
                    Consultando favoritos...
                  </Text>
                </>
              ) : (
                <>
                  <Text style={styles.summaryStar}>★</Text>

                  <View style={styles.summaryContent}>
                    <Text style={styles.favoritesTitle}>
                      Mis comunidades favoritas
                    </Text>

                    <Text style={styles.favoritesText}>
                      {favoriteIds.length === 0
                        ? "Todavía no has guardado ninguna."
                        : `${favoriteIds.length} ${
                            favoriteIds.length === 1
                              ? "comunidad guardada"
                              : "comunidades guardadas"
                          }. Aparecen primero en la lista.`}
                    </Text>
                  </View>
                </>
              )}
            </View>

            {error && (
              <Text style={styles.favoritesError}>
                {error}
              </Text>
            )}
          </View>
        }
        ListFooterComponent={
          <Text style={styles.disclaimer}>
            Los pronósticos no sustituyen los avisos
            oficiales de las autoridades.
          </Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F1F7F4",
  },
  listContent: {
    width: "100%",
    maxWidth: 560,
    alignSelf: "center",
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 20,
    gap: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#14532D",
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: "#4B6B57",
  },
  hint: {
    marginTop: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#BFDCF0",
    backgroundColor: "#E3F0FA",
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  hintText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1B5E8C",
  },
  favoritesSummary: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 8,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#EAD99B",
    backgroundColor: "#FFFBEA",
  },
  summaryStar: {
    fontSize: 27,
    color: "#E0A800",
  },
  summaryContent: {
    flex: 1,
  },
  favoritesTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#14532D",
  },
  favoritesText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    color: "#4B6B57",
  },
  favoritesError: {
    fontSize: 13,
    lineHeight: 18,
    color: "#8B1E1E",
  },
  separator: {
    height: 12,
  },
  disclaimer: {
    marginTop: 24,
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
    color: "#6B8375",
  },
});