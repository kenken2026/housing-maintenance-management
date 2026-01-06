import Database from "@tauri-apps/plugin-sql"

export let dbInstance: Database | undefined = undefined

export const initializeDB = async (): Promise<Database> => {
  if (dbInstance) return dbInstance
  try {
    dbInstance = await Database.load("sqlite:housing-maintanance-management.db")
    await createTable(dbInstance)

    return dbInstance
  } catch (error) {
    console.error("Database initialization failed:", error)
    throw error
  }
}

const createTable = async (database) => {
  await database.execute(
    `CREATE TABLE IF NOT EXISTS teams(
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    )`
  )
  await database.execute(
    `CREATE TABLE IF NOT EXISTS houses(
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,

    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),

    latitude  REAL NOT NULL CHECK (latitude  BETWEEN -90  AND 90),
    longitude REAL NOT NULL CHECK (longitude BETWEEN -180 AND 180),
    altitude  REAL,

    team_id INTEGER,

    floor_count INTEGER NOT NULL DEFAULT 1 CHECK (floor_count > 0),
    room_count  INTEGER NOT NULL DEFAULT 1 CHECK (room_count  > 0),
    step_count  INTEGER NOT NULL DEFAULT 1 CHECK (step_count  >= 0),

    udid TEXT UNIQUE,

    floor_information        JSON,
    exterior_information     JSON,
    check_list_template      JSON,

    FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE
    )`
  )

  await database.execute(
    `CREATE TABLE IF NOT EXISTS comments(
    id INTEGER PRIMARY KEY,

    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),

    latitude  REAL NOT NULL CHECK (latitude  BETWEEN -90  AND 90),
    longitude REAL NOT NULL CHECK (longitude BETWEEN -180 AND 180),
    altitude  REAL,

    house_id INTEGER,

    body TEXT,
    image TEXT,
    unit_name TEXT,

    FOREIGN KEY (house_id) REFERENCES houses(id) ON DELETE CASCADE
    )`
  )

  await database.execute(
    `CREATE TABLE IF NOT EXISTS inspects(
    id INTEGER PRIMARY KEY,
    description TEXT,

    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),

    house_id INTEGER,
    body JSON,

    FOREIGN KEY (house_id) REFERENCES houses(id) ON DELETE CASCADE
    )`
  )
}
