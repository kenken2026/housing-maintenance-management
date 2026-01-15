import { dbInstance } from "lib/db"
import { model } from "."

export const inspectModel = () => {
  const db = dbInstance
  if (!db) throw new Error("Database is not initialized")
  const base = model<Inspect>({ db, tableName: "inspects" })

  return {
    ...base,
    index: async ({ houseId }: { houseId: number }): Promise<Inspect[]> => {
      const rows = await db.select<(Inspect & { payload?: string })[]>(
        `SELECT * FROM inspects where houseId = ? ORDER BY updatedAt DESC`,
        [houseId]
      )
      return rows.map(
        (row): Inspect => ({
          ...row,
          payload: row.payload
            ? (JSON.parse(row.payload as string) as UnitCheck[])
            : [],
        })
      )
    },
    show: async ({ id }: { id: number }): Promise<Inspect> => {
      const rows = await db.select<(Inspect & { payload?: string })[]>(
        `SELECT * FROM inspects where id = ? `,
        [id]
      )
      const row = rows[0]
      return {
        ...row,
        payload: row.payload ? (JSON.parse(row.payload) as UnitCheck[]) : [],
      }
    },
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
        `UPDATE inspects SET status = ?, description = ?, payload = ?, updatedAt = ? WHERE id = ?`,
        [status, description || null, payload, new Date().toISOString(), id]
      )
      return result.lastInsertId
    },
  }
}
