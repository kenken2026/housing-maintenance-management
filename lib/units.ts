import { OuteriorUnits, ResidenceUnits } from "lib/constants"

export const getUnitName = (uid: string): string => {
  const exterior = OuteriorUnits.find((u) => u.uid === uid)
  if (exterior) return exterior.name
  const residence = ResidenceUnits.find((u) => u.uid === uid)
  if (residence) return residence.name
  const roomMatch = uid.match(/^f(\d+)r(\d+)$/)
  if (roomMatch)
    return `${parseInt(roomMatch[1]) + 1}階 部屋${parseInt(roomMatch[2]) + 1}`
  const stairMatch = uid.match(/^f(\d+)s(\d+)$/)
  if (stairMatch)
    return `${parseInt(stairMatch[1]) + 1}階 階段${parseInt(stairMatch[2]) + 1}`
  return uid
}
