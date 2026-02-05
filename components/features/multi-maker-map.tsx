"use client"

import { useEffect, useRef, useState, type ComponentProps, type FC } from "react"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import { LatLng, icon, type Marker as LeafletMarker } from "leaflet"
import "leaflet/dist/leaflet.css"
import Link from "next/link"
import { ChangeMapCenter, getCenterLatLng } from "lib/map"

const HoverableMarker: FC<{
  marker: House
  isHovered: boolean
}> = ({ marker, isHovered }) => {
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
        <Link href={`/house?id=${marker.id}`}>{marker.name}</Link>
      </Popup>
    </Marker>
  )
}

const MultiMarkerMap: FC<
  ComponentProps<"div"> & {
    markers: House[]
    hoveredMarkerId?: string
  }
> = ({ markers, hoveredMarkerId, style, ...props }) => {
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
    <div style={{ minHeight: "32rem", ...style }} {...props}>
      {position && (
        <MapContainer
          center={position}
          zoom={13}
          style={{
            height: "100%",
          }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {markers.map((marker) => (
            <HoverableMarker
              key={marker.id}
              marker={marker}
              isHovered={hoveredMarkerId === marker.id}
            />
          ))}
          <ChangeMapCenter position={position} />
        </MapContainer>
      )}
    </div>
  )
}

export default MultiMarkerMap
