import { useSQLiteContext } from "expo-sqlite";
import {
    createContext,
    type PropsWithChildren,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    deleteFavoriteLocation,
    getFavoriteLocationIds,
    saveFavoriteLocation,
} from "@/lib/database/favorites-repository";

type FavoritesContextValue = {
  favoriteIds: string[];
  loading: boolean;
  error: string | null;
  isFavorite: (locationId: string) => boolean;
  addFavorite: (locationId: string) => Promise<void>;
  removeFavorite: (locationId: string) => Promise<void>;
  refreshFavorites: () => Promise<void>;
};

const FavoritesContext =
  createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({
  children,
}: PropsWithChildren) {
  const database = useSQLiteContext();

  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshFavorites = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const storedFavoriteIds =
        await getFavoriteLocationIds(database);

      setFavoriteIds(storedFavoriteIds);
    } catch {
      setError(
        "No se pudieron consultar las ubicaciones favoritas.",
      );
    } finally {
      setLoading(false);
    }
  }, [database]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      void refreshFavorites();
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [refreshFavorites]);

  const addFavorite = useCallback(
    async (locationId: string) => {
      setError(null);

      try {
        await saveFavoriteLocation(database, locationId);
        await refreshFavorites();
      } catch {
        setError(
          "No se pudo guardar la ubicación como favorita.",
        );
      }
    },
    [database, refreshFavorites],
  );

  const removeFavorite = useCallback(
    async (locationId: string) => {
      setError(null);

      try {
        await deleteFavoriteLocation(database, locationId);
        await refreshFavorites();
      } catch {
        setError(
          "No se pudo eliminar la ubicación de favoritos.",
        );
      }
    },
    [database, refreshFavorites],
  );

  const isFavorite = useCallback(
    (locationId: string) =>
      favoriteIds.includes(locationId),
    [favoriteIds],
  );

  const contextValue = useMemo(
    () => ({
      favoriteIds,
      loading,
      error,
      isFavorite,
      addFavorite,
      removeFavorite,
      refreshFavorites,
    }),
    [
      favoriteIds,
      loading,
      error,
      isFavorite,
      addFavorite,
      removeFavorite,
      refreshFavorites,
    ],
  );

  return (
    <FavoritesContext.Provider value={contextValue}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);

  if (!context) {
    throw new Error(
      "useFavorites debe utilizarse dentro de FavoritesProvider.",
    );
  }

  return context;
}