import Database from "@tauri-apps/plugin-sql"

export const model = <T>({
  db,
  tableName,
}: {
  db: Database
  tableName: string
}) => ({
  index: async (): Promise<T[]> =>
    db.select(`SELECT * FROM ${tableName} ORDER BY updatedAt DESC`),

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
