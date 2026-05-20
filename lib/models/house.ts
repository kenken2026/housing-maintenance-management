import { dbInstance } from "lib/db"
import { model } from "."

type HouseRaw = Omit<House, "floorInformation" | "exteriorInformation" | "residenceInformation" | "checkListTemplate" | "unitPositions"> & {
  floorInformation?: string
  exteriorInformation?: string
  residenceInformation?: string
  checkListTemplate?: string
  unitPositions?: string
}

const parseHouse = (raw: HouseRaw): House => ({
  ...raw,
  floorInformation: raw.floorInformation
    ? (JSON.parse(raw.floorInformation) as FloorInformation)
    : undefined,
  exteriorInformation: raw.exteriorInformation
    ? (JSON.parse(raw.exteriorInformation) as ExteriorInformation)
    : undefined,
  residenceInformation: raw.residenceInformation
    ? (JSON.parse(raw.residenceInformation) as ResidenceInformation)
    : undefined,
  checkListTemplate: raw.checkListTemplate
    ? (JSON.parse(raw.checkListTemplate) as CheckTemplate[])
    : undefined,
  unitPositions: raw.unitPositions
    ? (JSON.parse(raw.unitPositions) as Record<string, Position>)
    : undefined,
})

export const houseModel = () => {
  const db = dbInstance
  if (!db) throw new Error("Database is not initialized")
  const base = model<House>({ db, tableName: "houses" })
  return {
    ...base,
    index: async ({ teamId }: { teamId: number }): Promise<House[]> => {
      const rows = await db.select<HouseRaw[]>(
        `SELECT * FROM houses where teamId = ? ORDER BY updatedAt DESC`,
        [teamId]
      )
      return rows.map(parseHouse)
    },
    show: async (id: number): Promise<House | undefined> => {
      const rows = await db.select<HouseRaw[]>(
        `SELECT * FROM houses WHERE id = ? LIMIT 1`,
        [id]
      )
      return rows[0] ? parseHouse(rows[0]) : undefined
    },
    create: async ({
      name,
      description,
      latitude,
      longitude,
      altitude,
      uid,
      teamId,
      floorCount,
      roomCount,
      stepCount,
      floorInformation,
      exteriorInformation,
      residenceInformation,
      checkListTemplate,
      orientation,
      roomWidth,
      roomDepth,
    }: {
      name: string
      description?: string
      latitude: number
      longitude: number
      altitude?: number
      uid?: string
      teamId: number
      floorCount: number
      roomCount: number
      stepCount: number
      floorInformation?: FloorInformation
      exteriorInformation?: ExteriorInformation
      residenceInformation?: ResidenceInformation
      checkListTemplate?: CheckTemplate[]
      unitPositions?: Record<string, Position>
      orientation?: number
      roomWidth?: number
      roomDepth?: number
    }): Promise<number> => {
      const result = await db.execute(
        `INSERT INTO houses (
        name, description, latitude, longitude, altitude, uid, teamId, floorCount, roomCount, stepCount, floorInformation, exteriorInformation, residenceInformation, checkListTemplate, orientation, roomWidth, roomDepth
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          name,
          description ?? null,
          latitude,
          longitude,
          altitude ?? null,
          uid ?? null,
          teamId,
          floorCount,
          roomCount,
          stepCount,
          floorInformation ? JSON.stringify(floorInformation) : null,
          exteriorInformation ? JSON.stringify(exteriorInformation) : null,
          residenceInformation ? JSON.stringify(residenceInformation) : null,
          checkListTemplate ? JSON.stringify(checkListTemplate) : null,
          orientation ?? null,
          roomWidth ?? null,
          roomDepth ?? null,
        ]
      )
      return result.lastInsertId
    },
    updateUnitPositions: async (
      id: number,
      unitPositions: Record<string, Position>
    ): Promise<void> => {
      await db.execute(
        `UPDATE houses SET unitPositions = ?, updatedAt = datetime('now') WHERE id = ?`,
        [JSON.stringify(unitPositions), id]
      )
    },
  }
}
