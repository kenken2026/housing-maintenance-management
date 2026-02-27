"use client"

import {
  useEffect,
  useRef,
  useState,
  type ComponentProps,
  type FC,
} from "react"
import { MapContainer, Marker, Popup, useMap } from "react-leaflet"
import { LatLng, icon, type Marker as LeafletMarker } from "leaflet"
import "leaflet/dist/leaflet.css"
import { ChangeMapCenter, FitBoundsToMarkers, getCenterLatLng } from "lib/map"
import { MapTileLayer } from "components/modules/map-tile-layer"

const HoverableMarker: FC<{
  marker: Marker
  isHovered: boolean
  onMarkerClick: (args: { id: number }) => void
}> = ({ marker, isHovered, onMarkerClick }) => {
  const markerRef = useRef<LeafletMarker>(null)
  useEffect(() => {
    if (!markerRef.current) return
    if (isHovered) {
      markerRef.current.openPopup()
    } else {
      markerRef.current.closePopup()
    }
  }, [isHovered])
  return (
    <Marker
      ref={markerRef}
      position={new LatLng(marker.latitude, marker.longitude)}
      icon={icon({
        iconUrl: "/images/marker-icon-2x.png",
        iconSize: [20, 30],
        iconAnchor: [10, 30],
        popupAnchor: [10, -30],
      })}
    >
      <Popup>
        <div
          aria-hidden={true}
          onClick={() => onMarkerClick({ id: marker.id })}
          style={{ cursor: "pointer" }}
        >
          {marker.name.split("\n").map((n, i) => (
            <div key={i} style={{ color: "#44a", textAlign: "center" }}>
              {n}
            </div>
          ))}
        </div>
      </Popup>
    </Marker>
  )
}

const ZoomController: FC<{
  hoveredMarkerId?: number
  markers: Marker[]
}> = ({ hoveredMarkerId, markers }) => {
  const map = useMap()

  useEffect(() => {
    if (hoveredMarkerId === undefined) return
    const marker = markers.find((m) => m.id === hoveredMarkerId)
    if (marker) {
      map.flyTo(new LatLng(marker.latitude, marker.longitude), 16, {
        animate: true,
        duration: 0.4,
      })
    }
  }, [hoveredMarkerId, markers, map])

  return null
}

const MultiMarkerMap: FC<
  ComponentProps<"div"> & {
    markers: Marker[]
    hoveredMarkerId?: number
    onMarkerClick: (args: { id: number }) => void
  }
> = ({ markers, hoveredMarkerId, style, onMarkerClick, ...props }) => {
  const [position, setPosition] = useState<LatLng>(getCenterLatLng(markers))
  useEffect(() => {
    if (markers.length > 0) return
    navigator.geolocation.getCurrentPosition((position) => {
      setPosition(
        new LatLng(position.coords.latitude, position.coords.longitude)
      )
    })
  }, [markers])
  return (
    <div style={{ ...style }} {...props}>
      {position && (
        <MapContainer
          center={position}
          zoom={13}
          style={{
            height: "100%",
          }}
        >
          <MapTileLayer />
          {markers.map((marker) => (
            <HoverableMarker
              key={marker.id}
              marker={marker}
              isHovered={hoveredMarkerId === marker.id}
              onMarkerClick={onMarkerClick}
            />
          ))}
          <ChangeMapCenter position={position} />
          {markers.length > 0 && <FitBoundsToMarkers markers={markers} />}
          <ZoomController hoveredMarkerId={hoveredMarkerId} markers={markers} />
        </MapContainer>
      )}
    </div>
  )
}

export default MultiMarkerMap
