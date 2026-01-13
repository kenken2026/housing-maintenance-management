import { dbInstance } from "lib/db"
import { model } from "."

export const inspectModel = () => {
  const db = dbInstance
  if (!db) throw new Error("Database is not initialized")
  const base = model<Inspect>({ db, tableName: "inspects" })

  return {
    ...base,
    index: async ({ houseId }: { houseId: number }): Promise<Inspect[]> =>
      db.select(
        `SELECT * FROM inspects where houseId = ? ORDER BY updatedAt DESC`,
        [houseId]
      ),
    create: async ({
      houseId,
      status,
      description,
      payload,
    }: {
      houseId: number
      status: string
      description?: string
      payload?: object
    }): Promise<number> => {
      const result = await db.execute(
        `INSERT INTO inspects (houseId, status, description, payload) VALUES (?, ?, ?, ?)`,
        [houseId, status, description || null, payload]
      )
      return result.lastInsertId
    },
    update: async ({
      id,
      status,
      description,
      payload,
    }: {
      id: number
      status: string
      description?: string
      payload?: object
    }): Promise<number> => {
      const result = await db.execute(
        `UPDATE inspects SET status = ?, description = ?, payload = ? WHERE id = ?`,
        [status, description || null, payload, id]
      )
      return result.lastInsertId
    },
  }
}
