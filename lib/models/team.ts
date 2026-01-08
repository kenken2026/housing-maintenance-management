import { dbInstance } from "lib/db"
import { model } from "."

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
