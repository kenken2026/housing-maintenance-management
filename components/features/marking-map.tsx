"use client"

import { useEffect, useRef, useState, type ComponentProps, type FC } from "react"
import Map, { Marker, type MapRef } from "react-map-gl/maplibre"
import "maplibre-gl/dist/maplibre-gl.css"
import { DEFAULT_CENTER, EMPTY_MAP_STYLE, MARKER_ICON_SRC } from "lib/map"
import { MapTileLayer } from "components/modules/map-tile-layer"
import { ZoomDisplay } from "components/modules/zoom-display"

export const MarkingMap: FC<
  ComponentProps<"div"> & {
    onChangePosition: (position: Position) => void
    initialPosition?: Position
  }
> = ({ onChangePosition, initialPosition, style, ...props }) => {
  const mapRef = useRef<MapRef>(null)
  const [zoom, setZoom] = useState(13)
  const [position, setPosition] = useState<Position>(
    initialPosition ?? DEFAULT_CENTER
  )

  useEffect(() => {
    if (!initialPosition) return
    setPosition(initialPosition)
    mapRef.current?.flyTo({
      center: [initialPosition.longitude, initialPosition.latitude],
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialPosition?.latitude, initialPosition?.longitude])

  return (
    <div style={{ height: "100vw", maxHeight: "24rem", ...style }} {...props}>
      <Map
        ref={mapRef}
        initialViewState={{
          longitude: position.longitude,
          latitude: position.latitude,
          zoom: 13,
        }}
        mapStyle={EMPTY_MAP_STYLE}
        style={{ height: "100%" }}
        onZoomEnd={(e) => setZoom(e.viewState.zoom)}
      >
        <MapTileLayer />
        <Marker
          longitude={position.longitude}
          latitude={position.latitude}
          anchor="bottom"
          draggable
          onDragEnd={(e) => {
            const newPos: Position = {
              latitude: e.lngLat.lat,
              longitude: e.lngLat.lng,
            }
            setPosition(newPos)
            onChangePosition(newPos)
          }}
        >
          <img src={MARKER_ICON_SRC} style={{ width: 25, height: 41 }} alt="marker" />
        </Marker>
        <ZoomDisplay zoom={zoom} />
      </Map>
    </div>
  )
}
