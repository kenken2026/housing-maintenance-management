import { dbInstance } from "lib/db"
import { model } from "."

export const commentModel = () => {
  const db = dbInstance
  if (!db) throw new Error("Database is not initialized")
  const base = model<HouseComment>({ db, tableName: "comments" })

  return {
    ...base,
    index: async ({ houseId }: { houseId: number }): Promise<HouseComment[]> =>
      await db.select<HouseComment[]>(
        `SELECT * FROM comments where houseId = ? ORDER BY createdAt DESC`,
        [houseId]
      ),
    create: async ({
      houseId,
      inspectId,
      latitude,
      longitude,
      altitude,
      body,
      image,
      uid,
      uname,
    }: {
      houseId: number
      inspectId?: number
      latitude: number
      longitude: number
      altitude?: number
      body?: string
      image?: string
      uid?: string
      uname?: string
    }): Promise<number> => {
      const result = await db.execute(
        `INSERT INTO comments
        (houseId, inspectId, latitude, longitude, altitude, body, image, uid, uname)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          houseId,
          inspectId ?? null,
          latitude,
          longitude,
          altitude ?? null,
          body ?? null,
          image ?? null,
          uid ?? null,
          uname ?? null,
        ]
      )
      return result.lastInsertId
    },
    update: async ({
      id,
      latitude,
      longitude,
      altitude,
      body,
      image,
    }: {
      id: number
      latitude: number
      longitude: number
      altitude?: number
      body?: string
      image?: string
    }): Promise<number> => {
      const result = await db.execute(
        `UPDATE comments SET
        latitude = ?, longitude = ?, altitude = ?, body = ?, image = ?, updatedAt = ?
        WHERE id = ?`,
        [
          latitude,
          longitude,
          altitude,
          body,
          image,
          new Date().toISOString(),
          id,
        ]
      )
      return result.lastInsertId
    },
  }
}
