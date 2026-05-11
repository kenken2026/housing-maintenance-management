"use client"

import { useEffect, useRef, useState, type ComponentProps, type FC } from "react"
import Map, { Marker, Popup, type MapRef } from "react-map-gl/maplibre"
import "maplibre-gl/dist/maplibre-gl.css"
import { EMPTY_MAP_STYLE, getCenterPosition } from "lib/map"
import { MapTileLayer } from "components/modules/map-tile-layer"

const MultiMarkerMap: FC<
  ComponentProps<"div"> & {
    markers: Marker[]
    hoveredMarkerId?: number
    onMarkerClick: (args: { id: number }) => void
  }
> = ({ markers, hoveredMarkerId, style, onMarkerClick, ...props }) => {
  const mapRef = useRef<MapRef>(null)
  const [zoom, setZoom] = useState(13)

  const initialCenter =
    markers.length > 0
      ? getCenterPosition(markers)
      : { latitude: 35.6809591, longitude: 139.7673068 }

  const hoveredMarker = markers.find((m) => m.id === hoveredMarkerId)

  useEffect(() => {
    if (markers.length === 0) {
      navigator.geolocation.getCurrentPosition((pos) => {
        mapRef.current?.flyTo({
          center: [pos.coords.longitude, pos.coords.latitude],
        })
      })
      return
    }
    const lats = markers.map((m) => m.latitude)
    const lngs = markers.map((m) => m.longitude)
    mapRef.current?.fitBounds(
      [
        [Math.min(...lngs), Math.min(...lats)],
        [Math.max(...lngs), Math.max(...lats)],
      ],
      { padding: 40 }
    )
  }, [markers])

  useEffect(() => {
    if (hoveredMarkerId === undefined) return
    const marker = markers.find((m) => m.id === hoveredMarkerId)
    if (marker) {
      mapRef.current?.flyTo({
        center: [marker.longitude, marker.latitude],
        zoom: 16,
        duration: 400,
      })
    }
  }, [hoveredMarkerId, markers])

  return (
    <div style={{ ...style }} {...props}>
      <Map
        ref={mapRef}
        initialViewState={{
          longitude: initialCenter.longitude,
          latitude: initialCenter.latitude,
          zoom: 13,
        }}
        mapStyle={EMPTY_MAP_STYLE}
        style={{ height: "100%" }}
        onZoomEnd={(e) => setZoom(e.viewState.zoom)}
      >
        <MapTileLayer />
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            longitude={marker.longitude}
            latitude={marker.latitude}
            anchor="bottom"
            onClick={() => onMarkerClick({ id: marker.id })}
          >
            <img
              src={`${process.env.NEXT_PUBLIC_BASE_PATH}/images/marker-icon-2x.png`}
              style={{ width: 20, height: 30, cursor: "pointer" }}
              alt={marker.name}
            />
          </Marker>
        ))}
        {hoveredMarker && (
          <Popup
            longitude={hoveredMarker.longitude}
            latitude={hoveredMarker.latitude}
            anchor="bottom"
            closeButton={false}
            closeOnClick={false}
            offset={30}
          >
            <div
              aria-hidden={true}
              onClick={() => onMarkerClick({ id: hoveredMarker.id })}
              style={{ cursor: "pointer" }}
            >
              {hoveredMarker.name.split("\n").map((n, i) => (
                <div key={i} style={{ color: "#44a", textAlign: "center" }}>
                  {n}
                </div>
              ))}
            </div>
          </Popup>
        )}
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

export default MultiMarkerMap
