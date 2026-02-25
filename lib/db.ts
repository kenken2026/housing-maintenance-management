export interface DBAdapter {
  select<T>(sql: string, params?: unknown[]): Promise<T>
  execute(sql: string, params?: unknown[]): Promise<{ lastInsertId: number }>
}

export let dbInstance: DBAdapter | undefined = undefined

const isTauri = (): boolean =>
  typeof window !== "undefined" && "__TAURI_INTERNALS__" in window

export const initializeDB = async (): Promise<DBAdapter> => {
  if (dbInstance) return dbInstance

  if (isTauri()) {
    const { default: Database } = await import("@tauri-apps/plugin-sql")
    const { appDataDir } = await import("@tauri-apps/api/path")
    const { message } = await import("@tauri-apps/plugin-dialog")
    try {
      const dir = await appDataDir()
      const dbPath = dir + "/housing-maintanance-management.db"
      const tauriDb = await Database.load(`sqlite:${dbPath}`)
      await createTable({
        select: tauriDb.select.bind(tauriDb),
        execute: async (sql: string, params?: unknown[]) => {
          const result = await tauriDb.execute(sql, params)
          return { lastInsertId: result.lastInsertId ?? 0 }
        },
      })
      dbInstance = {
        select: tauriDb.select.bind(tauriDb),
        execute: async (sql: string, params?: unknown[]) => {
          const result = await tauriDb.execute(sql, params)
          return { lastInsertId: result.lastInsertId ?? 0 }
        },
      }
    } catch (error: unknown) {
      if (error instanceof Error)
        await message(`${error.message}:\n${error.stack}`, {
          title: error.name,
        })
      else await message(`${error}`, { title: "Database error" })
      throw error
    }
  } else {
    const { DexieAdapter } = await import("./dexie-db")
    dbInstance = new DexieAdapter()
  }

  return dbInstance
}

const createTable = async (database: DBAdapter) => {
  await database.execute(
    `CREATE TABLE IF NOT EXISTS teams(
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    createdAt TEXT NOT NULL DEFAULT (datetime('now')),
    updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
    )`
  )
  await database.execute(
    `CREATE TABLE IF NOT EXISTS houses(
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,

    createdAt TEXT NOT NULL DEFAULT (datetime('now')),
    updatedAt TEXT NOT NULL DEFAULT (datetime('now')),

    latitude  REAL NOT NULL CHECK (latitude  BETWEEN -90  AND 90),
    longitude REAL NOT NULL CHECK (longitude BETWEEN -180 AND 180),
    altitude  REAL,

    teamId INTEGER NOT NULL,

    floorCount INTEGER NOT NULL DEFAULT 1 CHECK (floorCount > 0),
    roomCount  INTEGER NOT NULL DEFAULT 1 CHECK (roomCount  > 0),
    stepCount  INTEGER NOT NULL DEFAULT 1 CHECK (stepCount  >= 0),

    uid TEXT UNIQUE,

    floorInformation        JSON,
    exteriorInformation     JSON,
    checkListTemplate      JSON,

    FOREIGN KEY (teamId) REFERENCES teams(id) ON DELETE CASCADE
    )`
  )

  await database.execute(
    `CREATE TABLE IF NOT EXISTS inspects(
    id INTEGER PRIMARY KEY,
    description TEXT,

    createdAt TEXT NOT NULL DEFAULT (datetime('now')),
    updatedAt TEXT NOT NULL DEFAULT (datetime('now')),

    houseId INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'in_progress',
    payload JSON,

    FOREIGN KEY (houseId) REFERENCES houses(id) ON DELETE CASCADE
    )`
  )

  await database.execute(
    `CREATE TABLE IF NOT EXISTS comments(
    id INTEGER PRIMARY KEY,

    createdAt TEXT NOT NULL DEFAULT (datetime('now')),
    updatedAt TEXT NOT NULL DEFAULT (datetime('now')),

    latitude  REAL NOT NULL CHECK (latitude  BETWEEN -90  AND 90),
    longitude REAL NOT NULL CHECK (longitude BETWEEN -180 AND 180),
    altitude  REAL,

    houseId INTEGER NOT NULL,
    inspectId INTEGER,

    body TEXT,
    image TEXT,
    uname TEXT,
    uid TEXT,

    FOREIGN KEY (houseId) REFERENCES houses(id) ON DELETE CASCADE,
    FOREIGN KEY (inspectId) REFERENCES inspects(id) ON DELETE CASCADE
    )`
  )
}
