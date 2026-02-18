"use client"

import { useEffect, useState, type ComponentProps, type FC } from "react"
import { MapContainer, TileLayer, Marker } from "react-leaflet"
import { LatLng, icon } from "leaflet"
import "leaflet/dist/leaflet.css"
import { ChangeMapCenter } from "lib/map"

export const MarkingMap: FC<
  ComponentProps<"div"> & {
    onChangePosition: (position: Position) => void
    initialPosition?: Position
  }
> = ({ onChangePosition, initialPosition, style, ...props }) => {
  const [position, setPosition] = useState<LatLng>(
    initialPosition
      ? new LatLng(initialPosition.latitude, initialPosition.longitude)
      : new LatLng(35.6809591, 139.7673068)
  )
  useEffect(() => {
    if (initialPosition) {
      setPosition(
        new LatLng(initialPosition.latitude, initialPosition.longitude)
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialPosition?.latitude, initialPosition?.longitude])

  return (
    <div style={{ height: "100vw", maxHeight: "24rem", ...style }} {...props}>
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
          <Marker
            position={position}
            icon={icon({
              iconUrl: "/images/marker-icon-2x.png",
              iconSize: [25, 41],
              iconAnchor: [25, 41],
              popupAnchor: [0, -41],
            })}
            draggable={true}
            eventHandlers={{
              dragend: (event) => {
                const newPosition: LatLng = event.target.getLatLng()
                setPosition(newPosition)
                onChangePosition({
                  latitude: newPosition.lat,
                  longitude: newPosition.lng,
                })
              },
            }}
          ></Marker>
          <ChangeMapCenter position={position} />
        </MapContainer>
      )}
    </div>
  )
}
