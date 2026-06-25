"use client"

import { FC, useState } from "react"
import { Button } from "components/elements/form"
import { Modal } from "components/elements/modal"
import MultiMarkerMap from "components/features/multi-maker-map"
import { getUnitName } from "lib/units"

export const UnitPositionsMap: FC<{ house: House }> = ({ house }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [hoveredMarkerId, setHoveredMarkerId] = useState<string>()

  const markers: Marker[] = Object.entries(house.unitPositions ?? {}).map(
    ([uid, position]) => ({
      id: uid,
      latitude: position.latitude,
      longitude: position.longitude,
      name: getUnitName(uid),
    })
  )

  if (markers.length === 0) return null

  return (
    <>
      <Button type="button" onClick={() => setIsOpen(true)}>
        ユニット位置を地図で見る
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false)
          setHoveredMarkerId(undefined)
        }}
      >
        <h3>ユニット位置</h3>
        <MultiMarkerMap
          markers={markers}
          hoveredMarkerId={hoveredMarkerId}
          style={{ height: "24rem", width: "100%" }}
          onMarkerClick={({ id }) => setHoveredMarkerId(String(id))}
        />
      </Modal>
    </>
  )
}
