import type { SQLiteDatabase } from "expo-sqlite";

type FavoriteRow = {
  location_id: string;
};

export async function initializeDatabase(
  database: SQLiteDatabase,
) {
  await database.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS favorites (
      location_id TEXT PRIMARY KEY NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

export async function getFavoriteLocationIds(
  database: SQLiteDatabase,
) {
  const rows = await database.getAllAsync<FavoriteRow>(
    `
      SELECT location_id
      FROM favorites
      ORDER BY created_at DESC
    `,
  );

  return rows.map((row) => row.location_id);
}

export async function saveFavoriteLocation(
  database: SQLiteDatabase,
  locationId: string,
) {
  await database.runAsync(
    `
      INSERT OR IGNORE INTO favorites (location_id)
      VALUES (?)
    `,
    locationId,
  );
}

export async function deleteFavoriteLocation(
  database: SQLiteDatabase,
  locationId: string,
) {
  await database.runAsync(
    `
      DELETE FROM favorites
      WHERE location_id = ?
    `,
    locationId,
  );
}