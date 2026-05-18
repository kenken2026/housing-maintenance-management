import { dbInstance } from "lib/db"
import { model } from "."

type HouseRaw = Omit<House, "floorInformation" | "exteriorInformation" | "residenceInformation" | "checkListTemplate"> & {
  floorInformation?: string
  exteriorInformation?: string
  residenceInformation?: string
  checkListTemplate?: string
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
    }): Promise<number> => {
      const result = await db.execute(
        `INSERT INTO houses (
        name, description, latitude, longitude, altitude, uid, teamId, floorCount, roomCount, stepCount, floorInformation, exteriorInformation, residenceInformation, checkListTemplate
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
        ]
      )
      return result.lastInsertId
    },
  }
}
