import Database from "@tauri-apps/plugin-sql"
import { dbInstance } from "../db"

export const model = <T>({
  db,
  tableName,
}: {
  db: Database
  tableName: string
}) => ({
  index: async (): Promise<T[]> => db.select(`SELECT * FROM ${tableName}`),

  show: async (id: number): Promise<T | undefined> => {
    const rows = await db.select<T[]>(
      `SELECT * FROM ${tableName} WHERE id = ? LIMIT 1`,
      [id]
    )
    return rows[0] ?? undefined
  },

  delete: async (id: number) =>
    db.execute(`DELETE FROM ${tableName} WHERE id = ?`, [id]),
})

export const teamModel = () => {
  const db = dbInstance
  if (!db) throw new Error("Database is not initialized")
  const base = model<Team>({ db, tableName: "teams" })

  return {
    ...base,
    create: async ({
      name,
      description,
    }: {
      name: string
      description?: string
    }): Promise<number> => {
      const result = await db.execute(
        `INSERT INTO teams (name, description) VALUES (?, ?)`,
        [name, description ?? null]
      )
      return result.lastInsertId as number
    },
  }
}

export const houseModel = () => {
  const db = dbInstance
  if (!db) throw new Error("Database is not initialized")
  const base = model<House>({ db, tableName: "houses" })
  return {
    ...base,
    index: async ({ teamId }: { teamId: number }): Promise<House[]> =>
      db.select(`SELECT * FROM houses where teamId = ?`, [teamId]),
    create: async ({
      name,
      description,
      latitude,
      longitude,
      altitude,
      teamId,
      floorCount,
      roomCount,
      stepCount,
    }: {
      name: string
      description?: string
      latitude: number
      longitude: number
      altitude?: number
      teamId: number
      floorCount: number
      roomCount: number
      stepCount: number
    }): Promise<number> => {
      const result = await db.execute(
        `INSERT INTO houses (
        name, description, latitude, longitude, altitude, teamId, floorCount, roomCount, stepCount
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          name,
          description ?? null,
          latitude,
          longitude,
          altitude ?? null,
          teamId,
          floorCount,
          roomCount,
          stepCount,
        ]
      )
      return result.lastInsertId
    },
  }
}
