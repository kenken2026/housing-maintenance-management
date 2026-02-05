import { describe, it, expect, vi } from "vitest"
import { model } from "../index"

const createMockDb = () => ({
  select: vi.fn(),
  execute: vi.fn(),
})

describe("model", () => {
  describe("index", () => {
    it("全レコードをupdatedAt降順で取得する", async () => {
      const db = createMockDb()
      const mockRows = [
        { id: 2, name: "B", updatedAt: "2024-01-02" },
        { id: 1, name: "A", updatedAt: "2024-01-01" },
      ]
      db.select.mockResolvedValue(mockRows)

      const m = model({ db: db as never, tableName: "teams" })
      const result = await m.index()

      expect(result).toEqual(mockRows)
      expect(db.select).toHaveBeenCalledWith(
        "SELECT * FROM teams ORDER BY updatedAt DESC"
      )
    })
  })

  describe("show", () => {
    it("指定IDのレコードを返す", async () => {
      const db = createMockDb()
      const mockRow = { id: 1, name: "A" }
      db.select.mockResolvedValue([mockRow])

      const m = model({ db: db as never, tableName: "teams" })
      const result = await m.show(1)

      expect(result).toEqual(mockRow)
      expect(db.select).toHaveBeenCalledWith(
        "SELECT * FROM teams WHERE id = ? LIMIT 1",
        [1]
      )
    })

    it("レコードが見つからない場合undefinedを返す", async () => {
      const db = createMockDb()
      db.select.mockResolvedValue([])

      const m = model({ db: db as never, tableName: "teams" })
      const result = await m.show(999)

      expect(result).toBeUndefined()
    })
  })

  describe("delete", () => {
    it("指定IDのレコードを削除する", async () => {
      const db = createMockDb()
      db.execute.mockResolvedValue({ rowsAffected: 1 })

      const m = model({ db: db as never, tableName: "teams" })
      await m.delete(1)

      expect(db.execute).toHaveBeenCalledWith(
        "DELETE FROM teams WHERE id = ?",
        [1]
      )
    })
  })
})
