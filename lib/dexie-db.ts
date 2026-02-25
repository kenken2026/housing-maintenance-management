import Dexie, { type Table } from "dexie"

class HousingDB extends Dexie {
  teams!: Table<Team>
  houses!: Table<House>
  inspects!: Table<Inspect>
  comments!: Table<Comment>

  constructor() {
    super("housing-maintenance-management")
    this.version(1).stores({
      teams: "++id, updatedAt",
      houses: "++id, teamId, updatedAt",
      inspects: "++id, houseId, createdAt",
      comments: "++id, houseId, createdAt",
    })
  }
}

// オブジェクトを JSON 文字列にシリアライズ（DB に格納する前に使用）
const serializeValue = (val: unknown): unknown => {
  if (val !== null && val !== undefined && typeof val === "object") {
    return JSON.stringify(val)
  }
  return val
}

export class DexieAdapter {
  private db: HousingDB

  constructor() {
    this.db = new HousingDB()
  }

  private getTable(tableName: string): Table<Record<string, unknown>> {
    const tables: Record<string, Table> = {
      teams: this.db.teams,
      houses: this.db.houses,
      inspects: this.db.inspects,
      comments: this.db.comments,
    }
    const table = tables[tableName.toLowerCase()]
    if (!table) throw new Error(`Unknown table: ${tableName}`)
    return table as Table<Record<string, unknown>>
  }

  async select<T>(sql: string, params: unknown[] = []): Promise<T> {
    const normalized = sql.trim().replace(/\s+/g, " ")

    const fromMatch = normalized.match(/FROM\s+(\w+)/i)
    if (!fromMatch) throw new Error(`Cannot parse SQL: ${sql}`)
    const table = this.getTable(fromMatch[1])

    const whereMatch = normalized.match(/WHERE\s+(\w+)\s*=\s*\?/i)
    const orderByMatch = normalized.match(/ORDER BY\s+(\w+)\s*(DESC|ASC)?/i)
    const limitMatch = normalized.match(/LIMIT\s+(\d+)/i)

    let results: Record<string, unknown>[]

    if (whereMatch) {
      const col = whereMatch[1]
      const val = params[0]
      if (col.toLowerCase() === "id") {
        const item = await table.get(val as number)
        results = item ? [item] : []
      } else {
        results = await table
          .where(col)
          .equals(val as string | number)
          .toArray()
      }
    } else {
      results = await table.toArray()
    }

    if (orderByMatch) {
      const sortCol = orderByMatch[1]
      const isDesc = (orderByMatch[2] ?? "DESC").toUpperCase() === "DESC"
      results.sort((a, b) => {
        const aVal = String(a[sortCol] ?? "")
        const bVal = String(b[sortCol] ?? "")
        return isDesc ? bVal.localeCompare(aVal) : aVal.localeCompare(bVal)
      })
    }

    if (limitMatch) {
      results = results.slice(0, parseInt(limitMatch[1]))
    }

    return results as T
  }

  async execute(
    sql: string,
    params: unknown[] = []
  ): Promise<{ lastInsertId: number }> {
    const normalized = sql.trim().replace(/\s+/g, " ")

    // CREATE TABLE — no-op（スキーマは Dexie コンストラクタで定義）
    if (/^\s*CREATE\s+TABLE/i.test(normalized)) {
      return { lastInsertId: 0 }
    }

    // DELETE FROM table WHERE id = ?
    const deleteMatch = normalized.match(
      /DELETE\s+FROM\s+(\w+)\s+WHERE\s+id\s*=\s*\?/i
    )
    if (deleteMatch) {
      const table = this.getTable(deleteMatch[1])
      await table.delete(params[0] as number)
      return { lastInsertId: 0 }
    }

    // INSERT INTO table (col1, col2, ...) VALUES (?, ?, ...)
    const insertMatch = normalized.match(
      /INSERT\s+INTO\s+(\w+)\s*\(([^)]+)\)\s*VALUES\s*\(([^)]+)\)/i
    )
    if (insertMatch) {
      const tableName = insertMatch[1]
      const columns = insertMatch[2].split(",").map((c) => c.trim())
      const table = this.getTable(tableName)
      const now = new Date().toISOString()
      const obj: Record<string, unknown> = { createdAt: now, updatedAt: now }
      columns.forEach((col, i) => {
        obj[col] = serializeValue(params[i])
      })
      const id = await table.add(obj)
      return { lastInsertId: id as number }
    }

    // UPDATE table SET col = ?, ... WHERE id = ?
    const updateMatch = normalized.match(
      /UPDATE\s+(\w+)\s+SET\s+(.+)\s+WHERE\s+id\s*=\s*\?/i
    )
    if (updateMatch) {
      const tableName = updateMatch[1]
      const setPart = updateMatch[2]
      const table = this.getTable(tableName)
      const setCols = setPart
        .split(",")
        .map((s) =>
          s
            .trim()
            .split(/\s*=\s*\?/)[0]
            .trim()
        )
        .filter(Boolean)
      const id = params[params.length - 1] as number
      const changes: Record<string, unknown> = {}
      setCols.forEach((col, i) => {
        changes[col] = serializeValue(params[i])
      })
      await table.update(id, changes)
      return { lastInsertId: id }
    }

    throw new Error(`Cannot parse SQL: ${sql}`)
  }
}
