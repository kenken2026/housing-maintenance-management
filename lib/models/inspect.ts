import { dbInstance } from "lib/db"
import { model } from "."

export const inspectModel = () => {
  const db = dbInstance
  if (!db) throw new Error("Database is not initialized")
  const base = model<Inspect>({ db, tableName: "inspects" })

  return {
    ...base,
    index: async ({ teamId }: { teamId: number }): Promise<Inspect[]> =>
      db.select(
        `SELECT * FROM inspects where teamId = ? ORDER BY updatedAt DESC`,
        [teamId]
      ),
  }
}
