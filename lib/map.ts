import { LatLng, LatLngBounds } from "leaflet"
import { useEffect } from "react"
import { useMap } from "react-leaflet"

export const TILE_CONFIGS = {
  OpenStreetMap: {
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
  GSI: {
    url: "https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png",
    attribution:
      '<a href="https://maps.gsi.go.jp/development/ichiran.html">国土地理院</a>',
  },
} as const

export const ChangeMapCenter = ({ position }: { position: LatLng }) => {
  const map = useMap()
  useEffect(() => {
    map.panTo(position)
  }, [position, map])

  return null
}

const calcCenter = (values: number[]) =>
  (Math.max(...values) + Math.min(...values)) / 2

export const getCenterPosition = (positions: Position[]): Position => ({
  latitude: calcCenter(positions.map((p) => p.latitude)),
  longitude: calcCenter(positions.map((p) => p.longitude)),
})

export const getCenterLatLng = (positions: Position[]): LatLng =>
  new LatLng(
    calcCenter(positions.map((p) => p.latitude)),
    calcCenter(positions.map((p) => p.longitude))
  )

export const FitBoundsToMarkers = ({
  markers,
}: {
  markers: Position[]
}) => {
  const map = useMap()
  useEffect(() => {
    if (markers.length === 0) return
    const bounds = new LatLngBounds(
      markers.map((m) => new LatLng(m.latitude, m.longitude))
    )
    map.fitBounds(bounds, { padding: [40, 40] })
  }, [markers, map])
  return null
}
