import { dbInstance } from "lib/db"
import { model } from "."

export const commentModel = () => {
  const db = dbInstance
  if (!db) throw new Error("Database is not initialized")
  const base = model<Comment>({ db, tableName: "comments" })

  return {
    ...base,
    index: async ({ houseId }: { houseId: number }): Promise<Comment[]> =>
      await db.select<Comment[]>(
        `SELECT * FROM comments where houseId = ? ORDER BY createdAt DESC`,
        [houseId]
      ),
    create: async ({
      houseId,
      latitude,
      longitude,
      altitude,
      body,
      image,
      uid,
      uname,
    }: {
      houseId: number
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
        (houseId, latitude, longitude, altitude, body, image, uid, uname)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          houseId,
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
        `UPDATE comment SET
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
