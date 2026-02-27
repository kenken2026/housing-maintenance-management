"use client"

import { TILE_CONFIGS } from "lib/map"
import { useMapTypeState } from "lib/store"
import { TileLayer } from "react-leaflet"

export const MapTileLayer = () => {
  const { mapType } = useMapTypeState()
  const config = TILE_CONFIGS[mapType ?? "OpenStreetMap"]
  return <TileLayer attribution={config.attribution} url={config.url} />
}
