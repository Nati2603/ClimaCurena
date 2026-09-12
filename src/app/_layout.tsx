import { Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";

import { FavoritesProvider } from "@/context/FavoritesContext";
import { initializeDatabase } from "@/lib/database/favorites-repository";

export default function RootLayout() {
  return (
    <SQLiteProvider
      databaseName="clima-curena.db"
      onInit={initializeDatabase}
    >
      <FavoritesProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </FavoritesProvider>
    </SQLiteProvider>
  );
}