import type { StyleSpecification } from "maplibre-gl"

export const TILE_CONFIGS = {
  OpenStreetMap: {
    tiles: [
      "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
      "https://b.tile.openstreetmap.org/{z}/{x}/{y}.png",
      "https://c.tile.openstreetmap.org/{z}/{x}/{y}.png",
    ],
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
  GSI: {
    tiles: ["https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png"],
    attribution:
      '<a href="https://maps.gsi.go.jp/development/ichiran.html">国土地理院</a>',
  },
} as const

export const EMPTY_MAP_STYLE: StyleSpecification = {
  version: 8,
  sources: {},
  layers: [],
}

export const DEFAULT_CENTER: Position = { latitude: 35.6809591, longitude: 139.7673068 }

export const MARKER_ICON_SRC = `${process.env.NEXT_PUBLIC_BASE_PATH}/images/marker-icon-2x.png`

const calcCenter = (values: number[]) =>
  (Math.max(...values) + Math.min(...values)) / 2

export const getCenterPosition = (positions: Position[]): Position => ({
  latitude: calcCenter(positions.map((p) => p.latitude)),
  longitude: calcCenter(positions.map((p) => p.longitude)),
})
