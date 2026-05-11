"use client"

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentProps,
  type FC,
} from "react"
import Map, { Marker, Popup, type MapRef } from "react-map-gl/maplibre"
import "maplibre-gl/dist/maplibre-gl.css"
import {
  DEFAULT_CENTER,
  EMPTY_MAP_STYLE,
  MARKER_ICON_SRC,
  getCenterPosition,
} from "lib/map"
import { MapTileLayer } from "components/modules/map-tile-layer"
import { ZoomDisplay } from "components/modules/zoom-display"

const MultiMarkerMap: FC<
  ComponentProps<"div"> & {
    markers: Marker[]
    hoveredMarkerId?: number
    onMarkerClick: (args: { id: number }) => void
  }
> = ({ markers, hoveredMarkerId, style, onMarkerClick, ...props }) => {
  const mapRef = useRef<MapRef>(null)
  const [zoom, setZoom] = useState(13)
  const [initialCenter] = useState(() =>
    markers.length > 0 ? getCenterPosition(markers) : DEFAULT_CENTER
  )

  const hoveredMarker = useMemo(
    () => markers.find((m) => m.id === hoveredMarkerId),
    [markers, hoveredMarkerId]
  )

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
    if (!hoveredMarker) return
    mapRef.current?.flyTo({
      center: [hoveredMarker.longitude, hoveredMarker.latitude],
      zoom: 16,
      duration: 400,
    })
  }, [hoveredMarker])

  return (
    <div style={style} {...props}>
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
              src={MARKER_ICON_SRC}
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
        <ZoomDisplay zoom={zoom} />
      </Map>
    </div>
  )
}

export default MultiMarkerMap
