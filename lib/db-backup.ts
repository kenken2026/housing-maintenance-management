import { dbInstance } from "lib/db"

type BackupData = {
  version: number
  exportedAt: string
  teams: Team[]
  houses: Record<string, unknown>[]
  inspects: Record<string, unknown>[]
  comments: HouseComment[]
}

export const exportDB = async (): Promise<void> => {
  const db = dbInstance
  if (!db) throw new Error("Database is not initialized")

  const [teams, houses, inspects, comments] = await Promise.all([
    db.select<Team[]>("SELECT * FROM teams ORDER BY id"),
    db.select<Record<string, unknown>[]>("SELECT * FROM houses ORDER BY id"),
    db.select<Record<string, unknown>[]>("SELECT * FROM inspects ORDER BY id"),
    db.select<HouseComment[]>("SELECT * FROM comments ORDER BY id"),
  ])

  const backup: BackupData = {
    version: 1,
    exportedAt: new Date().toISOString(),
    teams,
    houses,
    inspects,
    comments,
  }

  const blob = new Blob([JSON.stringify(backup, null, 2)], {
    type: "application/json",
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `housing-backup-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}

export const importDB = async (file: File): Promise<void> => {
  const db = dbInstance
  if (!db) throw new Error("Database is not initialized")

  const text = await file.text()
  const backup = JSON.parse(text) as BackupData

  if (backup.version !== 1) throw new Error(`Unsupported version: ${backup.version}`)

  // 全テーブル削除（外部キー順: comments → inspects → houses → teams）
  await db.execute("DELETE FROM comments WHERE id > 0")
  await db.execute("DELETE FROM inspects WHERE id > 0")
  await db.execute("DELETE FROM houses WHERE id > 0")
  await db.execute("DELETE FROM teams WHERE id > 0")

  for (const t of backup.teams) {
    await db.execute(
      "INSERT INTO teams (id, name, description, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)",
      [t.id, t.name, t.description ?? null, t.createdAt, t.updatedAt]
    )
  }

  for (const h of backup.houses) {
    await db.execute(
      `INSERT INTO houses (id, name, description, latitude, longitude, altitude, teamId, floorCount, roomCount, stepCount, uid, floorInformation, exteriorInformation, checkListTemplate, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        h.id,
        h.name,
        h.description ?? null,
        h.latitude,
        h.longitude,
        h.altitude ?? null,
        h.teamId,
        h.floorCount,
        h.roomCount,
        h.stepCount,
        h.uid ?? null,
        h.floorInformation != null
          ? typeof h.floorInformation === "string"
            ? h.floorInformation
            : JSON.stringify(h.floorInformation)
          : null,
        h.exteriorInformation != null
          ? typeof h.exteriorInformation === "string"
            ? h.exteriorInformation
            : JSON.stringify(h.exteriorInformation)
          : null,
        h.checkListTemplate != null
          ? typeof h.checkListTemplate === "string"
            ? h.checkListTemplate
            : JSON.stringify(h.checkListTemplate)
          : null,
        h.createdAt,
        h.updatedAt,
      ]
    )
  }

  for (const i of backup.inspects) {
    await db.execute(
      `INSERT INTO inspects (id, description, houseId, status, payload, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        i.id,
        i.description ?? null,
        i.houseId,
        i.status,
        i.payload != null
          ? typeof i.payload === "string"
            ? i.payload
            : JSON.stringify(i.payload)
          : null,
        i.createdAt,
        i.updatedAt,
      ]
    )
  }

  for (const c of backup.comments) {
    await db.execute(
      `INSERT INTO comments (id, houseId, inspectId, latitude, longitude, altitude, body, image, uid, uname, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        c.id,
        c.houseId,
        c.inspectId ?? null,
        c.latitude,
        c.longitude,
        c.altitude ?? null,
        c.body ?? null,
        c.image ?? null,
        c.uid ?? null,
        c.uname ?? null,
        c.createdAt,
        c.updatedAt,
      ]
    )
  }
}
