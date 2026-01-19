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
