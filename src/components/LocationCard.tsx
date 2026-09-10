import { StyleSheet, Text, View } from "react-native";

type LocationCardProps = {
  name: string;
  description: string;
};

/** Tarjeta reutilizable para mostrar una comunidad en el listado. */
export function LocationCard({ name, description }: LocationCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.accent} />
      <View style={styles.content}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#DCEAE0",
    overflow: "hidden",
    shadowColor: "#14532D",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  accent: {
    width: 6,
    backgroundColor: "#3F9D5B",
  },
  content: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 16,
    gap: 4,
  },
  name: {
    fontSize: 17,
    fontWeight: "600",
    color: "#14532D",
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: "#4B6B57",
  },
});
