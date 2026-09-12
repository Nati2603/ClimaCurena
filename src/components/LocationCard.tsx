import { Pressable, StyleSheet, Text, View } from "react-native";

type LocationCardProps = {
  name: string;
  description: string;
  onPress: () => void;
};

/** Tarjeta reutilizable para seleccionar una comunidad. */
export function LocationCard({
  name,
  description,
  onPress,
}: LocationCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Consultar el clima de ${name}`}
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        pressed && styles.cardPressed,
      ]}
    >
      <View style={styles.accent} />

      <View style={styles.content}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.description}>{description}</Text>
        <Text style={styles.action}>Consultar clima →</Text>
      </View>
    </Pressable>
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
  cardPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.99 }],
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
  action: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: "600",
    color: "#1B5E8C",
  },
});