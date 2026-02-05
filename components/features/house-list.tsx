"use client"

import { useEffect, useState, type FC } from "react"
import { Card } from "components/elements"
import { Button } from "components/elements/form"
const MultiMarkerMap = dynamic(
  () => import("components/features/multi-maker-map"),
  { ssr: false }
)
import dynamic from "next/dynamic"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { houseModel } from "lib/models/house"

export const HouseList: FC<{ team: Team }> = ({ team }) => {
  const router = useRouter()
  const [houses, setHouses] = useState<House[]>([])
  const [hoveredHouseId, setHoveredHouseId] = useState<string>()

  useEffect(() => {
    const fetchHouses = async () => {
      const houses = await houseModel().index({ teamId: team.id })
      setHouses(houses)
    }
    fetchHouses()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <Card>
        <h2>{team.name}</h2>
        <div>
          <Button onClick={() => router.push("/house/new")}>新規作成</Button>
        </div>
        <div style={{ display: "flex", gap: ".5rem" }}>
          {houses.length > 0 && (
            <MultiMarkerMap markers={houses} hoveredMarkerId={hoveredHouseId} style={{ width: "100%" }} />
          )}
          <div style={{ minWidth: "16rem", overflow: "scroll" }}>
            {houses.map((house) => (
              <div
                key={house.id}
                onMouseEnter={() => setHoveredHouseId(house.id)}
                onMouseLeave={() => setHoveredHouseId(undefined)}
              >
                <div style={{ fontWeight: "bold" }}>
                  <Link href={`/house?id=${house.id}`}>{house.name}</Link>
                </div>
                <div style={{ fontSize: ".75rem" }}>
                  {new Date(house.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </>
  )
}
