import { dbInstance } from "lib/db"
import { model } from "."

export const houseModel = () => {
  const db = dbInstance
  if (!db) throw new Error("Database is not initialized")
  const base = model<House>({ db, tableName: "houses" })
  return {
    ...base,
    index: async ({ teamId }: { teamId: number }): Promise<House[]> =>
      db.select(
        `SELECT * FROM houses where teamId = ? ORDER BY updatedAt DESC`,
        [teamId]
      ),
    create: async ({
      name,
      description,
      latitude,
      longitude,
      altitude,
      uid,
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
      uid?: string
      teamId: number
      floorCount: number
      roomCount: number
      stepCount: number
    }): Promise<number> => {
      const result = await db.execute(
        `INSERT INTO houses (
        name, description, latitude, longitude, altitude, uid, teamId, floorCount, roomCount, stepCount
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          name,
          description ?? null,
          latitude,
          longitude,
          altitude ?? null,
          uid ?? null,
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
