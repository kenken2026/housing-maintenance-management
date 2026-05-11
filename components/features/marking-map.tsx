"use client"

import { useEffect, useRef, useState, type ComponentProps, type FC } from "react"
import Map, { Marker, type MapRef } from "react-map-gl/maplibre"
import "maplibre-gl/dist/maplibre-gl.css"
import { EMPTY_MAP_STYLE } from "lib/map"
import { MapTileLayer } from "components/modules/map-tile-layer"

export const MarkingMap: FC<
  ComponentProps<"div"> & {
    onChangePosition: (position: Position) => void
    initialPosition?: Position
  }
> = ({ onChangePosition, initialPosition, style, ...props }) => {
  const mapRef = useRef<MapRef>(null)
  const [zoom, setZoom] = useState(13)
  const [position, setPosition] = useState<Position>(
    initialPosition ?? { latitude: 35.6809591, longitude: 139.7673068 }
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
          <img
            src={`${process.env.NEXT_PUBLIC_BASE_PATH}/images/marker-icon-2x.png`}
            style={{ width: 25, height: 41 }}
            alt="marker"
          />
        </Marker>
        <div
          style={{
            position: "absolute",
            bottom: 24,
            right: 8,
            zIndex: 1,
            background: "rgba(255,255,255,0.85)",
            borderRadius: 4,
            padding: "2px 6px",
            fontSize: 12,
            fontWeight: "bold",
            pointerEvents: "none",
            lineHeight: "1.5",
          }}
        >
          zoom: {Math.round(zoom * 10) / 10}
        </div>
      </Map>
    </div>
  )
}
