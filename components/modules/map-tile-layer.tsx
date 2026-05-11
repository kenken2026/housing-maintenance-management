"use client"

import { TILE_CONFIGS } from "lib/map"
import { useMapTypeState } from "lib/store"
import { Layer, Source } from "react-map-gl/maplibre"

export const MapTileLayer = () => {
  const { mapType } = useMapTypeState()
  const config = TILE_CONFIGS[mapType ?? "OpenStreetMap"]
  return (
    <Source
      id="base-tiles"
      type="raster"
      tiles={[...config.tiles]}
      tileSize={256}
      attribution={config.attribution}
    >
      <Layer id="base-layer" type="raster" />
    </Source>
  )
}
