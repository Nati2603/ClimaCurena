import { StatusBar } from "expo-status-bar";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { LocationCard } from "@/components/LocationCard";
import { LOCATIONS, type Location } from "@/data/locations";

export default function Index() {
  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <StatusBar style="dark" />
      <FlatList<Location>
        data={LOCATIONS}
        keyExtractor={(location) => location.id}
        renderItem={({ item }) => (
          <LocationCard name={item.name} description={item.description} />
        )}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>Clima Cureña</Text>
            <Text style={styles.subtitle}>
              Información meteorológica de comunidades cercanas a Unión del Toro
            </Text>
            <View style={styles.hint}>
              <Text style={styles.hintText}>
                Selecciona una comunidad para consultar su clima
              </Text>
            </View>
          </View>
        }
        ListFooterComponent={
          <Text style={styles.disclaimer}>
            Los pronósticos no sustituyen los avisos oficiales de las
            autoridades
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
