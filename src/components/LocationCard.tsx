import { Pressable, StyleSheet, Text, View } from "react-native";

type LocationCardProps = {
  name: string;
  description: string;
  favorite: boolean;
  onPress: () => void;
  onToggleFavorite: () => void;
};

export function LocationCard({
  name,
  description,
  favorite,
  onPress,
  onToggleFavorite,
}: LocationCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.accent} />

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Consultar el clima de ${name}`}
        onPress={onPress}
        style={({ pressed }) => [
          styles.contentButton,
          pressed && styles.pressed,
        ]}
      >
        <Text style={styles.name}>{name}</Text>

        <Text style={styles.description}>
          {description}
        </Text>

        <Text style={styles.action}>
          Consultar clima →
        </Text>
      </Pressable>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={
          favorite
            ? `Eliminar ${name} de favoritos`
            : `Guardar ${name} como favorita`
        }
        onPress={onToggleFavorite}
        hitSlop={8}
        style={({ pressed }) => [
          styles.favoriteButton,
          pressed && styles.pressed,
        ]}
      >
        <Text
          style={[
            styles.favoriteIcon,
            favorite && styles.favoriteIconSelected,
          ]}
        >
          {favorite ? "★" : "☆"}
        </Text>
      </Pressable>
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
    shadowOffset: {
      width: 0,
      height: 3,
    },
    elevation: 2,
  },
  accent: {
    width: 6,
    backgroundColor: "#3F9D5B",
  },
  contentButton: {
    flex: 1,
    paddingVertical: 16,
    paddingLeft: 16,
    paddingRight: 8,
  },
  pressed: {
    opacity: 0.65,
  },
  name: {
    paddingRight: 6,
    fontSize: 17,
    fontWeight: "600",
    color: "#14532D",
  },
  description: {
    marginTop: 4,
    fontSize: 14,
    lineHeight: 20,
    color: "#4B6B57",
  },
  action: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: "600",
    color: "#1B5E8C",
  },
  favoriteButton: {
    alignSelf: "flex-start",
    alignItems: "center",
    justifyContent: "center",
    width: 52,
    height: 58,
  },
  favoriteIcon: {
    fontSize: 30,
    color: "#8AA095",
  },
  favoriteIconSelected: {
    color: "#E0A800",
  },
});